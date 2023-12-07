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

        <q-btn flat round dense icon="apps" @click="show" />
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
        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-MP')"
          :to="{ name: 'datos_ciudadano' }"
        >
          <q-item-section avatar>
            <q-icon name="looks_one" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Mi perfil</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-MV')"
          :to="{ name: 'vacantes_diponibles' }"
        >
          <q-item-section avatar>
            <q-icon name="looks_two" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Vacantes disponibles</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-MS')"
          :to="{ name: 'mis_postulaciones' }"
        >
          <q-item-section avatar>
            <q-icon name="looks_3" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Mis postulaciones</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-RV')"
          :to="{ name: 'registro_vacantes' }"
        >
          <q-item-section avatar>
            <q-icon name="work" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Registro de vacantes</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-PV')"
          :to="{ name: 'vacantes' }"
        >
          <q-item-section avatar>
            <q-icon name="groups" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Postulados a vacantes</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-CE')"
          :to="{ name: 'Calendario_Entrevistas' }"
        >
          <q-item-section avatar>
            <q-icon name="event" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Calendario de entrevistas</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-US')"
          :to="{ name: 'Usuarios_Registrados' }"
        >
          <q-item-section avatar>
            <q-icon name="person" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Usuarios</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item
          v-if="menuRegistro.some((element) => element == 'SRV-REG-DB')"
          :to="{ name: 'Dashboard' }"
        >
          <q-item-section avatar>
            <q-icon name="analytics" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-purple label-title text-bold"
              >Dashboard</q-item-label
            >
          </q-item-section>
        </q-item>
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
import { useQuasar } from "quasar";
import { useAuthStore } from "../store/auth_store";
import { EncryptStorage } from "storage-encryption";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const $q = useQuasar();
    const authStore = useAuthStore();
    const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
    const { modulos, sistemas, apps } = storeToRefs(authStore);
    const menuRegistro = ref([]);
    const loadMenu = async () => {
      $q.loading.show();
      await authStore.loadSistemas();
      await authStore.loadModulos();
      modulos.value.forEach((element) => {
        switch (element.siglas_Modulo) {
          case "SRV-REG-MP":
            menuRegistro.value.push("SRV-REG-MP");
            break;
          case "SRV-REG-MV":
            menuRegistro.value.push("SRV-REG-MV");
            break;
          case "SRV-REG-MS":
            menuRegistro.value.push("SRV-REG-MS");
            break;
          case "SRV-REG-RV":
            menuRegistro.value.push("SRV-REG-RV");
            break;
          case "SRV-REG-PV":
            menuRegistro.value.push("SRV-REG-PV");
            break;
          case "SRV-REG-CE":
            menuRegistro.value.push("SRV-REG-CE");
            break;
          case "SRV-REG-DB":
            menuRegistro.value.push("SRV-REG-DB");
            break;
          case "SRV-REG-US":
            menuRegistro.value.push("SRV-REG-US");
            break;
        }
      });
      $q.loading.hide();
    };
    onBeforeMount(() => {
      load_datos();
    });

    const load_datos = async () => {
      if (route.query.key) {
        encryptStorage.encrypt("tokenE", route.query.key);
        //localStorage.setItem("tokenE", route.query.key);
      }
      if (route.query.sistema) {
        encryptStorage.encrypt("sistema", route.query.sistema);
      }
      if (route.query.userNameL) {
        encryptStorage.encrypt("userNameL", route.query.userNameL);
      }
      await loadMenu();
      const resp = accesoStore.checkToken();
      if (resp) {
        await datosCiudadanosStore.obtenerUsuario();
        await datosCiudadanosStore.prellenadoDatos();
        if (menuRegistro.value.some((element) => element == "SRV-REG-RV")) {
          router.push({ path: "/vacantes" });
        }
      } else {
        window.localStorage.clear();
        window.location = "http://sistema.ieenayarit.org:9471/";
      }
    };

    const show = () => {
      $q.bottomSheet({
        message: "Aplicaciones",
        grid: true,
        actions: apps.value,
      }).onOk((action) => {
        if (action.label == "Cerrar sesión") {
          localStorage.clear();
          window.location = "http://sistema.ieenayarit.org:9471/";
        } else if (action.label == "Ir a universo") {
          window.location = "http://sistema.ieenayarit.org:9471/";
        } else {
          window.location =
            action.url +
            `#/?key=${encryptStorage.decrypt("tokenE")}&sistema=${
              action.id
            }&usr=${encryptStorage.decrypt("userNameL")}`;
        }
      });
    };

    const datosCiudadanosStore = useDatosCiudadanosStore();
    const accesoStore = useAccesoStore();
    const router = useRouter();
    const route = useRoute();
    const leftDrawerOpen = ref(false);
    let { datos_personales } = storeToRefs(datosCiudadanosStore);
    return {
      leftDrawerOpen,
      datosCiudadanosStore,
      menuRegistro,
      show,
      datos_personales,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style></style>
