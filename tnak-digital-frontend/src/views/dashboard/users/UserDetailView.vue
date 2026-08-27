<template>
    <div class="card" style="background-color: var(--body-bg-color); border-radius: var(--border-inner-radius)">
        <div class="row g-0">
            <div class="col-12 d-flex align-items-center justify-content-center p-4" style="max-height: 300px;">
                <img class="object-fit-cover w-100 h-100"
                    :src="$authImg(user?.profile?.avatarUrl) || 'https://ui-avatars.com/api/?name=' + (user?.firstName || 'U') + '+' + (user?.lastName || 'U') + '&background=random'"
                    alt="User Avatar">
            </div>

            <div class="col-12">
                <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title mb-3">
                                {{ user?.firstName }} {{ user?.lastName }}
                            </h4>
                            <h6 class="card-subtitle text-muted text-capitalize">
                                {{ user?.role?.name || 'No Role Assigned' }}
                            </h6>
                        </div>
                        <span class="badge rounded-pill" :class="user?.isActive ? 'bg-success' : 'bg-secondary'">
                            {{ user?.isActive ? 'Active' : 'Inactive' }}
                        </span>
                    </div>

                    <hr>

                    <ul class="ps-0">
                        <li class="list-group-item px-0 py-1 border-0">
                            <strong class="text-secondary me-2">Email:</strong>
                            <a :href="`mailto:${user?.email}`" class="text-decoration-none text-primary">{{ user?.email }}</a>
                        </li>

                        <template v-if="user?.profile">
                            <li class="list-group-item px-0 py-1 border-0">
                                <strong class="text-secondary me-2">Phone:</strong> {{ user?.profile?.phone || 'N/A' }}
                            </li>
                            <li class="list-group-item px-0 py-1 border-0 text-capitalize">
                                <strong class="text-secondary me-2">Gender:</strong> {{ user?.profile?.gender || 'N/A'
                                }}
                            </li>
                            <li class="list-group-item px-0 py-1 border-0">
                                <strong class="text-secondary me-2">DOB:</strong> {{ formatDate(user?.profile?.dateOfBirth) || 'N/A'
                                }}
                            </li>
                            <li class="list-group-item px-0 py-1 border-0">
                                <strong class="text-secondary d-block mb-1">Bio:</strong>
                                <p class="mb-0 text-muted small">{{ user?.profile?.bio || 'No biography provided.' }}
                                </p>
                            </li>
                        </template>

                        <li v-else class="list-group-item px-0 py-2 border-0 text-muted fst-italic small">
                            Detailed profile data is currently unavailable.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatDate } from '@/utils/dateFormat.js';
const props = defineProps({
    user: {
        type: Object,
        required: true,
        default: () => ({})
    }
})
</script>