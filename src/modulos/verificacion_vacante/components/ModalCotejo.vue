<template>
  <q-dialog
    v-model="modalCotejo"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de fecha de fecha y hora de cotejo</div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit()">
          <div class="row q-col-gutter-xs">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                label="Fecha y hora de cotejo"
                hint="Ingrese fecha y hora"
                v-model="cotejo.fecha_Cotejo"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="cotejo.fecha_Cotejo"
                        :locale="myLocale"
                        mask="YYYY-MM-DD HH:mm"
                        color="purple"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="black"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="cotejo.fecha_Cotejo"
                        mask="YYYY-MM-DD HH:mm"
                        color="purple"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="black"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <br />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Guardar"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();
const route = useRoute();
const verificacionVacanteStore = useVerificacionVacante();
const datosCiudadanosStore = useDatosCiudadanosStore();
const { modalCotejo, cotejo } = storeToRefs(verificacionVacanteStore);
const { myLocale } = storeToRefs(datosCiudadanosStore);
//const opcionesTipo = ref(["Virtual", "Presencial"]);
//const opcionesConsumibles = ref([...listaConsumibles.value]);

const actualizarModal = (valor) => {
  verificacionVacanteStore.actualizarModalCotejo(valor);
  verificacionVacanteStore.initCotejo();
};

const onSubmit = async () => {
  if (cotejo.value.fecha_Cotejo != null && cotejo.value.fecha_Cotejo != "") {
    let resp = null;
    $q.dialog({
      title: "Asignar cotejo",
      message:
        "La fecha y hora " + cotejo.value.fecha_Cotejo + " sera asignada",
      icon: "Warning",

      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "positive",
        label: "Aceptar",
      },
      cancel: {
        color: "negative",
        label: " Cancelar",
      },
    }).onOk(async (data) => {
      $q.loading.show();
      resp = await verificacionVacanteStore.agendarCotejo(cotejo.value);
      $q.loading.hide();
      if (resp.success) {
        $q.notify({
          type: "positive",
          message: resp.data,
        });
        await verificacionVacanteStore.loadPostulantes(route.query.id);
        actualizarModal(false);
      } else {
        $q.notify({
          type: "negative",
          message: resp.data,
        });
        //loading.value = false;
      }
    });
  } else {
    $q.notify({
      type: "negative",
      message: "Seleccione una fecha y hora",
    });
  }
};
</script>
