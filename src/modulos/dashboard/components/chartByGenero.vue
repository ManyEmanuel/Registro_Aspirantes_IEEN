<template>
  <q-virtual-scroll
    v-if="props.vacante == 1"
    :items="oficinas"
    virtual-scroll-horizontal
    v-slot="{ index }"
    class="text-bold"
  >
    <div :key="index">
      <div id="chart">
        <apexchart
          type="pie"
          width="380"
          :options="options_chart[index]"
          :series="series_by_oficina[index]"
        ></apexchart>
      </div>
    </div>
  </q-virtual-scroll>
  <q-virtual-scroll
    v-if="props.vacante == 2"
    :items="oficinas"
    virtual-scroll-horizontal
    v-slot="{ index }"
    class="text-bold"
  >
    <div :key="index">
      <div id="chart">
        <apexchart
          type="pie"
          width="380"
          :options="options_chart[index]"
          :series="series_secretarias[index]"
        ></apexchart>
      </div>
    </div>
  </q-virtual-scroll>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useDashboard } from "../../../store/dashboard_store";

//--------------------------------------------------------------

const dasboadrStore = useDashboard();
const { dashboard } = storeToRefs(dasboadrStore);
const oficinas = [];
const series_by_oficina = ref([]);
const series_secretarias = ref([]);
const options_chart = ref([]);

const props = defineProps({
  vacante: {
    type: Number,
    default: 1,
  },
});

//--------------------------------------------------------------

onBeforeMount(() => {
  rellena_grafica_tarjeta();
});

//--------------------------------------------------------------

const rellena_grafica_tarjeta = () => {
  dashboard.value.solicitudes_Oficina.forEach((element) => {
    oficinas.push(element.oficina);

    const serie_temp = [
      element.solicitudes_Consejeros_Femeninos,
      element.solicitudes_Consejeros_Masculinos,
      element.solicitudes_Consejeros_No_Binarios,
    ];
    const serie_secre = [
      element.solicitudes_Secretarios_Femeninos,
      element.solicitudes_Secretarios_Masculinos,
      element.solicitudes_Secretarios_No_Binarios,
    ];

    series_by_oficina.value.push(serie_temp);
    series_secretarias.value.push(serie_secre);

    const chartOptions = {
      chart: {
        width: 380,
        type: "pie",
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true | '<img src="/static/icons/reset.png" width="20">',
            customIcons: [],
          },
          export: {
            csv: {
              filename: undefined,
              columnDelimiter: ",",
              headerCategory: "category",
              headerValue: "value",
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString();
              },
            },
            svg: {
              filename: undefined,
            },
            png: {
              filename: undefined,
            },
          },
          autoSelected: "zoom",
        },
      },
      title: {
        text: element.oficina,
      },
      labels: ["Femenino", "Masculino", "No binario"],
      colors: colors,
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
    options_chart.value.push(chartOptions);
  });
};

const colors = ["#d1308a", "#863399", "#76777a"];

//--------------------------------------------------------------
</script>

<style></style>
