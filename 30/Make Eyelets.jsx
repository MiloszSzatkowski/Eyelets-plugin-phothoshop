// CS6

//include class drawers
#include DrawAll.js

var pluginName = "Eyelets";

// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 0;
//debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
// $.localize = true;

//open file with amount for batch proccesing
var b = new File((new File($.fileName)).parent + "/Amount/Amount.txt");

b.open('r');
var batchDistance = "";
while(!b.eof)
batchDistance += b.readln();
b.close();
batchDistance = parseFloat(batchDistance);

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

var gScriptResult;

var originalUnit = preferences.rulerUnits;
var eyeDistanceEachOther;
preferences.rulerUnits = Units.CM;
var originalColor = app.foregroundColor.cmyk;

// #target estoolkit
var win, windowResource;

windowResource = "dialog {  \
    orientation: 'row', \
    alignChildren: ['fill', 'top'],  \
    preferredSize:[300, 130], \
    text: 'Oczkowanie - skrypt | Eyelets - script',  \
    margins:15, \
    \
    sliderPanel: Group { \
        orientation: 'column', \
        alignChildren: 'fill', \
        st: StaticText { text: 'Odstep | Distance:' }, \
        te: EditText { text: '30', characters: 5, justify: 'left'} \
        sizeT: StaticText { text: 'Wielkosc | Size:' }, \
        sizeTedit: EditText { text: '0.7', characters: 5, justify: 'left'} \
        distanceT: StaticText { text: 'Margines | Margin:' }, \
        distanceTedit: EditText { text: '1.5', characters: 5, justify: 'left'} \
        } \
    \
    bottomGroup: Group{ \
        orientation: 'column',\
        alignChildren: 'fill', \
        up: Checkbox { text:'Oczka z gory | Top eyelets', value: true }, \
        down: Checkbox { text:'Oczka z dolu | Down eyelets', value: true }, \
        left: Checkbox { text:'Oczka z lewej | Left eyelets', value: true }, \
        right: Checkbox { text:'Oczka z prawej | Right eyelets', value: true }, \
        alldocuments: Checkbox { text:'Przetworz otwarte dokumenty | Process open documents', value: false }, \
    }\
    rightGroup: Group{ \
      orientation: 'column',\
      alignChildren: 'fill', \
    }\
    closeGroup: Group{ \
      orientation: 'column',\
      alignChildren: 'fill', \
      cancelButton: Button { text: 'Cancel', properties:{name:'cancel'}, size: [120,24], alignment:['right', 'center'] }, \
      applyButton: Button { text: 'Ok', properties:{name:'ok'}, size: [120,24], alignment:['right', 'center'] }, \
    }\
}";

var up,down,left,right,eyeDistanceFromEdgeT,eyeSizeT;

win = new Window(windowResource);

win.closeGroup.cancelButton.onClick = function() {
  win.close();
};

win.closeGroup.applyButton.onClick = startApp;

function startApp() {
  win.close();

	eyeDistanceEachOther = win.sliderPanel.te.text  ;
  eyeSizeT =  win.sliderPanel.sizeTedit.text ;
  eyeDistanceFromEdgeT = win.sliderPanel.distanceTedit.text ;

  up = win.bottomGroup.up.value;
  down = win.bottomGroup.down.value;
  left = win.bottomGroup.left.value;
  right = win.bottomGroup.right.value;
  if (win.bottomGroup.alldocuments.value==true) {
      loop();
  } else {
    CreateEyelets(eyeDistanceEachOther, up, down, left, right, eyeDistanceFromEdgeT, eyeSizeT);
  }
};

function loop() {
  for (var i = 0; i < app.documents.length; i++) {
    app.activeDocument = app.documents[i];
    CreateEyelets(eyeDistanceEachOther, up, down, left, right, eyeDistanceFromEdgeT, eyeSizeT);
  }
}

//zgrzew
win.sliderPanel.add ("statictext", undefined, 'zgrzew bialy | white weld');
var weldGlobalWhite = win.sliderPanel.add ("edittext", undefined, '0');
win.sliderPanel.add ("statictext", undefined, 'zgrzew szary | grey weld');
var weldGlobalGrey = win.sliderPanel.add ("edittext", undefined, '0');

//color button
var colorButton;

  win.rightGroup.add('statictext',undefined,'Kolor oczek | Eyelets color:');
  var myDropdown = win.rightGroup.add ("dropdownlist", undefined, ['czarny | black','bialy | white','szary | grey','czerwony | red','zielony | green','cyan']);
  myDropdown.items[0].image = ScriptUI.newImage (File(new File((new File($.fileName)).parent +"/01 black.png")));
  myDropdown.items[1].image = ScriptUI.newImage (File(new File((new File($.fileName)).parent +"/02 white.png")));
  myDropdown.items[2].image = ScriptUI.newImage (File(new File((new File($.fileName)).parent +"/03 grey.png")));
  myDropdown.items[3].image = ScriptUI.newImage (File(new File((new File($.fileName)).parent +"/04 red.png")));
  myDropdown.items[4].image = ScriptUI.newImage (File(new File((new File($.fileName)).parent +"/05 green.png")));
  myDropdown.items[5].image = ScriptUI.newImage (File(new File((new File($.fileName)).parent +"/06 cyan.png")));

