console.log("evaluate.js has been loaded");

// Data fields
var cuffLength = 0;
var cuffStyle = "";
var ankleLength = 0;
var largeHeel = false;
var footLength = 0;

var cylinderSize = 0;
var targetNeedles = 0;
var stretchyYarn = false;

var stitchPerInch = 0;
var rowPerInch = 0;

// Calculated Fields
var cuffShape = null;
var ankleShape = null;
var heelShape = null;
var instepShape = null;
var toeShape = null;


$(function () {
    //Listen for button click
    $('#btn-generate').on('click', function () {

        //Reset hidden alerts from previous submission
        $('#anatomy').addClass('d-none');
        $('#anatomy').text("");

        loadAndVerifyData();
        createSockAnatomy();
    });
})

function loadAndVerifyData() {
    //Get data from form
    cuffLength = Number($('#input-cuff-length').val());
    if (typeof cuffLength !== "number" || cuffLength < 0) {
        throw 'Invalid cuff length';
    }

    cuffStyle = $('#input-cuff-style').val();
    if (typeof cuffStyle !== "string") {
        throw 'Invalid Cuff Style';
    }

    ankleLength = Number($('#input-ankle-length').val());
    if (typeof ankleLength !== "number" || ankleLength < 0) {
        throw 'Invalid ankle length';
    }

    largeHeel = $('#input-extra-heel').is(':checked');
    if (typeof largeHeel !== 'boolean') {
        throw 'Invalid type for heel';
    }

    footLength = Number($('#input-foot-length').val()) - 0.5;
    if (typeof footLength !== "number" || footLength < 0) {
        throw 'Invalid foot length';
    }

    cylinderSize = Number($('#input-cylinder').val());
    if (typeof cylinderSize !== "number" || cylinderSize < 0) {
        throw 'Invalid cylinder size';
    }

    targetNeedles = Number($('#input-target-needles').val());
    if (typeof targetNeedles !== "number" || targetNeedles < 0) {
        throw 'Invalid target needles';
    }

    stretchyYarn = $('#input-stretch').is(':checked');
    if (typeof stretchyYarn !== 'boolean') {
        throw 'Invalid type for heel';
    }

    stitchPerInch = Number($('#input-stitches-per-inch').val());
    if (typeof stitchPerInch !== "number" || stitchPerInch < 0) {
        throw 'Invalid stitches per inch';
    }

    rowPerInch = Number($('#input-row-per-inch').val());
    if (typeof rowPerInch !== "number" || rowPerInch < 0) {
        throw 'Invalid rows per inch';
    }
}

