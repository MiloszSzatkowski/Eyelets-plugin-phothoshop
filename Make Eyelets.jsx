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
        te: EditText { text: '30', characters: 5, justify: 'left'}, \
        sizeT: StaticText { text: 'Wielkosc | Size:' }, \
        sizeTedit: EditText { text: '0.7', characters: 5, justify: 'left'} \
        distanceT: StaticText { text: 'Margines | Margin:' }, \
        distanceTedit: EditText { text: '1.5', characters: 5, justify: 'left'}, \
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

//zgrzew
win.sliderPanel.add ("statictext", undefined, 'zgrzew bialy | white weld');
var weldGlobalWhite = win.sliderPanel.add ("edittext", undefined, 0);
win.sliderPanel.add ("statictext", undefined, 'zgrzew szary | grey weld');
var weldGlobalGrey = win.sliderPanel.add ("edittext", undefined, 0);

var onSidesOnly = win.sliderPanel.add ("checkbox", undefined, 'Zgrzew tylko na bokach | Weld on sides only');

var signTopDesc = win.sliderPanel.add('statictext', undefined, 'Dodaj napis na gorze | Add text on the top');
var signTop = win.sliderPanel.add ("edittext", undefined, 0);

var signBottomDesc = win.sliderPanel.add('statictext', undefined, 'Dodaj napis na dole | Add text on the bottom');
var signBottom = win.sliderPanel.add ("edittext", undefined, 0);

var top_sides_Desc = win.sliderPanel.add('checkbox', undefined, 'Dodaj napis \'top\' po bokach | Add \'top\' sign on sides');

var addNameOfGraphic = win.sliderPanel.add ("checkbox", undefined, 'Dodaj nazwe pliku na brzegach | Add graphic\'s name on sides ');

var flatten_ = win.sliderPanel.add ("checkbox", undefined, 'Slaszcz obraz | Flatten image '); flatten_.value = true;

var skipEyelets = win.sliderPanel.add ("checkbox", undefined, 'Pomin oczka | Skip eyelets ');

////////////////////////////////////////// WELD *****************************

function weld() {
      // alert( weldGlobalWhiteVal + weldGlobalGreyVal );
      //zgrzew | weld
      //weld on sides
      if (onSidesOnly.value===true && weldGlobalWhiteVal !== 0 && weldGlobalWhiteVal > 0.1) {
        frame();
        app.backgroundColor.cmyk =  whiteColorObj;
        app.activeDocument.resizeCanvas(app.activeDocument.width.value + (weldGlobalWhiteVal * 2),   app.activeDocument.height.value, AnchorPosition.MIDDLECENTER);
        frame();
      } else if (onSidesOnly.value===true && weldGlobalGreyVal !== 0 && weldGlobalGreyVal > 0.1) {
        app.backgroundColor.cmyk =  greyWeldColorObj;
        app.activeDocument.resizeCanvas(app.activeDocument.width.value + (weldGlobalGreyVal * 2),   app.activeDocument.height.value, AnchorPosition.MIDDLECENTER);
        app.backgroundColor.cmyk =  whiteColorObj;
        frame();
        //weld around graphic
      } else if (weldGlobalWhiteVal !== 0 && weldGlobalWhiteVal > 0.1) {
        frame();
        app.backgroundColor.cmyk =  whiteColorObj;
        app.activeDocument.resizeCanvas(app.activeDocument.width.value + (weldGlobalWhiteVal * 2), app.activeDocument.height.value + (weldGlobalWhiteVal * 2), AnchorPosition.MIDDLECENTER);
        frame();
      } else if (weldGlobalGreyVal !== 0 && weldGlobalGreyVal > 0.1){
        app.backgroundColor.cmyk =  greyWeldColorObj;
        app.activeDocument.resizeCanvas(app.activeDocument.width.value + (weldGlobalGreyVal * 2),  app.activeDocument.height.value + (weldGlobalGreyVal * 2), AnchorPosition.MIDDLECENTER);
        app.backgroundColor.cmyk =  whiteColorObj;
        frame();
      }

}
//zgrzew

var weldGlobalWhiteVal, weldGlobalGreyVal;
weldGlobalWhiteVal = 0;
weldGlobalGreyVal = 0;

////////////////////////////////////////// WELD *****************************

