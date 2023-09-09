<template>
  <q-page padding>
    <div class="row items-start">
      <div class="col-12">
        <q-breadcrumbs>
          <q-breadcrumbs-el
            label="Volver a mis postulaciones"
            to="/mis_postulaciones"
          />
          <q-breadcrumbs-el label="Detalle postulación" icon="library_books" />
        </q-breadcrumbs>
      </div>
      <div class="col-12">
        <div class="text-h6">Mi avance de la vacante {{ vacante.nombre }}</div>
      </div>

      <div class="row q-col-gutter-xs">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center q-pa-sm">
          <q-card class="q-pa-lg">
            <q-img :src="vacante.imagen_Url" style="width: 40%"> </q-img> <br />
            <div v-html="vacante.descripcion"></div>
            <br />
            <div>
              <span class="link-style"
                ><q-link @click="verDocumento()" class="text-weight-bolder">
                  Consulta las atribuciones de las autoridades electorales para
                  el Proceso Electoral Local Ordinario 2024</q-link
                ></span
              >
            </div>
          </q-card>
          <!--<q-space />
          <br />
          <q-card v-if="listaFormatos.length > 0" class="q-pa-lg">
            <q-list>
              <q-item-label class="text-center" header
                >Formatos de descarga</q-item-label
              >
              <q-item v-for="item in listaFormatos" :key="item.id" v-ripple>
                <q-item-section>
                  <q-item-label>
                    {{ item.formato }}
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn
                    round
                    dense
                    flat
                    icon="download"
                    @click="generarFormato(item.codigo)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>-->
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-sm">
          <q-card class="q-pa-lg">
            <q-list>
              <q-item-label class="text-center" header
                >Requisitos de la vacante</q-item-label
              >
              <q-item
                v-for="(item, index) in listCumplimientoRequisito"
                :key="item.id"
                v-ripple
              >
                <q-item-section side>
                  <q-icon name="info">
                    <q-tooltip>
                      {{ item.descripcion }}
                    </q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-item-section
                  v-if="item.is_formato == true && item.registrado == false"
                  avatar
                >
                  <div class="text-center">
                    <q-btn
                      round
                      color="purple"
                      icon="download"
                      @click="generarFormato(item.codigo)"
                    >
                      <q-tooltip>Descargar el archivo</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.requisito }}</q-item-label>
                  <q-item-label
                    v-if="item.is_formato == true && item.registrado == false"
                    caption
                    lines="2"
                  >
                    <span class="text-weight-bold"
                      >Descarga, firma y carga el archivo</span
                    >
                  </q-item-label>
                </q-item-section>

                <q-item-section v-if="item.registrado == false">
                  <div class="text-right">
                    <q-badge :color="item.registro == null ? 'red' : 'green'"
                      >{{
                        item.registro == null ? "Pendiente" : "Subir archivo"
                      }}
                    </q-badge>
                  </div>
                </q-item-section>

                <q-item-section
                  v-if="item.registrado == true && item.cumple == false"
                >
                  <div class="text-right">
                    <q-badge color="orange"> Archivo en revisión </q-badge>
                  </div>
                </q-item-section>
                <q-item-section
                  v-if="item.registrado == true && item.cumple == true"
                >
                  <div class="text-right">
                    <q-badge color="green"> Archivo aceptado </q-badge>
                  </div>
                </q-item-section>
                <q-item-section v-if="item.registrado == false" avatar>
                  <q-btn
                    round
                    color="purple"
                    icon="upload"
                    @click="registrarDocumento(item.id, item.requisito, index)"
                  >
                    <q-tooltip> Subir archivo </q-tooltip>
                  </q-btn>
                </q-item-section>

                <q-item-section v-else avatar class="text-center">
                  <q-btn
                    round
                    color="purple"
                    icon="visibility"
                    @click="verDocumentoUsuario(item.id)"
                  >
                    <q-tooltip> Ver documento </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
    <ModalVisorComp />
    <ModalCarga />
  </q-page>
