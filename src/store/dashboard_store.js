import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useDashboard = defineStore("dashboard", {
  state: () => ({
    dashboard: null,
  }),
  actions: {
    //-----------------------------------------------------------
    async loadDashboard() {
      try {
        let resp = await api.get("/Dasboard");
        let { data } = resp.data;
        console.log("data", data);
        this.dashboard = data;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },
  },
});
