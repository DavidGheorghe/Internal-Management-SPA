<script setup lang="ts">
import { Order } from '@/types/OrderTypes';
import { ref, watch } from 'vue';
import InputTextarea from '../../controls/InputTextarea.vue';

const props = defineProps<{
    editedOrder?: Order
}>();

const emit = defineEmits<{
    (e: 'update-details', newDetails: string): void,
    (e: 'update-due-date', newDueDate: Date | null): void,
}>();

const details = ref<string>(props.editedOrder?.details || "");
const dueDate = ref<Date | null>(props.editedOrder?.dueDate || null);


function isDateInThePast(date: Date) {
    return date < new Date();
}

function clearDueDateAndDetails() {
    details.value = "";
    dueDate.value = null;
}

defineExpose({
    clearDueDateAndDetails,
});

watch(details, () => {
    emit('update-details', details.value);
})
watch(dueDate, () => {
    emit('update-due-date', dueDate.value);
})
</script>

<template>
    <section>
        <!-- <label>Choose Due Date*</label> -->
        <div class="due-date-and-details-wrapper">
            <el-date-picker
                v-if="!editedOrder" 
                class="datepicker"
                v-model="dueDate" 
                format="DD-MM-YYYY"
                :disabled-date="isDateInThePast"
                placeholder="Pick a day"
            />
            <div class="details-wrapper">
                <InputTextarea
                    class="details"
                    v-model="details"
                    :required="false"
                    placeholder="Fill in necessary details."
                    :resizeable="false"
                    :cols="27"
                    :rows="12"
                />
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
section {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
label {
    width: 100%;
    text-align: start;
    font-family: 'Segoe UI', serif;
    font-weight: 600;
}
.due-date-and-details-wrapper {
    flex-basis: 100%;
    width: 100%;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
}
.details-wrapper {
    flex-basis: 50%;
    height: 15rem;
    margin-top: 1.5rem;
}
</style>