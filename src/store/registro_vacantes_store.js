import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useRegistroVacante = defineStore("registroVacante", {
  state: () => ({
    modal: false,
    modalRequisito: false,
    modalFormatos: false,
    modalRequisitoCotejo: false,
    vacantes: [],
    requisitos: [],
    requisitosCotejo: [],
    listaOficina: [],
    listaFormatos: [],
    documentoExcel: null,
    documentoZip: null,
    documentoExperienciaExcel: null,
    vacante: {
      id: null,
      empleado_Registra_Id: null,
      empleado_Registra: null,
      empleado_Publica_Id: null,
      empleado_Publica: null,
      nombre: null,
      fecha_Vencimiento: null,
      descripcion: null,
      oficina_Id: null,
      oficina: null,
      activo: false,
      activo_String: null,
      publicado: null,
      publicado_String: null,
      fecha_Publicacion: null,
      fecha_Creacion: null,
      convocatoria_Url: null,
      convocatoria: null,
      imagen_Url: null,
      siglas: null,
    },
    requisito: {
      id: null,
      nombre: null,
      descripcion: null,
      is_Documento: false,
      is_Documento_String: null,
      activo: false,
      activo_String: null,
      fecha_Registro: null,
    },
    requisitoCotejo: {
      id: null,
      vacante_Id: null,
      nombre: null,
      descripcion: null,
      fecha_Registro: null,
    },
  }),

  actions: {
    initVacante() {
      this.vacante.id = null;
      this.vacante.empleado_Registra_Id = null;
      this.vacante.empleado_Registra = null;
      this.vacante.empleado_Publica_Id = null;
      this.vacante.empleado_Publica = null;
      this.vacante.nombre = null;
      this.vacante.fecha_Vencimiento = null;
      this.vacante.descripcion = null;
      this.vacante.oficina_Id = null;
      this.vacante.oficina = null;
      this.vacante.activo = false;
      this.vacante.activo_String = null;
      this.vacante.publicado = null;
      this.vacante.publicado_String = null;
      this.vacante.fecha_Publicacion = null;
      this.vacante.fecha_Creacion = null;
      this.vacante.convocatoria_Url = null;
      this.vacante.imagen_Url = null;
      this.vacante.convocatoria = null;
      this.vacante.imagen = null;
      this.vacante.siglas = null;
    },
    initRequisito() {
      this.requisito.id = null;
      this.requisito.nombre = null;
      this.requisito.descripcion = null;
      this.requisito.is_Documento = false;
      this.requisito.is_Documento_String = null;
      this.requisito.activo = false;
      this.requisito.activo_String = false;
      this.requisito.fecha_Registro = null;
    },

    initRequisitosCotejo() {
      this.requisitoCotejo.id = null;
      this.requisitoCotejo.vacante_Id = null;
      this.requisitoCotejo.nombre = null;
      this.requisitoCotejo.descripcion = null;
      this.requisitoCotejo.fecha_Registro = null;
    },
    async loadVacantes() {
      try {
        let resp = await api.get("/Vacantes");
        let { data } = resp.data;
        let listVacantes = data.map((vacantes) => {
          return {
            id: vacantes.id,
            nombre: vacantes.nombre,
            oficina: vacantes.oficina,
            estatus: vacantes.publicado_String,
            siglas: vacantes.siglas,
            convocatoria_Url: vacantes.convocatoria_Url,
            imagen_Url: vacantes.imagen_Url,
          };
        });
        this.vacantes = listVacantes;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadAvanceVacanteExcel(id) {
      try {
        this.documentoExcel = "";
        const resp = await api.get(`/SolicitudesVacantes/Excel/${id}`, {
          responseType: "blob",
        });
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
          });
          this.documentoExcel = window.URL.createObjectURL(blob);
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

    async loadExperienciaExcel(id) {
      try {
        this.documentoExperienciaExcel = "";
        const resp = await api.get(
          `/SolicitudesVacantes/ExcelCurricula/${id}`,
          {
            responseType: "blob",
          }
        );
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
          });
          this.documentoExperienciaExcel = window.URL.createObjectURL(blob);
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

    async loadFormatoZip(vacante, formato) {
      try {
        this.documentoZip = "";
        const resp = await api.get(
          `/SolicitudesVacantes/ObtenerFormatos/${vacante}/${formato}`,
          {
            responseType: "blob",
          }
        );
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/zip",
          });
          this.documentoZip = window.URL.createObjectURL(blob);
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

    async loadVacante(id) {
      try {
        let resp = await api.get(`/Vacantes/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            const inputDate = data.fecha_Vencimiento;
            const parts = inputDate.split("-");
            const formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);

            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
            const day = String(formattedDate.getDate()).padStart(2, "0");
            const formattedDateString = `${year}/${month}/${day}`;
            this.vacante.id = data.id;
            this.vacante.empleado_Registra_Id = data.empleado_Registra_Id;
            this.vacante.empleado_Registra = data.empleado_Registra;
            this.vacante.empleado_Publica_Id = data.empleado_Publica_Id;
            this.vacante.empleado_Publica = data.empleado_Publica;
            this.vacante.nombre = data.nombre;
            this.vacante.fecha_Vencimiento = formattedDateString;
            this.vacante.descripcion = data.descripcion;
            this.vacante.oficina_Id = data.oficina_Id;
            this.vacante.oficina = data.oficina;
            this.vacante.activo = data.activo;
            this.vacante.activo_String = data.activo_String;
            this.vacante.publicado = data.publicado;
            this.vacante.publicado_String = data.publicado_String;
            this.vacante.fecha_Publicacion = data.fecha_Publicacion;
            this.vacante.fecha_Creacion = data.fecha_Creacion;
            this.vacante.convocatoria_Url = data.convocatoria_Url;
            this.vacante.imagen_Url = data.imagen_Url;
            this.vacante.siglas = data.siglas;
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
    async loadRequisitosVacantes(id) {
      try {
        let resp = await api.get(`/VacantesRequisitos/ByVacante/${id}`);
        let { data } = resp.data;
        let listRequisitos = data.map((requisitos) => {
          return {
            id: requisitos.id,
            nombre: requisitos.nombre,
            tipo: requisitos.is_Documento_String,
            estatus: requisitos.activo_String,
            lleno: false,
          };
        });
        this.requisitos = listRequisitos;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadRequisitoVacante(id) {
      try {
        let resp = await api.get(`/VacantesRequisitos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.requisito.id = data.id;
            this.requisito.nombre = data.nombre;
            this.requisito.descripcion = data.descripcion;
            this.requisito.is_Documento = data.is_Documento;
            this.requisito.is_Documento_String = data.is_Documento_String;
            this.requisito.activo = data.activo;
            this.requisito.activo_String = data.activo_String;
            this.requisito.fecha_Registro = data.fecha_Registro;
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

    async loadRequisitosCotejoVacantes(id) {
      try {
        let resp = await api.get(`/VacantesRequisitosCotejo/ByVacante/${id}`);
        let { data } = resp.data;
        console.log("Esto es data de cotejo", data);
        let listRequisitos = data.map((cotejo) => {
          return {
            id: cotejo.id,
            nombre: cotejo.nombre,
            descripcion: cotejo.descripcion,
          };
        });

        this.requisitosCotejo = listRequisitos;
        console.log("Estos son los de cotejo", this.requisitoCotejo);
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadRequisitoVacanteCotejo(id) {
      try {
        let resp = await api.get(`/VacantesRequisitosCotejo/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.requisitoCotejo.id = data.id;
            this.requisitoCotejo.vacante_Id = data.vacanteId;
            this.requisitoCotejo.nombre = data.nombre;
            this.requisitoCotejo.descripcion = data.descripcion;
            this.requisitoCotejo.fecha_Registro = data.fecha_Registro;
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

    async loadListOficinas() {
      try {
        let resp = await api.get("/Oficinas/GetLista");
        let { data } = resp.data;
        let listadoEstado = data.map((oficina) => {
          return {
            value: oficina.value,
            label: oficina.label,
          };
        });
        this.listaOficina = listadoEstado;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadFormatosByVacantes(id) {
      try {
        let resp = await api.get(`/VacantesRequisitos/ByVacante/${id}`);
        let { data } = resp.data;
        let filtroFormato = data.filter((element) =>
          element.nombre.includes("Formato")
        );
        let listadoFormatos = filtroFormato.map((formato) => {
          return {
            value: formato.nombre,
            label: formato.nombre,
            vacanteId: id,
          };
        });
        this.listaFormatos = listadoFormatos;
        console.log("Esta es la lista de formatos ", listadoFormatos);
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async consultarVacante() {
      try {
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async publicarVacante(id) {
      try {
        const resp = await api.get(`/Vacantes/Publicar/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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

    async createVacante(vacante) {
      try {
        let bodyFormData = new FormData();
        bodyFormData.append("nombre", vacante.nombre);
        bodyFormData.append("fecha_Vencimiento", vacante.fecha_Vencimiento);
        bodyFormData.append("descripcion", vacante.descripcion);
        bodyFormData.append("oficina_Id", vacante.oficina_Id);
        bodyFormData.append("activo", vacante.activo);
        bodyFormData.append("convocatoria", vacante.convocatoria);
        bodyFormData.append("imagen", vacante.imagen);
        bodyFormData.append("siglas", vacante.siglas);
        let resp = await api.post(`/Vacantes`, bodyFormData, {
          headers: {
            "Content-Type": `"multipart/form-data";
              `,
          },
        });
        console.log("Esto es resp", resp);
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async updateVacante(vacante) {
      try {
        let bodyFormData = new FormData();
        bodyFormData.append("nombre", vacante.nombre);
        bodyFormData.append("fecha_Vencimiento", vacante.fecha_Vencimiento);
        bodyFormData.append("descripcion", vacante.descripcion);
        bodyFormData.append("oficina_Id", vacante.oficina_Id);
        bodyFormData.append("activo", vacante.activo);
        bodyFormData.append("convocatoria", vacante.convocatoria);
        bodyFormData.append("imagen", vacante.imagen);
        bodyFormData.append("siglas", vacante.siglas);
        let resp = await api.put(`/Vacantes/${vacante.id}`, bodyFormData, {
          headers: {
            "Content-Type": `"multipart/form-data";
              `,
          },
        });
        console.log("Esto es resp", resp);
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createRequisitoVacante(requisito) {
      try {
        const resp = await api.post(
          `/VacantesRequisitos/${this.vacante.id}`,
          requisito
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async editRequisitoVacante(requisito) {
      try {
        const resp = await api.put(
          `/VacantesRequisitos/${this.requisito.id}`,
          requisito
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async deleteVacante(id) {
      try {
        const resp = await api.delete(`/Vacantes/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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
    async deleteRequisito(id) {
      try {
        const resp = await api.delete(`/VacantesRequisitos/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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

    async createRequisitoCotejoVacante(requisitoCotejo) {
      try {
        const resp = await api.post(
          `/VacantesRequisitosCotejo/${this.vacante.id}`,
          requisitoCotejo
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async editRequisitoCotejoVacante(requisitoCotejo) {
      try {
        const resp = await api.put(
          `/VacantesRequisitosCotejo/${this.requisitoCotejo.id}`,
          requisitoCotejo
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async deleteRequisitoCotejo(id) {
      try {
        const resp = await api.delete(`/VacantesRequisitosCotejo/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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
    actualizarModalRequisito(valor) {
      this.modalRequisito = valor;
    },
    actualizarModalFormato(valor) {
      this.modalFormatos = valor;
    },

    actualizarModalRequisitoCotejo(valor) {
      this.modalRequisitoCotejo = valor;
    },
  },
});
