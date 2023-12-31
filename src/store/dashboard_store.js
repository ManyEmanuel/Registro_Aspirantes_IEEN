import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useDashboard = defineStore("dashboard", {
  state: () => ({
    dashboard: null,
    listOficinas: [],
    listSolicitudes: [],
    oficinaRangoEdad: null,
    oficina: null,
  }),
  actions: {
    //-----------------------------------------------------------
    async loadDashboard(id) {
      try {
        let ruta = id == 0 ? "/Dasboard" : `/Dasboard?Oficina_Id=${id}`;
        let resp = await api.get(ruta);
        let { data } = resp.data;
        this.dashboard = data;
        console.log("this", this.dashboard);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },
    //-----------------------------------------------------------
    async loadOficinas() {
      try {
        this.listOficinas = [];
        let resp = await api.get("/Oficinas");
        let { data } = resp.data;
        let listOficinas = data.map((oficina) => {
          return {
            value: oficina.id,
            label: oficina.nombre,
          };
        });
        //Agrega todos a la lista
        listOficinas.splice(0, 0, {
          value: 0,
          label: "Estatal",
        });

        //busca la oficina y la quita de la lista
        const indexOficina = listOficinas.findIndex(
          (element) => element.label === "CME central IEEN"
        );

        if (indexOficina !== -1) {
          listOficinas.splice(indexOficina, 1);
        }

        this.listOficinas = listOficinas;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    //-----------------------------------------------------------
  },
});