function graphicName ()  {
  if (addNameOfGraphic.value === true || signBottom.text != 0 || signTop.text != 0){
    //
    var size = 1;
    var xPos = 10;
    var margin_ = 0.4;

    //how bounds work
    // var LB = activeDocument.activeLayer.bounds;
    //   var LWidth = (LB[2].value) - (LB[0].value);
    //   var LHeight = (LB[3].value) - (LB[1].value);

    //top *******************************
    var topLayer = app.activeDocument.artLayers.add();
    topLayer.kind = LayerKind.TEXT;
    topLayer.textItem.color.cmyk = redColorObj;

      if (signTop.text == 0 && (addNameOfGraphic.value === false) ) {
        topLayer.textItem.contents = '_';
        topLayer.textItem.color.cmyk = whiteColorObj;
      } else if (signTop.text != 0) {
        topLayer.textItem.contents = signTop.text;
      } else if (addNameOfGraphic.value === true)  {
        topLayer.textItem.contents = app.activeDocument.name;
      }

    topLayer.textItem.size= (size + ' cm');

    MoveLayerToAbsolute (topLayer  , xPos,
    0 + margin_);

    if (app.activeDocument.width.value > 100) {
      var topCopy = topLayer.duplicate();
      MoveLayerToAbsolute (topCopy  , (app.activeDocument.width.value - xPos - (topCopy.bounds[2].value - topCopy.bounds[0].value)) ,
      0 + margin_);
    }

    //*******************************

    //bottom *******************************
    var bottomLayer = app.activeDocument.artLayers.add();
    bottomLayer.kind = LayerKind.TEXT;
    bottomLayer.textItem.color.cmyk = redColorObj;

      if (signBottom.text == 0 && (addNameOfGraphic.value === false) )  {
        bottomLayer.textItem.contents = '_';
        bottomLayer.textItem.color.cmyk = whiteColorObj;
      } else if (signBottom.text != 0) {
        bottomLayer.textItem.contents = signBottom.text;
      } else if (addNameOfGraphic.value === true) {
        bottomLayer.textItem.contents = app.activeDocument.name;
      }

    bottomLayer.textItem.size= (size + ' cm');

    MoveLayerToAbsolute (bottomLayer, xPos,
    (app.activeDocument.height.value - size - margin_)) ;

    if (app.activeDocument.width.value > 100) {
      var botCopy = bottomLayer.duplicate();
      MoveLayerToAbsolute (botCopy, (app.activeDocument.width.value - xPos - (botCopy.bounds[2].value - botCopy.bounds[0].value)) ,
      (app.activeDocument.height.value - size - margin_));
    }
    //*******************************

  }

  //add top on sides
  if (top_sides_Desc.value) {

    var size = 1;
    var topOffset = 13;

    var toppL = app.activeDocument.artLayers.add();
    toppL.kind = LayerKind.TEXT;
    toppL.textItem.color.cmyk = blackColorObj;
    toppL.textItem.contents = 'TOP';
    toppL.textItem.size= (size + ' cm');

    MoveLayerToAbsolute (toppL, size, topOffset) ;
    var topCopy = toppL.duplicate();
    MoveLayerToAbsolute (topCopy, (app.activeDocument.width.value - size - (topCopy.bounds[2].value - topCopy.bounds[0].value)), topOffset);
  }

}

function MoveLayerToAbsolute (fLayer,fX,fY) {
  var Position = fLayer.bounds;
  Position[0] = fX - Position[0];
  Position[1] = fY - Position[1];

  fLayer.translate(-Position[0],-Position[1]);
}

function startApp() {

	eyeDistanceEachOther = win.sliderPanel.te.text  ;
  eyeSizeT =  win.sliderPanel.sizeTedit.text ;
  eyeDistanceFromEdgeT = win.sliderPanel.distanceTedit.text ;

  up = win.bottomGroup.up.value;
  down = win.bottomGroup.down.value;
  left = win.bottomGroup.left.value;
  right = win.bottomGroup.right.value;

  weldGlobalWhiteVal = parseFloat(weldGlobalWhite.text);
  weldGlobalGreyVal = parseFloat(weldGlobalGrey.text);

  if (win.bottomGroup.alldocuments.value==true) {
      loop();
  } else {
    CreateEyelets(eyeDistanceEachOther, up, down, left, right, eyeDistanceFromEdgeT, eyeSizeT);
  }

  win.close();
};


function loop() {
  loop = true;
  for (var i = 0; i < app.documents.length; i++) {
    app.activeDocument = app.documents[i];
    CreateEyelets(eyeDistanceEachOther, up, down, left, right, eyeDistanceFromEdgeT, eyeSizeT);
  }
}

//color button
var colorButton;

  win.bottomGroup.add('statictext',undefined,'Kolor oczek | Eyelets color:');
  var myDropdown = win.bottomGroup.add ("dropdownlist", undefined, ['czarny | black','bialy | white','szary | grey','czerwony | red','zielony | green','cyan']);
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

