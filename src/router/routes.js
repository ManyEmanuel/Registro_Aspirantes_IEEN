import isAutenticatedGuard from "../guard/auth-guard";

const routes = [
  /*{
    path: "",
    name: "login",
    // beforeEnter: [isAuthenticatedGuard],
    component: () => import("pages/Login.vue"),
  },*/
  {
    path: "/",
    name: "home",
    component: () => import("layouts/MainLayout.vue"),

    children: [
      {
        path: "/datos_ciudadano",
        name: "datos_ciudadano",
        //beforeEnter: [isAutenticatedGuard],
        component: () =>
          import("../modulos/datos_ciudadanos/pages/indexPage.vue"),
      },
      {
        path: "/postulacion",
        name: "postulacion",
        component: () =>
          import(
            "../modulos/postulaciones_usuario/pages/PostulacionesPage.vue"
          ),
      },
      {
        path: "",
        name: "vacantes_diponibles",
        component: () =>
          import("../modulos/publicacion_vacantes/pages/indexPage.vue"),
      },

      {
        path: "/registro_vacantes",
        name: "registro_vacantes",
        component: () =>
          import("../modulos/registro_vacantes/pages/IndexPage.vue"),
      },
      {
        path: "/mis_postulaciones",
        name: "mis_postulaciones",
        component: () =>
          import("../modulos/postulaciones_usuario/pages/IndexPage.vue"),
      },
      {
        path: "/vacantes",
        name: "vacantes",
        component: () =>
          import("../modulos/verificacion_vacante/pages/IndexPage.vue"),
      },
      {
        path: "/vacante_postulados",
        name: "vacante_postulados",
        component: () =>
          import(
            "../modulos/verificacion_vacante/pages/VacantePostuladosPage.vue"
          ),
      },
      {
        path: "/Datos_Postulado",
        name: "Datos_Postulado",
        component: () =>
          import(
            "../modulos/verificacion_vacante/pages/DatosPostuladosPage.vue"
          ),
      },
      {
        path: "/Calendario_Entrevistas",
        name: "Calendario_Entrevistas",
        component: () =>
          import("../modulos/calendario_postulantes/pages/IndexPage.vue"),
      },
      {
        path: "/Usuarios_Registrados",
        name: "Usuarios_Registrados",
        component: () =>
          import("../modulos/usuarios_Vacantes/pages/IndexPage.vue"),
      },
      {
        path: "/Dashboard",
        name: "Dashboard",
        component: () => import("../modulos/dashboard/pages/IndexPage.vue"),
      },
    ],
  },

  // but you can also remove it

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
