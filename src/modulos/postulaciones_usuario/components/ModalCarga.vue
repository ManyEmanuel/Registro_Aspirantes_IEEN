<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-subtitle2">Registro de {{ cargaArchivo.nombre }}</div>
        <q-space />
        <q-btn icon="close" @click="actualizarModal(false)" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-form ref="resetDocumento" @submit="onSubmit()">
          <div class="row q-col-gutter-xs">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-file
                v-model="documentoFile"
                label="Subir archivo"
                clearable
                accept="image/jpeg,image/png, image/jpg,application/pdf"
              >
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
import { storeToRefs } from "pinia";
import { useQuasar, date } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { usePostulacionesUsuario } from "../../../store/postulaciones_usuario_store";

const postulacionesUsuarioStore = usePostulacionesUsuario();
const { cargaArchivo, listCumplimientoRequisito, modal } = storeToRefs(
  postulacionesUsuarioStore
);
const $q = useQuasar();
const resetDocumento = ref();
const documentoFile = ref();

const resetInfo = async () => {
  documentoFile.value = null;
  actualizarModal(false);
};

const actualizarModal = (valor) => {
  postulacionesUsuarioStore.actualizarModal(valor);
  postulacionesUsuarioStore.initArchivo();
};

const onSubmit = async () => {
  $q.loading.show();
  let resp = null;
  let bodyFormData = new FormData();
  bodyFormData.append("Archivo", documentoFile.value);
  resp = await postulacionesUsuarioStore.createDocumento(
    cargaArchivo.value.id,
    bodyFormData
  );

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    let filtro = listCumplimientoRequisito.value[cargaArchivo.value.index];
    filtro.registrado = true;
    resetInfo();
    //await postulacionesUsuarioStore.loadAvancePostulacion(vacanteId.value);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};
</script>
