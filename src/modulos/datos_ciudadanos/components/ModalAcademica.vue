<template>
  <q-card style="width: 100%">
    <q-card-section>
      <q-form ref="ResetAcademica" @submit="onSubmit">
        <div class="row q-col-gutter-xs">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="academica_Estudio"
              label="Nivel de estudio"
              :options="tipoEstudio"
              :rules="[(val) => !!val || 'Nombre de estudio requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              ref="Prueba"
              v-model="formacion_Academica.institucion"
              label="Nombre de la institución"
              :rules="[(val) => !!val || 'Nombre de la institución requerida']"
            />
          </div>
          <div v-if="carrera" class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="formacion_Academica.carrera"
              label="Carrera"
              :rules="[(val) => !!val || 'Nombre de carrera requerido']"
            />
          </div>
          <div
            v-else-if="posgrado"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="formacion_Academica.nombre"
              :label="'Nombre de ' + nombrePosgrado"
              :rules="[(val) => !!val || 'Nombre del estudio requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="formacion_Academica.periodo"
              label="Periodo"
              :rules="[(val) => !!val || 'Periodo requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="formacion_Academica.documento_Recibido"
              label="Documento recibido"
              :options="opcionesDocumento"
              :rules="[(val) => !!val || 'Documento requerido']"
            />
          </div>
        </div>
        <br />

        <div class="text-right q-gutter-xs">
          <q-btn
            icon-right="add"
            label="Agregar"
            color="positive"
            class="q-ml-sm"
            type="submit"
          />
        </div>
      </q-form>
      <br />
      <q-separator style="width: 100%" color="purple" size="2px" />
      <br />
      <TablaAcademica />
      <br />
    </q-card-section>
  </q-card>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import TablaAcademica from "../components/TablaAcademica.vue";

const datosCiudadanosStore = useDatosCiudadanosStore();
const { formacion_Academica, tipoEstudio } = storeToRefs(datosCiudadanosStore);
const $q = useQuasar();

onBeforeMount(() => {
  datosCiudadanosStore.loadListTipoEstudio();
});
const ResetAcademica = ref();
const academica_Estudio = ref();
const opcionesDocumento = ref([
  "Reconocimiento",
  "Carta pasante",
  "Constancia",
  "Certificado",
  "Cédula",
  "Título",
]);
let carrera = false;
let posgrado = false;
let nombrePosgrado = "";

const resetInfo = async () => {
  academica_Estudio.value = null;
  datosCiudadanosStore.initFormacionAcademica();
};

watch(academica_Estudio, (val) => {
  if (val != null) {
    if (["Preparatoria", "Licenciatura"].includes(val.label)) {
      carrera = true;
      posgrado = false;
      nombrePosgrado = "";
    } else if (
      ["Maestría", "Doctorado", "Diplomado", "Curso"].includes(val.label)
    ) {
      carrera = false;
      posgrado = true;
      nombrePosgrado = val.label;
    } else {
      carrera = false;
      posgrado = false;
      nombrePosgrado = "";
    }
  } else {
    carrera = false;
    posgrado = false;
    nombrePosgrado = "";
  }
});

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  formacion_Academica.value.tipo_Estudio_Id = academica_Estudio.value.value;
  resp = await datosCiudadanosStore.createFormacionAcademica(
    formacion_Academica.value
  );
  $q.loading.hide();

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await datosCiudadanosStore.loadFormaciónAcademica();
    await resetInfo();
    ResetAcademica.value.resetValidation();
    datosCiudadanosStore.loadAvance();

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
