<template>
  <q-page padding>
    <div v-if="vacantes.length > 0" class="row items-start">
      <div
        v-for="item in vacantes"
        :key="item.id"
        class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-lg"
      >
        <q-card class="my-card q-hoverable text-center" style="width: 100%">
          <q-img
            :src="item.imagen_Url"
            class="rounded-borders"
            style="width: 60%"
          />
          <q-item>
            <q-item-section class="text-center">
              <q-item-label class="text-weight-bolder">
                {{ item.nombre }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="text-center">
            <q-item-section class="text-center">
              <q-btn
                label="Ir a postulados"
                color="purple"
                icon="arrow_forward"
                @click="irVacante(item.id)"
              />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 10vh">Bienvenido</div>

        <div class="text-h2" style="opacity: 0.4">
          No hay vacantes registradas
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

import { useRegistroVacante } from "../../../store/registro_vacantes_store";
import { useVerificacionVacante } from "../../../store/verificacion_vacante_store";

const $q = useQuasar();
const router = useRouter();
const registroVacanteStore = useRegistroVacante();
const verificacionVacanteStore = useVerificacionVacante();

const { vacantes } = storeToRefs(registroVacanteStore);
onBeforeMount(() => {
  registroVacanteStore.loadVacantes();
});

const irVacante = async (id) => {
  await verificacionVacanteStore.loadPostulantes(id);
  await registroVacanteStore.loadListOficinas();
  router.push({ path: "/vacante_postulados", query: { id: id } });
};
</script>
