// Raw data
var raw = [];

// Data structures
var gauge;
var cylinder;
var construction;

// Sock elements
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

    //console.info("Returning key: " + key + " val: " + val);
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
    var total = collectRawData("input-number-cylinder");
    
    cylinder = {
        needles: {
            total: total,
            half: total / 2,
            heel: collectRawData("input-number-heel-needles"), 
            target: collectRawData("input-number-target-needles"),
        },
        fabric: {
            width: total / gauge.stPerInch,
        }
    };

    console.debug(cylinder);
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
    var length = collectRawData("input-number-cuff-length");

    if( construction.selvage === "hung" ) {
        length *= 2;
    }

    cuff = {
        rows: ConvertSize.inchToRows(length),
        length: length,
        style: collectRawData("select-cuff-pattern"),
    }

    console.debug(cuff);
    createAnkle();
}

function createAnkle() {
    var length = collectRawData("input-number-ankle-length");

    ankle = {
        rows: ConvertSize.inchToRows(length),
        length: length,
        style: collectRawData("select-ankle-pattern")
    }

    console.debug(ankle);
    createHeel();
}

function createHeel() {
    var rows = cylinder.needles.half - cylinder.needles.target + cylinder.needles.heel;

    heel = {
        rows: rows,
        length: {
            cuff:   ConvertSize.rowsToInch(rows / 2),
            instep: ConvertSize.rowsToInch(rows / 2),
        },
        style: "stock",
    }

    console.debug(heel);
    createToe();
}

function createToe() {
    var rows = cylinder.needles.half - cylinder.needles.target;

    toe = {
        rows: rows,
        length: {
            instep: ConvertSize.rowsToInch(rows / 2),
            top:    ConvertSize.rowsToInch(rows / 2),
        },
        style: "stock",
    }

    console.debug(toe);
    createInstep();
}

function createInstep() {
    var totalSize = collectRawData("input-number-foot-length");
    var instepSize = totalSize - heel.length.instep - toe.length.instep; 
    
    instep = {
        rows: ConvertSize.inchToRows(instepSize),
        length: instepSize,
        style: collectRawData("select-foot-pattern")
    }

    console.debug(instep);
}

class ConvertSize {
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
