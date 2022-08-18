<script setup lang="ts">
import { DoughnutChart, useDoughnutChart, BarChart, useBarChart, LineChart, useLineChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { computed, ref } from "vue";
import { getOrdersReports } from "@/services/OrderService";

Chart.register(...registerables);

const dataValues = ref(await initReports());
const dataLabels = ref(["Due In One Week", "Active Orders"]);

const data = computed<ChartData<"bar">>(() => ({
    labels: dataLabels.value,
    datasets: [
        {
            data: dataValues.value,
            backgroundColor: [
                "#ef4444",
                "#60a5fa",
            ],
        },
    ],
}));

const options = computed<ChartOptions<"bar">>(() => ({
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
            display: false,
        },
        title: {
            display: true,
            text: "Orders",
        },
    },
}));

const { barChartProps, barChartRef } = useBarChart({
    chartData: data,
    options,
});

async function initReports() {
    const reportsDTO = (await getOrdersReports());
    return Object.values(reportsDTO);
}
</script>

<template>
    <BarChart v-bind="barChartProps" css-classes="orders-reports"/>
</template>

<style lang="less" scoped>
.orders-reports {
    width: 30rem;
    height: 20rem;
}
</style>
