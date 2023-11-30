<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="vacantes"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar.."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
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
                  <q-tooltip>Eliminar vacante</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo == null ? false : modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>editar vacante</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  v-if="modulo == null ? false : modulo.leer"
                  round
                  color="purple-ieen"
                  icon="checklist"
                  @click="requisitos(col.value)"
                >
                  <q-tooltip>Requisitos de la vacante</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  v-if="modulo == null ? false : modulo.leer"
                  round
                  color="purple-ieen"
                  icon="manage_search"
                  @click="requisitosCotejo(col.value)"
                >
                  <q-tooltip>Requisitos del Cotejo</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  v-if="modulo == null ? false : modulo.leer"
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verDocumento(props.row.convocatoria_Url)"
                >
                  <q-tooltip>Ver convocatoria</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  v-if="modulo == null ? false : modulo.leer"
                  round
                  color="purple-ieen"
                  icon="image"
                  @click="verDocumento(props.row.imagen_Url)"
                >
                  <q-tooltip>Ver imagen</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus == 'Sin publicar'"
                  flat
                  round
                  color="purple-ieen"
                  icon="campaign"
                  @click="publicar(col.value)"
                >
                  <q-tooltip>Publicar vacante</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus != 'Sin publicar'"
                  flat
                  round
                  color="purple-ieen"
                  icon="download"
                  @click="descargar(col.value, props.row.nombre)"
                >
                  <q-tooltip>Descargar BD</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus != 'Sin publicar'"
                  flat
                  round
                  color="purple-ieen"
                  icon="folder_zip"
                  @click="Formatos(col.value)"
                >
                  <q-tooltip>Obtener formatos de vacante</q-tooltip>
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
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../store/auth_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();

const registroVacanteStore = useRegistroVacante();
const { vacantes } = storeToRefs(registroVacanteStore);

onBeforeMount(() => {
  registroVacanteStore.loadVacantes();
});

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre de la vacante",
    field: "nombre",
    sortable: true,
  },
  {
    name: "siglas",
    align: "center",
    label: "Siglas de la vacante",
    field: "siglas",
    sortable: true,
  },
  {
    name: "oficina",
    align: "center",
    label: "Oficina de la vacante",
    field: "oficina",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: false,
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
const actualizarModal = async () => {
  $q.loading.show();
  registroVacanteStore.actualizarModal(true);
  $q.loading.hide();
};

const editar = async (id) => {
  await registroVacanteStore.loadVacante(id);
  $q.loading.show();
  registroVacanteStore.actualizarModal(true);
  $q.loading.hide();
};
const requisitos = async (id) => {
  await registroVacanteStore.loadVacante(id);
  await registroVacanteStore.loadRequisitosVacantes(id);
  registroVacanteStore.actualizarModalRequisito(true);
};

const requisitosCotejo = async (id) => {
  await registroVacanteStore.loadVacante(id);
  await registroVacanteStore.loadRequisitosCotejoVacantes(id);
  registroVacanteStore.actualizarModalRequisitoCotejo(true);
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar vacante",
    message: "¿Está seguro de eliminar el la vacante?",
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
    const resp = await registroVacanteStore.deleteVacante(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await registroVacanteStore.loadVacantes();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const verDocumento = async (url) => {
  window.open(url, "_blank");
};

const Formatos = async (id) => {
  $q.loading.show();
  await registroVacanteStore.loadFormatosByVacantes(id);
  registroVacanteStore.actualizarModalFormato(true);
  $q.loading.hide();
};

const descargar = async (id, nombre) => {
  $q.loading.show();
  await registroVacanteStore.loadAvanceVacanteExcel(id);
  //const adjunto_item = adjuntos.value.find((x) => x.id == id);
  const link = document.createElement("a");
  link.href = registroVacanteStore.documentoExcel;
  link.setAttribute("download", "BD-" + nombre);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

const publicar = async (id) => {
  $q.dialog({
    title: "Publicar vacante",
    message: "Al publicar la vacante quedara visible a todos los usuarios",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, publicar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await registroVacanteStore.publicarVacante(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await registroVacanteStore.loadVacantes();
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
