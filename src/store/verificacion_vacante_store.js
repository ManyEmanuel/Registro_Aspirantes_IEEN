import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useVerificacionVacante = defineStore("verificacionVacante", {
  state: () => ({
    modalVisor: false,
    modalAgenda: false,
    modalCotejo: false,
    listaPendientes: [],
    listaCompletos: [],
    listaAceptados: [],
    listaCotejo: [],
    listaPostulantes: [],
    listaDocumentos: [],
    adjunto_url: null,
    nIndex: 0,
    usuario: {
      id: null,
      empleado_Id: null,
      empleado: null,
      actualizado: null,
      foto_Url: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      tipo_Usuario: null,
      municipio_Id: null,
      municipio: null,
      clave_Elector: null,
      sexo: null,
      sa: null,
      estatus: null,
      userName: null,
      email: null,
      phoneNumber: null,
    },
    agendar: {
      id: null,
      solicitudId: null,
      fecha_Entrevista: null,
      hora: "",
      link_Direccion: null,
      tipo: "Virtual",
    },
    cotejo: {
      id: null,
      fecha_Cotejo: null,
    },
  }),

  actions: {
    initUsuario() {
      this.usuario.id = null;
      this.usuario.empleado_Id = null;
      this.usuario.empleado = null;
      this.usuario.actualizado = null;
      this.usuario.foto_Url = null;
      this.usuario.nombres = null;
      this.usuario.apellido_Paterno = null;
      this.usuario.apellido_Materno = null;
      this.usuario.tipo_Usuario = null;
      this.usuario.municipio_Id = null;
      this.usuario.municipio = null;
      this.usuario.clave_Elector = null;
      this.usuario.sexo = null;
      this.usuario.sa = null;
      this.usuario.estatus = null;
      this.usuario.userName = null;
      this.usuario.email = null;
      this.usuario.phoneNumber = null;
    },

    initAgenda() {
      this.agendar.id = null;
      this.agendar.fecha_Entrevista = null;
      this.agendar.hora = "";
      this.agendar.link_Direccion = null;
      this.agendar.tipo = "Virtual";
      this.agendar.solicitudId = null;
    },

    initCotejo() {
      this.cotejo.id = null;
      this.cotejo.fecha_Cotejo = null;
    },

    async loadPostulantes(id) {
      try {
        this.listaPendientes = [];
        this.listaCompletos = [];
        this.listaAceptados = [];
        this.listaCotejo = [];
        let resp = await api.get(`/SolicitudesVacantes/ByVacante/${id}`);
        let { data } = resp.data;
        let listPostulante = data.map((postulantes) => {
          return {
            id: postulantes.id,
            usuario_Id: postulantes.usuario_Id,
            usuario: postulantes.usuario,
            vacante_Id: postulantes.vacante_Id,
            vacante: postulantes.vacante,
            oficina: postulantes.oficina,
            folio: postulantes.folio,
            fecha_Registro: postulantes.fecha_Registro,
            estatus: postulantes.estatus,
            fecha_Cotejo: postulantes.fecha_Cotejo,
          };
        });

        this.listaPendientes = listPostulante.filter(
          (x) =>
            x.estatus !== "Entrevista" &&
            x.estatus !== "Registro terminado" &&
            x.estatus !== "Registro aprobado" &&
            x.estatus !== "Registro no aprobado" &&
            x.estatus !== "Cotejo documental"
        );
        this.listaCompletos = listPostulante.filter(
          (x) =>
            x.estatus == "Registro terminado" ||
            x.estatus == "Registro no aprobado"
        );
        this.listaAceptados = listPostulante.filter(
          (x) => x.estatus == "Entrevista" || x.estatus == "Registro aprobado"
        );
        this.listaCotejo = listPostulante.filter(
          (x) => x.estatus == "Cotejo documental"
        );
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPostulantesFiltrados(datos) {
      try {
        this.listaPostulantes = [];
        this.listaPostulantes = datos;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadInformacionUsuario(id) {
      try {
        console.log("Esto es id", id);
        let resp = await api.get(`/Usuarios/${id}`);
        let { data } = resp.data;
        this.usuario.id = data.id;
        this.usuario.empleado_Id = data.empleado_Id;
        this.usuario.empleado = data.empleado;
        this.usuario.actualizado = data.actualizado;
        this.usuario.foto_Url = data.foto_Url;
        this.usuario.nombres = data.nombres;
        this.usuario.apellido_Paterno = data.apellido_Paterno;
        this.usuario.apellido_Materno = data.apellido_Materno;
        this.usuario.tipo_Usuario = data.tipo_Usuario;
        this.usuario.municipio_Id = data.municipio_Id;
        this.usuario.municipio = data.municipio;
        this.usuario.clave_Elector = data.clave_Elector;
        this.usuario.sexo = data.sexo;
        this.usuario.sa = data.sa;
        this.usuario.estatus = data.estatus;
        this.usuario.userName = data.userName;
        this.usuario.email = data.email;
        this.usuario.phoneNumber = data.phoneNumber;

        this.nIndex = this.listaPostulantes.findIndex(
          (x) => x.usuario_Id == id
        );
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadDocumento(id) {
      try {
        this.adjunto_url = "";
        let resp = await api.get(`/CumplimientosRequisitos/GetDocumento/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.adjunto_url = data;
          }
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async loadDocumentoURL() {
      try {
        this.adjunto_url = "";
        this.adjunto_url =
          "https://ieenayarit.org/PDF/2023/Atribuciones_Autoridades_Electorales_PEL2024.pdf";
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createVerificaciones(cumple, observacion, id) {
      try {
        let resp = await api.post(`/CumplimientosRequisitos/Validar/${id}`, {
          cumple: cumple,
          observaciones: observacion,
        });
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

    async notificacionPostulante(id) {
      try {
        let resp = await api.get(`/SolicitudesVacantes/Notificar/${id}`);
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

    async aceptarRegistro(id) {
      try {
        let resp = await api.get(`/SolicitudesVacantes/Aprobar/${id}`);
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

    async rechazarRegistro(id) {
      try {
        let resp = await api.get(`/SolicitudesVacantes/Rechazar/${id}`);
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

    async agendarPostulante(agenda) {
      try {
        let resp = await api.post(
          `/SolicitudesVacantes/AgendarEntrevista/${agenda.solicitudId}`,
          agenda
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

    async agendarCotejo(cotejo) {
      try {
        let resp = await api.post(
          `/SolicitudesVacantes/AgendarCotejo/${cotejo.id}`,
          cotejo
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
      this.modalVisor = valor;
    },
    actualizarModalAgenda(valor, id) {
      this.modalAgenda = valor;
      if (valor == true) {
        this.agendar.solicitudId = id;
      }
    },
    actualizarModalCotejo(valor, id) {
      this.modalCotejo = valor;
      if (valor == true) {
        this.cotejo.id = id;
      }
    },
  },
});
