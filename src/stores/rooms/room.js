import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";
import { socket } from "@/utils/socket";

export const useRoomStore = defineStore('room', () => {
    const toastStore = useToastStore();
    const rooms = ref([]);
    const roomDetails = ref(null);
    const roomTypes = ref([]);
    const isLoading = ref(false);
    const queryCache = new Map();

    const search = ref('');
    const activeFilter = ref('all');
    const roomStats = ref({ 'all': '...', 'occupied': '...', 'available': '...' });

    const fetchRoomStats = async (forceRefresh = false) => {
        if (!forceRefresh && roomStats.value['all'] !== '...') return;
        try {
            const promises = Object.keys(roomStats.value).map(async (statusKey) => {
                let params = { _per_page: 1, _page: 1 };
                if (statusKey === 'available') params.isActive = true;
                if (statusKey === 'occupied') params.isActive = false;

                const res = await api.get('rooms', { params });
                const meta = res?.data?.data?.meta;
                if (meta) {
                    roomStats.value[statusKey] = String(meta.totalItems || 0);
                }
            });
            await Promise.all(promises);
        } catch (e) {
            console.error("Failed to fetch room stats", e);
        }
    };

    const clearCache = () => {
        queryCache.clear();
        roomStats.value = { 'all': '...', 'occupied': '...', 'available': '...' };
        fetchRoomStats(true);
    };

    const roomSessionTypes = ref([]);
    const roomAvailabilityTypes = ref([]);

    const page = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);
    const totalPages = ref(0);

    const sortBy = ref('id');
    const sortOrder = ref('asc');

    const getAllRooms = async (options = {}) => {
        const { showLoading = null, forceRefresh = false, ...extraParams } = options;
        const shouldLoad = showLoading !== null ? showLoading : rooms.value.length === 0;

        const params = Object.assign({
            _page: page.value,
            _per_page: perPage.value,
            sortBy: sortBy.value,
            sortDir: sortOrder.value,
            search: search.value || undefined
        }, extraParams || {});

        if (activeFilter.value === 'available') {
            params.isActive = true;
        } else if (activeFilter.value === 'occupied') {
            params.isActive = false;
        }

        const cacheKey = 'rooms_' + JSON.stringify(params);

        if (!forceRefresh && queryCache.has(cacheKey)) {
            const cached = queryCache.get(cacheKey);
            rooms.value = cached.rooms;
            totalItems.value = cached.meta.totalItems;
            totalPages.value = cached.meta.totalPages;
            page.value = cached.meta.page;
            return true;
        }

        try {
            if (shouldLoad) isLoading.value = true;

            const response = await api.get('rooms', { params });

            const data = response?.data?.data?.rooms || [];
            rooms.value = data;

            const meta = response.data.data.meta;
            totalItems.value = meta.totalItems;
            totalPages.value = meta.totalPages;
            page.value = meta.page;

            queryCache.set(cacheKey, { rooms: data, meta });

            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            if (shouldLoad) isLoading.value = false;
        }
    }

    const getRoomById = async (id) => {
        try {
            isLoading.value = true;
            const response = await api.get(`room/${id}`)
            const data = response?.data?.data;
            roomDetails.value = data;
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const getRoomTypes = async () => {
        try {
            const response = await api.get('rooms/types')
            const data = response?.data?.data;
            roomTypes.value = data;
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const createRoom = async (payload) => {
        try {
            await api.post('create-room', payload);
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateRoom = async (id, payload) => {
        try {
            await api.put(`update-room/${id}`, payload)
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const manageRoomStatus = async (id, payload) => {
        try {
            const res = await api.put(`room/manage-status/${id}`, payload);
            toastStore.showToast(res?.data?.message, 'success')
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteRoom = async (id) => {
        try {
            await api.delete(`delete-room/${id}`)
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const getAllRoomAvailabilityType = async () => {
        try {
            const res = await api.get('rooms/availability/types')
            roomAvailabilityTypes.value = res.data?.data || [];
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const getAllRoomSessionType = async () => {
        try {
            const res = await api.get('rooms/session/types')
            roomSessionTypes.value = res.data?.data || [];
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    // Room Session ----------------------------
    const roomSessions = ref([]);
    const getAllRoomSessions = async (options = {}) => {
        const { showLoading = null, forceRefresh = false, ...extraParams } = options;
        const shouldLoad = showLoading !== null ? showLoading : roomSessions.value.length === 0;

        const cacheKey = 'roomSessions_' + JSON.stringify(extraParams || {});
        if (!forceRefresh && queryCache.has(cacheKey)) {
            roomSessions.value = queryCache.get(cacheKey);
            return true;
        }

        try {
            if (shouldLoad) isLoading.value = true;
            const res = await api.get('room-sessions', { params: extraParams });
            roomSessions.value = res?.data?.data?.data || [];
            queryCache.set(cacheKey, roomSessions.value);
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            if (shouldLoad) isLoading.value = false;
        }
    }

    const createRoomSession = async (payload) => {
        try {
            const res = await api.post('room-sessions', payload);
            toastStore.showToast(res?.data?.message, 'success');
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateRoomSession = async (id, payload) => {
        try {
            const res = await api.put(`room-sessions/${id}`, payload)
            toastStore.showToast(res?.data?.message, 'success');
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteRoomSession = async (id, payload) => {
        try {
            const res = await api.delete(`room-sessions/${id}`, payload);
            toastStore.showToast(res?.data.message, 'success');
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const getRoomAvailability = async (options = {}) => {
        const { date, session = null } = options;
        if (!date) return false;
        
        try {
            isLoading.value = true;
            const params = { date };
            if (session) {
                params.session = session;
            }
            const response = await api.get('rooms/availability', { params });
            const data = response?.data?.data || [];
            rooms.value = data;
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    // Room Image Section
    const createRoomImage = async (id, payload) => {
        try {
            await api.post(`room/${id}/images`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateRoomImage = async (roomId, imageId, payload) => {
        try {
            await api.put(`room/${roomId}/images/${imageId}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteRoomImage = async (roomId, imageId) => {
        try {
            await api.delete(`room/${roomId}/images/${imageId}`);
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const setupSocketListeners = () => {
        socket.off('room:created');
        socket.off('room:updated');
        socket.off('room:deleted');
        socket.off('room:status_changed');
        socket.off('room_session:updated');
        socket.off('room_session:deleted');

        socket.on('room:created', () => {
            clearCache();
            getAllRooms({ forceRefresh: true });
        });

        socket.on('room:updated', () => {
            clearCache();
            getAllRooms({ forceRefresh: true });
        });

        socket.on('room:deleted', () => {
            clearCache();
            getAllRooms({ forceRefresh: true });
        });

        socket.on('room:status_changed', () => {
            clearCache();
            getAllRooms({ forceRefresh: true });
        });

        socket.on('room_session:updated', () => {
            clearCache();
            getAllRoomSessions({ forceRefresh: true });
        });

        socket.on('room_session:deleted', () => {
            clearCache();
            getAllRoomSessions({ forceRefresh: true });
        });
    };

    return {
        isLoading,
        page,
        perPage,
        totalItems,
        totalPages,
        sortBy,
        sortOrder,

        rooms,
        roomDetails,
        rooms, roomDetails, isLoading, getAllRooms, getRoomById, createRoom, updateRoom, manageRoomStatus, deleteRoom,
        roomTypes, getRoomTypes,
        roomSessionTypes, getAllRoomSessionType,
        roomAvailabilityTypes, getAllRoomAvailabilityType,
        roomSessions, getAllRoomSessions, createRoomSession, updateRoomSession, deleteRoomSession,
        getRoomAvailability,
        page, perPage, totalItems, totalPages, sortBy, sortOrder, clearCache,
        search, activeFilter, roomStats, fetchRoomStats,
        createRoomImage,
        updateRoomImage,
        deleteRoomImage,
        setupSocketListeners
    }
})