</template>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
//import { useAuthStore } from "../../../stores/auth_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { usePostulacionesUsuario } from "../../../store/postulaciones_usuario_store";
import ReporteCME01 from "../../../helpers/CME-F01";
import ReporteCME02 from "../../../helpers/CME-F02";
import ReporteCME03 from "../../../helpers/CME-F03";
import ReporteSCME01 from "../../../helpers/SCME-F01";
import ReporteSCME02 from "../../../helpers/SCME-F02";
import ReporteSCME03 from "../../../helpers/SCME-F03";
import ModalVisorComp from "../../verificacion_vacante/components/ModalVisorComp.vue";
import ModalCarga from "../components/ModalCarga.vue";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";
const verificacionVacanteStore = useVerificacionVacante();
const $q = useQuasar();
const router = useRouter();
const postulacionesUsuarioStore = usePostulacionesUsuario();
const registroVacanteStore = useRegistroVacante();
const { vacante, requisitos } = storeToRefs(registroVacanteStore);
const { listCumplimientoRequisito, listaFormatos } = storeToRefs(
  postulacionesUsuarioStore
);
const vacanteId = ref(router.currentRoute.value.query.id);
const porcentaje = ref(0);
const loading = ref(false);
const intervalo = ref();

onBeforeMount(() => {
  registroVacanteStore.loadVacante(router.currentRoute.value.query.id);
  postulacionesUsuarioStore.loadAvancePostulacion(
    router.currentRoute.value.query.id
  );
});

const verDocumento = async () => {
  await verificacionVacanteStore.loadDocumentoURL();
  verificacionVacanteStore.actualizarModal(true);
};

const verDocumentoUsuario = async (id) => {
  await verificacionVacanteStore.loadDocumento(id);
  verificacionVacanteStore.actualizarModal(true);
};

const actualizarModal = (valor) => {
  postulacionesUsuarioStore.actualizarModal(valor);
  registroVacanteStore.initVacante();
};

const generarFormato = async (codigo) => {
  $q.loading.show();
  if (codigo == 1) {
    ReporteCME01();
  } else if (codigo == 2) {
    ReporteCME02();
  } else if (codigo == 3) {
    ReporteCME03();
  } else if (codigo == 4) {
    let filtro = listCumplimientoRequisito.value.find(
      (x) => x.requisito == "Formato CME-F04"
    );
    descargar(filtro.id, "Formato CME-F04");
  } else if (codigo == 5) {
    ReporteSCME01();
  } else if (codigo == 6) {
    ReporteSCME02();
  } else if (codigo == 7) {
    ReporteSCME03();
  } else if (codigo == 8) {
    let filtro = listCumplimientoRequisito.value.find(
      (x) => x.requisito == "Formato SCME-F04"
    );
    descargar(filtro.id, "Formato SCME-F04");
  } /*else if (codigo == 2) {

  } else if (codigo == 3) {
    ReporteCME03();
  } else if (codigo == 5) {
    ReporteSCME01();
  }*/

  $q.loading.hide();
};

const descargar = async (id, nombre) => {
  $q.loading.show();
  await postulacionesUsuarioStore.loadAdjunto(id);
  //const adjunto_item = adjuntos.value.find((x) => x.id == id);
  const link = document.createElement("a");
  link.href = postulacionesUsuarioStore.adjunto_url;
  link.setAttribute("download", nombre);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

const registrarDocumento = async (id, archivo, index) => {
  $q.loading.show();
  loading.value = true;
  await postulacionesUsuarioStore.cargaArchivoModal(id, index, archivo);
  postulacionesUsuarioStore.actualizarModal(true);
  $q.loading.hide();
};

/*const filterConsumible = (val, update) => {
  if (val === "") {
    update(() => {
     // opcionesConsumibles.value = listaConsumibles.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesConsumibles.value = listaConsumibles.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};*/
</script>

<style scoped>
.link-style {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
