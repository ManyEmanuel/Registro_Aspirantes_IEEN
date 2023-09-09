<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de vacante</div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit()">
          <div class="row q-col-gutter-xs">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                v-model="oficinaId"
                autogrow
                :options="listaOficina"
                label="Oficina de la vacante"
              >
              </q-select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input
                v-model="vacante.nombre"
                autogrow
                label="Nombre de la vacante"
              >
              </q-input>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input
                v-model="vacante.siglas"
                autogrow
                label="Siglas de la vacante"
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <br />
              <q-item-label> Descripción de la vacante</q-item-label>

              <q-editor
                v-model="vacante.descripcion"
                min-height="5rem"
                :toolbar="[
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                  ],
                  ['bold', 'italic', 'strike', 'underline'],
                  [
                    {
                      label: $q.lang.editor.fontSize,
                      icon: $q.iconSet.editor.fontSize,
                      fixedLabel: true,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'size-1',
                        'size-2',
                        'size-3',
                        'size-4',
                        'size-5',
                        'size-6',
                        'size-7',
                      ],
                    },
                    {
                      label: $q.lang.editor.defaultFont,
                      icon: $q.iconSet.editor.font,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'default_font',
                        'arial',
                        'arial_black',
                        'comic_sans',
                        'courier_new',
                        'impact',
                        'lucida_grande',
                        'times_new_roman',
                        'verdana',
                      ],
                    },
                    'removeFormat',
                  ],
                  ['unordered', 'ordered', 'outdent', 'indent'],

                  ['undo', 'redo'],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input
                v-model="vacante.fecha_Vencimiento"
                label="Fecha de vencimiento de la vacante"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="vacante.fecha_Vencimiento"
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
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center">
              <br />
              <q-checkbox
                v-model="vacante.activo"
                :label="
                  vacante.activo == false
                    ? 'Activar la vacante'
                    : 'Desactivar vacante'
                "
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-file
                v-model="vacante.convocatoria"
                label="Archivo de la convocatoria"
                accept=".pdf, doc/*"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-file
                v-model="vacante.imagen"
                label="Imagen de la vacante"
                accept=".jpg, .png, image/*"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
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
import { useQuasar, date } from "quasar";
//import { useAuthStore } from "../../../stores/auth_store";
import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";

const $q = useQuasar();
const datosCiudadanosStore = useDatosCiudadanosStore();
const registroVacanteStore = useRegistroVacante();
const { modal, vacante, listaOficina } = storeToRefs(registroVacanteStore);
const { myLocale } = storeToRefs(datosCiudadanosStore);
const filtrarFecha = ref("");
const oficinaId = ref();
const FiltroFecha = (fechha) => {
  const today = new Date();
  filtrarFecha.value = date.formatDate(today, "YYYY/MM/DD");
  return fechha > filtrarFecha.value;
};

//const opcionesConsumibles = ref([...listaConsumibles.value]);

onBeforeMount(() => {
  registroVacanteStore.loadListOficinas();
});

const actualizarModal = (valor) => {
  registroVacanteStore.actualizarModal(valor);
  registroVacanteStore.initVacante();
};

watch(vacante.value, (val) => {
  if (val.id != null) {
    cargarOficina(val);
  }
});

const cargarOficina = async (val) => {
  if (oficinaId.value == null) {
    let oficinaFiltrada = listaOficina.value.find(
      (x) => x.value == `${val.oficina_Id}`
    );
    oficinaId.value = oficinaFiltrada;
  }
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  vacante.value.oficina_Id = oficinaId.value.value;
  if (vacante.value.id != null) {
    resp = await registroVacanteStore.updateVacante(vacante.value);
  } else {
    resp = await registroVacanteStore.createVacante(vacante.value);
  }

  $q.loading.hide();
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await registroVacanteStore.loadVacantes();
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }
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
