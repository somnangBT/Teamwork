<template>
    <div class="user-view">
        <Tabs v-model:value="activeTab" scrollable class="card gap-2 p-2" style="background-color: var(--surface-ground);">
        <div>
            <TabList>
                <Tab value="all-users" :disabled="activeTab === 'user-form' || activeTab === 'bulk-preview'">
                    <div class="d-flex align-items-center gap-2">
                        <UserRoundCheck style="color: var(--success-color);" :size="16" />
                        All Verified Users
                    </div>
                </Tab>
                <Tab value="all-pending-users" :disabled="activeTab === 'user-form' || activeTab === 'bulk-preview'">
                    <div class="d-flex align-items-center gap-2">
                        <MailWarning style="color: var(--warning-color);" :size="16" />
                        Pending Users
                    </div>
                </Tab>
                <Tab value="user-form" v-show="activeTab === 'user-form'">
                    <div class="d-flex align-items-center gap-2">
                        <UserPlus style="color: var(--primary-color);" :size="16" />
                        Add New User
                    </div>
                </Tab>
                <Tab value="bulk-preview" v-show="activeTab === 'bulk-preview'">
                    <div class="d-flex align-items-center gap-2">
                        <FileDown style="color: var(--primary-color);" :size="16" />
                        Preview Import
                    </div>
                </Tab>
            </TabList>
        </div>
        <TabPanels class="p-0 bg-transparent">
            <TabPanel value="bulk-preview">
                <UserBulkPreviewView v-if="activeTab === 'bulk-preview'" @close="onFormClose" />
            </TabPanel>
            <TabPanel value="user-form">
                <UserFormView v-if="activeTab === 'user-form'" @close="onFormClose" />
            </TabPanel>
            <TabPanel value="all-users">
                <UserListView v-if="activeTab === 'all-users'" @new="activeTab = 'user-form'" @preview-bulk="activeTab = 'bulk-preview'" />
            </TabPanel>
            <TabPanel value="all-pending-users">
                <UserPendingView v-if="activeTab === 'all-pending-users'" />
            </TabPanel>
        </TabPanels>
    </Tabs>
    </div>
</template>

<script setup>
import { Tab, TabList, TabPanels, TabPanel, Tabs } from 'primevue';
import { ref, watch, onMounted } from 'vue';
import UserListView from './UserListView.vue';
import UserPendingView from './UserPendingView.vue';
import UserFormView from './UserFormView.vue';
import UserBulkPreviewView from './UserBulkPreviewView.vue';
import { useRoute, useRouter } from 'vue-router';
import { UserRoundCheck, MailWarning, UserPlus, FileDown } from '@lucide/vue';

const route = useRoute();
const router = useRouter();

const activeTab = ref('all-users');
const VALID_TABS = ['all-users', 'all-pending-users', 'user-form'];

const onFormClose = () => {
    activeTab.value = 'all-users';
}

onMounted(() => {
    if (route.query.tab && VALID_TABS.includes(route.query.tab)) {
        activeTab.value = route.query.tab;
    } else if (route.query.tab) {
        router.replace({ query: { ...route.query, tab: activeTab.value } });
    }
});

watch(activeTab, (newTab) => {
    if (route.query.tab !== newTab) {
        router.replace({ query: { ...route.query, tab: newTab } });
    }
});
</script>
