<template>
  <div class="row q-col-gutter-xs">
    <div class="text-weight-bolder">
      *Su registro debe incluir al menos preparatoria o licenciatura para contar
      como completo*
    </div>
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-table
        :rows="list_Formacion_Academica"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        visible-columns="nivel_Estudio,institucion,periodo,documento,documento_Recibido,id"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="modulo == null ? false : modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar estudio</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const datosCiudadanosStore = useDatosCiudadanosStore();
const { list_Formacion_Academica } = storeToRefs(datosCiudadanosStore);
const $q = useQuasar();

const columns = [
  {
    name: "nivel_Estudio",
    align: "center",
    label: "Nivel de estudio",
    field: "nivel_Estudio",
    sortable: true,
  },
  {
    name: "institucion",
    align: "center",
    label: "Nombre de Institución",
    field: "institucion",
    sortable: true,
  },
  {
    name: "carrera",
    align: "center",
    label: "Nombre carrera",
    field: "carrera",
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre de postgrado",
    field: "nombre",
    sortable: true,
  },
  {
    name: "periodo",
    align: "center",
    label: "Periodo de estudio",
    field: "periodo",
    sortable: true,
  },
  {
    name: "documento_Recibido",
    align: "center",
    label: "Documento recibido",
    field: "documento_Recibido",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: true,
  },
];

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar registro academico",
    message: "¿Está seguro de eliminar el registro?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await datosCiudadanosStore.deleteFormacionAcademica(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await datosCiudadanosStore.loadFormaciónAcademica();
      datosCiudadanosStore.loadAvance();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};
</script>
