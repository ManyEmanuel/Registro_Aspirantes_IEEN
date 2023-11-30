<template>
  <q-card style="width: 100%">
    <q-card-section>
      <q-form @submit="onSubmit()">
        <div class="row q-col-gutter-xs">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.nombres"
              label="Nombre"
              :rules="[(val) => !!val || 'El nombre es requerido']"
            ></q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.apellido_Paterno"
              label="Apellido Paterno"
              :rules="[(val) => !!val || 'El apellido paterno es requerido']"
            ></q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.apellido_Materno"
              label="Apellido Materno"
              :rules="[(val) => !!val || 'El apellido materno es requerido']"
            ></q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-file
              color="purple-12"
              v-model="fotoFile"
              :label="
                datos_personales.foto_Url != null
                  ? 'Cambiar fotografía'
                  : 'Agregar fotografía'
              "
              accept="image/jpeg,image/png, image/jpg"
            >
              <template v-slot:prepend>
                <q-icon name="photo_camera" />
              </template>
              <template v-if="datos_personales.foto_Url != null" v-slot:after>
                <q-btn round dense flat icon="image" @click="verFoto = true">
                  <q-tooltip>Ver foto del registro</q-tooltip>
                </q-btn>
              </template>
            </q-file>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="datos_personales.genero"
              label="Género"
              :options="opcionesGenero"
              :rules="[(val) => !!val || 'El género es requerido']"
            ></q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              label="Fecha de nacimiento"
              v-model="datos_personales.fecha_Nacimiento"
              :rules="['date']"
              mask="####/##/##"
              fill-mask=""
              hint="Formato de fecha año/mes/dia"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="datos_personales.fecha_Nacimiento"
                      :locale="myLocale"
                      color="purple"
                      :options="FiltroFecha"
                      default-view="Years"
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
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.edad"
              label="Edad"
              mask="##"
              :rules="[(val) => !!val || 'La edas es requerida']"
            ></q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.email"
              label="Correo electrónico"
              type="email"
              :rules="[(val) => !!val || 'El correo es requerido']"
            ></q-input>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.curp"
              label="CURP"
              counter
              maxlength="18"
              min-length="18"
              mask="XXXXXXXXXXXXXXXXXX"
              :rules="[
                (val) => !!val || 'La CURP es requerida',
                (val) =>
                  val.length == 18 || 'Se requieren los 18 digitos del CURP',
              ]"
            ></q-input>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.rfc"
              label="RFC"
              counter
              maxlength="13"
              mask="XXXXXXXXXXXXX"
              :rules="[
                (val) => !!val || 'El RFC es requerido',
                (val) =>
                  val.length == 13 || 'Se requieren los 13 digitos del RFC',
              ]"
            ></q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="estado_nacimientoId"
              :options="estados"
              label="Estado de nacimiento"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="municipio_nacimientoId"
              label="Municipio de nacimiento"
              :options="listadoMunicipioNacimiento"
            />
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.telefono_Particular"
              label="Teléfono particular"
              type="tel"
              mask="##########"
            ></q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.telefono_Celular"
              label="Teléfono celular"
              type="tel"
              mask="##########"
              :rules="[(val) => !!val || 'El teléfono celular es requerido']"
            ></q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <br />
            <q-checkbox
              v-model="datos_personales.is_Pueblo_Originario"
              label="Seleccione si pertenece a un pueblo originario"
              color="purple"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              :true-value="true"
              :false-value="false"
            />
          </div>
          <div
            v-if="datos_personales.is_Pueblo_Originario"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="datos_personales.pueblo_Originario"
              label="Especifique su pueblo de origen"
              :rules="[(val) => !!val || 'Especifique su pueblo de origen']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <br />
            <q-checkbox
              v-model="datos_personales.is_Discapacidad"
              label="Seleccione si tiene alguna discapacidad"
              color="purple"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              :true-value="true"
              :false-value="false"
            />
          </div>
          <div
            v-if="datos_personales.is_Discapacidad"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="datos_personales.discapacidad"
              label="Especifique su discapacidad"
              :rules="[(val) => !!val || 'Especifique su discapacidad']"
            />
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <br />
            <q-checkbox
              v-model="datos_personales.is_Lgbt"
              label="Seleccione si pertenece a la población LGBTTTIQ+"
              color="purple"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              :true-value="true"
              :false-value="false"
            />
          </div>
          <div
            v-if="datos_personales.is_Lgbt"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="datos_personales.lgbt"
              label="Especifique"
              :rules="[(val) => !!val || 'Especifique su genero']"
            />
          </div>
        </div>
        <br />
        <div class="row q-col-gutter-xs">
          <q-bar style="width: 100%; height: 20px" class="bg-purple">
            <div class="col text-center text-weight-bold text-white">
              Domicilio actual
            </div>
          </q-bar>
          <br />
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.calle"
              label="Calle"
              :rules="[(val) => !!val || 'La calle es requerida']"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.no_Exterior"
              label="Número exterior"
              mask="XXXXX"
              :rules="[(val) => !!val || 'Especifique el numero exterior']"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.no_Interior"
              label="Número interior"
              mask="XXXXX"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.colonia"
              label="Colonia"
              :rules="[(val) => !!val || 'Especifique la colonia']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="datos_personales.c_P"
              label="Código Postal"
              :rules="[(val) => !!val || 'Especifique su codigo postal']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select v-model="estadoId" :options="estados" label="Estado" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="municipioId"
              label="Municipio"
              :options="listadoMunicipio"
            />
          </div>
        </div>
        <br />
        <div
          v-if="modulo == null ? false : modulo.registrar"
          class="col-12 justify-end"
        >
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Guardar"
              type="submit"
              color="positive"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-form>
      <q-dialog
        v-if="modulo == null ? false : modulo.leer"
        v-model="verFoto"
        persistent
      >
        <q-card style="min-width: 400px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Foto de registro</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="verFoto = false" />
          </q-card-section>
          <q-card-section>
            <div>
              <q-img
                :src="datos_personales.foto_Url"
                style="height: 100%; width: 400px"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, date } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useDatosCiudadanosStore } from "../../../store/datos_ciudadanos_store";