myDropdown.onChange = function () {
app.foregroundColor.cmyk = allColors[myDropdown.selection.index];
}

myDropdown.selection = 0;
//color button

//szablony
var presetsGroup = win.rightGroup.add('group {orientation: "column", alignChildren: ["fill","fill"]} ');
presetsGroup.add ("statictext",undefined,'Szablony | Presets:');
var endoprint = presetsGroup.add ("button",undefined,'Zastosuj szablon oczek "Endoprint - Megabanner Bilka"');
var whiteWeld = presetsGroup.add ("checkbox", undefined, 'Endoprint - zgrzew bialy | white weld');
var greyWeld = presetsGroup.add ("checkbox", undefined, 'Endoprint - zgrzew szary | grey weld');
var napisTop = presetsGroup.add ("checkbox", undefined, 'Dodaj napis "top" | Add "top signature"');

var standardPresets = presetsGroup.add('group {orientation: "row", alignChildren: ["fill","fill"]} ');
var button25 = standardPresets.add ("button",undefined, 'standard - 25');
var button30 = standardPresets.add ("button",undefined, 'standard - 30');
var button50 = standardPresets.add ("button",undefined, 'standard - 50');

function loopEndoprint() {
  for (var i = 0; i < app.documents.length; i++) {
    app.activeDocument = app.documents[i];
    endoEyelets();
  }
}

endoprint.onClick = function () {
  win.close();
  if (win.bottomGroup.alldocuments.value==true) {
      loopEndoprint();
  } else {
      endoEyelets();
  }
}

function endoEyelets() {
  if (whiteWeld.value===true) {
    frame();
    app.backgroundColor.cmyk =  whiteColorObj;
    app.activeDocument.resizeCanvas(app.activeDocument.width.value+6, app.activeDocument.height.value, AnchorPosition.MIDDLECENTER);
    frame();
  } else if (greyWeld.value===true) {
    app.backgroundColor.cmyk =  greyWeldColorObj;
    app.activeDocument.resizeCanvas(app.activeDocument.width.value+6, app.activeDocument.height.value, AnchorPosition.MIDDLECENTER);
    app.backgroundColor.cmyk =  whiteColorObj;
  }

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

  if (napisTop.value) {
    topEndoprint();
  }
}

function frame () {
  app.backgroundColor.cmyk =  blackColorObj;

    app.activeDocument.resizeCanvas(
      (app.activeDocument.width.value + 0.2),
      (app.activeDocument.height.value + 0.2),
      AnchorPosition.MIDDLECENTER);

  app.backgroundColor.cmyk =  whiteColorObj;
}

button25.onClick = function () {
 win.sliderPanel.te.text  = 25;
 win.sliderPanel.sizeTedit.text = 0.7;
 win.sliderPanel.distanceTedit.text = 1.5;
 startApp();
}

button30.onClick = function () {
 win.sliderPanel.te.text  = 30;
 win.sliderPanel.sizeTedit.text = 0.7;
 win.sliderPanel.distanceTedit.text = 1.5;
 startApp();
}

button50.onClick = function () {
 win.sliderPanel.te.text  = 50;
 win.sliderPanel.sizeTedit.text = 0.7;
 win.sliderPanel.distanceTedit.text = 1.5;
 startApp();
}
//szablony

if (batchDistance!=0) {
  app.foregroundColor.cmyk = originalColor;
  CreateEyelets(batchDistance, true, true, true, true);
} else {
  win.show();
}

var eyeMultiplicator, eyeSize, _w_Amount, _h_Amount, eyeDistanceFromEdge, diffW, roundedDistanceW, diffH, roundedDistanceH, N_eyeDistanceFromEdge;

