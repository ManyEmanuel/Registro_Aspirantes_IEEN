<template>
  <q-page padding>
    <div class="col-12">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Volver a vacantes" to="/vacantes" />
        <q-breadcrumbs-el label="Postulados" icon="library_books" />
      </q-breadcrumbs>
      <br />
      <q-item-label class="text-weight-bolder text-h4">
        Postulados para {{ vacante.nombre }}</q-item-label
      >
    </div>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            type="button"
            class="q-ma-sm"
            color="accent"
            icon-right="download"
            label="Descargar BD"
            @click="descargar()"
          />
          <q-btn
            type="button"
            class="q-ma-sm"
            color="accent"
            icon-right="person"
            label="Reporte Experiencia"
            @click="descargarExperiencia()"
          />
        </div>
      </div>
    </div>

    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-black"
        active-color="purple"
        indicator-color="purple"
        align="justify"
        narrow-indicator
      >
        <q-tab name="pendientes" label="Pendientes / con observaciones" />
        <q-tab name="concluidos" label="Registros completos" />
        <q-tab name="aceptados" label="Aceptados" />
        <q-tab name="cotejo" label="Cotejo" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-if="modulo == null ? false : modulo.leer"
        v-model="tab"
        animated
      >
        <q-tab-panel name="pendientes">
          <div v-if="tab == 'pendientes'">
            <TablaPendientes />
          </div>
        </q-tab-panel>

        <q-tab-panel name="concluidos">
          <div v-if="tab == 'concluidos'">
            <TablaCompletos />
          </div>
        </q-tab-panel>
        <q-tab-panel name="aceptados">
          <div v-if="tab == 'aceptados'">
            <TablaAceptados />
          </div>
        </q-tab-panel>
        <q-tab-panel name="cotejo">
          <div v-if="tab == 'cotejo'">
            <TablaCotejo />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <ModalAgendar />
    <ModalCotejo />
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import ModalAgendar from "../components/ModalAgendar.vue";
import ModalCotejo from "../components/ModalCotejo.vue";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import TablaPendientes from "../components/TablaPendientes.vue";
import TablaCompletos from "../components/TablaCompletos.vue";
import TablaAceptados from "../components/TablaAceptados.vue";
import TablaCotejo from "../components/TablaCotejo.vue";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const tab = ref("pendientes");
const verificacionVacanteStore = useVerificacionVacante();
const registroVacanteStore = useRegistroVacante();
//const datosCiudadanosStore = useDatosCiudadanosStore();
const { vacante } = storeToRefs(registroVacanteStore);

onMounted(() => {
  cargaInformacion();
});

const cargaInformacion = async () => {
  await verificacionVacanteStore.loadPostulantes(route.query.id);
  await registroVacanteStore.loadVacante(route.query.id);
  await registroVacanteStore.loadListOficinas();
};

const descargar = async (id, nombre) => {
  $q.loading.show();
  await registroVacanteStore.loadAvanceVacanteExcel(route.query.id);
  //const adjunto_item = adjuntos.value.find((x) => x.id == id);
  const link = document.createElement("a");
  link.href = registroVacanteStore.documentoExcel;
  link.setAttribute("download", "BD-" + vacante.value.nombre);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

const descargarExperiencia = async () => {
  $q.loading.show();
  await registroVacanteStore.loadExperienciaExcel(route.query.id);
  //const adjunto_item = adjuntos.value.find((x) => x.id == id);
  const link = document.createElement("a");
  link.href = registroVacanteStore.documentoExperienciaExcel;
  link.setAttribute("download", "BD-Experiencia-" + vacante.value.nombre);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};
</script>
