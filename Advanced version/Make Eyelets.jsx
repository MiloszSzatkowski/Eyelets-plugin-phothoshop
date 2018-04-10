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
// alert(parseInt(batchDistance));


var gScriptResult;

var originalUnit = preferences.rulerUnits;
var eyeDistanceEachOther;
preferences.rulerUnits = Units.CM;

// #target estoolkit
var win, windowResource;

windowResource = "dialog {  \
    orientation: 'column', \
    alignChildren: ['fill', 'top'],  \
    preferredSize:[300, 130], \
    text: 'ScriptUI Window - dialog',  \
    margins:15, \
    \
    sliderPanel: Panel { \
        orientation: 'row', \
        alignChildren: 'right', \
        margins:15, \
        text: ' PANEL ', \
        st: StaticText { text: 'Odstęp:' }, \
        sl: Slider { minvalue: 1, maxvalue: 100, value: 30, size:[220,20] }, \
        te: EditText { text: '30', characters: 5, justify: 'left'} \
        } \
    \
    bottomGroup: Group{ \
        up: Checkbox { text:'Oczka z góry', value: true }, \
        down: Checkbox { text:'Oczka z dołu', value: true }, \
        left: Checkbox { text:'Oczka z lewej', value: true }, \
        right: Checkbox { text:'Oczka z prawej', value: true }, \
        alldocuments: Checkbox { text:'Przetwórz otwarte dokumenty', value: false }, \
        cancelButton: Button { text: 'Cancel', properties:{name:'cancel'}, size: [120,24], alignment:['right', 'center'] }, \
        applyButton: Button { text: 'Ok', properties:{name:'ok'}, size: [120,24], alignment:['right', 'center'] }, \
    }\
}";

var up,down,left,right;

win = new Window(windowResource);

win.bottomGroup.cancelButton.onClick = function() {
  win.close();
};
win.bottomGroup.applyButton.onClick = function() {
	eyeDistanceEachOther = win.sliderPanel.te.text  ;
  up = win.bottomGroup.up.value;
  down = win.bottomGroup.down.value;
  left = win.bottomGroup.left.value;
  right = win.bottomGroup.right.value;
  // alert(up.toString() + down.toString() + left.toString() + right.toString())
  win.close();
  if (win.bottomGroup.alldocuments.value==true) {
    for (var i = 0; i < app.documents.length; i++) {
      app.documents[i] = app.activeDocument;
      CreateEyelets(eyeDistanceEachOther, up, down, left, right);
    }
  } else {
    CreateEyelets(eyeDistanceEachOther, up, down, left, right);
  }
};

win.sliderPanel.sl.onChange = function() {
win.sliderPanel.te.text = Math.round(this.value);
};

if (batchDistance!=0) {
  CreateEyelets(batchDistance, true, true, true, true);
} else {
  win.show();
}

var eyeMultiplicator, eyeSize, _w_Amount, _h_Amount, eyeDistanceFromEdge, diffW, roundedDistanceW, diffH, roundedDistanceH, N_eyeDistanceFromEdge;

function CreateEyelets (eyeDistanceEachOther, up, down, left, right){
	//converting dpi in inches to centimeters ratio  - 1 inch = 2.54 centimeters
	eyeMultiplicator =  app.activeDocument.resolution/2.54
	eyeSize = 0.7  * eyeMultiplicator;

	_w_Amount = Math.round(app.activeDocument.width / eyeDistanceEachOther);
	_h_Amount = Math.round(app.activeDocument.height / eyeDistanceEachOther);

	eyeDistanceFromEdge = 1.5;
	N_eyeDistanceFromEdge = -1.5;
	diffW = app.activeDocument.width - eyeDistanceFromEdge - eyeDistanceFromEdge;
	roundedDistanceW = diffW / _w_Amount;
	diffH = app.activeDocument.height - eyeDistanceFromEdge - eyeDistanceFromEdge;
	roundedDistanceH= diffH / _h_Amount;

  makeEyelets (up, down, left, right);

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

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

// Release references
docRef = null;
artLayerRef = null;
textItemRef = null;
