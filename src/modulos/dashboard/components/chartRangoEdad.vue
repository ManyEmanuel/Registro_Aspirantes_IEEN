<template>
  <div id="chart">
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDashboard } from "../../../store/dashboard_store";

//--------------------------------------------------------------

const dashboardStore = useDashboard();
const { dashboard } = storeToRefs(dashboardStore);

//--------------------------------------------------------------

const series = [
  {
    name: "Consejerías",
    data: [28, 29, 33, 36, 32, 32],
  },
  {
    name: "Secretarías",
    data: [12, 11, 14, 18, 17, 13],
  },
];
const chartOptions = {
  chart: {
    height: 350,
    type: "line",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#77B6EA", "#545454"],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: "smooth",
  },
  title: {
    text: "Rango de edades",
    align: "left",
  },
  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  markers: {
    size: 1,
  },
  xaxis: {
    categories: ["18-24", "25-29", "30-39", "40-49", "50-59", "60 o más"],
    title: {
      text: "Rango de edades",
    },
  },
  yaxis: {
    title: {
      text: "Cantidad",
    },
    min: 5,
    max: 40,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
};
</script>

<style></style>
