<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="250"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDashboard } from "../store/dashboard_store";

//--------------------------------------------------------------

const dasboadrStore = useDashboard();
const { dashboard } = storeToRefs(dasboadrStore);
const series = [];
const props = defineProps({
  vacanteId: {
    type: Number,
    default: 100,
  },
});

//--------------------------------------------------------------

const registro_filtro = dashboard.value.registro_Vacante.find(
  (x) => x.vacante_Id == props.vacanteId
);

const rellena_grafica_tarjeta = () => {
  series.push(
    {
      name: "Femenino",
      data: [
        registro_filtro.solicitudes_Pendientes_Femenino,
        registro_filtro.solicitudes_Completas_Femenino,
      ],
    },
    {
      name: "Masculino",
      data: [
        registro_filtro.solicitudes_Pendientes_Masculino,
        registro_filtro.solicitudes_Completas_Masculino,
      ],
    },
    {
      name: "No binario",
      data: [
        registro_filtro.solicitudes_Pendientes_No_Binario,
        registro_filtro.solicitudes_Completas_No_Binario,
      ],
    }
  );
};
rellena_grafica_tarjeta();

const chartOptions = {
  chart: {
    type: "bar",
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  colors: ["#d1308a", "#863399", "#76777a"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontWeight: 200,
          },
        },
      },
    },
  },
  xaxis: {
    categories: ["Pendientes", "Completas"],
  },
  legend: {
    position: "bottom",
  },
  fill: {
    opacity: 1,
  },
};
</script>

<style></style>
