<template>
  <div id="chart">
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDashboard } from "../store/dashboard_store";

const dasboadrStore = useDashboard();
const { dashboard } = storeToRefs(dasboadrStore);

const series = [];
const seriesDataCons = [];
const seriesDataSec = [];
const categorias = [];
const consejeros = dashboard.value.solicitudes_Oficina.map(
  (x) => x.solicitudes_Consejeros
);

const secretarios = dashboard.value.solicitudes_Oficina.map(
  (x) => x.solicitudes_Secretarios
);

const rellena_grafica_tarjeta = () => {
  dashboard.value.solicitudes_Oficina.forEach((element) => {
    categorias.push(element.oficina);
  });
};

series.push(
  {
    name: "Consejeros",
    data: consejeros,
  },
  {
    name: "Secretarios",
    data: secretarios,
  }
);

console.log(consejeros, secretarios);

rellena_grafica_tarjeta();

const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: categorias,
  },
  yaxis: {},
  fill: {
    opacity: 1,
  },
  tooltip: {},
};
</script>

<style></style>
