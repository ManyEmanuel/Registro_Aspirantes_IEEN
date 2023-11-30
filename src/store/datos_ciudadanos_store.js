import { Date } from "core-js";
import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useDatosCiudadanosStore = defineStore("datosCiudadano", {
  state: () => ({
    modal: false,
    stepper: null,
    usuarioId: null,
    botonParticipacion: false,
    botonLaboral: false,
    personalesCheck: false,
    academicosCheck: false,
    curricularCheck: false,
    cursosCheck: false,
    checkComplete: false,
    avanceBarra: null,
    avanceLetra: null,
    tipoEstudio: null,

    datos_personales: {
      id: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      edad: null,
      genero: null,
      email: null,
      clave_Elector: null,
      curp: null,
      rfc: null,
      foto_Url: null,
      lugar_Nacimiento: null,
      fecha_Nacimiento: null,
      telefono_Particular: null,
      telefono_Celular: null,
      is_Pueblo_Originario: false,
      pueblo_Originario: null,
      is_Discapacidad: false,
      discapacidad: null,
      calle: null,
      no_Interior: null,
      no_Exterior: null,
      colonia: null,
      municipio: null,
      estado: null,
      municipio_Nacimiento: null,
      estado_Nacimiento: null,
      c_P: null,
      estado_Id: 0,
      municipio_Id: 0,
      estado_Nacimiento_Id: 0,
      municipio_Nacimiento_Id: 0,
      is_Lgbt: false,
      lgbt: null,
      userName: null,
      empleado_Id: null,
    },
    formacion_Academica: {
      id: null,
      usuario_Id: null,
      tipo_Estudio_Id: null,
      tipo_Estudio: null,
      institucion: null,
      carrera: null,
      nombre: null,
      periodo: null,
      documento_Recibido: null,
    },
    experiencia_Laboral: {
      id: null,
      usuario_Id: null,
      institucion: null,
      cargo: null,
      domicilio: null,
      periodo: null,
      sector: null,
    },
    publicaciones_Participaciones: {
      id: null,
      usuario_Id: null,
      tipo: null,
      titulo: null,
      fecha_Imparticion: null,
      autor: null,
      coAutor: null,
      medio_Publicacion: null,
      organizacion: null,
      cargo: null,
      fecha_Integracion: null,
    },

    estados: [],
    municipio: [],
    list_Formacion_Academica: [],
    list_Experiencia_Laboral: [],
    list_publicaciones_Participaciones: [],

    myLocale: {
      days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
      daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
      months:
        "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
          "_"
        ),
      monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
      firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
      format24h: true,
      pluralDay: "dias",
    },
  }),
  actions: {
    initDatosPersonales() {
      this.datos_personales.id = null;
      this.datos_personales.nombres = null;
      this.datos_personales.foto_Url = null;
      this.datos_personales.apellido_Paterno = null;
      this.datos_personales.apellido_Materno = null;
      this.datos_personales.edad = null;
      this.datos_personales.genero = null;
      this.datos_personales.email = null;
      this.datos_personales.clave_Elector = null;
      this.datos_personales.curp = null;
      this.datos_personales.rfc = null;
      this.datos_personales.lugar_Nacimiento = null;
      this.datos_personales.fecha_Nacimiento = null;
      this.datos_personales.telefono_Particular = null;
      this.datos_personales.telefono_Celular = null;
      this.datos_personales.is_Pueblo_Originario = false;
      this.datos_personales.pueblo_Originario = null;
      this.datos_personales.is_Discapacidad = false;
      this.datos_personales.discapacidad = null;
      this.datos_personales.calle = null;
      this.datos_personales.no_Interior = null;
      this.datos_personales.no_Exterior = null;
      this.datos_personales.colonia = null;
      this.datos_personales.municipio = null;
      this.datos_personales.entidad = null;
      this.datos_personales.c_P = null;
      this.datos_personales.estado_Id = 0;
      this.datos_personales.municipio_Id = 0;
      this.datos_personales.estado_Nacimiento_Id = 0;
      this.datos_personales.estado_Nacimiento = null;
      this.datos_personales.municipio_Nacimiento_Id = 0;
      this.datos_personales.municipio_Nacimiento = null;
      this.datos_personales.is_Lgbt = false;
      this.datos_personales.lgbt = null;
      this.datos_personales.userName = null;
      this.datos_personales.empleado_Id = null;
    },
    initFormacionAcademica() {
      this.formacion_Academica.id = null;
      this.formacion_Academica.usuario_Id = null;
      this.formacion_Academica.tipo_Estudio_Id = null;
      this.formacion_Academica.tipo_Estudio = null;
      this.formacion_Academica.institucion = null;
      this.formacion_Academica.carrera = null;
      this.formacion_Academica.nombre = null;
      this.formacion_Academica.periodo = null;
      this.formacion_Academica.documento_Recibido = null;
    },
    initExperienciaLaboral() {
      this.experiencia_Laboral.id = null;
      this.experiencia_Laboral.usuario_Id = null;
      this.experiencia_Laboral.institucion = null;
      this.experiencia_Laboral.cargo = null;
      this.experiencia_Laboral.domicilio = null;
      this.experiencia_Laboral.periodo = null;
      this.experiencia_Laboral.sector = null;
    },
    iniPublicacionesParticipaciones() {
      this.publicaciones_Participaciones.id = null;
      this.publicaciones_Participaciones.usuario_Id = null;
      this.publicaciones_Participaciones.tipo = null;
      this.publicaciones_Participaciones.titulo = null;
      this.publicaciones_Participaciones.fecha_Imparticion = null;
      this.publicaciones_Participaciones.autor = null;
      this.publicaciones_Participaciones.coAutor = null;
      this.publicaciones_Participaciones.medio_Publicacion = null;
      this.publicaciones_Participaciones.organizacion = null;
      this.publicaciones_Participaciones.cargo = null;
      this.publicaciones_Participaciones.fecha_Integracion = null;
    },

    async obtenerUsuario() {
      try {
        if (this.usuarioId != null) {
        } else {
          let usuario = encryptStorage.decrypt("userNameL");
          console.log("Esto es usuario", usuario);
          let resp = await api.get("/Usuarios");
          let { data } = resp.data;
          let filtro = data.find((x) => x.userName == usuario);
          this.usuarioId = filtro.id;
          //await this.prellenadoDatos();
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadListTipoEstudio() {
      try {
        this.tipoEstudio = null;
        let resp = await api.get("/TiposEstudios");
        let { data } = resp.data;
        let listadoEstudios = data.map((estudio) => {
          return {
            value: estudio.value,
            label: estudio.label,
          };
        });
        this.tipoEstudio = listadoEstudios;
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async prellenadoDatos() {
      try {
        await this.loadDatosPersonales();
        await this.loadFormaciónAcademica();
        await this.loadExperienciaLaboral();
        await this.loadPublicacionesParticipaciones();
        this.loadAvance();
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async loadDatosPersonales() {
      try {
        let resp = await api.get(`/DatosPersonalesUsuarios/MisDatosPersonales`);
        let { data } = resp.data;

        if (data != null) {
          const inputDate = data.fecha_Nacimiento;
          const parts = inputDate.split("-");
          const formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);

          const year = formattedDate.getFullYear();
          const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
          const day = String(formattedDate.getDate()).padStart(2, "0");

          const formattedDateString = `${year}/${month}/${day}`;
          this.personalesCheck = true;
          this.datos_personales.id = data.id;
          this.datos_personales.edad = data.edad;
          this.datos_personales.clave_Elector = data.clave_Elector;
          this.datos_personales.curp = data.curp;
          this.datos_personales.rfc = data.rfc;
          this.datos_personales.lugar_Nacimiento = data.lugar_Nacimiento;
          this.datos_personales.fecha_Nacimiento = formattedDateString;
          this.datos_personales.telefono_Particular = data.telefono_Particular;
          this.datos_personales.is_Pueblo_Originario =
            data.is_Pueblo_Originario;
          this.datos_personales.pueblo_Originario = data.pueblo_Originario;
          this.datos_personales.is_Discapacidad = data.is_Discapacidad;
          this.datos_personales.discapacidad = data.discapacidad;
          this.datos_personales.calle = data.calle;
          this.datos_personales.no_Interior = data.no_Interior;
          this.datos_personales.no_Exterior = data.no_Exterior;
          this.datos_personales.colonia = data.colonia;
          this.datos_personales.municipio = data.municipio;
          this.datos_personales.estado = data.estado;
          this.datos_personales.c_P = data.c_P;
          this.datos_personales.estado_Id = data.estado_Id;
          this.datos_personales.municipio_Id = data.municipio_Id;
          this.datos_personales.estado_Nacimiento_Id =
            data.estado_Nacimiento_Id;
          this.datos_personales.estado_Nacimiento = data.estado_Nacimiento;
          this.datos_personales.municipio_Nacimiento_Id =
            data.municipio_Nacimiento_Id;
          this.datos_personales.municipio_Nacimiento =
            data.municipio_Nacimiento;
        }
        console.log("Usuario datos", this.usuarioId);
        let user = await api.get(`/Usuarios/${this.usuarioId}`);
        let datosUser = user.data.data;
        if (datosUser != null) {
          this.datos_personales.nombres = datosUser.nombres;
          this.datos_personales.apellido_Paterno = datosUser.apellido_Paterno;
          this.datos_personales.apellido_Materno = datosUser.apellido_Materno;
          this.datos_personales.genero = datosUser.sexo;
          this.datos_personales.email = datosUser.email;
          this.datos_personales.telefono_Celular = datosUser.phoneNumber;
          this.datos_personales.foto_Url = datosUser.foto_Url;
          this.datos_personales.clave_Elector = datosUser.clave_Elector;
          this.datos_personales.userName = datosUser.userName;
          this.datos_personales.empleado_Id = datosUser.empleado_Id;
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async loadFormaciónAcademica() {
      try {
        this.list_Formacion_Academica = [];
        const resp = await api.get("/FormacionesAcademicas/MiFormacion");
        let { data } = resp.data;
        if (data.length > 0) {
          let listadoEstudiantil = data.map((estudio) => {
            return {
              nivel_Estudio: estudio.tipo_Estudio,
              tipo_Estudio_Id: estudio.tipo_Estudio_Id,
              institucion: estudio.institucion,
              carrera: estudio.carrera,
              nombre: estudio.nombre,
              periodo: estudio.periodo,
              documento_Recibido: estudio.documento_Recibido,
              id: estudio.id,
            };
          });
          this.list_Formacion_Academica = listadoEstudiantil;
          let filtro = this.list_Formacion_Academica.find(
            (x) => x.tipo_Estudio_Id == 1 || x.tipo_Estudio_Id == 2
          );
          if (filtro != undefined) {
            this.academicosCheck = true;
          } else {
            this.academicosCheck = false;
          }

          return true;
        } else {
          this.academicosCheck = false;
        }
        this.loadAvance();
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadExperienciaLaboral() {
      try {
        this.botonLaboral = false;
        this.list_Experiencia_Laboral = [];
        const resp = await api.get("/ExperienciasLaborales/MiExperiencia");
        let { data } = resp.data;
        if (data.length > 0) {
          let listadolaboral = data.map((laboral) => {
            if (laboral.sector == "Ninguno") {
              this.botonLaboral = true;
            }
            return {
              id: laboral.id,
              institucion: laboral.institucion,
              cargo: laboral.cargo,
              domicilio: laboral.domicilio,
              periodo: laboral.periodo,
              sector: laboral.sector,
            };
          });
          this.list_Experiencia_Laboral = listadolaboral;
          this.curricularCheck = true;
          return true;
        } else {
          this.curricularCheck = false;
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
      this.loadAvance();
    },
    async loadPublicacionesParticipaciones() {
      try {
        this.botonParticipacion = false;
        this.list_publicaciones_Participaciones = [];
        const resp = await api.get(
          "/PublicacionesParticipaciones/MisPublicaciones"
        );
        let { data } = resp.data;
        if (data.length > 0) {
          let listadoPublicaciones = data.map((publicacion) => {
            if (publicacion.tipo == "Ninguno") {
              this.botonParticipacion = true;
            }
            let nombre =
              publicacion.tipo == "Participación comunitaria"
                ? publicacion.organizacion
                : publicacion.titulo;
            let fecha =
              publicacion.tipo == "Participación comunitaria"
                ? publicacion.fecha_Integracion
                : publicacion.fecha_Imparticipacion_Tabla;
            return {
              id: publicacion.id,
              tipo: publicacion.tipo,
              nombre: nombre,
              fecha: fecha,
              usuario_Id: publicacion.usuario_Id,
              titulo: publicacion.titulo,
              fecha_Imparticion: publicacion.fecha_Imparticion,
              fecha_Imparticipacion_Tabla:
                publicacion.fecha_Imparticipacion_Tabla,
              autor: publicacion.autor,
              coAutor: publicacion.coAutor,
              medio_Publicacion: publicacion.medio_Publicacion,
              organizacion: publicacion.organizacion,
              cargo: publicacion.cargo,
              fecha_Integracion: publicacion.fecha_Integracion,
              fecha_Integracion_Tabla: publicacion.fecha_Integracion_Tabla,
            };
          });
          this.list_publicaciones_Participaciones = listadoPublicaciones;
          this.cursosCheck = true;
          return true;
        } else {
          this.cursosCheck = false;
        }
        this.loadAvance();
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadAvance() {
      this.checkComplete = false;
      let avance = [
        this.cursosCheck,
        this.academicosCheck,
        this.personalesCheck,
        this.curricularCheck,
      ];
      let filtro = avance.filter((x) => x == true);
      let total = filtro.length / avance.length;
      this.avanceBarra = total;
      if (total == 1) {
        this.checkComplete = true;
      }
      this.avanceLetra = (total * 100).toFixed(2) + "%";
    },

    async loadListaEstadosMunicipio() {
      try {
        let respEstado = await api.get("/Estados");
        let listEstado = respEstado.data.data;
        let listadoEstado = listEstado.map((estado) => {
          return {
            value: estado.clave,
            label: estado.nombre,
          };
        });

        let respMunicipio = await api.get("/Municipios");
        let listMunicipio = respMunicipio.data.data;
        let listadoMunicipio = listMunicipio.map((municipio) => {
          return {
            label: municipio.nombre,
            estado_Id: municipio.estado_Id,
            value: municipio.id,
          };
        });
        this.estados = listadoEstado;
        this.municipio = listadoMunicipio;
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createDatosPersonales(datos) {
      try {
        let resp = await api.post("/DatosPersonalesUsuarios", datos);
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

    async updateDatosPersonales(datos) {
      try {
        let resp = await api.put(`/DatosPersonalesUsuarios/${datos.id}`, datos);
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
    async updateDatosUsuario(usuario) {
      try {
        let resp = await api.put(`/Usuarios/${this.usuarioId}`, usuario, {
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

    async createFormacionAcademica(academica) {
      try {
        const resp = await api.post("/FormacionesAcademicas", academica);
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

    async createExperienciaLaboral(laboral) {
      try {
        const resp = await api.post("/ExperienciasLaborales", laboral);
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

    async createParticipacionPublicacion(publicacion) {
      try {
        const resp = await api.post(
          "/PublicacionesParticipaciones",
          publicacion
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

    async deleteFormacionAcademica(id) {
      try {
        const resp = await api.delete(`/FormacionesAcademicas/${id}`);
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

    async deleteExperienciaLaboral(id) {
      try {
        const resp = await api.delete(`/ExperienciasLaborales/${id}`);
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
    async deletePublicacionParticipacion(id) {
      try {
        const resp = await api.delete(`/PublicacionesParticipaciones/${id}`);
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

    actualizarStepper(valor) {
      this.stepper = valor;
    },

    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
