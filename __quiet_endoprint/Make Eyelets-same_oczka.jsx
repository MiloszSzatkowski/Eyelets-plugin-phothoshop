// CS6



//include class drawers
#include DrawAll.js

var pluginName = "Eyelets";

//specify colors
//white
var greyWeldColorObj = new CMYKColor();
  var lol = 20;
  greyWeldColorObj.cyan = lol;  greyWeldColorObj.magenta  = lol;
  greyWeldColorObj.yellow = lol;  greyWeldColorObj.black = lol;
//white
var whiteColorObj = new CMYKColor();
  var am = 0;
  whiteColorObj.cyan = am;  whiteColorObj.magenta  = am;
  whiteColorObj.yellow = am;  whiteColorObj.black = am;
//black
var blackColorObj = new CMYKColor();
  var bm = 100;
  blackColorObj.cyan = bm;  blackColorObj.magenta  = bm;
  blackColorObj.yellow = bm;  blackColorObj.black = bm;
//grey
  var greyColorObj = new CMYKColor();
    var cc = 50;
    greyColorObj.cyan = cc;  greyColorObj.magenta  = cc;
    greyColorObj.yellow = cc;  greyColorObj.black = cc;
//red
  var redColorObj = new CMYKColor();
    redColorObj.cyan = 0;  redColorObj.magenta  = 100;
    redColorObj.yellow = 100;  redColorObj.black = 0;
//green
  var greenColorObj = new CMYKColor();
    greenColorObj.cyan = 100;  greenColorObj.magenta  = 0;
    greenColorObj.yellow = 100;  greenColorObj.black = 0;
//blue
  var blueColorObj = new CMYKColor();
    blueColorObj.cyan = 100;  blueColorObj.magenta  = 0;
    blueColorObj.yellow = 0;  blueColorObj.black = 0;

    var allColors = [blackColorObj, whiteColorObj , greyColorObj , redColorObj , greenColorObj , blueColorObj ];
//specify colors

app.foregroundColor.cmyk = blackColorObj;

endoEyelets();

function endoEyelets() {
  // if (whiteWeld.value===true) {
  //   frame();
  //   app.backgroundColor.cmyk =  whiteColorObj;
  //   app.activeDocument.resizeCanvas(app.activeDocument.width.value+6, app.activeDocument.height.value, AnchorPosition.MIDDLECENTER);
  //   frame();
  // } else if (greyWeld.value===true) {
  //   app.backgroundColor.cmyk =  greyWeldColorObj;
  //   app.activeDocument.resizeCanvas(app.activeDocument.width.value+6, app.activeDocument.height.value, AnchorPosition.MIDDLECENTER);
  //   app.backgroundColor.cmyk =  whiteColorObj;
  // }

  var eyes = [];

  //converting dpi in inches to centimeters ratio  - 1 inch = 2.54 centimeters
  eyeMultiplicator =  app.activeDocument.resolution/2.54 ;
  eyeSize = 0.7  * eyeMultiplicator;

  //left
  eyes[1] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[1].translate(1.5,1.5);

  eyes[2] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[2].translate(1.5, (50 + 1.5) );

  eyes[3] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[3].translate(1.5, (50 + 125 + 1.5) );

  eyes[4] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[4].translate(1.5, (50 + 125 + 125 + 1.5) );

  eyes[5] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[5].translate(1.5, (50 + 125 + 125 + 125 + 1.5) );

  eyes[6] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[6].translate( 1.5, (app.activeDocument.height.value - 1.5) );

  //right
  eyes[7] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[7].translate( (app.activeDocument.width.value-1.5),1.5);

  eyes[8] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[8].translate( (app.activeDocument.width.value-1.5), (50 + 1.5) );

  eyes[9] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[9].translate( (app.activeDocument.width.value-1.5), (50 + 125 + 1.5) );

  eyes[10] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[10].translate( (app.activeDocument.width.value-1.5), (50 + 125 + 125 + 1.5) );

  eyes[11] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[11].translate( (app.activeDocument.width.value-1.5), (50 + 125 + 125 + 125 + 1.5) );

  eyes[12] = new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize);
  eyes[12].translate( (app.activeDocument.width.value-1.5), (app.activeDocument.height.value - 1.5) );

    topEndoprint();
}

function frame () {
  app.backgroundColor.cmyk =  blackColorObj;

    app.activeDocument.resizeCanvas(
      (app.activeDocument.width.value + 0.2),
      (app.activeDocument.height.value + 0.2),
      AnchorPosition.MIDDLECENTER);

  app.backgroundColor.cmyk =  whiteColorObj;
}

