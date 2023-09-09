import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { storeToRefs } from "pinia";
import { useDatosCiudadanosStore } from "../store/datos_ciudadanos_store";

const datosCiudadanosStore = useDatosCiudadanosStore();
await datosCiudadanosStore.obtenerUsuario();
await datosCiudadanosStore.prellenadoDatos();

const { datos_personales, list_Formacion_Academica, list_Experiencia_Laboral } =
  storeToRefs(datosCiudadanosStore);

const ReporteCME03 = async () => {
  try {
    let datos = datos_personales.value;
    for (let prop in datos) {
      if (datos[prop] == null) {
        datos[prop] = "";
      }
    }
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
    let doc = new jsPDF();
    function createHeader() {
      let img = new Image();
      img.src = require("../assets/banner768.png");
      let logo = new Image();
      logo.src = require("../assets/IEEN300.png");

      doc.addImage(img, "png", 0, 0, 210, 25);
      doc.addImage(logo, "png", 15, 20, 32, 18);

      doc.setFillColor(161, 55, 147);
      doc.rect(170, 25, 25, 7, "F");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("CME-F03", 183, 30, null, null, "center");
    }

    function createFooter() {
      let pelo = new Image();
      pelo.src = require("../assets/Pelo2024-250.png");
      doc.addImage(pelo, "png", 160, 285, 45, 6);
    }
    createHeader();
    createFooter();
    let otrosEstudios = list_Formacion_Academica.value.filter(
      (x) => x.tipo_Estudio_Id >= 3 && x.tipo_Estudio_Id <= 5
    );
    let cursos = list_Formacion_Academica.value.filter(
      (x) => x.tipo_Estudio_Id == 6
    );
    let listOtrosEstudios = otrosEstudios;
    let listCursos = cursos;
    let listLaboral = list_Experiencia_Laboral.value;
    //-----------------------------------------------------------------------------------------
    doc.setFillColor(161, 55, 147);
    doc.rect(0, 45, 210, 2, "F");
    doc.rect(0, 80, 210, 2, "F");
    //------------------------------------------------------------------------------------------/
    doc.setFillColor(255, 255, 255);
    doc.rect(90, 44, 30, 4, "F");
    doc.rect(80, 79, 50, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(161, 55, 147);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN", 105, 47, null, null, "center");
    doc.text("PERFIL ACADÉMICO", 105, 82, null, null, "center");
    //---------------------------------------DATOS GENERALES------------------------------------------------------/
    doc.setFillColor(161, 55, 147);
    doc.setDrawColor(0);
    doc.rect(15, 52, 180, 6, "FD");
    doc.rect(15, 58, 55, 5, "FD");
    doc.rect(15, 63, 55, 5, "FD");
    doc.rect(15, 68, 55, 5, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Datos Generales", 105, 56, null, null, "center");
    doc.setFont("helvetica", "bolditalic");
    doc.text("Apellido Paterno", 17, 62);
    doc.text("Apellido Materno", 17, 67);
    doc.text("Nombre(s)", 17, 72);
    //---------------------------------DATOS GENERALES---------------------------------------------------------------
    doc.rect(70, 58, 125, 5);
    doc.rect(70, 63, 125, 5);
    doc.rect(70, 68, 125, 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(datos.apellido_Paterno, 72, 62);
    doc.text(datos.apellido_Materno, 72, 67);
    doc.text(datos.nombres, 72, 72);

    //-----------------------------------PREPARATORIA------------------------------------------------------------
    doc.setFillColor(161, 55, 147);
    doc.setDrawColor(0);
    doc.rect(15, 88, 180, 6, "FD");
    doc.rect(15, 94, 55, 5, "FD");
    doc.rect(15, 99, 55, 5, "FD");
    doc.rect(15, 104, 55, 5, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Preparatoria/bachillerato", 105, 92, null, null, "center");
    doc.setFont("helvetica", "bolditalic");
    doc.text("Nombre de la institución", 17, 98);
    doc.text("Carrera", 17, 103);
    doc.text("Periodo", 17, 108);
    //-----------------------------------PREPARATORIA-------------------------------------------------------------
    let preparatoria = list_Formacion_Academica.value.find(
      (x) => x.tipo_Estudio_Id == 1
    );
    doc.rect(70, 94, 125, 5);
    doc.rect(70, 99, 125, 5);
    doc.rect(70, 104, 125, 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    if (preparatoria != undefined) {
      doc.text(preparatoria.institucion, 72, 98);
      doc.text(preparatoria.carrera, 72, 103);
      doc.text(preparatoria.periodo, 72, 108);
    } else {
      doc.text("", 72, 98);
      doc.text("", 72, 103);
      doc.text("", 72, 108);
    }

    //-----------------------------------LICENCIATURA--------------------------------------------------------------------
    doc.setFillColor(161, 55, 147);
    doc.setDrawColor(0);
    doc.rect(15, 109, 180, 6, "FD");
    doc.rect(15, 115, 55, 5, "FD");
    doc.rect(15, 120, 55, 5, "FD");
    doc.rect(15, 125, 55, 5, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Licenciatura", 105, 113, null, null, "center");
    doc.setFont("helvetica", "bolditalic");
    doc.text("Nombre de la institución", 17, 119);
    doc.text("Carrera", 17, 124);
    doc.text("Periodo", 17, 129);
    //-----------------------------------LICENCIATURA-------------------------------------------------------------
    let licenciatura = list_Formacion_Academica.value.find(
      (x) => x.tipo_Estudio_Id == 2
    );
    doc.rect(70, 115, 125, 5);
    doc.rect(70, 120, 125, 5);
    doc.rect(70, 125, 125, 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    if (licenciatura != undefined) {
      doc.text(licenciatura.institucion, 72, 119);
      doc.text(licenciatura.carrera, 72, 124);
      doc.text(licenciatura.periodo, 72, 129);
    } else {
      doc.text("", 72, 119);
      doc.text("", 72, 124);
      doc.text("", 72, 129);
    }

    //-------------------------------OTROS ESTUDIOS (DINAMICO)-----------------------------------------------------------
    doc.setFillColor(161, 55, 147);
    doc.setDrawColor(0);
    doc.rect(15, 130, 180, 6, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Otros estudios", 105, 134, null, null, "center");
    ////////////////////////////////////////////////////////////////////////
    let pointY = 136;
    if (listOtrosEstudios.length > 0) {
      let totalList = listOtrosEstudios.length - 1;

      listOtrosEstudios.forEach((item, index) => {
        doc.setFillColor(161, 55, 147);
        doc.setDrawColor(0);
        doc.setFontSize(9);
        doc.rect(15, pointY, 55, 5, "FD");
        doc.rect(15, pointY + 5, 55, 5, "FD");
        doc.rect(15, pointY + 10, 55, 5, "FD");
        doc.setFont("helvetica", "bolditalic");
        doc.setTextColor(255, 255, 255);
        doc.text("Nombre de la institución", 17, pointY + 4);
        doc.text("Estudio realizado", 17, pointY + 9);
        doc.text("Periodo", 17, pointY + 14);
        doc.rect(70, pointY, 125, 5);
        doc.rect(70, pointY + 5, 125, 5);
        doc.rect(70, pointY + 10, 125, 5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(item.institucion, 72, pointY + 4);
        doc.text(item.nombre, 72, pointY + 9);
        doc.text(item.periodo, 72, pointY + 14);
        if (totalList == index) {
          pointY = pointY + 15;
        } else {
          pointY = pointY + 20;
        }
        if (pointY >= 260) {
          doc.addPage();
          createFooter();
          createHeader();
          pointY = 50;
        }
      });
    }

    //-------------------------------Cursos (DINAMICO)-----------------------------------------------------------
    doc.setFillColor(161, 55, 147);
    doc.setDrawColor(0);
    doc.rect(15, pointY, 180, 6, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Cursos realizados", 105, pointY + 4, null, null, "center");
    ////////////////////////////////////////////////////////////////////////
    pointY = pointY + 6;
    if (listCursos.length > 0) {
      let totalList = listCursos.length - 1;
      listCursos.forEach((item, index) => {
        doc.setFillColor(161, 55, 147);
        doc.setDrawColor(0);
        doc.setFontSize(9);
        doc.rect(15, pointY, 55, 5, "FD");
        doc.rect(15, pointY + 5, 55, 5, "FD");
        doc.rect(15, pointY + 10, 55, 5, "FD");
        doc.setFont("helvetica", "bolditalic");
        doc.setTextColor(255, 255, 255);
        doc.text("Nombre de la curso", 17, pointY + 4);
        doc.text("Institución", 17, pointY + 9);
        doc.text("Periodo", 17, pointY + 14);
        doc.rect(70, pointY, 125, 5);
        doc.rect(70, pointY + 5, 125, 5);
        doc.rect(70, pointY + 10, 125, 5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(item.nombre, 72, pointY + 4);
        doc.text(item.institucion, 72, pointY + 9);
        doc.text(item.periodo, 72, pointY + 14);
        if (totalList == index) {
          pointY = pointY + 20;
        } else {
          pointY = pointY + 20;
        }
        if (pointY >= 260) {
          doc.addPage();
          createFooter();
          createHeader();
          pointY = 50;
        }
      });
    } else {
      pointY = pointY + 10;
      if (pointY >= 260) {
        doc.addPage();
        createFooter();
        createHeader();
        pointY = 50;
      }
    }
    //_---------------------------------------------------------------------------------------------------------
    doc.setFillColor(161, 55, 147);
    doc.rect(0, pointY, 210, 2, "F");

    doc.setFillColor(255, 255, 255);
    doc.rect(80, pointY - 1, 50, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(161, 55, 147);
    doc.setFont("helvetica", "bold");
    doc.text("EXPERIENCIA LABORAL", 105, pointY + 2, null, null, "center");

    pointY = pointY + 6;
    if (pointY >= 260) {
      doc.addPage();
      createFooter();
      createHeader();
      pointY = 40;
    }
    //-------------------------------sector (DINAMICO)-----------------------------------------------------------
    doc.setFillColor(161, 55, 147);
    doc.setDrawColor(0);
    doc.rect(15, pointY, 180, 6, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Sector público/privado", 105, pointY + 4, null, null, "center");
    /////////////////////////////////////////////////////////////////////////////////////////
    pointY = pointY + 6;
    if (listLaboral.length > 0) {
      let totalList = listLaboral.length - 1;
      let verificacionNull = false;
      if (listLaboral.length == 1) {
        let filtro = listLaboral.find((x) => x.sector == "Ninguno");
        if (filtro != undefined) {
          verificacionNull = true;
        }
      }
      listLaboral.forEach((item, index) => {
        doc.setFillColor(161, 55, 147);
        doc.setDrawColor(0);
        doc.setFontSize(9);
        doc.rect(15, pointY, 55, 5, "FD");
        doc.rect(15, pointY + 5, 55, 5, "FD");
        doc.rect(15, pointY + 10, 55, 5, "FD");
        doc.rect(15, pointY + 15, 55, 5, "FD");
        doc.setFont("helvetica", "bolditalic");
        doc.setTextColor(255, 255, 255);
        doc.text("Puesto", 17, pointY + 4);
        doc.text("Dependencia/entidad", 17, pointY + 9);
        doc.text("Domicilio", 17, pointY + 14);
        doc.text("Periodo", 17, pointY + 19);
        doc.rect(70, pointY, 125, 5);
        doc.rect(70, pointY + 5, 125, 5);
        doc.rect(70, pointY + 10, 125, 5);
        doc.rect(70, pointY + 15, 125, 5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        if (verificacionNull == false) {
          doc.text(item.cargo, 72, pointY + 4);
          doc.text(item.institucion, 72, pointY + 9);
          doc.text(item.domicilio, 72, pointY + 14);
          doc.text(item.periodo, 72, pointY + 19);
        }

        if (totalList == index) {
          pointY = pointY + 30;
        } else {
          pointY = pointY + 25;
        }
        if (pointY >= 260) {
          doc.addPage();
          createFooter();
          createHeader();
          pointY = 40;
        }
      });
    }
    if (pointY >= 250) {
      doc.addPage();
      createFooter();
      createHeader();
      pointY = 50;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(
      "Estado: Nayarit, Municipio: ____________________________________ a ______ de ______________________ del 2023",
      25,
      pointY
    );
    doc.line(25, pointY + 25, 184, pointY + 25);
    doc.setFontSize(9);
    doc.text(
      "Nombre y firma del aspirante a Consejera/o Municipal Electoral.",
      105,
      pointY + 30,
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
      pointY + 23,
      null,
      null,
      "center"
    );
    doc.text(datos.municipio, 90, pointY, null, null, "center");
    doc.text(dia.toString(), 127, pointY, null, null, "center");
    doc.text(mes, 153, pointY, null, null, "center");
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    doc.save("Formato_CME-F03.pdf");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};
export default ReporteCME03;
