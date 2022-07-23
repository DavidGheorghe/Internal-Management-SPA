<script setup lang="ts">
import { OrderStatus } from '@/types/OrderTypes';
import { computed, ref } from 'vue';
import { statusesAsStrings } from '@/utils/Utils';

const props = defineProps<{
    status: OrderStatus,
    // hasEditIcon?: boolean
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
    <div class="order-status-select-container">
        <!-- <div class="select-wrapper"> -->
            <select 
                name="statuses-dropdown" 
                id="statuses-dropdown"
                v-model="currentStatus"
            >
                <option 
                    v-for="status of statuses"
                    :key="status"
                    :value="status"
                >
                    {{status}}
                </option>
            </select>
            <!-- <span 
                v-if="hasEditIcon" 
                class="material-symbols-outlined"
            >
                edit
            </span> -->
        <!-- </div> -->
    </div>
</template>

<style scoped lang="less">
// .order-status-select-container {
//     display: flex;
//     justify-content: flex-start;
// }
// .select-wrapper {
//     display: flex;
// }
// select {
//   -webkit-appearance: none;
//   -moz-appearance: none;
//   text-indent: 1px;
//   text-overflow: '';
//   border: none;
// }
</style>