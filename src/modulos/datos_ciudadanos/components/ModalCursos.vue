<template>
  <q-card style="width: 100%">
    <q-card-section>
      <q-form ref="resetCurso" @submit="onSubmit()">
        <div class="row q-col-gutter-xs">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="participacion_Tipo"
              label="Tipo de participación"
              :options="opcionesParticipacion"
              :disable="participacion_Nula"
              :rules="[(val) => !!val || 'Tipo de participacion requerido']"
            />
          </div>
          <div
            v-if="
              participacion_Tipo == 'Conferencia, ponencia o similar' ||
              participacion_Tipo == 'Publicación'
            "
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.titulo"
              :label="'Titulo de la ' + participacion_Tipo"
              :rules="[(val) => !!val || 'El titulo es requerido']"
            />
          </div>

          <div
            v-if="
              participacion_Tipo == 'Conferencia, ponencia o similar' ||
              participacion_Tipo == 'Publicación'
            "
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.fecha_Imparticion"
              :label="'Fecha de la ' + participacion_Tipo"
              mask="date"
              :rules="[(val) => !!val || 'La fecha es requerida']"
              ><template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="publicaciones_Participaciones.fecha_Imparticion"
                      default-view="Years"
                      :locale="myLocale"
                      color="purple"
                      :options="FiltroFecha"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="purple"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div
            v-if="participacion_Tipo == 'Publicación'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.autor"
              label="Autor de la publicación"
              :rules="[(val) => !!val || 'El autor es requerido']"
            />
          </div>
          <div
            v-if="participacion_Tipo == 'Publicación'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.coAutor"
              label="Coautor de la publicación"
            />
          </div>
          <div
            v-if="participacion_Tipo == 'Publicación'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.medio_Publicacion"
              label="Medio de publicación"
              :rules="[(val) => !!val || 'El medio es requerido']"
            />
          </div>

          <div
            v-if="participacion_Tipo == 'Participación comunitaria'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.organizacion"
              label="Nombre de la organización"
              :rules="[(val) => !!val || 'El nombre es requerido']"
            />
          </div>
          <div
            v-if="participacion_Tipo == 'Participación comunitaria'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.cargo"
              label="Cargo dentro de la organización"
              :rules="[(val) => !!val || 'El cargo es requerido']"
            />
          </div>
          <div
            v-if="participacion_Tipo == 'Participación comunitaria'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="publicaciones_Participaciones.fecha_Integracion"
              label="Fecha de la integración"
              mask="date"
              :rules="[(val) => !!val || 'La fecha es requerida']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="publicaciones_Participaciones.fecha_Integracion"
                      default-view="Years"
                      :locale="myLocale"
                      :options="FiltroFecha"
                      color="purple"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="purple"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div
          v-if="list_publicaciones_Participaciones.length == 0"
          class="text-center q-gutter-xs"
        >
          <q-checkbox
            v-model="participacion_Nula"
            label="En caso de no tener una alguna participacion en los ambitos, marque esta opción y de clic en agregar"
            color="purple"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            :true-value="true"
            :false-value="false"
            size="xl"
          />
        </div>
        <br />

        <div
          v-if="modulo == null ? false : modulo.registrar"
          class="text-right q-gutter-xs"
        >
          <q-btn
            icon-right="add"
            :disable="botonParticipacion"
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
      <TablaCurso v-if="modulo == null ? false : modulo.leer" />
      <br />
    </q-card-section>
  </q-card>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, date } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import TablaCurso from "./TablaCurso.vue";
import { useAuthStore } from "../../../store/auth_store";

const datosCiudadanosStore = useDatosCiudadanosStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const {
  publicaciones_Participaciones,
  list_publicaciones_Participaciones,
  myLocale,
  botonParticipacion,
} = storeToRefs(datosCiudadanosStore);
const $q = useQuasar();
const resetCurso = ref();
const filtrarFecha = ref("");
const opcionesParticipacion = ref([
  "Conferencia, ponencia o similar",
  "Publicación",
  "Participación comunitaria",
]);
const participacion_Tipo = ref();
const participacion_Nula = ref(false);
const FiltroFecha = (fechha) => {
  const today = new Date();
  filtrarFecha.value = date.formatDate(today, "YYYY/MM/DD");
  return fechha < filtrarFecha.value;
};
const resetInfo = async () => {
  participacion_Tipo.value = null;
  datosCiudadanosStore.iniPublicacionesParticipaciones();
};

watch(participacion_Nula, (val) => {
  if (val == true) {
    resetInfo();
    resetCurso.value.resetValidation();
  }
});

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (participacion_Tipo.value == null) {
    participacion_Tipo.value = "Ninguno";
  }
  publicaciones_Participaciones.value.tipo = participacion_Tipo.value;
  resp = await datosCiudadanosStore.createParticipacionPublicacion(
    publicaciones_Participaciones.value
  );
  $q.loading.hide();

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await datosCiudadanosStore.loadPublicacionesParticipaciones();
    await resetInfo();
    resetCurso.value.resetValidation();
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
