<template>
  <q-page padding>
    <TablaComp />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
//import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import TablaComp from "../components/TablaComp.vue";
</script>
