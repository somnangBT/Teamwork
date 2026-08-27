import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/api';
import { useToastStore } from '@/stores/toast';
import { handleApiError } from '@/utils/apiError';

export const useStatisticsStore = defineStore('statistics', () => {
    const toastStore = useToastStore();
    
    const adminStats = ref(null);
    const teacherStats = ref(null);
    const studentStats = ref(null);
    const isLoading = ref(false);

    // Fetch Admin statistics
    const fetchAdminStats = async () => {
        isLoading.value = true;
        try {
            let response;
            try {
                response = await api.get('statistics/admin');
            } catch (err) {
                if (err.response?.status === 404) {
                    try {
                        response = await api.get('statistics');
                    } catch (err2) {
                        response = await api.get('stats/admin');
                    }
                } else {
                    throw err;
                }
            }
            adminStats.value = response?.data?.data || null;
            return adminStats.value;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch Teacher statistics
    const fetchTeacherStats = async () => {
        isLoading.value = true;
        try {
            let response;
            try {
                response = await api.get('statistics/teacher');
            } catch (err) {
                if (err.response?.status === 404) {
                    try {
                        response = await api.get('statistics');
                    } catch (err2) {
                        response = await api.get('stats/teacher');
                    }
                } else {
                    throw err;
                }
            }
            teacherStats.value = response?.data?.data || null;
            return teacherStats.value;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch Student statistics
    const fetchStudentStats = async () => {
        isLoading.value = true;
        try {
            let response;
            try {
                response = await api.get('statistics/student');
            } catch (err) {
                if (err.response?.status === 404) {
                    try {
                        response = await api.get('statistics');
                    } catch (err2) {
                        response = await api.get('stats/student');
                    }
                } else {
                    throw err;
                }
            }
            studentStats.value = response?.data?.data || null;
            return studentStats.value;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        adminStats,
        teacherStats,
        studentStats,
        isLoading,
        fetchAdminStats,
        fetchTeacherStats,
        fetchStudentStats
    };
});
