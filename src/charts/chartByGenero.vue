<template>
  <div id="chart">
    <apexchart
      type="pie"
      width="380"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDashboard } from "../store/dashboard_store";

const dasboadrStore = useDashboard();
const { dashboard, oficina } = storeToRefs(dasboadrStore);

const series = [1, 2, 3];
const categorias = [];

// const graficas = () => {
//   dashboard.value.solicitudes_Oficina.forEach((element) => {
//     categorias.push(element.oficina);
//     console.log("2", dashboard.value.solicitudes_Oficina.length);
//   });
// };
// graficas();
// const props = defineProps({
//   oficina: {
//     type: String,
//     default: "",
//   },
// });
// const registro_filtro = dashboard.value.solicitudes_Oficina.find(
//   (x) => x.oficina == oficina.value
// );
// series.push(
//   registro_filtro.solicitudes_Consejeros_Femeninos,
//   registro_filtro.solicitudes_Consejeros_Masculinos,
//   registro_filtro.solicitudes_Consejeros_No_Binarios
// );

const chartOptions = {
  chart: {
    width: 380,
    type: "pie",
  },
  labels: ["Femenino", "Masculino", "No binario"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};
</script>

<style></style>
