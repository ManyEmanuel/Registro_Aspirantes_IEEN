<template>
  <q-page padding>
    <template v-if="dashboard">
      <div class="row q-pb-md">
        <div class="col-3">
          <q-select
            rounded
            outlined
            v-model="municipio"
            :options="listOficinas"
            label="Seleccione"
          />
        </div>
      </div>
      <div class="row bg-grey-5" style="border-radius: 5px; color: white">
        <div class="text-h6 q-pl-md">{{ municipio.label }}</div>
      </div>
      <br />
      <div class="row">
        <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
          <q-card
            v-for="registro in dashboard.registro_Vacante"
            :key="registro.vacante_Id"
            class="my-card"
            flat
            bordered
          >
            <q-card-section horizontal>
              <q-card-section class="">
                <br />
                <div class="text-h6 text-center">Total de registros</div>
                <div class="text-h4 text-center">
                  {{ registro.solicitudes }}
                  <q-icon name="trending_up" color="green"></q-icon>
                </div>
              </q-card-section>

              <q-card-section class="col-8 flex flex-center">
                <chartGeneroGeneral :vacanteId="registro.vacante_Id" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
          <chartByOficina v-if="municipio.label == 'Estatal'" />
          <chartRangoEdad v-else />
        </div>
      </div>
      <br />
      <div class="row bg-grey-5" style="border-radius: 5px; color: white">
        <div class="text-h6 q-pl-md">CONSEJERÍAS POSTULADAS</div>
      </div>
      <div class="row">
        <div class="col">
          <chartByGenero :vacante="1" />
        </div>
      </div>
      <div class="row bg-grey-5" style="border-radius: 5px; color: white">
        <div class="text-h6 q-pl-md">SECRETARÍAS POSTULADAS</div>
      </div>
      <div class="row">
        <div class="col">
          <chartByGenero :vacante="2" />
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useDashboard } from "../../../store/dashboard_store";
import chartGeneroGeneral from "../components/chartGeneroGeneral.vue";
import chartByOficina from "../components/chartByOficina.vue";
import chartByGenero from "../components/chartByGenero.vue";
import chartRangoEdad from "../components/chartRangoEdad.vue";

const $q = useQuasar();
const dasboadrStore = useDashboard();
const { dashboard, listOficinas } = storeToRefs(dasboadrStore);
const municipio = ref(null);

onBeforeMount(() => {
  dasboadrStore.loadDashboard();
  dasboadrStore.loadOficinas();
  municipio.value = { value: 0, label: "Estatal" };
});

watch(municipio, (val) => {
  dasboadrStore.loadDashboard(val.value);
});
</script>

<style></style>
