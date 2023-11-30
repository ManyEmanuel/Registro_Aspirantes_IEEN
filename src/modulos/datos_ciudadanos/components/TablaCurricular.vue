<template>
  <div class="row q-col-gutter-xs">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-table
        :rows="list_Experiencia_Laboral"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <div v-if="props.row.sector == 'Ninguno'">
                  <q-btn
                    v-if="modulo == null ? false : modulo.eliminar"
                    flat
                    round
                    color="purple-ieen"
                    icon="restart_alt"
                    @click="eliminar(col.value)"
                  >
                    <q-tooltip>Reestablecer registro</q-tooltip>
                  </q-btn>
                </div>
                <div v-else>
                  <q-btn
                    v-if="modulo == null ? false : modulo.eliminar"
                    flat
                    round
                    color="purple-ieen"
                    icon="delete"
                    @click="eliminar(col.value)"
                  >
                    <q-tooltip>Eliminar registro</q-tooltip>
                  </q-btn>
                </div>
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
const { list_Experiencia_Laboral } = storeToRefs(datosCiudadanosStore);
const $q = useQuasar();

const columns = [
  {
    name: "sector",
    align: "center",
    label: "Sector laboral",
    field: "sector",
    sortable: true,
  },
  {
    name: "institucion",
    align: "center",
    label: "Nombre de Institución/Empresa",
    field: "institucion",
    sortable: true,
  },
  {
    name: "cargo",
    align: "center",
    label: "Cargo desempeñado",
    field: "cargo",
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
    title: "Eliminar registro laboral",
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
    const resp = await datosCiudadanosStore.deleteExperienciaLaboral(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await datosCiudadanosStore.loadExperienciaLaboral();
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
