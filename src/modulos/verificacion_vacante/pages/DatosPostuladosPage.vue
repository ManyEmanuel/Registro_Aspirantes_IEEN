<template>
  <q-page padding>
    <div class="col-12">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Vacantes" to="/vacantes" />
        <q-breadcrumbs-el label="Volver a solicitudes" @click="volver()" />
        <q-breadcrumbs-el label="Postulados" icon="library_books" />
      </q-breadcrumbs>
    </div>
    <br />
    <div class="row">
      <q-item-label class="text-weight-bolder text-h4">
        {{ solicitud.vacante }}</q-item-label
      >

      <br />
      <br />
      <div class="col-12 text-center">
        <q-img
          :src="usuario.foto_Url"
          class="rounded-borders"
          style="width: 10%"
          spinner-color="white"
        />
      </div>
      <div class="col-12 text-center text-h5">
        {{ solicitud.usuario }}<br />
        {{ solicitud.folio + " - " + solicitud.estatus }}<br />
        {{ solicitud.oficina }}
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-lg-2 col-md-2 col-sm-1 col-xs-1">
        <div class="column justify-center">
          <div class="col text-center">
            <q-btn
              v-if="nIndex > 0"
              round
              size="lg"
              color="purple"
              icon="arrow_back"
              @click="cambiarPostulante('Atras')"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-8 col-md-8 col-sm-10 col-xs-10">
        <br />

        <q-list bordered separator>
          <q-item-label class="text-center" header
            >Documentos del postulante</q-item-label
          >
          <q-item
            v-for="item in listCumplimientoRequisito"
            :key="item.id"
            v-ripple
          >
            <q-item-section style="width: 33%">
              {{ item.requisito }}
            </q-item-section>
            <q-item-section
              side
              v-if="item.registrado == false && item.observacion != null"
            >
              <q-icon name="info" class="text-red">
                <q-tooltip>
                  {{ item.observacion }}
                </q-tooltip>
              </q-icon>
            </q-item-section>
            <q-item-section class="text-center">
              <div
                v-if="item.registrado == false && item.observacion == null"
                class="text-center"
              >
                <q-badge outline align="middle" color="red">
                  Sin documento registrado
                </q-badge>
              </div>
              <div
                v-if="item.registrado == false && item.observacion != null"
                class="text-center"
              >
                <q-badge outline align="middle" color="red" multi-line>
                  Archivo con observación, esperando corrección de usuario
                </q-badge>
              </div>
              <div
                v-if="item.registrado == true && item.cumple == false"
                class="text-center"
              >
                <q-badge outline align="middle" color="orange" multi-line>
                  En espera de aprobación
                </q-badge>
              </div>
              <div
                v-if="item.registrado == true && item.cumple == true"
                class="text-center"
              >
                <q-badge outline align="middle" color="green" multi-line>
                  Documento válido
                </q-badge>
              </div>
            </q-item-section>

            <q-item-section
              v-if="item.cumple == false && item.registrado == true"
              style="width: 34%"
              class="text-center"
            >
              <div class="justify-center q-gutter-lg">
                <q-btn
                  round
                  color="purple"
                  icon="visibility"
                  @click="verDocumento(item.id)"
                >
                  <q-tooltip>Ver documento</q-tooltip>
                </q-btn>
                <q-btn
                  round
                  color="green"
                  icon="check"
                  @click="aprobarDocumento(true, item.id)"
                >
                  <q-tooltip>Aceptar documentación</q-tooltip>
                </q-btn>

                <q-btn
                  round
                  color="red"
                  icon="close"
                  @click="aprobarDocumento(false, item.id)"
                >
                  <q-tooltip>Cancelar documentación</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
            <q-item-section
              v-if="item.cumple == true && item.registrado == true"
              style="width: 34%"
              class="text-center"
            >
              <div class="justify-center q-gutter-lg">
                <q-btn
                  round
                  color="purple"
                  icon="visibility"
                  @click="verDocumento(item.id)"
                >
                  <q-tooltip>Ver documento</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>

            <q-item-section
              v-else-if="item.cumple == false && item.registrado == false"
              style="width: 34%"
              class="text-center"
            >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-lg-2 col-md-2 col-sm-1 col-xs-1">
        <div class="column justify-center">
          <div class="col text-center">
            <q-btn
              v-if="nIndex + 1 < listaPostulantes.length"
              round
              size="lg"
              color="purple"
              icon="arrow_forward"
              @click="cambiarPostulante('Delante')"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
    <div
      v-if="
        solicitud.estatus == 'Documentación pendiente' ||
        solicitud.estatus == 'Con observaciones' ||
        solicitud.estatus == 'Documentación enviada éxitosamente'
      "
      class="row justify-center"
    >
      <q-btn
        color="purple"
        icon="send"
        label="Notificar a postulante"
        @click="notificarPostulante(solicitudId)"
      />
    </div>
    <br />
    <ModalVisorComp />
  </q-page>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";