function topEndoprint() {
  firstDoc = app.activeDocument;
  new_layer_from_file = open(new File((new File($.fileName)).parent +"/topEndoprint.png"));
  new_layer_from_file.resizeImage(  null,  null,  firstDoc.resolution,  ResampleMethod.BICUBIC );
  new_layer_from_file.selection.selectAll();
  new_layer_from_file.selection.copy();
  new_layer_from_file.close(SaveOptions.DONOTSAVECHANGES);
  firstDoc.paste();

  app.preferences.rulerUnits = Units.CM;
  oCM = app.activeDocument.width.value;
  app.preferences.rulerUnits = Units.PIXELS;
  oPX = app.activeDocument.width.value;
  factor = oPX/oCM;
  app.preferences.rulerUnits = Units.CM;
  oCM = app.activeDocument.width.value;
  moveY = 25 * factor;
  // =======================================================
  // =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc819 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref569 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref569.putProperty( idChnl, idfsel );
    desc819.putReference( idnull, ref569 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idAl = charIDToTypeID( "Al  " );
    desc819.putEnumerated( idT, idOrdn, idAl );
executeAction( idsetd, desc819, DialogModes.NO );

// =======================================================
var idAlgn = charIDToTypeID( "Algn" );
    var desc820 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref570 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref570.putEnumerated( idLyr, idOrdn, idTrgt );
    desc820.putReference( idnull, ref570 );
    var idUsng = charIDToTypeID( "Usng" );
    var idADSt = charIDToTypeID( "ADSt" );
    var idAdLf = charIDToTypeID( "AdLf" );
    desc820.putEnumerated( idUsng, idADSt, idAdLf );
executeAction( idAlgn, desc820, DialogModes.NO );

// =======================================================
var idAlgn = charIDToTypeID( "Algn" );
    var desc821 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref571 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref571.putEnumerated( idLyr, idOrdn, idTrgt );
    desc821.putReference( idnull, ref571 );
    var idUsng = charIDToTypeID( "Usng" );
    var idADSt = charIDToTypeID( "ADSt" );
    var idAdTp = charIDToTypeID( "AdTp" );
    desc821.putEnumerated( idUsng, idADSt, idAdTp );
executeAction( idAlgn, desc821, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc822 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref572 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref572.putProperty( idChnl, idfsel );
    desc822.putReference( idnull, ref572 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idNone = charIDToTypeID( "None" );
    desc822.putEnumerated( idT, idOrdn, idNone );
executeAction( idsetd, desc822, DialogModes.NO );

// =======================================================
var idTrnf = charIDToTypeID( "Trnf" );
    var desc823 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref573 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref573.putEnumerated( idLyr, idOrdn, idTrgt );
    desc823.putReference( idnull, ref573 );
    var idFTcs = charIDToTypeID( "FTcs" );
    var idQCSt = charIDToTypeID( "QCSt" );
    var idQcsa = charIDToTypeID( "Qcsa" );
    desc823.putEnumerated( idFTcs, idQCSt, idQcsa );
    var idOfst = charIDToTypeID( "Ofst" );
        var desc824 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc824.putUnitDouble( idHrzn, idRlt, 0.000000 );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc824.putUnitDouble( idVrtc, idRlt, moveY );
    var idOfst = charIDToTypeID( "Ofst" );
    desc823.putObject( idOfst, idOfst, desc824 );
    var idIntr = charIDToTypeID( "Intr" );
    var idIntp = charIDToTypeID( "Intp" );
    var idbicubicSmoother = stringIDToTypeID( "bicubicSmoother" );
    desc823.putEnumerated( idIntr, idIntp, idbicubicSmoother );
executeAction( idTrnf, desc823, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc825 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref574 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref574.putProperty( idChnl, idfsel );
    desc825.putReference( idnull, ref574 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idAl = charIDToTypeID( "Al  " );
    desc825.putEnumerated( idT, idOrdn, idAl );
executeAction( idsetd, desc825, DialogModes.NO );

// =======================================================
var idCpTL = charIDToTypeID( "CpTL" );
executeAction( idCpTL, undefined, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc826 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref575 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref575.putProperty( idChnl, idfsel );
    desc826.putReference( idnull, ref575 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idAl = charIDToTypeID( "Al  " );
    desc826.putEnumerated( idT, idOrdn, idAl );
executeAction( idsetd, desc826, DialogModes.NO );

// =======================================================
var idAlgn = charIDToTypeID( "Algn" );
    var desc827 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref576 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref576.putEnumerated( idLyr, idOrdn, idTrgt );
    desc827.putReference( idnull, ref576 );
    var idUsng = charIDToTypeID( "Usng" );
    var idADSt = charIDToTypeID( "ADSt" );
    var idAdRg = charIDToTypeID( "AdRg" );
    desc827.putEnumerated( idUsng, idADSt, idAdRg );
executeAction( idAlgn, desc827, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc828 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref577 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref577.putProperty( idChnl, idfsel );
    desc828.putReference( idnull, ref577 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idNone = charIDToTypeID( "None" );
    desc828.putEnumerated( idT, idOrdn, idNone );
executeAction( idsetd, desc828, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc829 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref578 = new ActionReference();
        var idzoomTool = stringIDToTypeID( "zoomTool" );
        ref578.putClass( idzoomTool );
    desc829.putReference( idnull, ref578 );
    var iddontRecord = stringIDToTypeID( "dontRecord" );
    desc829.putBoolean( iddontRecord, true );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc829.putBoolean( idforceNotify, true );
executeAction( idslct, desc829, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc830 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref579 = new ActionReference();
        var idmoveTool = stringIDToTypeID( "moveTool" );
        ref579.putClass( idmoveTool );
    desc830.putReference( idnull, ref579 );
    var iddontRecord = stringIDToTypeID( "dontRecord" );
    desc830.putBoolean( iddontRecord, true );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc830.putBoolean( idforceNotify, true );
executeAction( idslct, desc830, DialogModes.NO );



}

// Release references
docRef = null;
artLayerRef = null;
textItemRef = null;
