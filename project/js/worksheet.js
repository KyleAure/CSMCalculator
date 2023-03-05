const inchToPixelRatio = 10;
const canvasBuffer = 5;
const canvasPixelBuffer = 20;

//Raw data
var raw = [];

//Data structures
var gauge;
var cylinder;
var sock;
var construction;

var cuff;
var ankle;
var heel;
var instep;
var toe;

/**
 * Entrypoint for worksheet
 */
function parse() {
    //Note order is important here
    createGauge();
}

/**
 * Card 1
 *   "input-cuff-length" "select-cuff-pattern" "input-ankle-length" "select-ankle-pattern" "input-foot-length" "select-foot-pattern",
 * Card 2
 *   "input-number-cylinder" "input-number-target-needles" "input-number-heel-needles",
 * Card 3
 *   "input-number-stitches-per-inch" "input-number-row-per-inch" "input-check-stretch",
 * Card 4
 *   select-direction" "select-selvage" "select-bind-off"
 */
function collectRawData(key) {
    var val;

    if(key.startsWith("input-number")) {
        val = Number(document.getElementById(key).value);
    } else if(key.startsWith("input-check")) {
        val = document.getElementById(key).checked;
    } else {
        val = document.getElementById(key).value;
    }

    console.info("Returning key: " + key + " val: " + val);
    return val;
}

function createGauge() {
    gauge = {
       stPerInch: collectRawData("input-number-stitches-per-inch"),
       rowPerInch: collectRawData("input-number-row-per-inch"),
       roundDown: collectRawData("input-check-stretch"),
    };
    console.debug(gauge);
    createCylinder();
}

function createCylinder() {
    var size = collectRawData("input-number-cylinder");
    var targetNeedles = collectRawData("input-number-target-needles");
    var heelNeedles = collectRawData("input-number-heel-needles");
    cylinder = {
        needles: {
            total: size,
            half: size / 2,
            heel: heelNeedles, 
            target: targetNeedles,
        },
        rows: {
            heel: (size / 2) - targetNeedles + heelNeedles,
            toe: (size / 2) - targetNeedles,
        },
    };
    console.debug(cylinder);
    createSock();
}

function createSock() {
    sock = {
        width: cylinder.needles.total / gauge.stPerInch,
    }
    console.debug(sock);
    createConstruction();
}

function createConstruction() {
    construction = {
        direction: collectRawData("select-direction"),
        selvage: collectRawData("select-selvage"),
        bindoff: collectRawData("select-bind-off"),
    };
    console.debug(construction);
    createCuff();
}

function createCuff() {
    var size = collectRawData("input-cuff-length");
    var style = collectRawData("select-cuff-style");

    var rows;
    if(construction.selvage === "hung" || style === "hung") {
        rows = ConvertSize.inchToRows(size * 2);
    } else {
        rows = ConvertSize.inchToRows(size);
    }

    cuff = {
        rows: rows,
        length: {
            inches: size,
            pixels: ConvertSize.inchToPixels(size),
        },
        width: {
            inches: sock.width,
            pixels: ConvertSize.inchToPixels(sock.width),
        },
        position: {
            x: canvasBuffer,
            y: canvasBuffer,
        },
        pattern: getSubPattern(collectRawData("select-cuff-pattern")),
        style: style,
    }

    console.debug(cuff);
    createAnkle();
}

function createAnkle() {
    var size = collectRawData("input-ankle-length");

    ankle = {
        rows: ConvertSize.inchToRows(size),
        length: {
            inches: size,
            pixels: ConvertSize.inchToPixels(size),
        },
        width: {
            inches: sock.width,
            pixels: ConvertSize.inchToPixels(sock.width),
        },
        position: {
            x: canvasBuffer,
            y: canvasBuffer + cuff.length.pixels,
        },
        pattern: getSubPattern(collectRawData("select-ankle-pattern")),
    }
    console.debug(cuff);
    createHeel();
}

function createHeel() {
    heel = {
        width: {
            inches: sock.width,
            pixels: ConvertSize.inchToPixels(sock.width),
        },
        position: {
            x: canvasBuffer + ankle.width.pixels,
            y: canvasBuffer + cuff.length.pixels + ankle.length.pixels,
        },
        geometry: {
            radius: ankle.width.pixels,
            startAngle: (Math.PI / 180) * 90,
            endAngle: (Math.PI / 180) * 180,
            counterClockwise: false
        },
        pattern: getStockenette(),
    }
    console.debug(heel);
    createInstep();
}

function createInstep() {
    var footSize = collectRawData("input-foot-length");
    var heelInstep = ConvertSize.rowsToInch(cylinder.rows.heel) / 2;
    var toeInstep = ConvertSize.rowsToInch(cylinder.rows.toe) / 2;
    var instepSize = footSize - heelInstep - toeInstep; 
    instep = {
        rows: ConvertSize.inchToRows(instepSize),
        length: {
            inches: instepSize,
            pixels: ConvertSize.inchToPixels(instepSize),
        },
        width: {
            inches: sock.width,
            pixels: ConvertSize.inchToPixels(sock.width),
        },
        position: {
            x: canvasBuffer + ankle.width.pixels,
            y: canvasBuffer + cuff.length.pixels + ankle.length.pixels,
        },
        pattern: getSubPattern(collectRawData("select-foot-pattern")),
    }
    console.debug(instep);
    createToe();
}

function createToe() {
    toe = {
        width: {
            inches: sock.width,
            pixels: ConvertSize.inchToPixels(sock.width),
        },
        position: {
            x: canvasBuffer + ankle.width.pixels + instep.length.pixels,
            y: canvasBuffer + cuff.length.pixels + ankle.length.pixels + (instep.width.pixels / 2),
        },
        geometry: {
            radius: cuff.width.pixels / 2,
            startAngle: (Math.PI / 180) * 270,
            endAngle: (Math.PI / 180) * 90,
            counterClockwise: false
        },
        pattern: getStockenette(),
    }
    console.debug(toe);
}

class ConvertSize {
    static inchToPixels(size) {
        return size * inchToPixelRatio;
    }

    static inchToRows(size) {
        if(gauge.roundDown) {
            return Math.floor(size * gauge.rowPerInch);
        } else {
            return Math.ceil(size * gauge.rowPerInch);
        }
    }

    static rowsToInch(rows) {
        return rows / gauge.rowPerInch;
    }
}