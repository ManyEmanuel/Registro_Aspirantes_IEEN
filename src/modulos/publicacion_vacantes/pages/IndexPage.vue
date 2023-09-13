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

    <div v-if="listVacantes.length > 0" class="row items-start" id="pageTour">
      <div
        v-for="items in listVacantes"
        :key="items.id"
        class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-lg"
      >
        <q-card id="cartaTour" class="my-card q-hoverable" style="width: 100%">
          <q-img
            id="imagenTour"
            :transition="'flip-right'"
            :src="items.imagen_Url"
            ratio="1"
            spinner-color="white"
            class="rounded-borders"
          >
            <div class="absolute-bottom text-subtitle2 text-center">
              {{ items.nombre }}
              <q-btn
                color="white"
                round
                flat
                dense
                :icon="items.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="items.open = !items.open"
              />
            </div>
          </q-img>
          <q-slide-transition>
            <div v-show="items.open">
              <q-separator />
              <div class="q-pa-lg" id="descripcionTour">
                <div v-html="items.descripcion"></div>
              </div>

              <q-card-section
                class="text-subitle2 q-hoverable custom-section"
                @mouseover="items.open = true"
              >
                <q-card-actions
                  id="accionesTour"
                  :vertical="$q.screen.width <= 1700 ? true : false"
                  :align="formatoBotones"
                >
                  <q-btn
                    id="convocatoriaTour"
                    label="Ver convocatoria"
                    color="purple"
                    icon="visibility"
                    @click="verVacante(items.convocatoria_Url)"
                  >
                    <q-tooltip>Ver convocatoria</q-tooltip></q-btn
                  >
                  <q-space> </q-space>
                  <br />
                  <div id="estatusTour" v-if="checkComplete">
                    <q-btn
                      v-if="items.estatus == false"
                      label="Postularme"
                      color="purple"
                      icon="hail"
                      @click="oficinaSeleccion(items.id)"
                    >
                      <q-tooltip> Postularme a la vacante</q-tooltip></q-btn
                    >
                    <q-btn
                      v-else-if="items.estatus == true"
                      disable=""
                      label="Ya postulado"
                      color="purple"
                      icon="hail"
                    >
                      <q-tooltip>
                        Ya postulado para la vacante</q-tooltip
                      ></q-btn
                    >
                  </div>
                  <div v-else id="estatusTour">
                    <q-badge outline color="red" align="middle">
                      Datos de perfil incompleto
                    </q-badge>
                  </div>
                </q-card-actions>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 10vh">Bienvenido</div>

        <div class="text-h2" style="opacity: 0.4">
          No hay vacantes disponibles
        </div>
        <div>
          <img
            alt="Quasar logo"
            src="~assets/IEEN300.png"
            style="width: 200px; height: 132px"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="dialogMunicipio" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Municipio en el que desea postularse</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            v-model="oficina_id"
            :disable="selectOficina"
            label="Municipio"
            :options="listaOficina.filter((x) => x.value != 21)"
            :rules="[(val) => !!val || 'El municipio es requerido']"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-accent">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Postularme" @click="postularme()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { usePublicacionVacante } from "../../../store/publicacion_vacante_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import { usePostulacionesUsuario } from "src/store/postulaciones_usuario_store";
import introJs from "intro.js";
import "intro.js/introjs.css";

const $q = useQuasar();
const router = useRouter();
const publicacionVacanteStore = usePublicacionVacante();
const registroVacanteStore = useRegistroVacante();
const datosCiudadanosStore = useDatosCiudadanosStore();
const postulacionesUsuarioStore = usePostulacionesUsuario();
const { listVacantes } = storeToRefs(publicacionVacanteStore);
const { listaOficina } = storeToRefs(registroVacanteStore);
const { municipio, checkComplete } = storeToRefs(datosCiudadanosStore);
const dialogMunicipio = ref(false);
const oficina_id = ref();
const selectOficina = ref(false);
const listMunicipio = ref();
const postuladoStatus = ref(false);
const formatoBotones = ref($q.screen.width <= 1700 ? "center" : "around");
let vacante_Id = null;

onBeforeMount(() => {
  publicacionVacanteStore.loadVacantesPublicados();
  datosCiudadanosStore.prellenadoDatos();
});

