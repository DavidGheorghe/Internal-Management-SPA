<script setup lang="ts">
import { DoughnutChart, useDoughnutChart, BarChart, useBarChart, LineChart, useLineChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { computed, ref } from "vue";
import { getNewOrdersReport, getOrderCompletedReport } from "@/services/OrderService";
import { lastEightWeeksDatesStr } from "@/utils/Utils";

Chart.register(...registerables);

const completeOrdersValues = ref(await initCompleteOrdersReportData());
const dates = ref(Object.values(lastEightWeeksDatesStr));
const newOrdersValues = ref(await initNewOrdersReportData());

const data = computed<ChartData<"line">>(() => ({
    labels: dates.value,
    datasets: [
        {
            data: completeOrdersValues.value,
            backgroundColor: [
                "#ffffff",
            ],
            label: 'Completed Orders',
            borderColor: "#22c55e"
        },
        {
            data: newOrdersValues.value,
            backgroundColor: [
                "#ffffff",
            ],
            label: 'New Orders',
            borderColor: "#fde047"
        },
    ]
}));

const options = computed<ChartOptions<"line">>(() => ({
    scales: {
        myScale: {
            type: "linear",
            position: "left",
            ticks: {
                stepSize: 1
            }
        },
    },
    plugins: {
        legend: {
            display: true,
        },
        title: {
            display: true,
            text: "Orders in the last two months per week",
        },
    },
}));

const { lineChartProps, lineChartRef } = useLineChart({
    chartData: data,
    options,
});

async function initCompleteOrdersReportData() {
    const reportDTO = await getOrderCompletedReport();
    return Object.values(reportDTO);
}

async function initNewOrdersReportData() {
    const reportDTO = await getNewOrdersReport();
    return Object.values(reportDTO);
}
</script>

<template>
    <LineChart v-bind="lineChartProps"  css-classes="report"/>
</template>

<style scoped lang="less">
.report {
    width: 50rem;
    height: 25rem;
}
</style>