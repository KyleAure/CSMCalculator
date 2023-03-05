function draw() {
    var canvasHeight = canvasPixelBuffer + cuff.length.pixels + ankle.length.pixels + instep.width.pixels;
    var canvasWidth = canvasPixelBuffer + cuff.width.pixels + instep.length.pixels + toe.geometry.radius;

    //Output to website
    var diagram = document.getElementById("diagram");

    var title = document.createElement("h5");
    title.textContent = "Proportional Diagram";
    diagram.appendChild(title);

    var canvas = document.createElement("canvas");
    canvas.id = "canvasDiagram";
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    diagram.appendChild(canvas);

    //Create canvas
    const context = canvas.getContext("2d");

    // Fonts for canvas
    context.font = "15px Arial"

    //Draw cuff
    context.strokeRect(cuff.position.x, cuff.position.y, cuff.width.pixels, cuff.length.pixels);
    context.fillStyle = context.createPattern(cuff.pattern, 'repeat');
    context.fillRect(cuff.position.x, cuff.position.y, cuff.width.pixels, cuff.length.pixels);

    //Draw ankle
    context.strokeRect(ankle.position.x, ankle.position.y, ankle.width.pixels, ankle.length.pixels);
    context.fillStyle = context.createPattern(ankle.pattern, 'repeat');
    context.fillRect(ankle.position.x, ankle.position.y, ankle.width.pixels, ankle.length.pixels);

    //Draw instep
    context.strokeRect(instep.position.x, instep.position.y, instep.length.pixels, instep.width.pixels);
    context.fillStyle = context.createPattern(instep.pattern, 'repeat');
    context.fillRect(instep.position.x, instep.position.y, instep.length.pixels, instep.width.pixels);

    //Draw heel
    context.beginPath();
    context.moveTo(heel.position.x, heel.position.y);
    context.arc(heel.position.x, heel.position.y, 
                heel.geometry.radius, heel.geometry.startAngle, heel.geometry.endAngle, 
                heel.geometry.counterClockwise);
    context.stroke();

    //Draw toe
    context.beginPath();
    context.moveTo(toe.position.x, toe.position.y);
    context.arc(toe.position.x, toe.position.y, 
                toe.geometry.radius, toe.geometry.startAngle, toe.geometry.endAngle, 
                toe.geometry.counterClockwise);
    context.stroke();
    
}

function getSubPattern(name) {
    if(name === "stock") {
        return getStockenette();
    } else if (name === "1x1r") {
        return get1x1RibPattern();
    } else if (name === "1x1mr") {
        return get1x1MockRibPattern();
    } else if (name === "3x1r") {
        return get3x1RibPattern();
    } else if (name === "3x1mr") {
        return get3x1MockRibPattern();
    }
}

// Pattern VV
function getStockenette() {
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
    patternContext.strokeStyle = "grey";
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}

// Pattern - VU
function get1x1RibPattern() {
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
    patternContext.strokeStyle = "grey";
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}

// Pattern - V-
function get1x1MockRibPattern() {
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
    patternContext.strokeStyle = "grey";
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}

// Pattern - VVVU
function get3x1RibPattern() {
    var patternCanvas = document.createElement('canvas');
    var patternContext = patternCanvas.getContext('2d');

    patternCanvas.width = 40;
    patternCanvas.height = 10;

    patternContext.beginPath();
    patternContext.lineTo(0, 0);

    patternContext.lineTo(5, 10);
    patternContext.lineTo(10, 0);

    patternContext.lineTo(15, 10);
    patternContext.lineTo(20, 0);

    patternContext.lineTo(25, 10);
    patternContext.lineTo(30, 0);

    patternContext.moveTo(30, 5);
    patternContext.quadraticCurveTo(35, 0, 40, 5);
    patternContext.strokeStyle = "grey";
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}

// Pattern - VVV-
function get3x1MockRibPattern() {
    var patternCanvas = document.createElement('canvas');
    var patternContext = patternCanvas.getContext('2d');

    patternCanvas.width = 40;
    patternCanvas.height = 10;

    patternContext.beginPath();
    patternContext.lineTo(0, 0);

    patternContext.lineTo(5, 10);
    patternContext.lineTo(10, 0);

    patternContext.lineTo(15, 10);
    patternContext.lineTo(20, 0);

    patternContext.lineTo(25, 10);
    patternContext.lineTo(30, 0);

    patternContext.moveTo(30, 5);
    patternContext.lineTo(40, 5);
    patternContext.strokeStyle = "grey";
    patternContext.stroke();
    patternContext.closePath();

    return patternCanvas;
}