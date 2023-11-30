<template>
  <div class="row justify-end">
    <div class="col-4">
      <q-select
        v-model="oficinaId"
        autogrow
        :options="listaBusquedaOficina"
        label="Filtrar por municipio"
      >
      </q-select>
    </div>
  </div>
  <br />
  <div class="row">
    <br />
    <div class="col-12">
      <q-table
        :rows="listaPendientes"
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
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="
                    verDocumentacion(
                      col.value,
                      props.row.vacante_Id,
                      props.row.usuario_Id
                    )
                  "
                >
                  <q-tooltip>Ver documentación</q-tooltip>
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
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const verificacionVacanteStore = useVerificacionVacante();
const registroVacanteStore = useRegistroVacante();
const { listaOficina } = storeToRefs(registroVacanteStore);
const { listaPendientes } = storeToRefs(verificacionVacanteStore);
let listaBusquedaOficina = listaOficina.value;
let verificación = listaBusquedaOficina.find((x) => x.value == 0);
if (verificación == undefined) {
  listaBusquedaOficina.unshift({ label: "Ver todos", value: 0 });
}
let listaTablaPendientes = listaPendientes.value;
const oficinaId = ref();

const columns = [
  {
    name: "folio",
    align: "center",
    label: "Folio de registro",
    field: "folio",
    sortable: true,
  },
  {
    name: "usuario",
    align: "center",
    label: "Nombre",
    field: "usuario",
    sortable: true,
  },
  {
    name: "vacante",
    align: "center",
    label: "Vacante postulado",
    field: "vacante",
    sortable: true,
  },
  {
    name: "oficina",
    align: "center",
    label: "Lugar de postulación",
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

onMounted(() => {
  cargaArchivo();
});

const cargaArchivo = async () => {
  await verificacionVacanteStore.loadPostulantes(route.query.id);
};
const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

watch(oficinaId, (val) => {
  if (val.value != 0) {
    let listaFiltrada = listaTablaPendientes.filter(
      (x) => x.oficina == val.label
    );
    listaPendientes.value = listaFiltrada;
  } else {
    listaPendientes.value = listaTablaPendientes;
  }
});

const verDocumentacion = async (solicitud, vacante, usuario) => {
  await verificacionVacanteStore.loadPostulantesFiltrados(
    listaPendientes.value
  );
  await verificacionVacanteStore.loadInformacionUsuario(usuario);
  router.push({
    path: "/Datos_Postulado",
    query: { vacante: vacante, solicitud: solicitud },
  });
};

/*const eliminar = async (id) => {
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
};*/
</script>
