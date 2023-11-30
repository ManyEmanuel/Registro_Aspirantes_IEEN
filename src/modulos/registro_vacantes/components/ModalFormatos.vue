<template>
  <q-dialog
    v-model="modalFormatos"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Formatos de la vacante</div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <div class="text-center text-subtitle1">
          Seleccione el formato que desea generar el zip
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-lg">
          <q-option-group
            v-model="formatoEleccion"
            :options="listaFormatos"
            color="purple"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit()">
          <br />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                label="Generar ZIP"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar, date } from "quasar";

import { useRegistroVacante } from "../../../store/registro_vacantes_store";

import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();

const registroVacanteStore = useRegistroVacante();
const formatoEleccion = ref();
const { modalFormatos, listaFormatos } = storeToRefs(registroVacanteStore);

const actualizarModal = (valor) => {
  registroVacanteStore.actualizarModalFormato(valor);
  listaFormatos.value = [];
  formatoEleccion.value = null;
};

const onSubmit = async () => {
  if (formatoEleccion.value != null) {
    $q.loading.show({
      spinnerColor: "white",
      spinnerSize: 140,
      message: "Espere un momento, generando documento ZIP",
      messageColor: "white",
    });
    let filtro = listaFormatos.value.find(
      (x) => x.value == formatoEleccion.value
    );
    await registroVacanteStore.loadFormatoZip(filtro.vacanteId, filtro.value);
    //const adjunto_item = adjuntos.value.find((x) => x.id == id);
    const link = document.createElement("a");
    link.href = registroVacanteStore.documentoZip;
    link.setAttribute("download", "Archivos del " + filtro.value);
    document.body.appendChild(link);
    link.click();
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: "Seleccione un formato",
    });
  }

  $q.loading.hide();

  /*if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await registroVacanteStore.loadVacantes();
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }*/
};
</script>
