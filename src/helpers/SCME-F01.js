import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { storeToRefs } from "pinia";
import { useDatosCiudadanosStore } from "../store/datos_ciudadanos_store";

const datosCiudadanosStore = useDatosCiudadanosStore();
await datosCiudadanosStore.obtenerUsuario();
await datosCiudadanosStore.prellenadoDatos();

const { datos_personales, estados, municipio } =
  storeToRefs(datosCiudadanosStore);

let resp = await api.get("/SolicitudesVacantes/ValidarPostulacion");
let { oficina } = resp.data;
let obtenerOficina = await api.get(`/Oficinas/${oficina}`);
let datosOficina = obtenerOficina.data.data;
let arr = datosOficina.nombre.split(" ");
arr.shift();
let Postulacion = arr.join(" ");

const ReporteSCME01 = async () => {
  try {
    let datos = datos_personales.value;
    for (let prop in datos) {
      if (datos[prop] == null) {
        datos[prop] = "";
      }
    }
    let puebloBol = datos.is_Pueblo_Originario == true ? "Si" : "No";
    let pueblo =
      datos.is_Pueblo_Originario == true ? datos.pueblo_Originario : "";
    let discapacidadBol = datos.is_Discapacidad == true ? "Si" : "No";
    let discapacidad =
      datos.is_Pueblo_Originario == true ? datos.discapacidad : "";
    let lgbtBol = datos.is_Lgbt == true ? "Si" : "No";
    let lgbt = datos.is_Lgbt == true ? datos.lgbt : "";
    let fechaActual = new Date();
    let dia = fechaActual.getDate();
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const numMes = fechaActual.getMonth();

    const mes = meses[numMes];
    let tipoImagen = datos.foto_Url.split(".");
    let extensionImg = tipoImagen[tipoImagen.length - 1];
    //let imgUsuario = new Image();
    //imgUsuario.src = datos.foto_Url;
    let logo = new Image();
    logo.src = require("../assets/Banderin.png");
    let pelo = new Image();
    pelo.src = require("../assets/Pelo2024-250.png");
    const doc = new jsPDF();
    if (extensionImg == "png") {
      let imgUsuario = new Image();
      imgUsuario.src = datos.foto_Url;
      doc.addImage(imgUsuario, "jpg", 161, 21, 22, 26);
    }
    doc.addImage(logo, "png", 25, 0, 32, 40);
    doc.addImage(pelo, "png", 160, 285, 45, 6);
    //doc.addImage(imgUsuario, "png", 161, 21, 22, 26);
    doc.roundedRect(160, 20, 24, 28, 3, 3);
    doc.setFillColor(196, 92, 145);
    doc.rect(160, 50, 24, 7, "F");
    doc.rect(0, 72, 210, 2, "F");
    doc.rect(0, 142, 210, 2, "F");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("SCME-F01", 172, 55, null, null, "center");
    //------------------------------------------------------------------------------
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Solicitud de registro para el procedimiento de designación de las secretarías municipales de\nlos Consejos Municipales Electorales para el Proceso Electoral Local Ordinario 2024.",
      25,
      62
    );
    //---------------------------------------------------------------------------------
    doc.setFillColor(255, 255, 255);
    doc.rect(50, 71, 110, 4, "F");
    doc.rect(80, 141, 50, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(196, 92, 145);
    doc.setFont("helvetica", "bold");
    doc.text(
      "IDENTIFICACIÓN DE LA PERSONA ASPIRANTE",
      105,
      74,
      null,
      null,
      "center"
    );
    doc.text("DOMICILIO ACTUAL", 105, 144, null, null, "center");
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
    doc.setDrawColor(0);
    doc.rect(25, 80, 40, 5, "FD");
    doc.rect(25, 85, 40, 5, "FD");
    doc.rect(25, 90, 40, 5, "FD");
    doc.rect(25, 95, 40, 5, "FD");
    doc.rect(80, 95, 40, 5, "FD");
    doc.rect(25, 100, 40, 12, "FD");
    doc.rect(80, 100, 40, 12, "FD");
    doc.rect(25, 112, 40, 12, "FD");
    doc.rect(80, 112, 40, 12, "FD");
    doc.rect(25, 124, 40, 12, "FD");
    doc.rect(80, 124, 40, 12, "FD");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bolditalic");
    doc.text("Apellido Paterno", 27, 84);
    doc.text("Apellido Materno", 27, 89);
    doc.text("Nombre(s)", 27, 94);
    doc.text("Edad", 27, 99);
    doc.text("Género", 82, 99);
    doc.setFontSize(8);
    doc.text(
      "Se autoadscribe como\nintegrante de alguno de los\npueblos originarios",
      27,
      103
    );
    doc.text("Indique a cuál etnia\nindígena pertenece", 82, 103);
    doc.text("¿Eres persona con\ndiscapacidad?", 27, 115);
    doc.text("¿Cuál?", 82, 118);
    doc.text("¿Perteneces a la población\nLGBTTTIQ+?", 27, 127);
    doc.text("¿Cuál?", 82, 130);

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
    doc.rect(65, 80, 119, 5);
    doc.rect(65, 85, 119, 5);
    doc.rect(65, 90, 119, 5);
    doc.rect(65, 95, 15, 5);
    doc.rect(120, 95, 64, 5);
    doc.rect(65, 100, 15, 12);
    doc.rect(120, 100, 64, 12);
    doc.rect(65, 112, 15, 12);
    doc.rect(120, 112, 64, 12);
    doc.rect(65, 124, 15, 12);
    doc.rect(120, 124, 64, 12);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(datos.apellido_Paterno, 67, 84);
    doc.text(datos.apellido_Materno, 67, 89);
    doc.text(datos.nombres, 67, 94);
    doc.text(datos.edad.toString(), 70, 99);
    doc.text(datos.genero, 122, 99);
    doc.text(puebloBol, 70, 107);
    doc.text(pueblo, 122, 107);
    doc.text(discapacidadBol, 70, 119);
    doc.text(discapacidad, 122, 119);
    doc.text(lgbtBol, 70, 131);
    doc.text(lgbt, 122, 131);

    //-----------------------------------------------------------------------------------------------------------------------------
    doc.setFillColor(196, 92, 145);
    doc.rect(25, 152, 40, 5, "FD");
    doc.rect(25, 157, 40, 5, "FD");
    doc.rect(105, 157, 40, 5, "FD");
    doc.rect(25, 162, 40, 5, "FD");
    doc.rect(25, 167, 40, 5, "FD");
    doc.rect(25, 172, 40, 5, "FD");
    doc.rect(25, 177, 40, 5, "FD");
    doc.rect(25, 182, 40, 5, "FD");
    doc.rect(105, 182, 40, 5, "FD");
    doc.rect(25, 187, 40, 5, "FD");
    doc.rect(25, 192, 80, 5, "FD");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bolditalic");
    doc.text("Calle", 27, 156);
    doc.text("Número exterior", 27, 161);
    doc.text("Número interior", 107, 161);
    doc.text("Colonia", 27, 166);
    doc.text("Municipio", 27, 171);
    doc.text("Entidad", 27, 176);
    doc.text("C.P.", 27, 181);
    doc.text("Teléfono particular", 27, 186);
    doc.text("Teléfono celular", 107, 186);
    doc.text("Correo electrónico", 27, 191);
    doc.text("Municipio en el que desea postularse", 27, 196);

    //---------------------------------------------------------------------------------------------------------------------------
    doc.rect(65, 152, 119, 5);
    doc.rect(65, 157, 40, 5);
    doc.rect(145, 157, 39, 5);
    doc.rect(65, 162, 119, 5);
    doc.rect(65, 167, 119, 5);
    doc.rect(65, 172, 119, 5);
    doc.rect(65, 177, 119, 5);
    doc.rect(65, 182, 40, 5);
    doc.rect(145, 182, 39, 5);
    doc.rect(65, 187, 119, 5);
    doc.rect(105, 192, 79, 5);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(datos.calle, 67, 156);
    doc.text(datos.no_Exterior, 67, 161);
    doc.text(datos.no_Interior, 147, 161);
    doc.text(datos.colonia, 67, 166);
    doc.text(datos.municipio, 67, 171);
    doc.text(datos.estado, 67, 176);
    doc.text(datos.c_P, 67, 181);
    doc.text(datos.telefono_Particular, 67, 186);
    doc.text(datos.telefono_Celular, 147, 186);
    doc.text(datos.email, 67, 191);
    doc.text(Postulacion, 107, 196);

    //----------------------------------------------------------------------------------------------------------------------

    doc.setFont("helvetica", "italic");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(
      "Solicito ser considerada (o) como aspirante para ocupar el cargo de Secretaria o secretario Municipal\nElectoral del Instituto Estatal Electoral del Estado de Nayarit conforme a las bases publicadas en la\nconvocatoria correspondiente",
      25,
      207
    );
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(
      "Estado: Nayarit, Municipio: ____________________________________ a ______ de ______________________ del 2023",
      25,
      227
    );
    doc.line(25, 252, 184, 252);
    doc.setFontSize(9);
    doc.text(
      "Nombre y firma del aspirante a Secretaria/o Municipal Electoral.",
      105,
      257,
      null,
      null,
      "center"
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      datos.nombres +
        " " +
        datos.apellido_Paterno +
        " " +
        datos.apellido_Materno,
      105,
      250,
      null,
      null,
      "center"
    );
    doc.text(datos.municipio, 90, 227, null, null, "center");
    doc.text(dia.toString(), 127, 227, null, null, "center");
    doc.text(mes, 153, 227, null, null, "center");

    doc.save("Formato_SCME-F01.pdf");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};
export default ReporteSCME01;
