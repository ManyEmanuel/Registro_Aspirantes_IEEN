import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useUsuariosVacantes = defineStore("usuariosVacantes", {
  state: () => ({
    listaUsuarios: [],
  }),

  actions: {
    async loadUsuarios() {
      try {
        let resp = await api.get("/Usuarios");
        let { data } = resp.data;
        let listUsuarios = data.map((usuario) => {
          let tipoUsuario =
            usuario.empleado_Id == null ? "Ciudadania" : "Personal IEEN";
          return {
            id: usuario.id,
            tipo: tipoUsuario,
            nombre:
              usuario.nombres +
              " " +
              usuario.apellido_Paterno +
              " " +
              usuario.apellido_Materno,
            user: usuario.userName,
            estatus: usuario.estatus,
            sexo: usuario.sexo,
          };
        });
        this.listaUsuarios = listUsuarios.filter((x) => x.tipo == "Ciudadania");
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async reenviarCorreoUsuario(id) {
      try {
        let resp = await api.get(`/Usuarios/ReenviarCorreo/${id}`);
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
  },
});
