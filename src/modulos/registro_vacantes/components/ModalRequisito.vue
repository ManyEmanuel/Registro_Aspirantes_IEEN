<template>
  <q-dialog
    v-model="modalRequisito"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Requisitos de la vacante {{ vacante.nombre }}</div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-form ref="resetRequisito" @submit="onSubmit()">
          <div class="row q-col-gutter-xs">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-model="requisito.nombre"
                autogrow
                label="Nombre del requisito"
                :rules="[(val) => !!val || 'Nombre del requisito es requerido']"
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-model="requisito.descripcion"
                autogrow
                label="Descripción del requisito"
                :rules="[
                  (val) =>
                    !!val || 'Ingrese una descripción breve del requisito',
                ]"
              >
              </q-input>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <br />
              <q-checkbox
                v-model="requisito.is_Documento"
                :label="
                  requisito.is_Documento == false
                    ? 'Marcar si el requisito es un documento'
                    : 'Desmarcar si el requisito no es un documento'
                "
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center">
              <br />
              <q-checkbox
                v-model="requisito.activo"
                :label="
                  requisito.activo == false
                    ? 'Activar el requisito'
                    : 'Desactivar el requisito'
                "
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>
          </div>
          <br />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
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
        <TablaRequisitos />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import TablaRequisitos from "./TablaRequisito.vue";

const registroVacanteStore = useRegistroVacante();
const { requisito, vacante, modalRequisito } =
  storeToRefs(registroVacanteStore);
const $q = useQuasar();
const resetRequisito = ref();

const resetInfo = async () => {
  registroVacanteStore.initRequisito();
};

const actualizarModal = (valor) => {
  registroVacanteStore.actualizarModalRequisito(valor);
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (requisito.value.id != null) {
    resp = await registroVacanteStore.editRequisitoVacante(requisito.value);
  } else {
    resp = await registroVacanteStore.createRequisitoVacante(requisito.value);
  }

  $q.loading.hide();

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await registroVacanteStore.loadRequisitosVacantes(vacante.value.id);
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
