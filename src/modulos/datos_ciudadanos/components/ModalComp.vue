<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1080px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-center">Formulario de registro</div>
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
      <q-card-section style="width: 100%">
        <q-tabs
          v-model="step"
          active-color="purple"
          indicator-color="purple"
          align="justify"
        >
          <q-tab
            name="datos_personales"
            icon="badge"
            label="Datos personales"
          />
          <q-tab
            name="formacion_academica"
            icon="history_edu"
            label="Formación académica"
          />
          <q-tab
            name="datos_curriculares"
            icon="article"
            label="Experiencia laboral"
          />

          <q-tab
            name="otros_datos"
            icon="person"
            label="Publicaciones y/o Participaciones"
          />
        </q-tabs>

        <q-form @submit="onSubmit">
          <q-tab-panels
            class=""
            v-model="step"
            animated
            swipeable
            align="justify"
            transition-prev="slide-down"
            transition-next="slide-up"
          >
            <q-tab-panel
              v-if="modulo == null ? false : modulo.registrar"
              name="datos_personales"
            >
              <ModalPersonales />
            </q-tab-panel>
            <q-tab-panel
              v-if="modulo == null ? false : modulo.registrar"
              name="formacion_academica"
            >
              <ModalAcademica />
            </q-tab-panel>

            <q-tab-panel
              v-if="modulo == null ? false : modulo.registrar"
              name="datos_curriculares"
            >
              <ModalCurricular />
            </q-tab-panel>

            <q-tab-panel
              v-if="modulo == null ? false : modulo.registrar"
              name="otros_datos"
            >
              <ModalCursos />
            </q-tab-panel>
          </q-tab-panels>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useAuthStore } from "../../../store/auth_store";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import ModalPersonales from "../components/ModalPersonales.vue";
import ModalAcademica from "./ModalAcademica.vue";
import ModalCurricular from "./ModalCurricular.vue";
import ModalCursos from "./ModalCursos.vue";

const $q = useQuasar();
const datosCiudadanosStore = useDatosCiudadanosStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { modal, stepper, datos_personales, myLocale } =
  storeToRefs(datosCiudadanosStore);
const step = ref(stepper);

onBeforeMount(() => {});

const actualizarModal = async () => {
  //leyendaStore.initLeyenda();
  //leyendaStore.updateEditar(false);
  await datosCiudadanosStore.loadDatosPersonales();
  datosCiudadanosStore.actualizarModal(false);
};

/*watch(datos_personales.value, (val) => {
  if (val.id != null) {
  } else {
    if (val.curp.length == 18) {
      let fecha = val.curp.substr(4, 6);
      console.log("Esto es fecha", fecha);
      obtenerNacimiento(fecha);
    }
  }
});

const obtenerNacimiento = async (fecha) => {
  let anio = fecha.substr(0, 2);
  let mes = fecha.substr(2, 2);
  let dia = fecha.substr(4, 2);
  console.log("Esto es anio ", anio, " Esto es mes", mes, "Esto es dia", dia);
  console.log("Esto es numero", parseInt(anio));
};*/
/*const onSubmit = async () => {
  let resp = null;
  resp = await leyendaStore.updateLey(leyenda.value);
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    //loading.value = false;
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }
};*/
</script>
