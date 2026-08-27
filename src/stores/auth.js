import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import Cookies from "js-cookie";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useToastStore } from "./toast";
import { socket } from "@/utils/socket";

export const useAuthStore = defineStore('auth', () => {

    const toastStore = useToastStore();

    const accessToken = ref(Cookies.get('accessToken') || null);
    const user = ref(null);

    const isAuthenticated = computed(() => !!accessToken.value);

    const fullName = computed(() => {
        if (!user.value) return '';
        return `${user.value.lastName ?? ''} ${user.value.firstName ?? ''}`.trim();
    });

    const userRole = computed(() => {
        if (!user.value?.role) return null;
        return typeof user.value.role === 'string'
            ? user.value.role
            : user.value.role.name;
    });

    const isAdmin = computed(() => userRole.value === 'ADMIN');
    const isTeacher = computed(() => userRole.value === 'TEACHER');
    const isStudent = computed(() => userRole.value === 'STUDENT');

    const hasRole = (roles) => roles.includes(userRole.value);

    const joinSocketRooms = () => {
        if (!user.value) return;
        socket.emit('join_user', user.value.id);
        if (isAdmin.value) {
            socket.emit('join_admin');
        }
    };

    socket.on('connect', () => {
        joinSocketRooms();
    });

    const setTokens = ({ access }) => {
        if (access) {
            accessToken.value = access;
            Cookies.set('accessToken', access, {
                secure: true,
                sameSite: 'Strict'
            });
            socket.disconnect();
            socket.connect();
        }
    };

    const login = async (payload) => {
        try {
            if (!payload.email || !payload.password) throw new Error('Email and Password are required!')

            const response = await api.post('/auth/login', payload);
            const data = response.data?.data;

            toastStore.showToast(response?.data?.message, 'success');

            if (data?.requireOtp) {
                localStorage.setItem('otpSessionToken', data.otpSessionToken);
                if (data.mfaType) {
                    localStorage.setItem('mfaType', data.mfaType);
                }
                return { requireOtp: true, mfaType: data.mfaType };
            }

            if (data?.requirePasswordChange) {
                localStorage.setItem('changePasswordToken', data.changePasswordToken);
                return { requirePasswordChange: true };
            }
            if (data?.tokens) {
                setTokens({ access: data.tokens.accessToken });
                user.value = data.user;
                joinSocketRooms();
            }

            return data;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    };

    const verifyOtp = async (otpCode) => {
        try {
            const otpSessionToken = localStorage.getItem('otpSessionToken');
            if (!otpSessionToken) throw new Error('Invalid session. Please login again.');
            if (!otpCode) throw new Error('OTP Code is required!');

            const response = await api.post('/auth/verify-otp', { otpSessionToken, otpCode });
            const data = response.data?.data;

            localStorage.removeItem('otpSessionToken');
            localStorage.removeItem('mfaType');

            if (data.requirePasswordChange) {
                localStorage.setItem('changePasswordToken', data.changePasswordToken);
                return { requirePasswordChange: true };
            }

            if (data.accessToken) {
                setTokens({ access: data.accessToken });
                user.value = data.user;
                joinSocketRooms();
            }

            toastStore.showToast(response?.data?.message, 'success')
            return data;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const resendOtp = async () => {
        try {
            const otpSessionToken = { otpSessionToken: localStorage.getItem('otpSessionToken') };
            if (!otpSessionToken) throw new Error('Invalid session. Please login again.');

            const res = await api.post('auth/resend-otp', otpSessionToken)

            toastStore.showToast(res?.data?.message, 'success')
            return true;
        } catch (error) {
            handleApiError(error, toastStore)
            return false;
        }
    }

    const changeDefaultPassword = async (payload) => {
        try {
            const changePasswordToken = localStorage.getItem('changePasswordToken');
            if (!changePasswordToken) return;

            const response = await api.put(`/auth/change-default-password/${changePasswordToken}`, payload);
            toastStore.showToast(response?.data?.message, 'success');

            localStorage.removeItem('changePasswordToken');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const getProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            user.value = response.data?.user;
            joinSocketRooms();
            return user.value;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    };

    const updateProfile = async (payload) => {
        try {
            const res = await api.put('auth/profile', payload);
            toastStore.showToast(res?.data?.message, 'success')
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const enableTotp = async (payload) => {
        try {
            const res = await api.post('auth/totp/setup', payload)
            toastStore.showToast(res?.data?.message, 'success')
            return res.data;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const verifyTotpSetup = async (payload) => {
        try {
            const res = await api.post('auth/totp/verify-setup', payload)
            toastStore.showToast(res?.data?.message, 'success')
            return true;
        } catch (error) {
            handleApiError(error, toastStore)
            return false;
        }
    }

    const disableTotp = async (payload) => {
        try {
            const res = await api.post('auth/totp/disable', payload)
            toastStore.showToast(res?.data?.message, 'success')
            return true;
        } catch (error) {
            handleApiError(error, toastStore)
            return false;
        }
    }

    const logout = async (callApi = true) => {
        clearAuth();

        if (callApi) {
            try {
                const res = await api.delete('/auth/logout');
                return res;
            } catch (error) {
                handleApiError(error, toastStore)
                return false;
            }
        }

        return true;
    };

    const clearAuth = () => {
        accessToken.value = null;
        user.value = null;
        Cookies.remove('accessToken');
        localStorage.removeItem('otpSessionToken');
        localStorage.removeItem('changePasswordToken');
        socket.disconnect();
    };

    const forgotPassword = async (payload) => {
        try {
            const res = await api.post('auth/forgot-password', payload);
            toastStore.showToast(res?.data?.message, 'success');
            return { success: true };
        } catch (error) {
            const errorMsg = error?.response?.data?.message;
            if (errorMsg === "USER_RESET_FORBIDDEN") {
                return { success: false, isUserForbidden: true };
            }
            handleApiError(error, toastStore);
            return { success: false };
        }
    };

    const resetPassword = async (payload) => {
        try {
            const res = await api.post('auth/reset-password', payload);
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const fetchProfile = getProfile;

    return {
        accessToken,
        user,
        userRole,
        isAuthenticated,
        isAdmin,
        isTeacher,
        isStudent,
        fullName,
        login,
        verifyOtp,
        resendOtp,
        enableTotp,
        disableTotp,
        verifyTotpSetup,
        changeDefaultPassword,
        hasRole,
        getProfile,
        updateProfile,
        fetchProfile,
        logout,
        clearAuth,
        setTokens,
        forgotPassword,
        resetPassword
    };
});