function CreateEyelets (eyeDistanceEachOther, up, down, left, right, eyeDistanceFromEdgeT, eyeSizeT){
  if (batchDistance!==0) {
	//converting dpi in inches to centimeters ratio  - 1 inch = 2.54 centimeters
	eyeMultiplicator =  app.activeDocument.resolution/2.54 ;
	eyeSize = 0.7  * eyeMultiplicator;

	_w_Amount = Math.round(app.activeDocument.width / eyeDistanceEachOther);
	_h_Amount = Math.round(app.activeDocument.height / eyeDistanceEachOther);

	eyeDistanceFromEdge = 1.5;
	diffW = app.activeDocument.width - eyeDistanceFromEdge - eyeDistanceFromEdge;
	roundedDistanceW = diffW / _w_Amount;
	diffH = app.activeDocument.height - eyeDistanceFromEdge - eyeDistanceFromEdge;
	roundedDistanceH= diffH / _h_Amount;

  makeEyelets (up, down, left, right);
  } else {

    //parsing passed values
    eyeSizeT = parseFloat(eyeSizeT);
    eyeDistanceFromEdgeT = parseFloat(eyeDistanceFromEdgeT);
    weldGlobalWhite = parseFloat(weldGlobalWhite.text);
    weldGlobalGrey = parseFloat(weldGlobalGrey.text);

    // alert( weldGlobalWhite + weldGlobalGrey )

    //zgrzew | weld
    if (weldGlobalWhite !== 0) {
      frame();
      app.backgroundColor.cmyk =  whiteColorObj;
      app.activeDocument.resizeCanvas(app.activeDocument.width.value + (weldGlobalWhite * 2), app.activeDocument.height.value + (weldGlobalWhite * 2), AnchorPosition.MIDDLECENTER);
      frame();
    } else if (weldGlobalGrey !== 0){
      app.backgroundColor.cmyk =  greyWeldColorObj;
      app.activeDocument.resizeCanvas(app.activeDocument.width.value + (weldGlobalGrey * 2), app.activeDocument.height.value + (weldGlobalGrey * 2), AnchorPosition.MIDDLECENTER);
      app.backgroundColor.cmyk =  whiteColorObj;
    }

    //converting dpi in inches to centimeters ratio  - 1 inch = 2.54 centimeters
  	eyeMultiplicator =  app.activeDocument.resolution/2.54 ;
  	eyeSize = eyeSizeT * eyeMultiplicator;

  	_w_Amount = Math.round(app.activeDocument.width / eyeDistanceEachOther);
  	_h_Amount = Math.round(app.activeDocument.height / eyeDistanceEachOther);

  	eyeDistanceFromEdge = eyeDistanceFromEdgeT;

  	roundedDistanceW = diffW / _w_Amount;
    diffW = app.activeDocument.width - eyeDistanceFromEdge - eyeDistanceFromEdge;
  	roundedDistanceW = diffW / _w_Amount;
  	diffH = app.activeDocument.height - eyeDistanceFromEdge - eyeDistanceFromEdge;
  	roundedDistanceH= diffH / _h_Amount;

    makeEyelets (up, down, left, right);

  }
}

function makeEyelets (up, down, left, right) {

  var CirclesTop = [];
  var CirclesBottom = [];
  var CirclesLeft= [];
  var CirclesRight = [];

  if (up==true) {
    //create top circles
    for (var i = 0; i < _w_Amount+1; i++){
      CirclesTop.push(new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize));
    }

    CirclesTop[0].translate(eyeDistanceFromEdge, eyeDistanceFromEdge);

    for (i = 1; i < CirclesTop.length; i++) {
      if (i==1) {
        CirclesTop[i].translate(eyeDistanceFromEdge, eyeDistanceFromEdge);
        CirclesTop[i].translate(roundedDistanceW, 0);

      } else {
        CirclesTop[i].translate(eyeDistanceFromEdge, eyeDistanceFromEdge);
        CirclesTop[i].translate(roundedDistanceW*i, 0);
      }
    }
  }

  if (down==true) {
    //create bottom circles

    for (var i = 0; i < _w_Amount+1; i++){
      CirclesBottom.push(new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize));
    }

    CirclesBottom[0].translate(eyeDistanceFromEdge, app.activeDocument.height-eyeDistanceFromEdge);

    for (i = 1; i < CirclesBottom.length; i++) {
      if (i==1) {
        CirclesBottom[i].translate(eyeDistanceFromEdge, app.activeDocument.height-eyeDistanceFromEdge);
        CirclesBottom[i].translate(roundedDistanceW, 0);

      } else {
        CirclesBottom[i].translate(eyeDistanceFromEdge, app.activeDocument.height-eyeDistanceFromEdge);
        CirclesBottom[i].translate(roundedDistanceW*i, 0);
      }
    }
  }

  if (left==true) {
    //create left circles

    for (var i = 0; i < _h_Amount+1; i++){
      CirclesLeft.push(new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize));
    }

    CirclesLeft[0].translate(eyeDistanceFromEdge, eyeDistanceFromEdge);

    for (i = 1; i < CirclesLeft.length; i++) {
      if (i==1) {
        CirclesLeft[i].translate(eyeDistanceFromEdge, eyeDistanceFromEdge);
        CirclesLeft[i].translate(0,roundedDistanceH);

      } else {
        CirclesLeft[i].translate(eyeDistanceFromEdge, eyeDistanceFromEdge);
        CirclesLeft[i].translate(0,roundedDistanceH*i);
      }
    }
  }

  if (right==true){
    //create right circles

    for (var i = 0; i < _h_Amount+1; i++){
      CirclesRight.push(new Ellipse(0-eyeSize/2, 0-eyeSize/2, eyeSize, eyeSize));
    }

    CirclesRight[0].translate(app.activeDocument.width-eyeDistanceFromEdge, eyeDistanceFromEdge);

    for (i = 1; i < CirclesRight.length; i++) {
      if (i==1) {
        CirclesRight[i].translate(app.activeDocument.width-eyeDistanceFromEdge, eyeDistanceFromEdge);
        CirclesRight[i].translate(0,roundedDistanceH);

      } else {
        CirclesRight[i].translate(app.activeDocument.width-eyeDistanceFromEdge, eyeDistanceFromEdge);
        CirclesRight[i].translate(0,roundedDistanceH*i);
      }
    }
  }

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
