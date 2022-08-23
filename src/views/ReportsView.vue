<script setup lang="ts">
import OrdersReport from '@/components/visual/reports/OrdersReport.vue';
import ProductReport from '../components/visual/reports/ProductReport.vue';
import CompletedAndNewOrdersReport from '@/components/visual/reports/CompletedAndNewOrdersReport.vue';

</script>

<template>
    <main class="reports-view">
        <section class="orders-reports-section">
            <div class="completed-and-new-orders-report-wrapper">
                <CompletedAndNewOrdersReport />
            </div>
            <div class="active-and-due-report-wrapper">
                <OrdersReport />
            </div>
        </section>
    </main>
</template>

<style scoped lang="less">
.reports-view {
    height: 100%;
    width: 100%;
}
.orders-reports-section {
    display: grid;
    grid-template-columns: 50% 50%;
    height: 60%;
    > * {
        justify-self: center;
        align-self: end;
    }
}
.orders-section {
    width: 50rem;
}
</style>