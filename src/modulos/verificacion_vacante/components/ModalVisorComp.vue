<template>
  <q-dialog
    v-model="modalVisor"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Visor</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <iframe
          :src="adjunto_url"
          frameborder="0"
          width="100%"
          height="600px"
        ></iframe>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";

const $q = useQuasar();
const verificacionVacanteStore = useVerificacionVacante();
const { modalVisor, adjunto_url } = storeToRefs(verificacionVacanteStore);
const actualizarModal = () => {
  verificacionVacanteStore.actualizarModal(false);
  //adjuntoStore.actualizarViewer(false);
};
</script>
<style></style>
