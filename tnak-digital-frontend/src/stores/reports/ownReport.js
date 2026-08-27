import api from "@/api/api";
import { handleApiError } from "@/utils/apiError";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "../toast";
import { socket } from "@/utils/socket";

export const useOwnReportstore = defineStore('own-report', () => {

    const ownReports = ref([]);
    const isLoading = ref(false)
    const toastStore = useToastStore();

    const page = ref(1)
    const perPage = ref(6)
    const totalItems = ref(0)
    const totalPages = ref(0)

    const sortBy = ref('createdAt');
    const sortOrder = ref('desc');
    const search = ref('');
    const statusFilter = ref('all');

    const handleRealTimeUpdate = (socketPayload) => {
        const report = socketPayload;
        if (!report || !report.id) return;

        const reportIndex = ownReports.value.findIndex(r => String(r.id) === String(report.id));
        if (reportIndex !== -1) {
            ownReports.value[reportIndex].status = report.status;
        }
    };

    const setupSocketListeners = () => {
        socket.off('report:status_changed');
        socket.on('report:status_changed', (payload) => {
            handleRealTimeUpdate(payload);
            getOwnReports();
            toastStore.showToast(`Your report status has been updated to ${payload.status}.`, 'info');
        });

        const resolutionEvents = [
            'resolution:replied', 'resolution-rating:replied', 'resolution_rating:replied',
            'resolution-rating:created', 'resolution-rating:updated', 'resolution-rating:deleted',
            'resolution_rating:created', 'resolution_rating:updated', 'resolution_rating:deleted',
            'resolution:rated', 'resolution:updated', 'resolution:deleted', 'report:updated'
        ];

        resolutionEvents.forEach(evt => {
            socket.off(evt);
            socket.on(evt, (payload) => {
                getOwnReports({ forceRefresh: true });
                if (evt.includes('replied')) {
                    toastStore.showToast('Admin has replied to your resolution feedback!', 'info');
                }
            });
        });
    };

    const getOwnReports = async (options = {}) => {
        try {
            const { showLoading = null, ...extraParams } = options;
            const shouldLoad = showLoading !== null ? showLoading : ownReports.value.length === 0;

            if (shouldLoad) isLoading.value = true;

            const params = Object.assign({
                _page: page.value,
                _per_page: perPage.value,
                sortBy: sortBy.value,
                sortDir: sortOrder.value,
                search: search.value,
                status: statusFilter.value !== 'all' ? statusFilter.value.toUpperCase() : undefined
            }, extraParams || {});

            const response = await api.get('own/report', { params })

            const responseData = response?.data?.data;
            const reports = responseData?.reports || responseData?.report || responseData || [];
            
            if (options.append) {
                ownReports.value = [...ownReports.value, ...(Array.isArray(reports) ? reports : [])];
            } else {
                ownReports.value = Array.isArray(reports) ? reports : [];
            }

            const meta = responseData?.meta || {}
            totalItems.value = meta.totalItems || meta.total || ownReports.value.length
            totalPages.value = meta.totalPages || 0
            page.value = meta.page || page.value
        } catch (error) {
            handleApiError(error, toastStore)
            ownReports.value = []
        } finally {
            isLoading.value = false
        }
    }
    const buildReportFormData = (reportData, isUpdate = false) => {
        const formData = new FormData()

        formData.append('title', reportData.title || '')
        formData.append('description', reportData.description || '')

        if (reportData.categoryId !== undefined && reportData.categoryId !== null) {
            formData.append('categoryId', reportData.categoryId)
        }

        formData.append('isAnonymous', reportData.isAnonymous ? 'true' : 'false')

        const images = reportData.images || []

        const newFiles = images.filter(img => img instanceof File || img instanceof Blob)

        if (newFiles.length > 0) {
            newFiles.forEach((image) => {
                formData.append('reportImages', image)
            })
        }

        return formData
    }

    const createReport = async (reportData) => {
        try {
            isLoading.value = true

            const res = await api.post('report', buildReportFormData(reportData), {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toastStore.showToast(res?.data?.message, 'success')
            page.value = 1;
            await getOwnReports({ showLoading: false })
            return true
        } catch (error) {
            handleApiError(error, toastStore)
            return false
        } finally {
            isLoading.value = false
        }
    }

    const updateReport = async (id, reportData) => {
        try {
            isLoading.value = true

            const res = await api.put(`report/${id}`, buildReportFormData(reportData, true), {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toastStore.showToast(res?.data?.message, 'success')
            page.value = 1;
            await getOwnReports({ showLoading: false })
            return true
        } catch (error) {
            handleApiError(error, toastStore)
            return false
        } finally {
            isLoading.value = false
        }
    }

    const deleteReport = async (id) => {
        try {
            isLoading.value = true

            const res = await api.delete(`own/report/${id}`)
            toastStore.showToast(res?.data?.message, 'success')
            ownReports.value = ownReports.value.filter(r => String(r.id) !== String(id));
            totalItems.value = Math.max(0, totalItems.value - 1);
            return true
        } catch (error) {
            handleApiError(error, toastStore)
            return false
        } finally {
            isLoading.value = false
        }
    }

    const feedbackReport = async (payload) => {
        try {
            const res = await api.post(`resolution-rating`, payload);
            toastStore.showToast(res?.data?.message || 'Feedback submitted', 'success');
            await getOwnReports({ forceRefresh: true });
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const updateFeedbackReport = async (id, payload) => {
        try {
            const res = await api.put(`resolution-rating/${id}`, payload)
            toastStore.showToast(res?.data?.message || 'Feedback updated', 'success');
            await getOwnReports({ forceRefresh: true });
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const deleteFeedbackReport = async (id) => {
        try {
            const res = await api.delete(`resolution-rating/${id}`);
            toastStore.showToast(res?.data?.message, 'success');
            await getOwnReports({ forceRefresh: true });
            return true;
        } catch (error) {
            handleApiError(error, toastStore);
            return false;
        }
    }

    const getReportById = async (id) => {
        try {
            const res = await api.get(`report/${id}`);
            return res.data?.data || res.data;
        } catch (error) {
            handleApiError(error, toastStore);
            return null;
        }
    }

    return {
        ownReports,
        isLoading,
        page,
        perPage,
        totalItems,
        totalPages,
        sortBy,
        sortOrder,
        getOwnReports,
        createReport,
        updateReport,
        deleteReport,
        feedbackReport,
        updateFeedbackReport,
        deleteFeedbackReport,
        getReportById,
        setupSocketListeners,
        search,
        statusFilter
    }
})
