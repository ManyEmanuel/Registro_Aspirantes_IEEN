<template>
  <q-dialog
    v-model="modalRequisitoCotejo"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">
          Requisitos de cotejo de la vacante {{ vacante.nombre }}
        </div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-form ref="resetRequisito" @submit="onSubmit()">
          <div class="row q-col-gutter-xs">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-model="requisitoCotejo.nombre"
                autogrow
                label="Nombre del requisito a cotejar"
                :rules="[
                  (val) =>
                    !!val || 'Nombre del requisito a cotejo es requerido',
                ]"
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-model="requisitoCotejo.descripcion"
                autogrow
                label="Descripción del requisito a cotejar"
                :rules="[
                  (val) =>
                    !!val ||
                    'Ingrese una descripción breve del requisito a cotejar',
                ]"
              >
              </q-input>
            </div>
          </div>
          <br />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                label="Agregar"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
        <br />
        <q-separator />
        <br />
        <TablaRequisitoCotejo v-if="modulo == null ? false : modulo.leer" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import TablaRequisitoCotejo from "./TablaRequisitoCotejo.vue";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const registroVacanteStore = useRegistroVacante();
const { requisitoCotejo, vacante, modalRequisitoCotejo } =
  storeToRefs(registroVacanteStore);
const $q = useQuasar();
const resetRequisito = ref();

const resetInfo = async () => {
  registroVacanteStore.initRequisitosCotejo();
};

const actualizarModal = (valor) => {
  registroVacanteStore.actualizarModalRequisitoCotejo(valor);
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (requisitoCotejo.value.id != null) {
    resp = await registroVacanteStore.editRequisitoCotejoVacante(
      requisitoCotejo.value
    );
  } else {
    resp = await registroVacanteStore.createRequisitoCotejoVacante(
      requisitoCotejo.value
    );
  }

  $q.loading.hide();

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await registroVacanteStore.loadRequisitosCotejoVacantes(vacante.value.id);
    await resetInfo();
    resetRequisito.value.resetValidation();

    //actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }
  $q.loading.hide();
};
</script>
