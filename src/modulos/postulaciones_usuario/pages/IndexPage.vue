<template>
  <q-page padding>
    <div v-if="postulaciones.length > 0" class="row items-start">
      <div
        v-for="item in postulaciones"
        :key="item.id"
        class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-lg"
      >
        <q-card class="my-card q-hoverable text-center" style="width: 100%">
          <q-img :src="item.imagen_Url" style="width: 60%" />
          <q-item>
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
            </q-item-section>
          </q-item>
          <q-item class="text-center">
            <q-item-section class="text-center">
              <q-btn
                label="Ver postulación"
                color="purple"
                icon="visibility"
                @click="verAvance(item.id)"
              />
            </q-item-section>
          </q-item>

          <q-slide-transition>
            <div v-show="item.open">
              <q-separator />
              <div class="q-pa-lg">
                <div v-html="item.descripcion"></div>
              </div>
              <q-card-section
                class="text-subitle2 q-hoverable custom-section"
                @mouseover="item.open = true"
              >
                <q-card-actions align="center">
                  <q-btn
                    label="Ver avance de postulación"
                    color="purple"
                    icon="visibility"
                    @click="verAvance(item.id)"
                    style="width: 50%"
                  >
                    <q-tooltip>Ver avance</q-tooltip></q-btn
                  >
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
