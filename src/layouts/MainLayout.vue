<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-purple-6">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Sistema de registro de vacantes</q-toolbar-title>

        <div>
          <q-btn
            flat
            dense
            icon="logout"
            label="Cerrar sesión"
            @click="retorno()"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered bg-gray>
      <div class="q-pa-sm q-gutter-sm flex flex-center" style="height: 120px">
        <q-avatar size="100px" class="overlapping">
          <img src="../assets/LogoNuevo.png" />
        </q-avatar>
      </div>

      <q-separator />
      <q-list>
        <div v-if="isEmpleado == false">
          <q-item :to="{ name: 'datos_ciudadano' }">
            <q-item-section avatar>
              <q-icon name="looks_one" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Mi perfil</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item :to="{ name: 'vacantes_diponibles' }">
            <q-item-section avatar>
              <q-icon name="looks_two" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Vacantes disponibles</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item :to="{ name: 'mis_postulaciones' }">
            <q-item-section avatar>
              <q-icon name="looks_3" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Mis postulaciones</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
        <div v-if="isEmpleado == true">
          <q-item :to="{ name: 'registro_vacantes' }">
            <q-item-section avatar>
              <q-icon name="work" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Registro de vacantes</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item :to="{ name: 'vacantes' }">
            <q-item-section avatar>
              <q-icon name="groups" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Postulados a vacantes</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item :to="{ name: 'Calendario_Entrevistas' }">
            <q-item-section avatar>
              <q-icon name="event" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Calendario de entrevistas</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item :to="{ name: 'Usuarios_Registrados' }">
            <q-item-section avatar>
              <q-icon name="person" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Usuarios</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item :to="{ name: 'Dashboard' }">
            <q-item-section avatar>
              <q-icon name="analytics" color="purple" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple label-title text-bold"
                >Dashboard</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="bg-purple-6">
      <q-toolbar>
        <q-toolbar-title
          ><div>
            &#169; Unidad Técnica de Informática y Estadística
          </div></q-toolbar-title
        >
      </q-toolbar>
    </q-footer>
    <!--<q-page-container>
      <q-page-sticky position="bottom-right" :offset="[20, 20]">
        <q-btn
          round
          :icon="$q.dark.mode == false ? 'mode_night' : 'sunny'"
          :color="$q.dark.mode == false ? 'black' : 'white'"
          :text-color="$q.dark.mode == false ? 'white' : 'black'"
          @click="
            $q.dark.mode == false ? $q.dark.set(true) : $q.dark.set(false)
          "
        />
      </q-page-sticky>
    </q-page-container>-->
  </q-layout>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDatosCiudadanosStore } from "../store/datos_ciudadanos_store";
import { storeToRefs } from "pinia";
import { useAccesoStore } from "../store/acceso_store";
import { LocalStorage } from "quasar";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    onBeforeMount(() => {
      if (route.query.tokenE && route.query.userNameL) {
        localStorage.setItem("tokenE", route.query.tokenE);
        localStorage.setItem("userNameL", route.query.userNameL);
        localStorage.setItem("isEmpleado", route.query.is_empleado);
      }
      const resp = accesoStore.checkToken();
      if (resp) {
        datosCiudadanosStore.obtenerUsuario();
        datosCiudadanosStore.prellenadoDatos();
      } else {
        window.localStorage.clear();
        window.location = "http://sistema.ieenayarit.org:9471?return=false";
      }
    });
    const datosCiudadanosStore = useDatosCiudadanosStore();
    const accesoStore = useAccesoStore();
    const router = useRouter();
    const route = useRoute();
    const convertirBoolean =
      route.query.is_empleado == undefined
        ? localStorage.getItem("isEmpleado")
        : route.query.is_empleado;
    const isEmpleado = convertirBoolean == "false" ? false : true;

    const comprobar = async () => {
      if (isEmpleado == true) {
        if (route.query.is_empleado != undefined) {
          router.push({ path: "/vacantes" });
        }
      }
    };
    comprobar();
    const retorno = async () => {
      window.localStorage.clear();
      window.location = "http://sistema.ieenayarit.org:9471?return=false";
      //window.location = "http://localhost:8080?return=false";
    };
    const leftDrawerOpen = ref(false);
    let { datos_personales } = storeToRefs(datosCiudadanosStore);
    return {
      leftDrawerOpen,
      datosCiudadanosStore,
      retorno,
      comprobar,
      isEmpleado,

      datos_personales,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style></style>
