<template>
    <form @submit.prevent>
        <div>
            <BaseInput label="Survey Target Name" type="text" placeholder="Enter name" v-model="name" :error="errors.name" required />
        </div>
    </form>
</template>

<script setup>
import { watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import { surveySchemas } from '@/utils/validations';

const props = defineProps({
    initialData: Object
});

const { validate, setValues, errors, resetForm } = useForm({
    validationSchema: surveySchemas.target,
    initialValues: {
        name: ''
    }
});

const { value: name } = useField('name');

const initForm = () => {
    if (props.initialData) {
        setValues({
            name: props.initialData.name || ''
        });
    } else {
        resetForm();
    }
};

const validateForm = async () => {
    const { valid } = await validate();
    if (valid) {
        return {
            name: name.value.trim()
        };
    }
    return false;
};

watch(() => props.initialData, () => {
    initForm();
}, { deep: true, immediate: true });

defineExpose({ validateForm, initForm });
</script>