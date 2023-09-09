import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { storeToRefs } from "pinia";
import { useDatosCiudadanosStore } from "../store/datos_ciudadanos_store";

const datosCiudadanosStore = useDatosCiudadanosStore();
await datosCiudadanosStore.obtenerUsuario();
await datosCiudadanosStore.prellenadoDatos();

const {
  datos_personales,
  list_Formacion_Academica,
  list_Experiencia_Laboral,
  list_publicaciones_Participaciones,
} = storeToRefs(datosCiudadanosStore);

const ReporteSCME02 = async () => {
  let ningunLaboral = false;
  let ningunDocencia = false;
  let ningunPublicacion = false;
  let ningunParticipacion = false;

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
    let filtroUltimo = list_Formacion_Academica.value.filter(
      (x) => x.tipo_Estudio_Id == 1 || x.tipo_Estudio_Id == 2
    );

    let listadoUltimo = filtroUltimo[filtroUltimo.length - 1];
    let bodyUl = [];
    bodyUl.push([
      listadoUltimo.nivel_Estudio,
      listadoUltimo.institucion,
      listadoUltimo.carrera,
      listadoUltimo.documento_Recibido,
    ]);
    let bodyUltimo = bodyUl;

    let headUltimo = [
      "Último grado de estudios",
      "Nombre de la institución",
      "Área de formación",
      "Documento Obtenido",
    ];
    //--------------------------------------------------------------------------------

    let filtroPosgrado = list_Formacion_Academica.value.filter(
      (x) => x.tipo_Estudio_Id >= 3
    );
    let bodyPos = [];
    if (filtroPosgrado != undefined) {
      filtroPosgrado.forEach((item) => {
        bodyPos.push([
          item.nivel_Estudio,
          item.institucion,
          item.nombre,
          item.documento_Recibido,
        ]);
      });
    }
    let bodyPosgrado = bodyPos;

    let headPosgrado = [
      "Estudios de posgrado",
      "Nombre de la institución",
      "Área de formación",
      "Documento Obtenido",
    ];

    //---------------------------------------------------------------------------
    let bodyLab = [];
    if (
      list_Experiencia_Laboral.value.length == 1 &&
      list_Experiencia_Laboral.value[0].sector == "Ninguno"
    ) {
      ningunLaboral = true;
    } else {
      list_Experiencia_Laboral.value.forEach((item) => {
        bodyLab.push([item.cargo, item.institucion, item.periodo]);
      });
    }
    let bodyLaboral = bodyLab;
    let headLaboral = ["Cargo", "Institución", "Periodo"];
    //------------------------------------------------------------------------------
    let bodyAct = [];
    let filtroActividad = list_publicaciones_Participaciones.value.filter(
      (x) => x.tipo == "Conferencia, ponencia o similar"
    );
    if (filtroActividad.length == 0) {
      ningunDocencia = true;
    } else {
      filtroActividad.forEach((item) => {
        bodyAct.push([item.tipo, item.nombre, item.fecha]);
      });
    }

    let bodyActividad = bodyAct;

    let headActividad = [
      "Foro/Institución",
      "Titulo de la participación",
      "Fecha de impartición",
    ];
    //-------------------------------------------------------------------------------------------------
    let bodyPub = [];
    let filtroPublicacion = list_publicaciones_Participaciones.value.filter(
      (x) => x.tipo == "Publicación"
    );
    if (filtroPublicacion.length == 0) {
      ningunPublicacion = true;
    } else {
      filtroPublicacion.forEach((item) => {
        bodyPub.push([
          item.titulo,
          item.autor,
          item.coAutor,
          item.medio_Publicacion,
          item.fecha,
        ]);
      });
    }

    let bodyPublicacion = bodyPub;
    let headPublicacion = [
      "Titulo de la publicación",
      "Autor",
      "Coautor",
      "Medio de publicación",
      "Fecha",
    ];
    //--------------------------------------------------------------------------------------------
    let bodyPar = [];
    let filtroParticipacion = list_publicaciones_Participaciones.value.filter(
      (x) => x.tipo == "Participación comunitaria"
    );
    if (filtroParticipacion.length == 0) {
      ningunParticipacion = true;
    } else {
      filtroParticipacion.forEach((item) => {
        bodyPar.push([item.organizacion, item.cargo, item.fecha_Integracion]);
      });
    }
    let bodyParticipación = bodyPar;
    let headParticipacion = [
      "Nombre de la organización",
      "Cargo o actividad",
      "Integrante desde",
    ];

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [196, 92, 145], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 10,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
    });
    function createHeader() {
      let logo = new Image();
      logo.src = require("../assets/Banderin.png");
      doc.addImage(logo, "png", 25, 0, 32, 40);
      doc.setFillColor(196, 92, 145);
      doc.rect(170, 25, 25, 7, "F");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("SCME-F02", 183, 30, null, null, "center");
    }

    function createFooter() {
      let pelo = new Image();
      pelo.src = require("../assets/Pelo2024-250.png");
      doc.addImage(pelo, "png", 160, 285, 45, 6);
    }

    //-----------------------------------------------------------------------------------------
    doc.setFillColor(196, 92, 145);
    doc.rect(0, 45, 210, 2, "F");
    doc.rect(0, 127, 210, 2, "F");
    //------------------------------------------------------------------------------------------/
    doc.setFillColor(255, 255, 255);
    doc.rect(75, 44, 60, 4, "F");
    doc.rect(75, 126, 60, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(196, 92, 145);
    doc.setFont("helvetica", "bold");
    doc.text("FORMATO CURRICULAR", 105, 47, null, null, "center");
    doc.text("FORMACIÓN ACADÉMICA", 105, 129, null, null, "center");

    //-------------------------------------------------------------------------------------------------/
    doc.setFillColor(196, 92, 145);
    doc.rect(35, 52, 140, 5, "F");
    doc.rect(35, 87, 140, 5, "F");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS PERSONALES", 105, 56, null, null, "center");
    doc.text("DATOS DE RESIDENCIA", 105, 91, null, null, "center");

    //---------------------------DATOS PERSONALES-------------------------------------------------------------------------------/
    doc.setFillColor(196, 92, 145);
    doc.setDrawColor(0);
    doc.rect(15, 62, 30, 5, "FD");
    doc.rect(105, 62, 30, 5, "FD");
    doc.rect(15, 67, 30, 5, "FD");
    doc.rect(105, 67, 30, 5, "FD");
    doc.rect(15, 72, 30, 5, "FD");
    doc.rect(105, 72, 30, 5, "FD");
    doc.rect(15, 77, 30, 5, "FD");
    doc.rect(105, 77, 30, 5, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(9);
    doc.text("Apellido paterno", 16, 66);
    doc.text("Apellido materno", 106, 66);
    doc.text("Nombre(s)", 16, 71);
    doc.text("CURP", 106, 76);
    doc.text("RFC", 16, 81);
    doc.text("Género", 106, 81);
    doc.setFontSize(8);
    doc.text("Lugar de nacimiento", 106, 71);
    doc.text("Fecha de nacimiento", 16, 76);

    //-----------------------------DATOS PERSONALES--------------------------------------------------------------------------------/
    doc.setFillColor(255, 255, 255);
    doc.rect(45, 62, 60, 5);
    doc.rect(135, 62, 60, 5);
    doc.rect(45, 67, 60, 5);
    doc.rect(135, 67, 60, 5);
    doc.rect(45, 72, 60, 5);
    doc.rect(135, 72, 60, 5);
    doc.rect(45, 77, 60, 5);
    doc.rect(135, 77, 60, 5);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(datos.apellido_Paterno, 46, 66);
    doc.text(datos.apellido_Materno, 136, 66);
    doc.text(datos.nombres, 46, 71);
    doc.text(
      datos.municipio_Nacimiento + ", " + datos.estado_Nacimiento,
      136,
      71
    );
    doc.text(datos.fecha_Nacimiento, 46, 76);
    doc.text(datos.curp, 136, 76);
    doc.text(datos.rfc, 46, 81);
    doc.text(datos.genero, 136, 81);

    //----------------------------DATOS DE RESIDENCIA---------------------------------------------------------------------//
    doc.setFillColor(196, 92, 145);
    doc.setDrawColor(0);
    doc.rect(15, 97, 30, 5, "FD");
    doc.rect(105, 97, 30, 5, "FD");
    doc.rect(15, 102, 30, 5, "FD");
    doc.rect(105, 102, 30, 5, "FD");
    doc.rect(15, 107, 30, 5, "FD");
    doc.rect(105, 107, 30, 5, "FD");
    doc.rect(15, 112, 30, 5, "FD");
    doc.rect(105, 112, 30, 5, "FD");
    doc.rect(15, 117, 30, 5, "FD");
    doc.rect(105, 117, 30, 5, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(9);
    doc.text("Calle", 16, 101);
    doc.text("Municipio", 106, 101);
    doc.text("Número exterior", 16, 106);
    doc.text("Entidad Federativa", 106, 106);
    doc.text("Número interior", 16, 111);
    doc.text("Correo electrónico", 106, 111);
    doc.text("Colonia", 16, 116);
    doc.text("Teléfono particular", 106, 116);
    doc.text("C.P.", 16, 121);
    doc.text("Teléfono celular", 106, 121);

    //-----------------------------DATOS DE RESIDENCIA--------------------------------------------------------------------------------/
    doc.setFillColor(255, 255, 255);
    doc.rect(45, 97, 60, 5);
    doc.rect(135, 97, 60, 5);
    doc.rect(45, 102, 60, 5);
    doc.rect(135, 102, 60, 5);
    doc.rect(45, 107, 60, 5);
    doc.rect(135, 107, 60, 5);
    doc.rect(45, 112, 60, 5);
    doc.rect(135, 112, 60, 5);
    doc.rect(45, 117, 60, 5);
    doc.rect(135, 117, 60, 5);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(datos.calle, 46, 101);
    doc.text(datos.municipio, 136, 101);
    doc.text(datos.no_Exterior, 46, 106);
    doc.text(datos.estado, 136, 106);
    doc.text(datos.no_Interior, 46, 111);
    doc.text(datos.email, 136, 111);
    doc.text(datos.colonia, 46, 116);
    doc.text(datos.telefono_Particular, 136, 116);
    doc.text(datos.c_P, 46, 121);
    doc.text(datos.telefono_Celular, 136, 121);

    //----------------------------------------------------------------------------------------------------------------/
    autoTable(doc, {
      theme: "grid",
      startY: 135,
      head: [headUltimo],
      body: bodyUltimo,
      bodyStyles: { fontSize: 9 },
      willDrawPage: function (data) {
        createHeader();
      },
      didDrawPage: function () {
        createFooter();
      },
      margin: { top: 40 },
    });

    let finalY = doc.lastAutoTable.finalY;
    if (finalY >= 265) {
      doc.addPage();
      finalY = 40;
    }
    autoTable(doc, {
      theme: "grid",
      startY: finalY + 10,
      head: [headPosgrado],
      body: bodyPosgrado,
      bodyStyles: { fontSize: 9 },
      willDrawPage: function (data) {
        createHeader();
      },
      didDrawPage: function () {
        createFooter();
      },
      margin: { top: 40 },
    });

    finalY = doc.lastAutoTable.finalY;
    if (finalY >= 265) {
      doc.addPage();
      finalY = 40;
    } else {
      finalY = finalY + 10;
    }
    //_--------------------------------------------------------------------------------------------------------------------------//
    doc.setFillColor(196, 92, 145);
    doc.rect(0, finalY, 210, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(50, finalY - 1, 110, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(196, 92, 145);
    doc.setFont("helvetica", "bold");
    doc.text(
      "TRAYECTORIA LABORAL/PROFESIONAL/EMPRESARIAL\nEN EL SECTOR PÚBLICO Y/O PRIVADO",
      105,
      finalY - 1,
      null,
      null,
      "center"
    );
    doc.setDrawColor(0);
    doc.setFillColor(196, 92, 145);
    doc.rect(155, finalY + 10, 30, 10, "FD");
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0);
    doc.rect(185, finalY + 10, 11, 10, "FD");
    if (ningunLaboral == true) {
      doc.setFontSize(18);
      doc.text("X", 188, finalY + 17);
    }
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Ninguno", 157, finalY + 16);

    autoTable(doc, {
      theme: "grid",
      startY: finalY + 20,
      head: [headLaboral],
      body: bodyLaboral,
      bodyStyles: { fontSize: 9 },
      willDrawPage: function (data) {
        createHeader();
      },
      didDrawPage: function () {
        createFooter();
      },
      margin: { top: 40 },
    });
    finalY = doc.lastAutoTable.finalY;
    if (finalY >= 265) {
      doc.addPage();
      finalY = 40;
    } else {
      finalY = finalY + 10;
    }

    //-------------------------------------------------------------------------------------------------------------------------------//

    doc.setFillColor(196, 92, 145);
    doc.rect(0, finalY, 210, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(45, finalY - 1, 120, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(196, 92, 145);
    doc.setFont("helvetica", "bold");
    doc.text(
      "ACTIVIDAD DOCENTE, PARTICIPACIONES EN CONFERENCIAS,\nPONENCIAS, SIMILARES",
      105,
      finalY - 1,
      null,
      null,
      "center"
    );
    doc.setDrawColor(0);
    doc.setFillColor(196, 92, 145);
    doc.rect(155, finalY + 10, 30, 10, "FD");
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0);
    doc.rect(185, finalY + 10, 11, 10, "FD");
    if (ningunDocencia == true) {
      doc.setFontSize(18);
      doc.text("X", 188, finalY + 17);
    }
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Ninguno", 157, finalY + 16);

    autoTable(doc, {
      theme: "grid",
      startY: finalY + 20,
      head: [headActividad],
      body: bodyActividad,
      bodyStyles: { fontSize: 9 },
      willDrawPage: function (data) {
        createHeader();
      },
      didDrawPage: function () {
        createFooter();
      },
      margin: { top: 40 },
    });
    finalY = doc.lastAutoTable.finalY;
    if (finalY >= 255) {
      doc.addPage();
      finalY = 40;
    } else {
      finalY = finalY + 10;
    }

    //--------------------------------------------------------------------------------------
    doc.setFillColor(196, 92, 145);
    doc.rect(0, finalY, 210, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(80, finalY - 1, 50, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(196, 92, 145);
    doc.setFont("helvetica", "bold");
    doc.text("PUBLICACIONES", 105, finalY + 1, null, null, "center");
    finalY = finalY + 10;
    if (finalY >= 255) {
      doc.addPage();
      finalY = 40;
    }

    doc.setDrawColor(0);
    doc.setFillColor(196, 92, 145);
    doc.rect(155, finalY + 10, 30, 10, "FD");
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0);
    doc.rect(185, finalY + 10, 11, 10, "FD");
    if (ningunPublicacion == true) {
      doc.setFontSize(18);
      doc.text("X", 188, finalY + 17);
    }
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Ninguno", 157, finalY + 16);
    autoTable(doc, {
      theme: "grid",
      startY: finalY + 20,
      head: [headPublicacion],
      body: bodyPublicacion,
      bodyStyles: { fontSize: 9 },
      willDrawPage: function (data) {
        createHeader();
      },
      didDrawPage: function () {
        createFooter();
      },
      margin: { top: 40 },
    });
    finalY = doc.lastAutoTable.finalY;
    if (finalY >= 255) {
      doc.addPage();
      finalY = 40;
    } else {
      finalY = finalY + 10;
    }
    //------------------------------------------------------------------------------
    doc.setFillColor(196, 92, 145);
    doc.rect(0, finalY, 210, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(40, finalY - 1, 130, 4, "F");
    doc.setFontSize(11);
    doc.setTextColor(196, 92, 145);
    doc.setFont("helvetica", "bold");
    doc.text(
      "PARTICIPACIÓN COMUNITARIA O CIUDADANA, ORGANIZACIONES\nSOCIALES A LAS QUE PERTENEZCA O PERTENECIERA\nY EL CARÁCTER DE PARTICIPACIÓN",
      105,
      finalY - 2,
      null,
      null,
      "center"
    );
    finalY = finalY + 10;
    if (finalY >= 255) {
      doc.addPage();
      finalY = 40;
    }
    doc.setDrawColor(0);
    doc.setFillColor(196, 92, 145);
    doc.rect(155, finalY + 10, 30, 10, "FD");
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0);
    doc.rect(185, finalY + 10, 11, 10, "FD");
    if (ningunParticipacion == true) {
      doc.setFontSize(18);
      doc.text("X", 188, finalY + 17);
    }
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Ninguno", 157, finalY + 16);
    autoTable(doc, {
      theme: "grid",
      startY: finalY + 20,
      head: [headParticipacion],
      body: bodyParticipación,
      bodyStyles: { fontSize: 9 },
      willDrawPage: function (data) {
        createHeader();
      },
      didDrawPage: function () {
        createFooter();
      },
      margin: { top: 40 },
    });
    finalY = doc.lastAutoTable.finalY;
    if (finalY >= 255) {
      doc.addPage();
      finalY = 40;
    } else {
      finalY = finalY + 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(
      "Estado: Nayarit, Municipio: ____________________________________ a ______ de ______________________ del 2023",
      25,
      finalY
    );
    doc.line(25, finalY + 25, 184, finalY + 25);
    doc.setFontSize(9);
    doc.text(
      "Nombre y firma del aspirante a Consejera/o Municipal Electoral.",
      105,
      finalY + 30,
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
      finalY + 23,
      null,
      null,
      "center"
    );
    doc.text(datos.municipio, 90, finalY, null, null, "center");
    doc.text(dia.toString(), 127, finalY, null, null, "center");
    doc.text(mes, 153, finalY, null, null, "center");

    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    doc.save("Formato_SCME-F02.pdf");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};
export default ReporteSCME02;
