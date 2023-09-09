<template>
  <q-page padding>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pa-xs q-gutter-sm">
        <q-card class="my-card">
          <q-card-section horizontal>
            <q-img
              :src="
                datos_personales.foto_Url != null
                  ? datos_personales.foto_Url
                  : require('../../../assets/perfilieen.jpg')
              "
              style="width: 200px; height: 200px"
            />

            <q-card-section class="text-weight-bolder">
              {{ datos_personales.nombres }} <br />
              {{ datos_personales.apellido_Paterno }} <br />
              {{ datos_personales.apellido_Materno }}
            </q-card-section>
          </q-card-section>

          <q-separator />
        </q-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
        <q-card class="my-card">
          <q-list>
            <q-item-label class="text-center" header
              >Datos registrados</q-item-label
            >
            <q-item
              v-for="items in opcionesDatos"
              :key="items.id"
              clickable
              v-ripple
              @click="(verStepper = items.codigo), actualizarModal(true)"
            >
              <q-item-section>{{ items.nombre }}</q-item-section>
              <q-item-section avatar>
                <q-avatar
                  :color="items.estatus == false ? 'negative' : 'positive'"
                  text-color="white"
                  :icon="items.estatus == false ? 'close' : 'check'"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
        <q-card class="my-card">
          <q-item-label class="text-center" header
            >Avance de registro de datos</q-item-label
          >
          <q-linear-progress
            size="50px"
            :value="avanceBarra"
            :color="avanceBarra == 1 ? 'positive' : 'negative'"
            class="q-mt-sm"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                :color="avanceBarra == 1 ? 'positive' : 'negative'"
                text-color="white"
                :label="avanceLetra"
                class="text-bold"
              />
            </div>
          </q-linear-progress>
        </q-card>
      </div>
      <!--<div
        v-if="checkComplete"
        class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xl"
      >
        <q-list bordered>
          <q-item-label class="text-center" header
            >Formatos de entrega</q-item-label
          >
          <q-item
            v-for="items in opcionesFormatos"
            :key="items.id"
            clickable
            v-ripple
            @click="generarFormato(items.codigo)"
          >
            <q-item-section>{{ items.nombre }}</q-item-section>
            <q-item-section avatar>
              <q-avatar color="accent" text-color="white" icon="download" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>-->
    </div>
    <ModalComp />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import ModalComp from "../components/ModalComp.vue";

//import ReporteSCME01 from "../../../helpers/SCME-F01";

const $q = useQuasar();
const datosCiudadanosStore = useDatosCiudadanosStore();
let {
  personalesCheck,
  academicosCheck,
  curricularCheck,
  checkComplete,
  cursosCheck,
  avanceBarra,
  avanceLetra,
  datos_personales,
} = storeToRefs(datosCiudadanosStore);
const verStepper = ref(null);
const opcionesDatos = ref([
  {
    nombre: "Datos personales",
    estatus: personalesCheck,
    codigo: "datos_personales",
  },
  {
    nombre: "Formación académica",
    estatus: academicosCheck,
    codigo: "formacion_academica",
  },
  {
    nombre: "Experiencia laboral",
    estatus: curricularCheck,
    codigo: "datos_curriculares",
  },

  {
    nombre: "Publicaciones y/o participaciones",
    estatus: cursosCheck,
    codigo: "otros_datos",
  },
]);

const opcionesFormatos = ref([
  {
    nombre: "Formato CME-F01",
    codigo: 1,
  },
  {
    nombre: "Formato CME-F02",
    codigo: 2,
  },
  {
    nombre: "Formato CME-F03",
    codigo: 3,
  },
]);
//let filter = opcionesDatos.value.filter((x) => x.estatus == true);
//let total = filter.length / opcionesDatos.value.length;
//const avanceBarra = ref(total);
//const avanceLetra = ref((total * 100).toFixed(2) + "%");

onBeforeMount(() => {
  cargarDatos();
});

const cargarDatos = async () => {
  $q.loading.show();
  await datosCiudadanosStore.obtenerUsuario();
  await datosCiudadanosStore.prellenadoDatos();
  $q.loading.hide();
};

const leerPermisos = async () => {
  $q.loading.show();

  $q.loading.hide();
};

const generarFormato = async (codigo) => {
  $q.loading.show();
  if (codigo == 1) {
    ReporteCME01();
  } else if (codigo == 2) {
    ReporteCME02();
  } else if (codigo == 3) {
    ReporteCME03();
  }

  $q.loading.hide();
};

const llenadoBarra = async () => {};

const actualizarModal = (valor) => {
  $q.loading.show();
  datosCiudadanosStore.actualizarStepper(verStepper.value);
  datosCiudadanosStore.actualizarModal(valor);
  $q.loading.hide();
};
</script>
