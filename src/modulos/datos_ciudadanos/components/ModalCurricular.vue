<template>
  <q-card style="width: 100%">
    <q-card-section>
      <q-form ref="ResetCurricular" @submit="onSubmit()">
        <div class="row q-col-gutter-xs">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="experiencia_Laboral.sector"
              label="Sector laboral"
              :disable="expericiencia_Nula == true || botonLaboral == true"
              :options="opcionesRubro"
              :rules="[(val) => !!val || 'Sector laboral requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="experiencia_Laboral.institucion"
              :disable="expericiencia_Nula == true || botonLaboral == true"
              label="Nombre de la institución o Empresa"
              :rules="[
                (val) =>
                  !!val || 'Nombre de la institución o empresa requerida',
              ]"
            />
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="experiencia_Laboral.cargo"
              :disable="expericiencia_Nula == true || botonLaboral == true"
              label="Cargo desempeñado"
              :rules="[(val) => !!val || 'Cargo requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="experiencia_Laboral.domicilio"
              :disable="expericiencia_Nula == true || botonLaboral == true"
              label="Domicilio laboral"
              :rules="[(val) => !!val || 'Domicilio requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="experiencia_Laboral.periodo"
              :disable="expericiencia_Nula == true || botonLaboral == true"
              label="Periodo que laboró"
              :rules="[(val) => !!val || 'Periodo requeridó']"
            />
          </div>
        </div>
        <div
          v-if="list_Experiencia_Laboral.length == 0"
          class="text-center q-gutter-xs"
        >
          <q-checkbox
            v-model="expericiencia_Nula"
            label="En caso de no tener ninguna experiencia laboral, marque esta opción y de clic en agregar"
            color="purple"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            :true-value="true"
            :false-value="false"
            size="xl"
          />
        </div>
        <br />
        <br />

        <div
          v-if="modulo == null ? false : modulo.registrar"
          class="text-right q-gutter-xs"
        >
          <q-btn
            icon-right="add"
            label="Agregar"
            :disable="botonLaboral"
            color="positive"
            class="q-ml-sm"
            type="submit"
          />
        </div>
      </q-form>

      <br />

      <q-separator style="width: 100%" color="purple" size="2px" />
      <br />
      <TablaCurricular v-if="modulo == null ? false : modulo.leer" />
      <br />
    </q-card-section>
  </q-card>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import TablaCurricular from "./TablaCurricular.vue";
import { useAuthStore } from "../../../store/auth_store";

const datosCiudadanosStore = useDatosCiudadanosStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { experiencia_Laboral, list_Experiencia_Laboral, botonLaboral } =
  storeToRefs(datosCiudadanosStore);
const $q = useQuasar();
const ResetCurricular = ref();
const opcionesRubro = ref(["Público", "Privado"]);
const expericiencia_Nula = ref(false);

const resetInfo = async () => {
  datosCiudadanosStore.initExperienciaLaboral();
};

watch(expericiencia_Nula, (val) => {
  if (val == true) {
    resetInfo();
    ResetCurricular.value.resetValidation();
  }
});

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (expericiencia_Nula.value == true) {
    experiencia_Laboral.value.sector = "Ninguno";
  }
  resp = await datosCiudadanosStore.createExperienciaLaboral(
    experiencia_Laboral.value
  );
  $q.loading.hide();

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await datosCiudadanosStore.loadExperienciaLaboral();
    await resetInfo();
    ResetCurricular.value.resetValidation();
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
