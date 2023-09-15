<template>
  <q-page padding>
    <div class="row">
      <template v-if="dashboard">
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-xs q-gutter-sm">
          <q-card
            v-for="registro in dashboard.registro_Vacante"
            :key="registro.vacante_Id"
            class="my-card"
            flat
            bordered
          >
            <q-card-section>
              <div class="text-h6 text-center">{{ registro.vacante }}</div>
            </q-card-section>
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs">
                <br />
                <div class="text-h6 text-center">Total de registros</div>
                <div class="text-h4 text-center">
                  {{ registro.solicitudes }}
                  <q-icon name="trending_up" color="green"></q-icon>
                </div>
              </q-card-section>

              <q-card-section class="col-8 flex flex-center">
                <dashboard1 :vacanteId="registro.vacante_Id" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <chartByOficina />
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount } from "vue";
import { useDashboard } from "../../../store/dashboard_store";
import dashboard1 from "../../../charts/dashboard1.vue";
import chartByOficina from "../../../charts/chartByOficina.vue";

const $q = useQuasar();
const dasboadrStore = useDashboard();
const { dashboard } = storeToRefs(dasboadrStore);
onBeforeMount(() => {
  dasboadrStore.loadDashboard();
});
</script>

<style lang="sss" scoped></style>
