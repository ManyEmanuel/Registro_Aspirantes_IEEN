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

const props = defineProps({
  vacanteId: {
    type: Number,
    default: 100,
  },
});

const registro_filtro = dashboard.value.registro_Vacante.find(
  (x) => x.vacante_Id == props.vacanteId
);

const rellena_grafica_tarjeta = () => {
  series.push({
    name: "Pendientes",
    data: [
      registro_filtro.solicitudes_Pendientes,
      registro_filtro.solicitudes_Completas,
    ],
  });
};

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
    categories: ["Pendientes", "Completas"],
  },
  yaxis: {},
  fill: {
    opacity: 1,
  },
  tooltip: {},
};
</script>

<style></style>
