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
    <div class="col">
      <q-table
        :rows="listaCotejo"
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
                <q-btn
                  v-if="props.row.estatus === 'Registro terminado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="check"
                  @click="aceptarRegistro(col.value)"
                >
                  <q-tooltip> Aprobar registro</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus === 'Registro terminado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="rechazarRegistro(col.value)"
                >
                  <q-tooltip> Rechazar registro</q-tooltip>
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
import { onBeforeMount, ref, watch } from "vue";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const route = useRoute();
const $q = useQuasar();
const router = useRouter();
const verificacionVacanteStore = useVerificacionVacante();
const registroVacanteStore = useRegistroVacante();
const { listaOficina } = storeToRefs(registroVacanteStore);
const { listaCotejo } = storeToRefs(verificacionVacanteStore);
let listaBusquedaOficina = listaOficina.value;
let verificación = listaBusquedaOficina.find((x) => x.value == 0);
if (verificación == undefined) {
  listaBusquedaOficina.unshift({ label: "Ver todos", value: 0 });
}
let listaTablaCotejo = listaCotejo.value;
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
    name: "fecha_Cotejo",
    align: "center",
    label: "Fecha de Cotejo",
    field: "fecha_Cotejo",
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

watch(oficinaId, (val) => {
  if (val.value != 0) {
    let listaFiltrada = listaTablaCotejo.filter((x) => x.oficina == val.label);
    listaCotejo.value = listaFiltrada;
  } else {
    listaCotejo.value = listaTablaCotejo;
  }
});

const verDocumentacion = async (solicitud, vacante, usuario) => {
  await verificacionVacanteStore.loadPostulantesFiltrados(listaCotejo.value);
  await verificacionVacanteStore.loadInformacionUsuario(usuario);
  router.push({
    path: "/Datos_Postulado",
    query: { vacante: vacante, solicitud: solicitud },
  });
};

const aceptarRegistro = async (id) => {
  $q.dialog({
    title: "Aceptar registro",
    message: "¿Está seguro de aceptar el registro?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, aceptar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await verificacionVacanteStore.aceptarRegistro(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await verificacionVacanteStore.loadPostulantes(route.query.id);
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const rechazarRegistro = async (id) => {
  $q.dialog({
    title: "Rechazar registro",
    message: "¿Está seguro de rechazar el registro?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, rechazar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await verificacionVacanteStore.rechazarRegistro(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await verificacionVacanteStore.loadPostulantes(route.query.id);
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
