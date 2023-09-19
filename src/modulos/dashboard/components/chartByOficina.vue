<template>
  <div id="chart">
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDashboard } from "../../../store/dashboard_store";

const dasboadrStore = useDashboard();
const { dashboard } = storeToRefs(dasboadrStore);

const series = [];
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
    name: "Consejerías",
    data: consejeros,
  },
  {
    name: "Secretarías",
    data: secretarios,
  }
);
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
  },
  xaxis: {
    categories: categorias,
  },
  title: {
    text: "Total de registros por municipio",
    style: {
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: undefined,
      color: "#263238",
    },
  },
  yaxis: {},
  fill: {
    opacity: 1,
  },
  tooltip: {},
};
</script>

<style></style>
