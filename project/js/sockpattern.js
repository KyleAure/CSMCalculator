class patternElement {
    sectionNum;
    stepNumber;
    element;
    cardList;

    constructor(title, description) {
        this.sectionNum = 1;
        this.stepNumber = 1;
        this.element = document.getElementById("pattern");

        var titleRow = document.createElement('div');
        titleRow.className = "row";
        this.element.appendChild(titleRow);

        var titleCol = document.createElement('div');
        titleCol.className = "col bg-title title";
        titleCol.id = "title"
        titleRow.appendChild(titleCol);
        
        var titleElem = document.createElement('h2');
        titleElem.textContent = title;
        titleCol.appendChild(titleElem);

        description.split("#").forEach(line => {
            var descriptionElem = document.createElement('p');
            descriptionElem.classList = "text-muted description"
            descriptionElem.textContent = line;
            titleCol.appendChild(descriptionElem);
        });

        var diagramCol = document.createElement('div');
        diagramCol.className = "col-auto diagram";
        diagramCol.id = "diagram"
        titleRow.appendChild(diagramCol);
    }

    createCard(title, description = "", image = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg") {

        var cardRow = document.createElement('div');
        cardRow.className = "row g-0 bg-card rounded my-2";
        this.element.appendChild(cardRow);

        var cardColumnImage = document.createElement('div');
        cardColumnImage.className = "col-md-3 align-self-center";
        cardRow.appendChild(cardColumnImage);

        var cardColumnBody = document.createElement('div');
        cardColumnBody.className = "col-md-9 align-self-center";
        cardRow.appendChild(cardColumnBody);

        var card = document.createElement('div');
        card.className = "card";
        cardColumnBody.appendChild(card);

        var cardBody = document.createElement('div');
        cardBody.className = "card-body";
        card.appendChild(cardBody);

        var cardTitle = document.createElement('h5');
        cardTitle.textContent = this.sectionNum + ". " + title;
        cardBody.appendChild(cardTitle);

        var cardText = document.createElement('small');
        cardText.classList = "text-muted description"
        cardText.textContent = description;
        cardBody.appendChild(cardText);

        var cardImg = document.createElement('img');
        cardImg.className = "img-fluid rounded";
        cardImg.src = image;
        cardColumnImage.appendChild(cardImg);

        this.cardList = document.createElement("ul");
        this.cardList.className = "list-group list-group-flush";
        card.appendChild(this.cardList);
    }

    appendStep(step) {
        var cardListItem = document.createElement("li");
        cardListItem.className = "list-group-item user-select-none";
        cardListItem.id = "step" + this.sectionNum + this.stepNumber;
        cardListItem.textContent = step;
        cardListItem.addEventListener("click", event => {
            var thisCardListItem = document.getElementById(event.target.id);
            var sockCount = thisCardListItem.childElementCount;

            console.log("On click count: " + thisCardListItem.childElementCount);

            if(sockCount === 0) {
                var badge = document.createElement("span");
                badge.className = "badge rounded-pill bg-success ms-2";
                badge.id = "badgeLeft";
                badge.textContent = "Left";
                thisCardListItem.appendChild(badge);
            } else if (sockCount === 1) {
                var badge = document.createElement("span");
                badge.className = "badge rounded-pill bg-success ms-2";
                badge.id = "badgeRight";
                badge.textContent = "Right"
                thisCardListItem.appendChild(badge);
            } else {
                thisCardListItem.removeChild(document.getElementById("badgeLeft"));
                thisCardListItem.removeChild(document.getElementById("badgeRight"));
            }
        })

        this.cardList.appendChild(cardListItem);
        this.stepNumber++;
    }

    endCard() {
        this.cardList = undefined;
        this.stepNumber = 1;
        this.sectionNum++;
    }

    endPattern() {
        var modifyBtn = document.createElement("button");
        modifyBtn.id = "btn-modify";
        modifyBtn.className = "btn btn-primary";
        modifyBtn.type = "modify";
        modifyBtn.textContent = "Modify Pattern";

        modifyBtn.addEventListener('click', event => {
            var worksheet = document.getElementById('worksheet');
            worksheet.classList.remove("d-none");

            var pattern = document.getElementById('pattern');
            pattern.classList.add("d-none");
        });

        this.element.appendChild(modifyBtn);
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
            this.toeUp();
        } else {
            this.cuffDown();
        }
    }

    toeUp() {
        var pattern = new patternElement("Pattern: Toe Up", 
        "This pattern will have you creating a sock from the toe up to the cuff.#"
        + "This means you will not have to sew up the toe after removing the sock from the machine.#"
        + "However, you will need to bind off after finishing the cuff.");

        pattern.createCard("Casting On", "Click on each step to mark complete");
        pattern.appendStep("Hang setup bonnet on every other needle of your  " + this.#worksheetInstance.getCylinderSize() + " needle cylinder");
        pattern.appendStep("Knit 15 rounds with waste yarn");
        pattern.appendStep("Knit 1 round with ravel cord");
        pattern.endCard();

        pattern.createCard("Create toe", "Working the toe and hanging the stitches");
        var toeRows = ( this.#worksheetInstance.getCylinderSize() / 2 ) - this.#worksheetInstance.getTargetNeedles();
        pattern.appendStep("Lift " + this.#worksheetInstance.getCylinderSize() / 2 + " needles out of work");
        pattern.appendStep("Work " +  toeRows + " rows of decreases until " + this.#worksheetInstance.getTargetNeedles() + " needles are left in work");
        pattern.appendStep("Work " +  toeRows + " rows of increases until " + this.#worksheetInstance.getCylinderSize() / 2 + " needles are back in work");
        pattern.appendStep("Put all needles into working position");
        pattern.appendStep("Pick up stitches from beginning of toe and place them onto the newly working needles");
        pattern.endCard();

        pattern.createCard("Knit instep");
        pattern.appendStep("Knit " + this.instepRows + " rounds");
        pattern.endCard();

        pattern.createCard("Knit heel");
        var heelRows = calcHeelNeedlesWorked(this.#worksheetInstance);
        var heelNeedles = calcHeelNeedles(this.#worksheetInstance);
        var outOfWorkNeedles = this.#worksheetInstance.getCylinderSize() - heelNeedles;
        pattern.appendStep("Lift " + outOfWorkNeedles + " needles out of work");
        pattern.appendStep("Work " +  heelRows + " rows of decreases until " + this.#worksheetInstance.getTargetNeedles() + " needles are left in work");
        pattern.appendStep("Work " +  heelRows + " rows of increases until " + heelNeedles + " needles are back in work");
        pattern.appendStep("Put all needles into working position");
        pattern.endCard();

        if(this.ankleRows > 0) {
            pattern.createCard("Knit ankle");
            pattern.appendStep("Knit " + this.ankleRows + " rounds");
            pattern.endCard();
        }

        if(this.cuffRows > 0) {
            pattern.createCard("Knit cuff");
            if(this.#worksheetInstance.getCuffStyle() === "Rolled") {
                pattern.appendStep("Place markers on target stitches");
                pattern.appendStep("Knit " + this.cuffRows + " rounds");
                pattern.appendStep("Use markers to hang stitches to create a rolled cuff");
            } else {
                pattern.appendStep("Knit " + this.cuffRows + " rounds");
            }
            pattern.endCard();
        }

        pattern.createCard("Bind off", "Future releases will have different bind off techniques");
        pattern.appendStep("Bind off all stitches using the latch hook bind off");
        pattern.appendStep("If knitting another sock, switch to waste yarn");
        pattern.endCard();

        pattern.endPattern();
    }

    cuffDown() {
        var pattern = new patternElement("Pattern: Cuff Down",
        "This pattern will have you creating a sock from the cuff down to the toe.#"
        + "This means you will need to sew the toe closed after taking the sock off the machine.#"
        + "You may also need to add a cast on selvage "
        );




        pattern.endPattern();
    }
}