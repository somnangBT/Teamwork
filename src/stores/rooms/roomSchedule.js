import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";
import { useAuthStore } from "../auth";
import { socket } from "@/utils/socket";

export const useRoomScheduleStore = defineStore('room-schedule', () => {

    const toastStore = useToastStore();
    const roomSchedules = ref([]);
    const isLoading = ref(false);

    const page = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);
    const totalPages = ref(0);
    const sortBy = ref('createdAt');
    const sortOrder = ref('desc');

    const previewRoomSchedule = async (roomId, payload) => {
        try {
            isLoading.value = true;
            const previewPayload = {
                isRecurring: payload.isRecurring,
                session: payload.session,
            };
            if (payload.isRecurring) {
                previewPayload.startDate = payload.startDate;
                previewPayload.endDate = payload.endDate;
                previewPayload.daysOfWeek = payload.daysOfWeek;
            } else {
                previewPayload.dates = payload.dates;
            }
            const res = await api.post(`room-schedules/${roomId}/preview-schedule`, previewPayload);
            return res?.data?.data || res?.data;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const getAllRoomSchedules = async (extraParams = {}) => {
        const authStore = useAuthStore();
        if (!authStore.isAdmin) return false;

        try {
            isLoading.value = true;
            const params = Object.assign({
                _page: page.value,
                _per_page: perPage.value,
                sortBy: sortBy.value,
                sortDir: sortOrder.value,
            }, extraParams || {});
            const response = await api.get('room-schedules', { params });
            const data = response?.data?.data?.schedule || [];
            roomSchedules.value = data;
            const meta = response.data.data.meta;
            if (meta) {
                totalItems.value = meta.totalItems || 0;
                page.value = meta.currentPage || 1;
                totalPages.value = meta.totalPages || 0;
            }
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const ownSchedules = ref([]);
    const getOwnSchedules = async () => {
        const authStore = useAuthStore();
        if (authStore.isAdmin) return false;

        try {
            const res = await api.get('room-schedules/own');
            ownSchedules.value = res.data?.data?.data || [];
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const createRoomSchedule = async (payload) => {
        try {
            const res = await api.post('room-schedules', payload);
            toastStore.showToast(res.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const updateRoomSchedule = async (id, payload) => {
        try {
            const res = await api.put(`room-schedules/${id}`, payload);
            toastStore.showToast(res?.data?.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const updateRoomScheduleStatus = async (id, payload) => {
        try {
            const res = await api.put(`room-schedules/${id}/status`, payload);
            toastStore.showToast(res.data.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const deleteRoomSchedule = async (id) => {
        try {
            const res = await api.delete(`room-schedules/${id}`);
            toastStore.showToast(res?.data.message, 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const roomScheduleTypes = ref([]);
    const getAllRoomScheduleType = async () => {
        try {
            const res = await api.get('rooms/schedule/types');
            roomScheduleTypes.value = res.data.data || [];
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    // ─── Booking Requests ────────────────────────────────────────────────────

    const requestRoomBooking = async (roomId, payload) => {
        try {
            isLoading.value = true;
            const res = await api.post(`room/${roomId}/request-booking`, payload);
            toastStore.showToast(res.data?.message || 'Booking request submitted!', 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const myBookings = ref([]);
    const myBookingsMeta = ref({ total: 0, page: 1 });
    const myBookingsPage = ref(1);
    const myBookingsPerPage = ref(10);
    const myBookingsStatus = ref('');  // '' = All Bookings (no status filter)
    const myBookingsDate = ref('');    // YYYY-MM-DD string

    const getMyBookings = async (extraParams = {}) => {
        const authStore = useAuthStore();
        if (authStore.isAdmin) return false;

        try {
            isLoading.value = true;
            const params = Object.assign({
                _page: myBookingsPage.value,
                _per_page: myBookingsPerPage.value,
            }, extraParams || {});

            if (myBookingsStatus.value) {
                params.status = myBookingsStatus.value;
            }

            if (myBookingsDate.value) {
                params.date = myBookingsDate.value;
            }

            const res = await api.get('room/my-bookings', { params });
            myBookings.value = res.data?.data?.data || [];
            myBookingsMeta.value = res.data?.data?.meta || { total: 0, page: 1 };
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const approveBooking = async (id) => {
        try {
            const res = await api.put(`room-schedules/${id}/approve`);
            toastStore.showToast(res.data?.message || 'Booking approved!', 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const rejectBooking = async (id, reason = '') => {
        try {
            const res = await api.put(`room-schedules/${id}/reject`, { rejectReason: reason });
            toastStore.showToast(res.data?.message || 'Booking rejected.', 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const cancelBooking = async (id) => {
        try {
            const res = await api.put(`room-schedules/${id}/cancel`);
            toastStore.showToast(res.data?.message || 'Booking cancelled.', 'success');
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const setupSocketListeners = () => {
        socket.off('room_schedule:created');
        socket.off('room_schedule:updated');
        socket.off('room_schedule:deleted');
        socket.off('schedule:status_changed');

        socket.on('room_schedule:created', () => {
            const authStore = useAuthStore();
            if (authStore.isAdmin) {
                getAllRoomSchedules();
            } else {
                getMyBookings();
                getOwnSchedules();
            }
        });

        socket.on('room_schedule:updated', (payload) => {
            const authStore = useAuthStore();
            if (authStore.isAdmin) {
                getAllRoomSchedules();
            } else {
                getMyBookings();
                getOwnSchedules();

                if (payload.status === 'SCHEDULED') {
                    toastStore.showToast(`Booking "${payload.title}" has been approved!`, 'success');
                } else if (payload.status === 'REJECTED') {
                    toastStore.showToast(`Booking "${payload.title}" has been rejected.`, 'warning');
                } else if (payload.status === 'CANCELLED') {
                    toastStore.showToast(`Booking "${payload.title}" was cancelled.`, 'info');
                }
            }
        });

        socket.on('room_schedule:deleted', () => {
            const authStore = useAuthStore();
            if (authStore.isAdmin) {
                getAllRoomSchedules();
            } else {
                getMyBookings();
                getOwnSchedules();
            }
        });

        socket.on('schedule:status_changed', () => {
            const authStore = useAuthStore();
            if (authStore.isAdmin) {
                getAllRoomSchedules();
            } else {
                getMyBookings();
                getOwnSchedules();
            }
        });
    };

    return {
        roomSchedules,
        roomScheduleTypes,

        ownSchedules,
        getOwnSchedules,

        getAllRoomSchedules,
        previewRoomSchedule,
        createRoomSchedule,
        updateRoomSchedule,
        updateRoomScheduleStatus,
        deleteRoomSchedule,
        getAllRoomScheduleType,

        // Booking requests
        requestRoomBooking,
        myBookings,
        myBookingsMeta,
        myBookingsPage,
        myBookingsPerPage,
        myBookingsStatus,
        myBookingsDate,
        getMyBookings,
        approveBooking,
        rejectBooking,
        cancelBooking,

        isLoading,
        page,
        perPage,
        totalItems,
        totalPages,
        sortBy,
        sortOrder,
        setupSocketListeners
    };
});