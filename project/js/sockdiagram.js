const canvasPixelBuffer = 20;

class sockdiagram {
    //Private variables
    #worksheetInstance;

    // Shape objects
    cuffShape;
    ankleShape;
    heelShape;
    instepShape;
    toeShape;

    //Other calculations
    sockWidth;
    sockInstep;

    //Creates a new instance of this object, and creates all the necessary shapes
    constructor(worksheetInstance) {
        this.#worksheetInstance = worksheetInstance;
        this.calculateShapes();
    }

    //Creates all of the shape objects
    calculateShapes() {
        this.sockWidth  = calcSockWidth(this.#worksheetInstance).pixles();
        this.sockInstep = calcInstep(   this.#worksheetInstance).pixles();
        this.cuffShape = {
            x: 0,
            y: 0,
            width: this.sockWidth,
            length: this.#worksheetInstance.getCuffLength().pixles()
        };
        this.ankleShape = {
            x: 0,
            y: this.cuffShape.length,
            width: this.sockWidth,
            length: this.#worksheetInstance.getAnkleLength().pixles()
        };
        this.heelShape = {
            x: this.sockWidth,
            y: this.cuffShape.length + this.ankleShape.length,
            radius: this.sockWidth,
            startAngle: (Math.PI / 180) * 90,
            endAngle: (Math.PI / 180) * 180,
            counterClockwise: false
        };
        this.instepShape = {
            x: this.sockWidth,
            y: this.cuffShape.length + this.ankleShape.length,
            width: this.sockInstep,
            length: this.sockWidth
        };
        this.toeShape = {
            x: this.sockWidth + this.instepShape.width,
            y: (this.sockWidth / 2) + this.cuffShape.length + this.ankleShape.length,
            radius: this.sockWidth / 2,
            startAngle: (Math.PI / 180) * 270,
            endAngle: (Math.PI / 180) * 90,
            counterClockwise: false
        };
    }

    draw() {  
        var canvasHeight = this.cuffShape.length + this.ankleShape.length + this.instepShape.length + canvasPixelBuffer;
        var canvasWidth = this.cuffShape.width + this.instepShape.width + this.toeShape.radius + canvasPixelBuffer
    
        //Output to website
        $('#diagram').append(
            "<h2>Sock Diagram</h2>" +
            "<canvas id=\"canvasDiagram\" height=\"" + canvasHeight + "\" width=\"" + canvasWidth + "\"></canvas>"
        );
    
        //Create canvas
        const canvas = document.querySelector("#canvasDiagram");
        const context = canvas.getContext("2d");
    
        // Fonts for canvas
        context.font = "15px Arial"
    
        //Draw cuff
        context.strokeRect(this.cuffShape.x, this.cuffShape.y, this.cuffShape.width, this.cuffShape.length);
        if (this.#worksheetInstance.getCuffStyle() === "None") {
        } else if (this.#worksheetInstance.getCuffStyle() === "Rolled") {
            context.fillStyle = context.createPattern(getRolledPattern(), 'repeat');
            context.fillRect(this.cuffShape.x, this.cuffShape.y, this.cuffShape.width, this.cuffShape.length);
        } else if (this.#worksheetInstance.getCuffStyle() === "Ribbed") {
            context.fillStyle = context.createPattern(getRibPattern(), 'repeat');
            context.fillRect(this.cuffShape.x, this.cuffShape.y, this.cuffShape.width, this.cuffShape.length);
        } else if (this.#worksheetInstance.getCuffStyle() === "Mock Ribbed") {
            context.fillStyle = context.createPattern(getMockRibPattern(), 'repeat');
            context.fillRect(this.cuffShape.x, this.cuffShape.y, this.cuffShape.width, this.cuffShape.length);
        }
        context.fillStyle = "black";
        context.fillText("Cuff", this.ankleShape.width + 5, this.ankleShape.y);
    
        //Draw ankle
        context.strokeRect(this.ankleShape.x, this.ankleShape.y, this.ankleShape.width, this.ankleShape.length);
        context.fillText("Ankle", 5, (this.ankleShape.length / 2) + this.cuffShape.length);
    
        //Draw instep
        context.strokeRect(this.instepShape.x, this.instepShape.y, this.instepShape.width, this.instepShape.length);
        context.fillText("Instep", this.instepShape.x + 5, this.instepShape.y + this.instepShape.length / 2);
    
        //Draw heel and toe
        context.beginPath();
        context.arc(this.heelShape.x, this.heelShape.y, this.heelShape.radius, this.heelShape.startAngle, this.heelShape.endAngle, this.heelShape.counterClockwise);
        context.moveTo(this.toeShape.x, this.toeShape.y)
        context.arc(this.toeShape.x, this.toeShape.y, this.toeShape.radius, this.toeShape.startAngle, this.toeShape.endAngle, this.toeShape.counterClockwise);
        context.closePath();
        context.stroke();
        context.fillText("Heel", this.sockWidth / 2, this.instepShape.y + this.instepShape.length / 2);
        context.fillText("Toe", this.instepShape.x + this.instepShape.width + 5, this.instepShape.y + this.instepShape.length / 2);
    
        // Display section
        $('#diagram').removeClass('d-none');
    }
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