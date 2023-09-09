import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const usePostulacionesUsuario = defineStore("postulacionesUsuario", {
  state: () => ({
    modal: false,
    postulaciones: [],
    listaFormatos: [],
    listaPorSolicitud: [],
    adjunto_url: null,
    formatos: [
      { formato: "Formato CME-F01", codigo: 1 },
      { formato: "Formato CME-F02", codigo: 2 },
      { formato: "Formato CME-F03", codigo: 3 },
      { formato: "Formato CME-F04", codigo: 4 },
      { formato: "Formato SCME-F01", codigo: 5 },
      { formato: "Formato SCME-F02", codigo: 6 },
      { formato: "Formato SCME-F03", codigo: 7 },
      { formato: "Formato SCME-F04", codigo: 8 },
    ],
    listaOficina: [],
    listVacantes: [],
    listCumplimientoRequisito: [],
    municipio: null,
    cargaArchivo: {
      id: null,
      index: null,
      nombre: null,
    },
    solicitud: {
      id: null,
      usuario_Id: null,
      usuario: null,
      vacante_Id: null,
      vacante: null,
      oficina: null,
      fecha_Registro: null,
      estatus: null,
      folio: null,
      tipo_Entrevista: null,
      fecha_Entrevista: null,
      link_Direccion: null,
    },
  }),
  actions: {
    initSolicitud() {
      this.solicitud.id = null;
      this.solicitud.usuario_Id = null;
      this.solicitud.usuario = null;
      this.solicitud.vacante_Id = null;
      this.solicitud.vacante = null;
      this.solicitud.oficina = null;
      this.solicitud.fecha_Registro = null;
      this.solicitud.estatus = null;
      this.solicitud.folio = null;
      this.solicitud.tipo_Entrevista = null;
      this.solicitud.fecha_Entrevista = null;
      this.solicitud.link_Direccion = null;
    },

    initArchivo() {
      this.cargaArchivo.id = null;
      this.cargaArchivo.index = null;
      this.cargaArchivo.nombre = null;
    },
    async loadPostulaciones() {
      try {
        let resp = await api.get("/Vacantes/Publicados");
        let { data } = resp.data;
        let respMisSoliciutdes = await api.get(
          "/SolicitudesVacantes/MisSolicitudes"
        );
        let solicitudes = respMisSoliciutdes.data.data;

        const postulaciones = data.filter((obj1) =>
          solicitudes.some((obj2) => obj2.vacante_Id === obj1.id)
        );
        const informacionPostulacion = postulaciones.map((obj1) => {
          const obj2 = solicitudes.find((obj2) => obj2.vacante_Id === obj1.id);
          return { ...obj1, ...obj2 };
        });

        let listVacantesPublicadas = informacionPostulacion.map((vacantes) => {
          return {
            id: vacantes.vacante_Id,
            nombre: vacantes.nombre,
            imagen_Url: vacantes.imagen_Url,
            descripcion: vacantes.descripcion,
            convocatoria_Url: vacantes.convocatoria_Url,
            estatus: vacantes.estatus,
            folio: vacantes.folio,
            tipo_Entrevista: vacantes.tipo_Entrevista,
            fecha_Entrevista: vacantes.fecha_Entrevista,
            link_Direccion: vacantes.link_Direccion,
            open: false,
          };
        });
        this.postulaciones = listVacantesPublicadas;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadSolicitud(id) {
      try {
        let resp = await api.get(`/SolicitudesVacantes/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.solicitud.id = data.id;
            this.solicitud.usuario_Id = data.usuario_Id;
            this.solicitud.usuario = data.usuario;
            this.solicitud.vacante_Id = data.vacante_Id;
            this.solicitud.vacante = data.vacante;
            this.solicitud.oficina = data.oficina;
            this.solicitud.fecha_Registro = data.fecha_Registro;
            this.solicitud.estatus = data.estatus;
            this.solicitud.folio = data.folio;
            this.solicitud.tipo_Entrevista = data.tipo_Entrevista;
            this.solicitud.fecha_Entrevista = data.fecha_Entrevista;
            this.solicitud.link_Direccion = data.link_Direccion;
            return { success };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
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

    async loadDocumentosSolicitud(id) {
      try {
        this.listCumplimientoRequisito = [];
        let resp = await api.get(`/CumplimientosRequisitos/BySolicitud/${id}`);
        let { data } = resp.data;

        let listRequisito = data.map((requisito) => {
          return {
            id: requisito.id,
            requisito_Id: requisito.requisito_Id,
            requisito: requisito.requisito,
            cumple: requisito.cumple,
            registrado: requisito.registrado,
            documento_Url: requisito.documento_Url,
            observacion: requisito.observacion,
            is_Dcumento: requisito.is_Dcumento,
            archivo: "",
          };
        });
        this.listCumplimientoRequisito = listRequisito;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async loadAvancePostulacion(id) {
      try {
        this.listCumplimientoRequisito = [];
        let resp = await api.get(
          `/CumplimientosRequisitos/ByVacanteUsuario/${id}`
        );
        let { data } = resp.data;

        let listRequisito = data.map((requisito) => {
          let codigo = null;
          let isFormato = false;
          let filtro = this.formatos.find(
            (x) => x.formato == requisito.requisito
          );
          if (filtro != undefined) {
            isFormato = true;
            codigo = filtro.codigo;
          }
          return {
            id: requisito.id,
            requisito_Id: requisito.requisito_Id,
            requisito: requisito.requisito,
            cumple: requisito.cumple,
            descripcion: requisito.descripcion_Requisito,
            registrado: requisito.registrado,
            documento_Url: requisito.documento_Url,
            observacion: requisito.observacion,
            is_Dcumento: requisito.is_Dcumento,
            archivo: "",
            is_formato: isFormato,
            codigo: codigo,
          };
        });
        this.listCumplimientoRequisito = listRequisito;
        await this.loadListaFormatos();
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async loadListaFormatos() {
      try {
        this.listaFormatos = [];
        const formatos = this.formatos.filter((obj1) =>
          this.listCumplimientoRequisito.some(
            (obj2) => obj2.requisito === obj1.formato
          )
        );
        this.listaFormatos = formatos;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadAdjunto(id) {
      try {
        this.adjunto_url = "";
        const resp = await api.get(`/Formatos/GeneraPDF/${id}`, {
          responseType: "blob",
        });
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], { type: "application/pdf" });
          this.adjunto_url = window.URL.createObjectURL(blob);
          return { success: true };
        } else {
          return {
            success: false,
            data: "Error al descargar archivo, intentelo de nuevo",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrio un error, intentelo de nuevo. Si el error persiste contacte a soporte",
        };
      }
    },

    async createPostulacion(vacante, municipio) {
      try {
        let resp = await api.get(
          `/SolicitudesVacantes/Solicitar/${vacante}/${18}`
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

    async cargaArchivoModal(id, index, nombre) {
      try {
        this.cargaArchivo.id = id;
        this.cargaArchivo.index = index;
        this.cargaArchivo.nombre = nombre;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createDocumento(id, documento) {
      try {
        let resp = await api.post(`/CumplimientosRequisitos/${id}`, documento, {
          headers: {
            "Content-Type": `"multipart/form-data";
              `,
          },
        });
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
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