function createSockAnatomy() {
    // Figure out how many inches the instep needs to be
    var heelNeedlesWorked = (largeHeel ? cylinderSize * .6 : cylinderSize * .5) - targetNeedles;
    var heelVarianceInInches = (heelNeedlesWorked - 2) / rowPerInch;

    var toeNeedlesWorked = (cylinderSize * .5) - targetNeedles;
    var toeVarianceInInches = (toeNeedlesWorked - 2) / rowPerInch;
    var instep = footLength - heelVarianceInInches - toeVarianceInInches;

    //Define shapes for drawing 1 inch = 100 pixels
    var inchToPixelRatio = 20;
    var shapeWidth = ((cylinderSize / 2) / stitchPerInch) * inchToPixelRatio;
    cuffShape = {
        x: 0,
        y: 0,
        width: shapeWidth,
        length: cuffLength * inchToPixelRatio
    };
    ankleShape = {
        x: 0,
        y: cuffShape.length,
        width: shapeWidth,
        length: ankleLength * inchToPixelRatio
    };
    heelShape = {
        x: shapeWidth,
        y: cuffShape.length + ankleShape.length,
        radius: shapeWidth,
        startAngle: (Math.PI / 180) * 90,
        endAngle: (Math.PI / 180) * 180,
        counterClockwise: false
    };
    instepShape = {
        x: shapeWidth,
        y: cuffShape.length + ankleShape.length,
        width: instep * inchToPixelRatio,
        length: shapeWidth
    };
    toeShape = {
        x: shapeWidth + instepShape.width,
        y: (shapeWidth / 2) + cuffShape.length + ankleShape.length,
        radius: shapeWidth / 2,
        startAngle: (Math.PI / 180) * 270,
        endAngle: (Math.PI / 180) * 90,
        counterClockwise: false
    };

    var canvasPixelBuffer = 20;
    var canvasHeight = cuffShape.length + ankleShape.length + instepShape.length + canvasPixelBuffer;
    var canvasWidth = cuffShape.width + instepShape.width + toeShape.radius + canvasPixelBuffer

    //Output to website
    $('#anatomy').append(
        "<h2>Sock Anatomy</h2>" +
        "<canvas id=\"canvasAnatomy\" height=\"" + canvasHeight + "\" width=\"" + canvasWidth + "\"></canvas>"
    );

    //Create canvas
    const canvas = document.querySelector("#canvasAnatomy");
    const context = canvas.getContext("2d");

    // Fonts for canvas
    context.font = "15px Arial"

    //Draw cuff
    context.strokeRect(cuffShape.x, cuffShape.y, cuffShape.width, cuffShape.length);
    if (cuffStyle === "None") {
    } else if (cuffStyle === "Rolled") {
        context.fillStyle = context.createPattern(getRolledPattern(), 'repeat');
        context.fillRect(cuffShape.x, cuffShape.y, cuffShape.width, cuffShape.length);
    } else if (cuffStyle === "Ribbed") {
        context.fillStyle = context.createPattern(getRibPattern(), 'repeat');
        context.fillRect(cuffShape.x, cuffShape.y, cuffShape.width, cuffShape.length);
    } else if (cuffStyle === "Mock Ribbed") {
        context.fillStyle = context.createPattern(getMockRibPattern(), 'repeat');
        context.fillRect(cuffShape.x, cuffShape.y, cuffShape.width, cuffShape.length);
    }
    context.fillStyle = "black";
    context.fillText("Cuff", ankleShape.width + 5, ankleShape.y);

    //Draw ankle
    context.strokeRect(ankleShape.x, ankleShape.y, ankleShape.width, ankleShape.length);
    context.fillText("Ankle", 5, (ankleShape.length / 2) + cuffShape.length);

    //Draw instep
    context.strokeRect(instepShape.x, instepShape.y, instepShape.width, instepShape.length);
    context.fillText("Instep", instepShape.x + 5, instepShape.y + instepShape.length / 2);

    //Draw heel and toe
    context.beginPath();
    context.arc(heelShape.x, heelShape.y, heelShape.radius, heelShape.startAngle, heelShape.endAngle, heelShape.counterClockwise);
    context.moveTo(toeShape.x, toeShape.y)
    context.arc(toeShape.x, toeShape.y, toeShape.radius, toeShape.startAngle, toeShape.endAngle, toeShape.counterClockwise);
    context.closePath();
    context.stroke();
    context.fillText("Heel", shapeWidth / 2, instepShape.y + instepShape.length / 2);
    context.fillText("Toe", instepShape.x + instepShape.width + 5, instepShape.y + instepShape.length / 2);

    // Display section
    $('#anatomy').removeClass('d-none');
}

// Patterns
// Pattern vv
function getRolledPattern() {
    var patternCanvas = document.createElement('canvas');
    var patternContext = patternCanvas.getContext('2d');

    patternCanvas.width = 20;
    patternCanvas.height = 10;

    patternContext.beginPath();
    patternContext.lineTo(0, 0);
    patternContext.lineTo(5, 10);
    patternContext.lineTo(10, 0);
    patternContext.lineTo(15, 10);
    patternContext.lineTo(20, 0);
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}

// Pattern - Vu
function getRibPattern() {
    var patternCanvas = document.createElement('canvas');
    var patternContext = patternCanvas.getContext('2d');

    patternCanvas.width = 20;
    patternCanvas.height = 10;

    patternContext.beginPath();
    patternContext.lineTo(0, 0);
    patternContext.lineTo(5, 10);
    patternContext.lineTo(10, 0);
    patternContext.moveTo(10, 5);
    patternContext.quadraticCurveTo(15, 0, 20, 5);
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}

// Pattern - V-
function getMockRibPattern() {
    var patternCanvas = document.createElement('canvas');
    var patternContext = patternCanvas.getContext('2d');

    patternCanvas.width = 20;
    patternCanvas.height = 10;

    patternContext.beginPath();
    patternContext.lineTo(0, 0);
    patternContext.lineTo(5, 10);
    patternContext.lineTo(10, 0);
    patternContext.moveTo(10, 5);
    patternContext.lineTo(20, 5);
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}