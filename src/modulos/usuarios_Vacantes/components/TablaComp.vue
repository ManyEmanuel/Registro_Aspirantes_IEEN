<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listaUsuarios"
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
                  icon="mail"
                  @click="reenviar(col.value)"
                >
                  <q-tooltip
                    >Reenviar correo electronico de registro de
                    usuario</q-tooltip
                  >
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
//import { useAuthStore } from "../../../stores/auth_store";
import { useUsuariosVacantes } from "../../../store/usuarios_vacantes_store";

const $q = useQuasar();
//const authStore = useAuthStore();
//const { modulo } = storeToRefs(authStore);
const usuariosVacantesStore = useUsuariosVacantes();
const { listaUsuarios } = storeToRefs(usuariosVacantesStore);

onBeforeMount(() => {
  usuariosVacantesStore.loadUsuarios();
});

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre del usuario",
    field: "nombre",
    sortable: true,
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo de usuario",
    field: "tipo",
    sortable: true,
  },
  {
    name: "user",
    align: "center",
    label: "Acceso de usuario",
    field: "user",
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
    name: "sexo",
    align: "center",
    label: "Sexo ",
    field: "sexo",
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

const reenviar = async (id) => {
  $q.dialog({
    title: "Reenviar el correo",
    message:
      "¿Está seguro de reenviar el correo de clave de acceso al usuario?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, Reenviar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await usuariosVacantesStore.reenviarCorreoUsuario(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
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
