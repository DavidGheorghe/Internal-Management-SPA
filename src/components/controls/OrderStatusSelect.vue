<script setup lang="ts">
import { OrderStatus } from '@/types/OrderTypes';
import { computed, ref } from 'vue';
import { statusesAsStrings } from '@/utils/Utils';

const props = defineProps<{
    status: OrderStatus,
}>();

const emit = defineEmits<{
    (e: 'update:status', newStatus: OrderStatus): void
}>();

const isDisabled = ref(true);

const statuses = [...statusesAsStrings];

const currentStatus = computed({
    get() {
        return props.status;
    },
    set(value) {
        if (value !== props.status) {
            emit('update:status', value);
        }
    }
})
</script>

<template>
    <el-select 
        v-model="currentStatus"
    >
        <el-option 
            v-for="status of statuses"
            :key="status"
            :value="status"
        />
    </el-select>
</template>