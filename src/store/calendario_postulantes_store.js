import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCalendarioPostulantes = defineStore("calendarioPostulantes", {
  state: () => ({
    modal: false,
    listEntrevistas: [],

    solicitud: {
      usuario: null,
      vacante: null,
      oficina: null,
      folio: null,
      tipo_Entrevista: null,
      fecha_Entrevista: null,
      fecha: null,
      hora: null,
      link_Direccion: null,
    },
  }),
  actions: {
    initSolicitud() {
      this.solicitud.usuario = null;
      this.solicitud.vacante = null;
      this.solicitud.oficina = null;
      this.solicitud.folio = null;
      this.solicitud.tipo_Entrevista = null;
      this.solicitud.fecha_Entrevista = null;
      this.solicitud.link_Direccion = null;
      this.solicitud.fecha = null;
      this.solicitud.hora = null;
    },

    async loadEntrevistas() {
      try {
        let resp = await api.get("/SolicitudesVacantes/Calendario");
        let { data } = resp.data;
        let listFechasEntrevista = data.map((fechas) => {
          return {
            id: fechas.solicitud_Id,
            title: fechas.solicitante,
            start: fechas.fecha_Entrevista,
          };
        });
        this.listEntrevistas = listFechasEntrevista;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadInformacionEntrevista(id) {
      try {
        let resp = await api.get(`/SolicitudesVacantes/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          let separarFecha = data.fecha_Entrevista.split("T");
          if (success === true) {
            this.solicitud.usuario = data.usuario;
            this.solicitud.vacante = data.vacante;
            this.solicitud.oficina = data.oficina;
            this.solicitud.folio = data.folio;
            this.solicitud.tipo_Entrevista = data.tipo_Entrevista;
            this.solicitud.fecha_Entrevista = data.fecha_Entrevista;
            this.solicitud.link_Direccion = data.link_Direccion;
            this.solicitud.fecha = separarFecha[0];
            this.solicitud.hora = separarFecha[1];
          }
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
