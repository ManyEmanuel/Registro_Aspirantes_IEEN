<template>
  <div id="chart">
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useDashboard } from "../../../store/dashboard_store";

//--------------------------------------------------------------

const dashboardStore = useDashboard();
const { dashboard } = storeToRefs(dashboardStore);
const series = ref([]);

//--------------------------------------------------------------

const rellena = () => {
  const consejeriaFemenino = dashboard.value.solicitudes_Consejeria_Genero.map(
    (x) => x.femenino
  );

  const consejeriaMasculino = dashboard.value.solicitudes_Consejeria_Genero.map(
    (x) => x.masculino
  );

  const consejeriaNoBinario = dashboard.value.solicitudes_Consejeria_Genero.map(
    (x) => x.no_Binario
  );

  const secretariaFemenino = dashboard.value.solicitudes_Secretaria_Genero.map(
    (x) => x.femenino
  );

  const secretariaMasculino = dashboard.value.solicitudes_Secretaria_Genero.map(
    (x) => x.masculino
  );

  const secretariaNoBinario = dashboard.value.solicitudes_Secretaria_Genero.map(
    (x) => x.no_Binario
  );
  series.value.push(
    {
      name: "Con-F",
      group: "consejeria",
      data: consejeriaFemenino,
    },
    {
      name: "Sec-F",
      group: "secretaria",
      data: secretariaFemenino,
    },
    {
      name: "Con-M",
      group: "consejeria",
      data: consejeriaMasculino,
    },
    {
      name: "Sec-M",
      group: "secretaria",
      data: secretariaMasculino,
    },
    {
      name: "Con-NB",
      group: "consejeria",
      data: consejeriaNoBinario,
    },
    {
      name: "Sec-NB",
      group: "secretaria",
      data: secretariaNoBinario,
    }
  );
};
watch(dashboard, () => {
  series.value = [];
  rellena();
});

const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  dataLabels: {},
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  xaxis: {
    categories: ["18-24", "25-29", "30-39", "40-49", "50-59", "60 o más"],
  },
  title: {
    text: "Total de registros por rango de edad y género",
    style: {
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: undefined,
      color: "#263238",
    },
  },
  fill: {
    opacity: 1,
  },
  colors: ["#d1308a", "#fe89bf", "#863399", "#b684c1", "#76777a", "#babbbc"],
  yaxis: {},
  legend: {
    position: "bottom",
    fontSize: "16px",
  },
};
</script>

<style></style>
