// CS6

//include class drawers
#include DrawAll.js

var pluginName = "Eyelets";

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 0;
//debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var gScriptResult;
//
// Hello Word Script
// Remember current unit settings and then set units to
// the value expected by this script
var originalUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.MM;
// Create a new 2x4 inch document and assign it to a variable
var docRef = app.documents.add( 200, 400 );
// Create a new art layer containing text
var artLayerRef = docRef.artLayers.add();

// app.foregroundColor = '000000';

// var eyeDistanceEachOther = prompt("Jaka jest odległość między oczkami w milimetrach?", 12, "Processing "+app.activeDocument.activeLayer.name);
// var eyeDistanceFromEdge = prompt("What is a distance from the edge of a document", 12, "Processing "+app.activeDocument.activeLayer.name);
// var eyeSize = prompt("What is a diameter?", 12, "Processing "+app.activeDocument.activeLayer.name);

var eyeDistanceEachOther = 50;
var eyeSize = 5;

var _w_Amount = Math.round(app.activeDocument.width / eyeDistanceEachOther);
var _h_Amount = Math.round(app.activeDocument.height / eyeDistanceEachOther);

var eyeDistanceFromEdge = 15;
var N_eyeDistanceFromEdge = -15;
var diffW = app.activeDocument.width - eyeDistanceFromEdge - eyeDistanceFromEdge;
var roundedDistanceW = diffW / _w_Amount;
var diffH = app.activeDocument.height - eyeDistanceFromEdge - eyeDistanceFromEdge;
var roundedDistanceH= diffH / _h_Amount;

//create top circles
var CirclesTop = [];
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

//create bottom circles
var CirclesBottom = [];

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

// circle.setColor('FF0000')
// circle.setColor(app.foregroundColor)

//app.project.item(index).layers.addShape

// textItemRef.contents = app.activeDocument.height + app.activeDocument.width;

// Release references
docRef = null;
artLayerRef = null;
textItemRef = null;
// Restore original ruler unit setting
app.preferences.rulerUnits = originalUnit;


// try {
// 	app.activeDocument.layerSets[0].layers[0];
// }
// // In case anything goes wrong.
// catch( e ) {
//     gScriptResult = 'cancel';
// }
