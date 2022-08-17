<script setup lang="ts">
import { Order, OrderStatus } from '@/types/OrderTypes';
import { isStatusBefore } from '@/utils/Utils';
import { computed, ref } from 'vue';

const props = defineProps<{
    order: Order,
}>();

const currentEntryDate = ref(props.order.entryDate);
const currentDueDate = ref(props.order.dueDate);
const currentDueDateFormatted = computed(() => formatDate(currentDueDate.value.toString()));
const currentEntryDateFormatted = computed(() => formatDate(currentEntryDate.value.toString()));

const currentStatus = computed(() => Number.parseInt(OrderStatus[props.order.status]));

const isNewCurrentStatus = computed(() => currentStatus.value === OrderStatus.NEW);
const isPouringCurrentStatus = computed(() =>  currentStatus.value === OrderStatus.POURING);
const isDryingCurrentStatus = computed(() => currentStatus.value === OrderStatus.DRYING);
const isSandingCurrentStatus = computed(() => currentStatus.value === OrderStatus.SANDING);
const isSealingCurrentStatus = computed(() => currentStatus.value === OrderStatus.SEALING);
const isPackingCurrentStatus = computed(() => currentStatus.value === OrderStatus.PACKING);
const isReadyCurrentStatus = computed(() => currentStatus.value === OrderStatus.READY);
const isCompletedCurrentStatus = computed(() => currentStatus.value === OrderStatus.COMPLETED);

const isNewDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.NEW));
const isPouringDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.POURING));
const isDryingDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.DRYING));
const isSandingDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.SANDING));
const isSealingDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.SEALING));
const isPackingDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.PACKING));
const isReadyDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.READY));
const isCompletedDone = computed(() => isStatusBefore(currentStatus.value, OrderStatus.COMPLETED));

function formatDate(dateStr: string) {
    if(dateStr.length > 10) {
        dateStr = dateStr.substring(0, 10);
    }
    const dates = dateStr.split("-");
    return dates[2] + "-" + dates[1] + "-" + dates[0];
}
</script>

<template>
    <el-scrollbar>
    <div class="progress-container">
        <div class="bars-container">
            <div class="bar new" :class="{'active': isNewCurrentStatus, 'done': isNewDone}">
                <div class="color"></div>
                <div class="label">New</div>
            </div>
            <div class="bar pouring" :class="{'active': isPouringCurrentStatus, 'done': isPouringDone}">
                <div class="color"></div>
                <div class="label">Pouring</div>
            </div>
            <div class="bar drying" :class="{'active': isDryingCurrentStatus, 'done': isDryingDone}">
                <div class="color"></div>
                <div class="label">Drying</div>
            </div>
            <div class="bar sanding" :class="{'active': isSandingCurrentStatus, 'done': isSandingDone}">
                <div class="color"></div>
                <div class="label">Sanding</div>
            </div>
            <div class="bar sealing" :class="{'active': isSealingCurrentStatus, 'done': isSealingDone}">
                <div class="color"></div>
                <div class="label">Sealing</div>
            </div>
            <div class="bar packing" :class="{'active': isPackingCurrentStatus, 'done': isPackingDone}">
                <div class="color"></div>
                <div class="label">Packing</div>
            </div>
            <div class="bar ready" :class="{'active': isReadyCurrentStatus, 'done': isReadyDone}">
                <div class="color"></div>
                <div class="label">Ready</div>
            </div>
            <div class="bar completed" :class="{'active': isCompletedCurrentStatus, 'done': isCompletedDone}">
                <div class="color"></div>
                <div class="label">Completed</div>
            </div>
            <div class="entry-date-wrapper">
                {{currentEntryDateFormatted}}
            </div>
            <div class="due-date-wrapper">
                {{currentDueDateFormatted}}
            </div>
        </div>
    </div>
    </el-scrollbar>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.progress-container {
    height: 3.2rem;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto auto auto;

}
.bars-container {
    // display: flex;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
    // grid-template-columns: repeat(8, 10.5rem);
    grid-template-rows: 2rem auto;
    // height: 3rem;
}
.label {
    text-align: center;
    background-color: #f1f5f9;
    font-size: 14px;
    font-style: italic;
}
.entry-date-wrapper {
    grid-row: 2 / 2;
    grid-column: 1 / 2;
    justify-self: start;
    align-self: end;
    font-size: 0.9rem;
}
.due-date-wrapper {
    grid-row: 2 / 2;
    grid-column: 7 / 9;
    justify-self: center;
    align-self: end;
    font-size: 0.9rem;
}

.bar {
    flex-basis: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50% 50%;
    box-sizing: border-box;
    overflow: hidden;
    border-top: 1px solid black;
    position: relative;
    opacity: 0.5;
    color: #666464;

    &::before {
        content: "";
        position: absolute;
        height: 2rem;
        border-right: 1px solid black;
    }
    &.completed {
        &::after {
            content: "";
            position: absolute;
            right: 0;
            height: 2rem;
            border-right: 1px solid black;
        }
    }
    &.done {
        background: repeating-linear-gradient(
            -45deg,
            #94a3b8,
            #94a3b8 10px,
            #cbd5e1 10px,
            #cbd5e1 20px
        );
    }
    &.active {
        opacity: 1;
        color: black;
        font-weight: 550;
        &::after {
            content: "";
            position: absolute;
            right: 0;
            height: 2rem;
            border-right: 1px solid black;
        }
        +.bar::before {
            content: "";
            position: absolute;
            height: 2rem;
            border-right: none;
        }
    }
}
.details {
    width: 100%;
    height: 10rem;
    border: 1px solid black;
    margin-top: 5rem;
}
.new {
    background-color: #86198f;
}
.pouring {
    background-color: #be123c;
}
.drying {
    background-color: #b91c1c;
}
.sanding {
    background-color: #f97316;
}
.sealing {
    background-color: #f59e0b;
}
.packing {
    background-color: #14b8a6;
}
.ready {
    background-color: #3b82f6;
}
.completed {
    background-color: @custom-green;
}
</style>