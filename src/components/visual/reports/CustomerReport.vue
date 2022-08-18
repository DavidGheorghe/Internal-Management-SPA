<script setup lang="ts">
import { DoughnutChart, useDoughnutChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { computed, ref } from "vue";

Chart.register(...registerables);

const dataValues = ref([30, 40, 60, 70, 5]);
const dataLabels = ref(["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"]);
const toggleLegend = ref(true);

const testData = computed<ChartData<"doughnut">>(() => ({
    labels: dataLabels.value,
    datasets: [
    {
        data: dataValues.value,
        backgroundColor: [
        "#77CEFF",
        "#0079AF",
        "#123E6B",
        "#97B0C4",
        "#A5C8ED",
        ],
    },
    ],
}));

const options = computed<ChartOptions<"doughnut">>(() => ({
    scales: {
    myScale: {
        type: "logarithmic",
        position: toggleLegend.value ? "left" : "right",
    },
    },
    plugins: {
    legend: {
        position: toggleLegend.value ? "top" : "bottom",
    },
    title: {
        display: true,
        text: "Chart.js Doughnut Chart",
    },
    },
}));

const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({
    chartData: testData,
    options,
});

let index = ref(20);

function shuffleData() {
    // dataValues.value = shuffle(dataValues.value);
    dataValues.value.push(index.value);
    dataLabels.value.push("Other" + index.value);
    console.log(dataValues.value);
    console.log(doughnutChartRef.value!.chartInstance);
    index.value++;
}

function switchLegend() {
    toggleLegend.value = !toggleLegend.value;
}
</script>

<template>

</template>

<style lang="less" scoped>

</style>
