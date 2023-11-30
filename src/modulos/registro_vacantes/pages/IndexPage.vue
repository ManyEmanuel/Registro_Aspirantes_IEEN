<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            type="button"
            class="q-ma-sm"
            color="accent"
            icon-right="add_circle_outline"
            label="Nueva vacante"
            @click="actualizarModal(true)"
          />
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
    <ModalRequisito />
    <ModalFormatos />
    <ModalRequisitoCotejo />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
//import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalRequisito from "../components/ModalRequisito.vue";
import ModalRequisitoCotejo from "../components/ModalRequisitoCotejo.vue";
import ModalFormatos from "../components/ModalFormatos.vue";
import { useAuthStore } from "../../../store/auth_store";
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);

const siglas = "SRV-REG-RV";

const $q = useQuasar();
//const authStore = useAuthStore();
const registroVacanteStore = useRegistroVacante();
//const { vacantes } = storeToRefs(registroVacanteStore);
onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  registroVacanteStore.actualizarModal(valor);
  $q.loading.hide();
};
</script>
