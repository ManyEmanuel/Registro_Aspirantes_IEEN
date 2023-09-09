<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Información de la entrevista</div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-center">
          Postulante: {{ solicitud.usuario }}
        </div>
        <div class="text-subtitle1 text-center">
          Vacante : {{ solicitud.vacante }}
        </div>
        <div class="text-subtitle1 text-center">
          Fecha : {{ solicitud.fecha }} - Hora :{{ solicitud.hora }}
        </div>
        <div class="text-subtitle1 text-center">
          Tipo de entrevista: {{ solicitud.tipo_Entrevista }}
        </div>
        <div
          v-if="solicitud.tipo_Entrevista == 'Presencial'"
          class="text-subtitle1 text-center"
        >
          Dirección de entrevista: {{ solicitud.link_Direccion }}
        </div>
        <div v-else class="text-subtitle1 text-center">
          Link de: {{ solicitud.link_Direccion }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
//import { useAuthStore } from "../../../stores/auth_store";
import { useCalendarioPostulantes } from "../../../store/calendario_postulantes_store";

const $q = useQuasar();
const calendarioPostulanteStore = useCalendarioPostulantes();

const { modal, solicitud } = storeToRefs(calendarioPostulanteStore);
const actualizarModal = (valor) => {
  calendarioPostulanteStore.initSolicitud();
  calendarioPostulanteStore.actualizarModal(valor);
};
</script>
