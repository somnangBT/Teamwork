<template>
    <form class="card p-3" style="background-color: var(--body-bg-color);">
        <div class="mb-3" v-if="!initialData">
            <BaseSelectButton v-model="creationMode" :options="modeOptions" />
        </div>

        <div v-if="creationMode === 'email'">
            <div class="mb-3">
                <BaseInput type="text" placeholder="example@gmail.com" :disabled="initialData ? true : false" label="Email"
                    v-model="email" :error="errors.email" required />
            </div>
            <div>
                <BaseSelect :disabled="initialData ? true : false" v-model="roleId" :options="roles"
                    label="User Role" placeholder="Select Role" required :error="errors.roleId" />
            </div>
        </div>

        <div v-else>
            <div class="row g-3 mb-3">
                <div class="col-sm-6 mb-sm-0">
                    <BaseInput type="text" placeholder="John" label="First Name" v-model="firstName" :maxlength="30" :error="errors.firstName" required />
                </div>
                <div class="col-sm-6">
                    <BaseInput type="text" placeholder="Doe" label="Last Name" v-model="lastName" :maxlength="30" :error="errors.lastName" required />
                </div>
            </div>
            <div>
                <BaseSelect v-model="roleId" :options="autoRoles"
                    label="User Role" placeholder="Select Role" required :error="errors.roleId" />
            </div>
        </div>
    </form>
</template>

<script setup>
import { useUserStore } from '@/stores/users/user';
import { ref, watch, computed } from 'vue';
import { useForm, useField } from 'vee-validate';
import { userSchemas } from '@/utils/validations';

const userStore = useUserStore();
const roles = computed(() => userStore.userRoles.map(r => ({ label: r.name, value: r.id })));
const autoRoles = computed(() => userStore.userRoles.filter(r => r.id === 2 || r.id === 3).map(r => ({ label: r.name, value: r.id })));

const creationMode = ref('email');
const modeOptions = [
    { label: 'Custom Email', value: 'email' },
    { label: 'Auto Generate', value: 'auto' }
];

const props = defineProps({
    initialData: Object
});

const dynamicSchema = computed(() => creationMode.value === 'email' ? userSchemas.create : userSchemas.createAuto);

const { validate, setValues, errors, resetForm } = useForm({
    validationSchema: dynamicSchema,
    initialValues: {
        email: "",
        firstName: "",
        lastName: "",
        roleId: 3
    }
});

const { value: email } = useField('email');
const { value: firstName } = useField('firstName');
const { value: lastName } = useField('lastName');
const { value: roleId } = useField('roleId');

watch(creationMode, (newMode) => {
    resetForm({
        values: {
            email: "",
            firstName: "",
            lastName: "",
            roleId: newMode === 'auto' ? 3 : 3
        }
    });
});

const initForm = () => {
    if (props.initialData) {
        setValues({
            email: props.initialData.email || '',
            firstName: '',
            lastName: '',
            roleId: props.initialData?.role?.id || 3,
        });
    } else {
        resetForm();
    }
};

const validateForm = async () => {
    const { valid } = await validate();
    if (valid) {
        if (creationMode.value === 'email') {
            return {
                mode: 'single',
                email: email.value.trim(),
                roleId: Number(roleId.value)
            };
        } else {
            return {
                mode: 'bulk',
                roleId: Number(roleId.value),
                users: [
                    { firstName: firstName.value.trim(), lastName: lastName.value.trim() }
                ]
            };
        }
    }
    return false;
};

watch(() => props.initialData, () => {
    initForm();
}, { deep: true, immediate: true });

defineExpose({ validateForm, initForm });
</script>