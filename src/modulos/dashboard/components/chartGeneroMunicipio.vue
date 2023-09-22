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
import { useDashboard } from "../../../store/dashboard_store";

//--------------------------------------------------------------

const dasboadrStore = useDashboard();
const { dashboard } = storeToRefs(dasboadrStore);
//const series = [];
const props = defineProps({
  oficina: {
    type: String,
  },
  vacanteId: {
    type: Number,
    default: 100,
  },
});
//--------------------------------------------------------------

const registro_filtro = dashboard.value.registro_Vacante.find(
  (x) => x.vacante_Id == props.vacanteId
);
const series = [
  {
    name: "PRODUCT A",
    data: [44, 55],
  },
  {
    name: "PRODUCT B",
    data: [13, 23],
  },
  {
    name: "PRODUCT C",
    data: [11, 17],
  },
];
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
  // title: {
  //   text: registro_filtro.vacante,
  //   style: {
  //     fontSize: "19px",
  //     fontWeight: "bold",
  //     fontFamily: undefined,
  //     color: "#263238",
  //   },
  // },
  legend: {
    position: "bottom",
  },
  fill: {
    opacity: 1,
  },
};
</script>

<style></style>