import { usePostulacionesUsuario } from "../../../store/postulaciones_usuario_store";
import ModalVisorComp from "../components/ModalVisorComp.vue";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);

const $q = useQuasar();
const router = useRouter();

let solicitudId = router.currentRoute.value.query.solicitud;
let vacanteId = router.currentRoute.value.query.vacante;
const registroVacanteStore = useRegistroVacante();
const postulacionesUsuarioStore = usePostulacionesUsuario();
const verificacionVacanteStore = useVerificacionVacante();

const { vacante } = storeToRefs(registroVacanteStore);
const { usuario, listaPostulantes, nIndex } = storeToRefs(
  verificacionVacanteStore
);
const { listCumplimientoRequisito, solicitud } = storeToRefs(
  postulacionesUsuarioStore
);
onBeforeMount(async () => {
  await postulacionesUsuarioStore.loadSolicitud(
    router.currentRoute.value.query.solicitud
  );
  await postulacionesUsuarioStore.loadDocumentosSolicitud(
    router.currentRoute.value.query.solicitud
  );
  //await registroVacanteStore.loadVacante(router.currentRoute.value.query.id);
});

const volver = async () => {
  router.go(-1);
};

const cambiarPostulante = async (tipo) => {
  $q.loading.show();
  let nuevo = 0;
  if (tipo == "Atras") {
    nIndex.value--;
  } else {
    nIndex.value++;
  }
  let datos = listaPostulantes.value[nIndex.value];
  await verificacionVacanteStore.loadInformacionUsuario(datos.usuario_Id);
  await postulacionesUsuarioStore.loadSolicitud(datos.id);
  await postulacionesUsuarioStore.loadDocumentosSolicitud(datos.id);
  solicitudId = datos.id;
  $q.loading.hide();
};

const verDocumento = async (id) => {
  await verificacionVacanteStore.loadDocumento(id);
  verificacionVacanteStore.actualizarModal(true);
};

const notificarPostulante = async (id) => {
  let resp = null;
  $q.loading.show();
  resp = await verificacionVacanteStore.notificacionPostulante(id);
  if (resp.success) {
    $q.loading.hide();
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await postulacionesUsuarioStore.loadDocumentosSolicitud(solicitudId);
    //await registroVacanteStore.loadRequisitosVacantes(vacante.value.id);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};

const aprobarDocumento = async (validacion, id) => {
  let observacion = null;
  if (validacion == false) {
    let resp = null;
    $q.dialog({
      title: "Observaciones",
      message: "Ingrese las observaciones de este documento",
      icon: "Warning",
      prompt: {
        model: observacion,
        type: "text",
      },
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "positive",
        label: "Enviar",
      },
      cancel: {
        color: "negative",
        label: " Cancelar",
      },
    }).onOk(async (data) => {
      resp = await verificacionVacanteStore.createVerificaciones(
        validacion,
        data,
        id
      );
      if (resp.success) {
        $q.loading.hide();
        $q.notify({
          type: "positive",
          message: resp.data,
        });
        //await registroVacanteStore.loadRequisitosVacantes(vacante.value.id);
        await postulacionesUsuarioStore.loadDocumentosSolicitud(solicitudId);
      } else {
        $q.notify({
          type: "negative",
          message: resp.data,
        });
      }
    });
  } else {
    let resp = null;
    $q.loading.show();
    resp = await verificacionVacanteStore.createVerificaciones(
      validacion,
      observacion,
      id
    );
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      await postulacionesUsuarioStore.loadDocumentosSolicitud(solicitudId);
      //await registroVacanteStore.loadRequisitosVacantes(vacante.value.id);
    } else {
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  }
  $q.loading.hide();
};

/*const tab = ref("pendientes");
const verificacionVacanteStore = useVerificacionVacante();
const registroVacanteStore = useRegistroVacante();
//const datosCiudadanosStore = useDatosCiudadanosStore();
const { vacante } = storeToRefs(registroVacanteStore);*/
</script>
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Adjust the height as needed */
}
</style>
