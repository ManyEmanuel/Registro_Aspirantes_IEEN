<template>
  <q-page padding>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn
        round
        icon="question_mark"
        color="blue"
        text-color="white"
        size="md"
        @click="startIntro"
      >
        <q-tooltip class="text-body1">Visita guiada</q-tooltip>
      </q-btn>
    </q-page-sticky>
    <div id="seccionTour" class="row">
      <div
        id="fotoTour"
        class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pa-xs q-gutter-sm"
      >
        <q-card v-if="modulo == null ? false : modulo.leer" class="my-card">
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
      <div id="rubroTour" class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
        <q-card
          v-if="modulo == null ? false : modulo.registrar"
          id="datosTour"
          class="my-card"
        >
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
      <div
        id="avanceTour"
        class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs"
      >
        <q-card
          v-if="modulo == null ? false : modulo.registrar"
          class="my-card"
        >
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
    </div>
    <ModalComp />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../store/auth_store";
import ModalComp from "../components/ModalComp.vue";
import introJs from "intro.js";
import "intro.js/introjs.css";

//import ReporteSCME01 from "../../../helpers/SCME-F01";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SRV-REG-MP";
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

onBeforeMount(() => {
  leerPermisos();
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
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  datosCiudadanosStore.actualizarStepper(verStepper.value);
  datosCiudadanosStore.actualizarModal(valor);
  $q.loading.hide();
};

const startIntro = () => {
  const intro = introJs();

  intro.setOptions({
    showProgress: true,
    nextLabel: "Siguiente",
    prevLabel: "Anterior",
    doneLabel: "Hecho",
    steps: [
      {
        intro:
          "👋 Bienvenido al asistente 🤖 de Registro de vacantes. Esta es la sección de 'Mi Perfil'.",
      },
      {
        element: "#seccionTour",
        intro: "Esta sección se comprende de tres apartados.",
      },
      {
        element: "#fotoTour",
        intro:
          "Este apartado donde se mostrará la fotografía que se haya guardado en el registro, además del nombre del usuario.",
      },
      {
        element: "#avanceTour",
        intro:
          "El siguiente apartado es la barra que muestra el porcentaje actual de avance del registro de información requerida a cada usuario. Nota: Es necesario contar con el 100% para postularse a una vacante.",
      },
      {
        element: "#rubroTour",
        intro:
          "Tenemos este otro apartado donde se muestra el listado de rubros a llenar cada usuario, a continuación te explico cada uno.",
      },
      {
        element: "#datosTour",
        intro:
          "'Datos Personales', aquí se registra la información personal y datos del domicilio actual.",
      },
      {
        element: "#datosTour",
        intro:
          "'Formación Academica', aquí se registra todo el listado de instituciones educativas( bachillerato y/o licenciatura obligatorio ) y postgrados realizados.",
      },
      {
        element: "#datosTour",
        intro:
          "'Experiencia laboral', Rubro donde se registrará tu trayectoria laboral ejercitada en su carrera profesional",
      },
      {
        element: "#datosTour",
        intro:
          "'Publicaciones y/o participaciones', Por ultimo el registro de aquellas actividades que tengan que ver con publicaciones, conferencias o participaciones en asociaciones civiles",
      },
      {
        intro:
          "Espero que esta información te haya sido de gran utilidad. Recuerda que estoy a tu disposición en todo momento en el botón de ayuda 👋 🤖",
      },

      // Add more steps as needed
    ],
  });

  intro.start();
};
</script>
