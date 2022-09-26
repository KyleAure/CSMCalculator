// . = class 
// # = label
class patternText {
    text;
    sectionNum;

    constructor(title) {
        this.text = "";
        this.sectionNum = 1;
        this.title(title);
    }

    title(title) {
        this.text = "<h2> Sock Pattern - " + title + "</h2>" + this.text;
    }

    append(line) {
        this.text += "<p>  - " + line + "</p>";
    }

    section(sectionTitle) {
        this.text += "<h5>" + this.sectionNum + ". " + sectionTitle + "</h5>";
        this.sectionNum = this.sectionNum + 1;
    }

    get() {
        return this.text;
    }
}

class sockpattern {
    //Private variables
    #worksheetInstance;

    cuffRows;
    ankleRows;
    instepRows;

    //Creates a new instance of this object, and creates all the necessary shapes
    constructor(worksheetInstance) {
        this.#worksheetInstance = worksheetInstance;
        this.calculateRows();
    }

    calculateRows() {
        if(this.#worksheetInstance.getCuffStyle() === "Rolled") {
            this.cuffRows = this.#worksheetInstance.getCuffLength().rows() * 2;
        } else {
            this.cuffRows = this.#worksheetInstance.getCuffLength().rows();
        }
        this.ankleRows = this.#worksheetInstance.getAnkleLength().rows();
        this.instepRows = calcInstep(this.#worksheetInstance).rows();
    }

    print() {
        if(this.#worksheetInstance.getDirection() === "Toe up") {
            $('#pattern').append(this.toeUp());
        } else {
            $('#pattern').append(this.cuffDown());
        }

        // Display section
        $('.pattern').removeClass('d-none');
    }

    toeUp() {
        var patterntxt = new patternText("Toe up pattern");

        patterntxt.section("Cast On");
        patterntxt.append("Cast onto your CSM " + this.#worksheetInstance.getCylinderSize() + " stitches with waste yarn");
        patterntxt.append("Knit 15 rounds with waste yarn.");
        patterntxt.append("Knit 1 round with ravel cord");

        patterntxt.section("Knit toe");
        var toeRows = ( this.#worksheetInstance.getCylinderSize() / 2 ) - this.#worksheetInstance.getTargetNeedles();
        patterntxt.append("Lift " + this.#worksheetInstance.getCylinderSize() / 2 + " needles out of work");
        patterntxt.append("Work " +  toeRows + " rows of decreases until " + this.#worksheetInstance.getTargetNeedles() + " needles are left in work");
        patterntxt.append("Work " +  toeRows + " rows of increases until " + this.#worksheetInstance.getCylinderSize() / 2 + " needles are back in work");
        patterntxt.append("Put all needles into working position");
        patterntxt.append("Pick up stitches from beginning of toe and place them onto the newly working needles");

        patterntxt.section("Knit instep");
        patterntxt.append("Knit " + this.instepRows + " rounds");

        //TODO
        patterntxt.section("Knit heel");
        var heelRows = calcHeelNeedlesWorked(this.#worksheetInstance);
        var heelNeedles = calcHeelNeedles(this.#worksheetInstance);
        var outOfWorkNeedles = this.#worksheetInstance.getCylinderSize() - heelNeedles;
        patterntxt.append("Lift " + outOfWorkNeedles + " needles out of work");
        patterntxt.append("Work " +  heelRows + " rows of decreases until " + this.#worksheetInstance.getTargetNeedles() + " needles are left in work");
        patterntxt.append("Work " +  heelRows + " rows of increases until " + heelNeedles + " needles are back in work");
        patterntxt.append("Put all needles into working position");  

        if(this.ankleRows > 0) {
            patterntxt.section("Knit ankle");
            patterntxt.append("Knit " + this.ankleRows + " rounds");
        }

        if(this.cuffRows > 0) {
            patterntxt.section("Knit cuff");
            if(this.#worksheetInstance.getCuffStyle() === "Rolled") {
                patterntxt.append("Place markers on target stitches");
                patterntxt.append("Knit " + this.cuffRows + " rounds");
                patterntxt.append("Use markers to hang stitches to create a rolled cuff");
            } else {
                patterntxt.append("Knit " + this.cuffRows + " rounds");
            }
        }


        patterntxt.section("Bind off (Future releases will have different bind off techniques)");
        patterntxt.append("Bind off all stitches using the latch hook bind off");
        patterntxt.append("If knitting another sock, switch to waste yarn");





        return patterntxt.get();
    }

    cuffDown() {
        var patterntxt = new patternText("Cuff down pattern");
        patterntxt.append("Cast onto your CSM, " + this.#worksheetInstance.getCylinderSize() + " stitches with waste yarn");
        patterntxt.append("Knit 15 rounds with waste yarn.");
        patterntxt.append("Knit 1 round with ravel cord");

        return patterntxt.get();
    }
}