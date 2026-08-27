import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";
import { socket } from "@/utils/socket";

export const useReportStore = defineStore('report', () => {
    const toastStore = useToastStore();
    const reports = ref([]);
    const reportStatus = ref([]);
    const isLoading = ref(false);

    const page = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);
    const totalPages = ref(0);

    const sortBy = ref('id');
    const sortOrder = ref('desc');
    const search = ref('');
    const statusFilter = ref('all');
    const categoryId = ref('all');

    const statusStats = ref({ 'all': '...', 'pending': '...', 'in_progress': '...', 'resolved': '...', 'rejected': '...' });

    const fetchStatusStats = async (forceRefresh = false) => {
        if (!forceRefresh && statusStats.value['all'] !== '...') return;
        try {
            const promises = Object.keys(statusStats.value).map(async (statusKey) => {
                const params = statusKey === 'all' ? { _per_page: 10, _page: 1 } : { status: statusKey.toUpperCase(), _per_page: 10, _page: 1 };
                const res = await api.get('report', { params });
                const meta = res?.data?.data?.meta;
                if (meta) {
                    statusStats.value[statusKey] = String(meta.totalItems || 0);
                }
            });
            await Promise.all(promises);
        } catch (e) {
            console.error("Failed to fetch status stats", e);
        }
    };

    const queryCache = new Map();

    const clearCache = () => {
        queryCache.clear();
        statusStats.value = { 'all': '...', 'pending': '...', 'in_progress': '...', 'resolved': '...', 'rejected': '...' };
        fetchStatusStats(true);
    };

    const handleRealTimeUpdate = (socketPayload) => {
        const report = socketPayload;
        if (!report || !report.id) return;

        const reportIndex = reports.value.findIndex(r => String(r.id) === String(report.id));
        if (reportIndex !== -1) {
            reports.value[reportIndex].status = report.status;
        }
    };

    const setupSocketListeners = () => {
        socket.off('report:created');
        socket.off('report:updated');
        socket.off('report:deleted');
        socket.off('report:status_changed');

        socket.on('report:created', () => {
            toastStore.showToast('A new report has been submitted!', 'info');
            clearCache();
            getAllReports();
        });

        socket.on('report:updated', (payload) => {
            handleRealTimeUpdate(payload);
            clearCache();
            getAllReports();
        });

        socket.on('report:deleted', () => {
            clearCache();
            getAllReports();
        });

        socket.on('report:status_changed', (payload) => {
            handleRealTimeUpdate(payload);
            clearCache();
            getAllReports();
        });

        const resolutionEvents = [
            'resolution:replied', 'resolution-rating:replied', 'resolution_rating:replied',
            'resolution-rating:created', 'resolution-rating:updated', 'resolution-rating:deleted',
            'resolution_rating:created', 'resolution_rating:updated', 'resolution_rating:deleted',
            'resolution:rated', 'resolution:updated', 'resolution:deleted'
        ];

        resolutionEvents.forEach(evt => {
            socket.off(evt);
            socket.on(evt, () => {
                clearCache();
                getAllReports({ forceRefresh: true });
                if (evt.includes('created')) {
                    toastStore.showToast('A student submitted feedback on a report resolution!', 'info');
                } else if (evt.includes('updated')) {
                    toastStore.showToast('A student updated feedback on a report resolution!', 'info');
                } else if (evt.includes('deleted')) {
                    toastStore.showToast('A student deleted their resolution feedback.', 'info');
                }
            });
        });
    };

    const getAllReports = async (options = {}) => {
        const { showLoading = null, forceRefresh = false, ...extraParams } = options;
        const shouldLoad = showLoading !== null ? showLoading : reports.value.length === 0;

        const params = Object.assign({
            _page: page.value,
            _per_page: perPage.value,
            sortBy: sortBy.value,
            sortDir: sortOrder.value,
            search: search.value,
            status: statusFilter.value !== 'all' ? statusFilter.value.toUpperCase() : undefined,
            categoryId: categoryId.value !== 'all' ? categoryId.value : undefined,
        }, extraParams || {});

        const cacheKey = 'reports_' + JSON.stringify(params);

        if (!forceRefresh && queryCache.has(cacheKey)) {
            const cached = queryCache.get(cacheKey);
            reports.value = cached.reports;
            if (cached.meta) {
                totalItems.value = cached.meta.totalItems;
                totalPages.value = cached.meta.totalPages;
                page.value = cached.meta.page;
            }
            return cached.reports;
        }

        try {
            if (shouldLoad) isLoading.value = true;

            const response = await api.get('report', { params });

            const data = response?.data?.data?.reports || [];
            reports.value = data;

            const meta = response.data.data.meta;
            totalItems.value = meta.totalItems || 0;
            totalPages.value = meta.totalPages || 0;
            page.value = meta.page || 0;

            queryCache.set(cacheKey, { reports: data, meta });

            await getReportStatus();
        } catch (error) {
            handleApiError(error, toastStore);
            throw error;
        } finally {
            if (shouldLoad) isLoading.value = false;
        }
    };

    const getReportById = async (id) => {
        try {
            const response = await api.get(`report/${id}`);
            const data = response?.data?.data || [];
            return data;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const getReportStatus = async () => {
        try {
            const response = await api.get('report/status');
            const data = response?.data?.data || [];
            reportStatus.value = data;
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const updateReportStatus = async (id, payload, showToast = true) => {
        try {
            const res = await api.put(`report/manage-status/${id}`, payload);
            if (showToast) {
                toastStore.showToast(res?.data?.message, 'success');
            }
            clearCache();
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    const replyToResolution = async (resolutionId, payload) => {
        try {
            if (!resolutionId) throw new Error('Resolution ID is required!');
            const res = await api.post(`resolutions/${resolutionId}/reply`, payload);
            toastStore.showToast(res?.data?.message || 'Reply submitted successfully!', 'success');
            clearCache();
            return res?.data?.data || true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    };

    return {
        getAllReports,
        getReportById,
        getReportStatus,
        updateReportStatus,
        replyToResolution,
        setupSocketListeners,

        reports,
        reportStatus,
        isLoading,
        page,
        perPage,
        totalItems,
        totalPages,
        sortBy,
        sortOrder,
        search,
        statusFilter,
        categoryId,
        statusStats,
        fetchStatusStats
    };
});