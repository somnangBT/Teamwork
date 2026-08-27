<template>
    <div class="d-flex flex-column gap-3">
        <div>
            <h5 class="d-flex align-items-center gap-2 mb-0">
                <User :size="20" class="text-primary" /> Personal Information
            </h5>
            <p class="text-muted small mb-0 mt-1">Update your profile details and personal information.</p>
        </div>
        <div class="main-divider"></div>

        <div class="row g-3">
            <div class="col-sm-4 d-flex justify-content-center mb-2">
                <BaseAvatarUpload v-model="formData.avatar" :defaultImage="props.initialData?.profile?.avatarUrl"
                    :isLoading="props.isLoading" :disabled="props.disabled" />
            </div>

            <div class="col-sm-8">
                <BaseInput id="bio" type="textarea" v-model="bio" label="Bio" placeholder="Tell us about yourself"
                    :rows="4" :error="errors.bio" :disabled="props.disabled" />
            </div>

            <div class="col-md-6">
                <BaseInput id="firstName" v-model="firstName" label="First Name" placeholder="Enter first name"
                    :error="errors.firstName" :disabled="props.disabled" />
            </div>
            <div class="col-md-6">
                <BaseInput id="lastName" v-model="lastName" label="Last Name" placeholder="Enter last name"
                    :error="errors.lastName" :disabled="props.disabled" />
            </div>

            <div class="col-md-6">
                <BaseInput id="phone" v-model="phone" label="Phone Number" placeholder="Enter phone number"
                    :error="errors.phone" :disabled="props.disabled" />
            </div>
            <div class="col-md-6">
                <BaseSelectButton id="gender" v-model="gender" label="Gender" :options="genderOptions"
                    :error="errors.gender" :disabled="props.disabled" />
            </div>

            <div class="col-12">
                <BaseDatePicker id="dateOfBirth" v-model="dateOfBirth" label="Date of Birth" :error="errors.dateOfBirth"
                    :disabled="props.disabled" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { User } from '@lucide/vue';
import { useForm, useField } from 'vee-validate';
import { profileSchemas } from '@/utils/validations';

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const formData = ref({ avatar: null });

const { validate, setValues, errors, resetForm } = useForm({
    validationSchema: profileSchemas.update,
    initialValues: {
        firstName: '',
        lastName: '',
        bio: '',
        phone: '',
        gender: '',
        dateOfBirth: ''
    }
});

const { value: firstName } = useField('firstName');
const { value: lastName } = useField('lastName');
const { value: bio } = useField('bio');
const { value: phone } = useField('phone');
const { value: gender } = useField('gender');
const { value: dateOfBirth } = useField('dateOfBirth');

const genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' }
];

const initForm = () => {
    if (props.initialData && Object.keys(props.initialData).length > 0) {
        setValues({
            firstName: props.initialData.firstName || '',
            lastName: props.initialData.lastName || '',
            bio: props.initialData?.profile?.bio || '',
            phone: props.initialData?.profile?.phone || '',
            gender: props.initialData?.profile?.gender || 'MALE',
            dateOfBirth: props.initialData?.profile?.dateOfBirth || ''
        });
    } else {
        resetForm();
    }
};

const validateForm = async () => {
    const { valid } = await validate();
    if (valid) {
        return {
            firstName: firstName.value,
            lastName: lastName.value,
            bio: bio.value,
            phone: phone.value,
            gender: gender.value,
            dateOfBirth: dateOfBirth.value,
            avatar: formData.value.avatar
        };
    }
    return false;
};

watch(() => props.initialData, () => {
    initForm();
}, { deep: true, immediate: true });

onMounted(() => {
    initForm();
});

defineExpose({ validateForm, formData, initForm });
</script>