import { useAuthStore } from "../../../store/auth_store";

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();
const datosCiudadanosStore = useDatosCiudadanosStore();
const estadoId = ref();
const municipioId = ref();
const estado_nacimientoId = ref();
const municipio_nacimientoId = ref();
const fotoFile = ref(null);

const verFoto = ref(false);
let listadoMunicipioNacimiento = [];
let listadoMunicipio = [];
const filtrarFecha = ref("");
const { modal, stepper, datos_personales, myLocale, estados, municipio } =
  storeToRefs(datosCiudadanosStore);
const opcionesGenero = ref(["Femenino", "Masculino", "No binario"]);

const FiltroFecha = (fechha) => {
  const today = new Date();
  filtrarFecha.value = date.formatDate(today, "YYYY/MM/DD");
  return fechha < "2006/01/01";
};
onBeforeMount(() => {
  cargar_informacion();
});

const cargar_informacion = async () => {
  $q.loading.show();
  await datosCiudadanosStore.loadListaEstadosMunicipio();
  await cargarEstado_Nacimiento();
  await cargarMunicipio_Nacimiento();
  await cargarEstado_Residencia();
  await cargarMunicipio_Residencia();
  $q.loading.hide();
};

watch(estadoId, (val) => {
  listadoMunicipio = [];
  municipioId.value = "";
  let filtro = municipio.value.filter((x) => x.estado_Id == val.value);
  let lista = filtro.map((municipio) => {
    return {
      value: municipio.value,
      label: municipio.label,
    };
  });
  listadoMunicipio = lista;
});

watch(estado_nacimientoId, (val) => {
  listadoMunicipioNacimiento = [];
  municipio_nacimientoId.value = "";
  let filtro = municipio.value.filter((x) => x.estado_Id == val.value);
  let lista = filtro.map((municipio) => {
    return {
      value: municipio.value,
      label: municipio.label,
    };
  });
  listadoMunicipioNacimiento = lista;
});

const cargarEstado_Nacimiento = async () => {
  if (datos_personales.value.estado_Nacimiento_Id != null) {
    let estadoNacimientoFiltrado = estados.value.find(
      (x) => x.value == `${datos_personales.value.estado_Nacimiento_Id}`
    );
    estado_nacimientoId.value = estadoNacimientoFiltrado;
  }
};
const cargarMunicipio_Nacimiento = async () => {
  if (datos_personales.value.municipio_Nacimiento_Id != null) {
    let municipioNacimientoFiltrado = municipio.value.find(
      (x) => x.value == `${datos_personales.value.municipio_Nacimiento_Id}`
    );
    let filtroId = municipioNacimientoFiltrado;
    municipio_nacimientoId.value = filtroId;
  }
};

const cargarEstado_Residencia = async () => {
  if (datos_personales.value.estado_Id != null) {
    let estadoResidenciaFiltrado = estados.value.find(
      (x) => x.value == `${datos_personales.value.estado_Id}`
    );
    estadoId.value = estadoResidenciaFiltrado;
  }
};
const cargarMunicipio_Residencia = async () => {
  if (datos_personales.value.municipio_Id != null) {
    let municipioResidenciaFiltrado = municipio.value.find(
      (x) => x.value == `${datos_personales.value.municipio_Id}`
    );
    municipioId.value = municipioResidenciaFiltrado;
  }
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  datos_personales.value.municipio_Id = municipioId.value.value;
  datos_personales.value.estado_Id = estadoId.value.value;
  datos_personales.value.municipio_Nacimiento_Id =
    municipio_nacimientoId.value.value;
  datos_personales.value.estado_Nacimiento_Id = estado_nacimientoId.value.value;

  if (datos_personales.value.id == null) {
    resp = await datosCiudadanosStore.createDatosPersonales(
      datos_personales.value
    );
  } else {
    resp = await datosCiudadanosStore.updateDatosPersonales(
      datos_personales.value
    );
  }

  let bodyFormData = new FormData();
  let empleado = datos_personales.value.empleado_Id;
  if (empleado == null) {
    empleado = "";
  }
  bodyFormData.append("Foto", fotoFile.value);
  bodyFormData.append("nombres", datos_personales.value.nombres);
  bodyFormData.append("Empleado_Id", empleado);
  bodyFormData.append(
    "apellido_Paterno",
    datos_personales.value.apellido_Paterno
  );
  bodyFormData.append(
    "apellido_Materno",
    datos_personales.value.apellido_Materno
  );
  bodyFormData.append("clave_Elector", datos_personales.value.clave_Elector);
  bodyFormData.append("sexo", datos_personales.value.genero);
  bodyFormData.append("userName", datos_personales.value.userName);
  bodyFormData.append("email", datos_personales.value.email);
  bodyFormData.append("phoneNumber", datos_personales.value.telefono_Celular);
  resp = await datosCiudadanosStore.updateDatosUsuario(bodyFormData);

  $q.loading.hide();
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    await datosCiudadanosStore.loadDatosPersonales();
    datosCiudadanosStore.loadAvance();
    stepper.value = "formacion_academica";
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }
};
</script>