watch($q.screen, (val) => {
  if (val.width <= 1700) {
    formatoBotones.value = "center";
  } else {
    formatoBotones.value = "around";
  }
});

const verVacante = async (url) => {
  window.open(url, "_blank");
};

const startIntro = () => {
  const intro = introJs();
  const updatedArray = listVacantes.value.map((obj) => {
    return { ...obj, open: true };
  });
  listVacantes.value = updatedArray;
  intro.setOptions({
    showProgress: true,
    nextLabel: "Siguiente",
    prevLabel: "Anterior",
    doneLabel: "Hecho",
    steps: [
      {
        intro:
          "👋 Bienvenido al asistente 🤖 de Registro de vacantes. Estas en la sección de vacantes disponibles.",
      },
      {
        element: "#pageTour",
        intro:
          "Aquí se mostrarán las convocatorias de las vacantes disponibles.",
        position: "bottom",
      },
      {
        element: "#cartaTour",
        intro:
          "En esta tarjeta informativa encontraras la información relacionada con la vacante y se comprende de 3 secciones.",
      },
      {
        element: "#imagenTour",
        intro: "Imagen ilustrativa de la vacante.",
      },
      {
        element: "#descripcionTour",
        intro: "Descripción breve de la vacante.",
      },
      {
        element: "#accionesTour",
        intro:
          "La siguiente sección corresponde a las acciones que se pueden realizar.",
      },
      {
        element: "#convocatoriaTour",
        intro: "Enlace para mostrar la convocatoria completa.",
      },
      {
        element: "#estatusTour",
        intro:
          "En este apartado te muestra el estatus actual. Primero 'Datos de perfil incompleto', en este caso recurrir a la opción 1 del menú lateral izquierdo (Mi Perfil)",
      },
      {
        element: "#estatusTour",
        intro:
          "Una vez completos los datos, se habilitará la opción de 'Postularme', el cual desprenderá la lista de los municipios disponibles, seleccionar el que desee y listo, quedará postulado.",
      },
      {
        element: "#estatusTour",
        intro:
          "Y por último un botón deshabilitado con la leyenda 'Ya Postulado', el cual nos indicara que ya se está postulado para dicha vacante",
      },
      {
        element: "#pageTour",
        intro:
          "Espero que esta información te haya sido de gran utilidad. Recuerda que estoy a tu disposición en todo momento en el botón de ayuda 👋 🤖",
      },
      // Add more steps as needed
    ],
  });

  intro.start();
};

const RegresarSeccion = () => {
  const updatedArray = listVacantes.value.map((obj) => {
    return { ...obj, open: false };
  });
  listVacantes.value = updatedArray;
  console.log("Esto es updateArraySalidaStep", updatedArray);
};

const oficinaSeleccion = async (id) => {
  vacante_Id = id;
  let resp = null;
  resp = await publicacionVacanteStore.validacionPostulacion();
  await registroVacanteStore.loadListOficinas();
  postuladoStatus.value = resp.postulado;
  if (resp.postulado == true) {
    selectOficina.value = true;
    oficina_id.value = resp.oficina;
    let oficinaCargada = listaOficina.value.find(
      (x) => x.value == resp.oficina
    );
    oficina_id.value = oficinaCargada;
  } else {
    selectOficina.value = false;
  }

  dialogMunicipio.value = true;
};

const postularme = async () => {
  let resp = null;
  let mensaje =
    postuladoStatus.value == true
      ? "Su municipio de postulación es " + oficina_id.value.label
      : "Sus futuras vacantes quedaran sujetas a este municipio ( " +
        oficina_id.value.label +
        " )";
  $q.dialog({
    title: "Postularme a esta vacante ",
    message: "¿Está seguro de postularse a esta vacante? " + mensaje,
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, postularme",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    resp = await publicacionVacanteStore.createPostulacion(
      vacante_Id,
      oficina_id.value.value
    );
    if (resp.success) {
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      oficina_id.value = null;
      router.push({ path: "/postulacion", query: { id: vacante_Id } });
    } else {
      $q.notify({
        type: "negative",
        message: resp.data,
      });
      //loading.value = false;
    }
    $q.loading.hide();
  });
};
</script>
