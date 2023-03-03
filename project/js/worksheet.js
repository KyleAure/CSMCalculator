const inchToPixelRatio = 10;

class inches {
    constructor(inch, rowPerInch, roundDown) {
        this.inch = inch;
        this.rowPerInch = rowPerInch;
        this.roundDown = roundDown;
    }
    inches() {
        return this.inch;
    }
    pixles() {
        return this.inch * inchToPixelRatio;
    }
    rows() {
        if(this.roundDown) {
            return Math.floor(this.inch * this.rowPerInch);
        } else {
            return Math.ceil(this.inch * this.rowPerInch);
        }
    }
}

class worksheet {
    //bool
    #stretchyYarn;
    #largeHeel;

    //ratio
    #stitchPerInch;
    #rowPerInch;

    //string
    #cuffStyle;
    #direction;
    
    //inches
    #cuffLength;
    #ankleLength;
    #footLength; 
    
    //integers
    #cylinderSize;
    #targetNeedles;
    #heelNeedles;

    // Constructor
    constructor() {}

    // SETTERS
    setStretchyYarn(stretchyYarn) {
        if (typeof stretchyYarn !== 'boolean') {
            throw 'Invalid type for heel';
        }
        this.#stretchyYarn = stretchyYarn;
    }

    setLargeHeel(largeHeel) {
        if (typeof largeHeel !== 'boolean') {
            throw 'Invalid type for heel';
        }
        this.#largeHeel = largeHeel;
    }


    setStitchPerInch(stitchPerInch) {
        if (typeof stitchPerInch !== "number" || stitchPerInch < 0) {
            throw 'Invalid stitches per inch';
        }
        this.#stitchPerInch = stitchPerInch;
    }

    setRowPerInch(rowPerInch) {
        if (typeof rowPerInch !== "number" || rowPerInch < 0) {
            throw 'Invalid rows per inch';
        }
        this.#rowPerInch = rowPerInch;
    }


    setCuffStyle(cuffStyle) {
        if (typeof cuffStyle !== "string") {
            throw 'Invalid type for Cuff Style';
        }
        this.#cuffStyle = cuffStyle;
    }

    setDirection(direction) {
        if (typeof direction !== "string") {
            throw 'Invalid type for direction';
        }
        this.#direction = direction;
    }


    setCuffLength(cuffLength) {
        if (typeof cuffLength !== "number" || cuffLength < 0) {
            this.cuffLength = new Inches(cuffLength);
        }
        this.#cuffLength = new inches(cuffLength, this.#rowPerInch, this.#stretchyYarn);
    }

    setAnkleLength(ankleLength) {
        if (typeof ankleLength !== "number" || ankleLength < 0) {
            throw 'Invalid ankle length';
        }
        this.#ankleLength = new inches(ankleLength, this.#rowPerInch, this.#stretchyYarn);
    }

    setFootLength(footLength) {
        if (typeof footLength !== "number" || footLength < 0) {
            throw 'Invalid foot length';
        }
        this.#footLength = new inches(footLength, this.#footLength, this.#stretchyYarn);
    }

    setCylinderSize(cylinderSize) {
        if (typeof cylinderSize !== "number" || cylinderSize < 0 || ! Number.isInteger(cylinderSize)) {
            throw 'Invalid cylinder size';
        }
        this.#cylinderSize = cylinderSize;
    }

    setTargetNeedles(targetNeedles) {
        if (typeof targetNeedles !== "number" || targetNeedles < 0 || ! Number.isInteger(targetNeedles)) {
            throw 'Invalid target needles';
        }
        this.#targetNeedles = targetNeedles;
    }

    setHeelNeedles(heelNeedles) {
        if (typeof heelNeedles !== "number" || heelNeedles < 0 || ! Number.isInteger(heelNeedles)) {
            throw 'Invalid target needles';
        }
        this.#heelNeedles = heelNeedles;
    }

    // GETTERS
    getStretchyYarn() {
        return this.#stretchyYarn;
    }
    getLargeHeel() {
        return this.#largeHeel;
    }
    getStitchPerInch() {
        return this.#stitchPerInch;
    }
    getRowPerInch() {
        return this.#rowPerInch;
    }
    getCuffStyle() {
        return this.#cuffStyle;
    }
    getDirection() {
        return this.#direction;
    }
    getCuffLength() {
        return this.#cuffLength;
    }
    getAnkleLength() {
        return this.#ankleLength;
    }
    getFootLength() {
        return this.#footLength;
    }
    getCylinderSize() {
        return this.#cylinderSize;
    }
    getTargetNeedles() {
        return this.#targetNeedles;
    }
    getHeelNeedles() {
        return this.#heelNeedles;
    }
}

// CALCULATIONS
function calcSockWidth(worksheetInstance) {
    return new inches((worksheetInstance.getCylinderSize() / 2) / worksheetInstance.getStitchPerInch(), worksheetInstance.getRowPerInch(), worksheetInstance.getStretchyYarn());
}

function calcInstep(worksheetInstance) {
    var heelVarianceInInches = (calcHeelNeedlesWorked(worksheetInstance) - 2) / worksheetInstance.getRowPerInch();

    var toeNeedlesWorked = (worksheetInstance.getCylinderSize() / 2) - worksheetInstance.getTargetNeedles();
    var toeVarianceInInches = (toeNeedlesWorked - 2) / worksheetInstance.getRowPerInch();

    var result = worksheetInstance.getFootLength().inches() - heelVarianceInInches - toeVarianceInInches;
    
    return new inches(result, worksheetInstance.getRowPerInch(), worksheetInstance.getStretchyYarn());
}

function calcHeelNeedlesWorked(worksheetInstance) {
    return calcHeelNeedles(worksheetInstance) - worksheetInstance.getTargetNeedles();
}

function calcHeelNeedles(worksheetInstance) {
    if(worksheetInstance.getLargeHeel()) {
        return (worksheetInstance.getCylinderSize() / 2) + worksheetInstance.getHeelNeedles();
    } else {
        return (worksheetInstance.getCylinderSize() / 2);
    }
}