import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAccesoStore = defineStore("acceso", {
  state: () => ({
    acceso: {
      usuario: null,
      password: null,
    },
  }),
  actions: {
    async doLogin(to) {
      let success = null;
      try {
        if (this.acceso.usuario == "Admin" && this.acceso.password == "Admin") {
          success = true;
        } else {
          success = false;
        }
        return success;
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async checkToken() {
      try {
        const token = localStorage.getItem("tokenE");
        if (token != null) {
          const resp = await api.get("/Accesos/ValidarToken?token=" + token);
          if (resp.status == 200) {
            const { success } = resp.data;
            return success;
          }
          return false;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
});
