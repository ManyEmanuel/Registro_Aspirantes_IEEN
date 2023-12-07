<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="requisitosCotejo"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        visible-columns="corto,id"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'corto'">
                <q-btn
                  size="sm"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                >
                  <q-tooltip>Ver información completa</q-tooltip>
                </q-btn>
                {{ col.value }}
              </div>
              <div v-else-if="col.name === 'id'">
                <q-btn
                  v-if="modulo == null ? false : modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar requisito</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo == null ? false : modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar requisito</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <strong>Nombre del requisito: </strong>
                {{ props.row.nombre }}
                <br />
                <strong>Descripción del requisito: </strong>
                {{ props.row.descripcion }}
              </div>
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
import { onBeforeMount, ref } from "vue";
//import { useAuthStore } from "../../../stores/auth_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();
//const authStore = useAuthStore();
//const { modulo } = storeToRefs(authStore);
const registroVacanteStore = useRegistroVacante();
const { requisitosCotejo, vacante } = storeToRefs(registroVacanteStore);

onBeforeMount(() => {
  registroVacanteStore.loadVacantes();
});

const columns = [
  {
    name: "corto",
    align: "center",
    label: "Nombre Corto",
    field: "nombreCorto",
    align: "left",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: false,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre del requisito",
    field: "nombre",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripción del requisito",
    field: "descripcion",
    sortable: true,
  },
];

const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const editar = async (id) => {
  await registroVacanteStore.loadRequisitoVacanteCotejo(id);
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar requisito",
    message: "¿Está seguro de eliminar el requisito?",
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
    const resp = await registroVacanteStore.deleteRequisitoCotejo(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await registroVacanteStore.loadRequisitosCotejoVacantes(vacante.value.id);
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
