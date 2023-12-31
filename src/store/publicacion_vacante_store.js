import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const usePublicacionVacante = defineStore("publicacionVacante", {
  state: () => ({
    modal: false,
    vacantes: [],
    listaOficina: [],
    listVacantes: [],
    municipio: null,
  }),
  actions: {
    async loadVacantesPublicados() {
      try {
        let resp = await api.get("/Vacantes/Publicados");
        let respMisSoliciutdes = await api.get(
          "/SolicitudesVacantes/MisSolicitudes"
        );
        var hoy = new Date();
        var anio = hoy.getFullYear();
        var mes = String(hoy.getMonth() + 1).padStart(2, "0");
        var dia = String(hoy.getDate()).padStart(2, "0");
        var formatoFecha = anio + "-" + mes + "-" + dia;

        let solicitudes = respMisSoliciutdes.data.data;
        let { data } = resp.data;

        let listVacantesPublicadas = data.map((vacantes) => {
          let estatus = false;
          let fecha_vencimiento_boolean = false;
          var date1 = new Date(formatoFecha);
          var date2 = new Date(vacantes.fecha_Vencimiento);
          if (date1 <= date2) {
            fecha_vencimiento_boolean = true;
          }
          let filtro = solicitudes.find((x) => x.vacante_Id == vacantes.id);
          if (filtro != undefined) {
            estatus = true;
          }
          return {
            id: vacantes.id,
            nombre: vacantes.nombre,
            imagen_Url: vacantes.imagen_Url,
            descripcion: vacantes.descripcion,
            convocatoria_Url: vacantes.convocatoria_Url,
            open: false,
            activo: fecha_vencimiento_boolean,
            estatus: estatus,
          };
        });
        this.listVacantes = listVacantesPublicadas;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadOficinas() {
      try {
        let resp = await api.get("/Vacantes/Publicados");
        let { data } = resp.data;
        let listVacantesPublicadas = data.map((vacantes) => {
          return {
            id: vacantes.id,
            nombre: vacantes.nombre,
            imagen_Url: vacantes.imagen_Url,
            descripcion: vacantes.descripcion,
            convocatoria_Url: vacantes.convocatoria_Url,
            open: false,
          };
        });
        this.listVacantes = listVacantesPublicadas;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async validacionPostulacion() {
      try {
        let resp = await api.get(`/SolicitudesVacantes/ValidarPostulacion`);
        if (resp.status == 200) {
          const { success, postulado, oficina } = resp.data;
          if (success === true) {
            return { postulado, oficina };
          } else {
            return { success };
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

    async createPostulacion(vacante, oficina) {
      try {
        let resp = await api.get(
          `/SolicitudesVacantes/Solicitar/${vacante}/${oficina}`
        );

        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
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