win.bottomGroup.add ("statictext",undefined,'Szablony | Presets:');
var button25 = win.bottomGroup.add ("button",undefined, 'standard - 25');
var button30 = win.bottomGroup.add ("button",undefined, 'standard - 30');
var button50 = win.bottomGroup.add ("button",undefined, 'standard - 50');
var corners_ = win.bottomGroup.add ("button",undefined, 'Only in the corners / Tylko w naroznikach');
var corners_weld = win.bottomGroup.add ("button",undefined, 'Only in the corners + weld / Tylko w naroznikach + zgrzew');
var endoprint = win.bottomGroup.add ("button",undefined,'Zastosuj szablon oczek "Endoprint - Megabanner Bilka"');

//bottom group amount - win.bottomGroup.add
var info_desc = win.bottomGroup.add('statictext', undefined, 'Ilosci oczek - lista | Amount of eyelets - list')
var info_ = win.bottomGroup.add ("treeview", undefined, []);

//  INFORMATION DROPDOWN
function inform()  {

  // debug -
  try {
    info_.removeAll();
  } catch (err) {
    alert(err);
  }

  var originActiveDoc = app.activeDocument;

  var VAL = parseFloat(win.sliderPanel.te.text)

  _accum = [];

  for (var i = 0; i < app.documents.length; i++) {

    app.activeDocument = app.documents[i];
    var ww = app.activeDocument.width.value / VAL;
    var hh = app.activeDocument.height.value / VAL;
    if (ww < 2) { ww = 2; }
    if (hh < 2) { hh = 2; }
    info_.add ( 'item', (app.activeDocument.name + ' Pion|Vert:' + Math.round(ww) + ' Poz.|Hor.:' + Math.round(hh)) );
  }

  app.activeDocument = originActiveDoc;
}

win.sliderPanel.te.onChange = function () {  inform(); }
try {  inform(); } catch (err) {  alert(err + '\n Czy otwarles dokument | Have you opened your file?')  }

button25.onClick = function () {
 win.sliderPanel.te.text  = 25;
 win.sliderPanel.sizeTedit.text = 0.7;
 win.sliderPanel.distanceTedit.text = 1.5;
 // standard weld - 3cm
 weldGlobalWhite.text = 3;
 startApp();
}

button30.onClick = function () {
 win.sliderPanel.te.text  = 30;
 win.sliderPanel.sizeTedit.text = 0.7;
 win.sliderPanel.distanceTedit.text = 1.5;
 // standard weld - 3cm
 weldGlobalWhite.text = 3;
 startApp();
}

button50.onClick = function () {
 win.sliderPanel.te.text  = 50;
 win.sliderPanel.sizeTedit.text = 0.7;
 win.sliderPanel.distanceTedit.text = 1.5;
 // standard weld - 3cm
 weldGlobalWhite.text = 3;
 startApp();
}

corners_.onClick = function () {
  win.sliderPanel.te.text  = app.activeDocument.width.value;
  win.bottomGroup.left.value = false;
  win.bottomGroup.right.value = false;
  startApp();
}

corners_weld.onClick = function () {
  win.sliderPanel.te.text  = app.activeDocument.width.value;
  win.bottomGroup.left.value = false;
  win.bottomGroup.right.value = false;
  // standard weld - 3cm
  weldGlobalWhite.text = 3;
  startApp();
}

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

//szablony

if (batchDistance!=0) {
  app.foregroundColor.cmyk = originalColor;
  CreateEyelets(batchDistance, true, true, true, true);
} else {
  win.show();
}

var eyeMultiplicator, eyeSize, _w_Amount, _h_Amount, eyeDistanceFromEdge, diffW, roundedDistanceW, diffH, roundedDistanceH, N_eyeDistanceFromEdge;

function CreateEyelets (eyeDistanceEachOther, up, down, left, right, eyeDistanceFromEdgeT, eyeSizeT){
  if (batchDistance!==0 && batchDistance != null) {
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

    weld();
    graphicName();

    //parsing passed values
    eyeSizeT = parseFloat(eyeSizeT);
    eyeDistanceFromEdgeT = parseFloat(eyeDistanceFromEdgeT);

    // converting dpi in inches to centimeters ratio  - 1 inch = 2.54 centimeters
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

    if (!skipEyelets.value) {
      makeEyelets (up, down, left, right);
    }

    if(flatten_.value){
      app.activeDocument.flatten();
    }

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

// Release references
docRef = null;
artLayerRef = null;
textItemRef = null;
