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
    <div
      id="postulacionesTour"
      v-if="postulaciones.length > 0"
      class="row items-start"
    >
      <div
        v-for="item in postulaciones"
        :key="item.id"
        class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-lg"
      >
        <q-card
          v-if="modulo == null ? false : modulo.leer"
          id="cartaTour"
          class="my-card q-hoverable text-center"
          style="width: 100%"
        >
          <q-img id="imagenTour" :src="item.imagen_Url" style="width: 60%" />
          <q-item id="informacionTour">
            <q-item-section class="text-center">
              <q-item-label class="text-weight-bolder">
                {{ item.nombre }}
              </q-item-label>
              <q-item-label
                v-if="
                  item.estatus != 'Documentación pendiente' &&
                  item.estatus != 'Con observaciones' &&
                  item.estatus != 'Documentación enviada éxitosamente'
                "
                class="text-h5"
              >
                Folio {{ item.folio }}
              </q-item-label>
              <q-item-label>
                <q-badge outline color="red" align="top">{{
                  item.estatus
                }}</q-badge>
              </q-item-label>
              <q-item-label
                v-if="item.estatus == 'Cotejo documental'"
                class="text-h6"
              >
                Cotejo en {{ item.direccion_Cotejo }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="text-center">
            <q-item-section id="verTour" class="text-center">
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                label="Ver postulación"
                color="purple"
                icon="visibility"
                @click="verAvance(item.id)"
              />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 10vh">Bienvenido</div>

        <div class="text-h2" style="opacity: 0.4">
          No estas postulado a ninguna vacante
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
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { usePostulacionesUsuario } from "../../../store/postulaciones_usuario_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SRV-REG-MS";
const $q = useQuasar();
const router = useRouter();
const postulacionesUsuarioStore = usePostulacionesUsuario();
const registroVacanteStore = useRegistroVacante();
const datosCiudadanosStore = useDatosCiudadanosStore();
const { postulaciones } = storeToRefs(postulacionesUsuarioStore);
const { listaOficina } = storeToRefs(registroVacanteStore);
const { municipio } = storeToRefs(datosCiudadanosStore);
const dialogMunicipio = ref(false);
const oficina_id = ref();
const listMunicipio = ref();
let vacante_Id = null;

onBeforeMount(() => {
  leerPermisos();
  postulacionesUsuarioStore.loadPostulaciones();
});

const verVacante = async (url) => {
  window.open(url, "_blank");
};
const verAvance = async (id) => {
  //await registroVacanteStore.loadVacante(id);
  //await postulacionesUsuarioStore.loadAvancePostulacion(id);
  router.push({ path: "/postulacion", query: { id: id } });
};
const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
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
          "👋 Bienvenido al asistente 🤖 de Registro de vacantes. Esta es la sección de 'Mis Postulaciones'.",
      },
      {
        element: "#postulacionesTour",
        intro:
          "En este apartado se mostrarán las vacantes a las cuales te has postulado",
      },
      {
        element: "#cartaTour",
        intro:
          "En esta tarjeta informativa encontraras la información, estatus y acceso de tu postulación.",
      },
      {
        element: "#imagenTour",
        intro: "Imagen ilustrativa de la vacante a la cual te has postulado.",
      },
      {
        element: "#informacionTour",
        intro:
          "Esta sección contiene la siguiente información: Cargo al cual te has postulado y estatus actual de tu solicitud.",
      },
      {
        element: "#verTour",
        intro:
          "Este botón te llevará al siguiente apartado para realizar la carga de los documentos requeridos, así como conocer el estatus de cada uno de ellos. Cuando des clic, me encontrarás allá para darte más información.",
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

const postularme = async () => {
  let resp = null;
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
    dialogMunicipio.value = false;
    oficina_id.value = 0;
    publicacionVacanteStore.loadVacantesPublicados();

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
