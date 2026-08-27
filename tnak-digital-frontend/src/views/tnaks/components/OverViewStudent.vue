<template>
    <div class="tnak-overview-view">
        <!-- Banner Section -->
        <div class="row mb-3">
            <div class="col-12">
                <div class="card position-relative overflow-hidden">
                    <div class="position-absolute w-100 h-100" style="top: 0; left: 0; z-index: 0;">
                        <Banner />
                    </div>

                    <div class="card-body d-flex justify-content-between align-items-end position-relative p-4"
                        style="z-index: 2; min-height: 220px;">
                        <div class="d-flex flex-column text-white">
                            <h3 class="fw-bold mb-1 text-white">{{ authStore.user?.firstName + ' ' + authStore.user?.lastName }}</h3>
                            <p class="mb-3 text-white-50" style="font-size: 0.95rem;">{{ authStore.user?.email }}</p>
                            <div>
                            <span class="badge px-3 py-2 text-base text-uppercase" style="letter-spacing: 0.5px; font-weight: 600; border-radius: var(--border-inner-radius); background-color: var(--surface-ground);">
                                    {{ authStore.user?.role?.name || 'STUDENT' }}
                                </span>
                            </div>
                        </div>

                        <!-- Weather inside banner -->
                        <div class="d-none d-md-block">
                            <div class="card p-3" style="background-color: var(--surface-ground); border-radius: var(--border-inner-radius); min-width: 260px;">
                                <div class="card-body p-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <div class="d-flex align-items-center gap-1 text-muted mb-1" style="font-size: 0.85rem;">
                                            <MapPin :size="14" />
                                            <span>{{ weatherData.location }}</span>
                                        </div>
                                        <div class="fw-bold text-heading" style="font-size: 2rem; line-height: 1;">{{ weatherData.temp }}°</div>
                                        <div class="text-muted mt-2" style="font-size: 0.85rem;">{{ weatherData.description }} • Feels {{ weatherData.feelsLike }}°</div>
                                    </div>
                                    <div class="text-primary ms-4">
                                        <component :is="weatherData.icon" :size="48" stroke-width="1.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        </div>

        <!-- Main Layout Grid -->
        <div class="row g-3">
            <!-- Left Column: Surveys & Reports -->
            <div class="col-12 col-lg-8 d-flex flex-column gap-3">
                
                <!-- Surveys Pending Section -->
                <div class="d-flex flex-column gap-2 flex-grow-1">
                    <!-- Title Card -->
                    <div class="card p-3" style="background-color: var(--body-bg-color)">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center gap-2">
                                <div class="rounded p-1 d-flex align-items-center justify-content-center" style="background-color: rgba(102, 16, 242, 0.1); color: var(--purple, #6f42c1);">
                                    <ClipboardList :size="16" />
                                </div>
                                <span class="fw-bold text-heading">Surveys pending your feedback</span>
                            </div>
                            <router-link :to="{ name: 'tnak-surveys' }" class="text-primary text-decoration-none fw-medium" style="font-size: 0.9rem;">View all</router-link>
                        </div>
                    </div>
                    
                    <!-- Dynamic Surveys List -->
                    <div v-if="surveyStudentStore.states.isLoading" class="card d-flex justify-content-center py-5" style="background-color: var(--body-bg-color)">
                        <div class="spinner-border text-primary spinner-border-sm mx-auto" role="status"></div>
                    </div>
                    <div v-else-if="pendingSurveys.length > 0" class="row g-2">
                        <div v-for="survey in pendingSurveys.slice(0, 4)" :key="survey.id" class="col-12 col-md-6">
                            <div class="card p-3 h-100" style="background-color: var(--body-bg-color); cursor: pointer;" @click="router.push({ name: 'tnak-survey', params: { id: survey.id } })">
                                <div class="d-flex align-items-center justify-content-between h-100">
                                    <div class="d-flex flex-column overflow-hidden me-2">
                                        <span class="fw-medium text-heading text-truncate" style="font-size: 0.95rem;">{{ survey.title }}</span>
                                        <span class="text-muted mt-1" style="font-size: 0.85rem; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ survey.description || 'No description provided' }}</span>
                                    </div>
                                    <ChevronRight :size="18" class="text-muted" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="card d-flex flex-column align-items-center justify-content-center py-5" style="background-color: var(--body-bg-color)">
                        <CheckCircle :size="32" class="text-muted mb-3 opacity-50" stroke-width="1.5" />
                        <span class="text-muted" style="font-size: 0.95rem;">You're all caught up — no surveys waiting</span>
                    </div>
                </div>

            </div>

            <!-- Right Column: Weather & Reports -->
            <div class="col-12 col-lg-4 d-flex flex-column">
                <div class="row g-3 flex-grow-1 flex-lg-column">

                    <div class="col-12 flex-grow-1 d-flex flex-column">
                        <!-- My Active Reports Section -->
                        <div class="d-flex flex-column gap-2 flex-grow-1">
                            <!-- Title Card -->
                            <div class="card p-3" style="background-color: var(--body-bg-color)">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded p-1 d-flex align-items-center justify-content-center" style="background-color: rgba(220, 53, 69, 0.1); color: var(--danger, #dc3545);">
                                            <AlertTriangle :size="16" />
                                        </div>
                                        <span class="fw-bold text-heading">My active reports</span>
                                    </div>
                                    <router-link :to="{ name: 'tnak-reports' }" class="text-primary text-decoration-none fw-medium" style="font-size: 0.9rem;">View all</router-link>
                                </div>
                            </div>

                            <!-- Dynamic Reports List -->
                            <div v-if="ownReportStore.isLoading" class="card d-flex justify-content-center py-5" style="background-color: var(--body-bg-color)">
                                <div class="spinner-border text-primary spinner-border-sm mx-auto" role="status"></div>
                            </div>
                            <div v-else-if="activeReports.length > 0" class="row g-2">
                                <div v-for="report in activeReports.slice(0, 4)" :key="report.id" class="col-12">
                                    <div class="card p-3 h-100" style="background-color: var(--body-bg-color); cursor: pointer;" @click="router.push({ name: 'tnak-reports' })">
                                        <div class="d-flex align-items-center justify-content-between h-100">
                                            <div class="d-flex flex-column overflow-hidden me-2">
                                                <span class="fw-medium text-heading text-truncate" style="font-size: 0.95rem;">{{ report.title }}</span>
                                                <div class="d-flex align-items-center gap-2 mt-1">
                                                    <BaseBadge :status="report.status" size="sm" />
                                                </div>
                                            </div>
                                            <ChevronRight :size="18" class="text-muted" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="card d-flex flex-column align-items-center justify-content-center py-5" style="background-color: var(--body-bg-color)">
                                <FileText :size="32" class="text-muted mb-3 opacity-50" stroke-width="1.5" />
                                <span class="text-muted" style="font-size: 0.95rem;">No active reports found</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { useSurveyStudentStore } from '@/stores/surveys/surveyStudent';
import { useOwnReportstore } from '@/stores/reports/ownReport';
import Banner from '@/components/Banner.vue';
import BaseBadge from '@/components/base/BaseBadge.vue';
import { Newspaper, ClipboardList, CheckCircle, AlertTriangle, FileText, MapPin, CloudSun, ChevronRight, Sun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from '@lucide/vue';

const router = useRouter();
const authStore = useAuthStore();
const surveyStudentStore = useSurveyStudentStore();
const ownReportStore = useOwnReportstore();

const weatherData = ref({
    temp: '--',
    feelsLike: '--',
    description: 'Loading...',
    icon: markRaw(CloudSun),
    location: 'Loading...'
});

const fetchWeather = async () => {
    const fetchWithCoords = async (lat, lon, locationName) => {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`);
            const data = await response.json();
            
            const temp = Math.round(data.current.temperature_2m);
            const feelsLike = Math.round(data.current.apparent_temperature);
            const code = data.current.weather_code;
            
            let desc = 'Clear';
            let icon = Sun;
            
            if (code === 0) { desc = 'Clear sky'; icon = Sun; }
            else if (code === 1 || code === 2 || code === 3) { desc = 'Partly cloudy'; icon = CloudSun; }
            else if (code === 45 || code === 48) { desc = 'Fog'; icon = CloudFog; }
            else if (code >= 51 && code <= 55) { desc = 'Drizzle'; icon = CloudDrizzle; }
            else if (code >= 61 && code <= 65) { desc = 'Rain'; icon = CloudRain; }
            else if (code >= 71 && code <= 75) { desc = 'Snow'; icon = CloudSnow; }
            else if (code >= 95) { desc = 'Thunderstorm'; icon = CloudLightning; }
            
            weatherData.value = { temp, feelsLike, description: desc, icon: markRaw(icon), location: locationName };
        } catch (error) {
            weatherData.value.description = 'Weather unavailable';
        }
    };

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                let locationName = 'Current Location';
                try {
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const geoData = await geoRes.json();
                    locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state || 'Current Location';
                } catch (e) {
                    console.error('Reverse geocoding failed', e);
                }
                fetchWithCoords(lat, lon, locationName);
            },
            (error) => {
                fetchWithCoords(11.5564, 104.9282, 'Phnom Penh');
            },
            { timeout: 5000 }
        );
    } else {
        fetchWithCoords(11.5564, 104.9282, 'Phnom Penh');
    }
};

const formattedDate = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

const pendingSurveys = computed(() => {
    return surveyStudentStore.states.surveyStudent.filter(survey => !survey.response?.isCompleted);
});

const activeReports = computed(() => {
    return ownReportStore.ownReports.filter(report => report.status !== 'RESOLVED' && report.status !== 'REJECTED');
});

onMounted(async () => {
    surveyStudentStore.getAllSurveyStudent();
    ownReportStore.page = 1;
    ownReportStore.getOwnReports();
    fetchWeather();

    surveyStudentStore.setupSocketListeners();
    ownReportStore.setupSocketListeners();
});
</script>
