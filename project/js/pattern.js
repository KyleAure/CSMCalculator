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

/**
 * Entrypoint
 */
function createPattern() {
    if(construction.direction === "toeup") {
        this.toeUp();
    } else {
        this.cuffDown();
    }
}

function toeUp() {
    var pattern = new patternElement("Pattern: Toe Up", 
    "This pattern will have you creating a sock from the toe up to the cuff.#"
    + "This means you will not have to sew up the toe after removing the sock from the machine.#"
    + "However, you will need to bind off after finishing the cuff.");

    pattern.createCard("Casting On", "Click on each step to mark complete");
    pattern.appendStep("Hang setup bonnet on every other needle of your  " + cylinder.needles.total + " needle cylinder");
    pattern.appendStep("Knit 15 rounds with waste yarn");
    pattern.appendStep("Knit 1 round with ravel cord");
    pattern.endCard();

    pattern.createCard("Create toe");
    pattern.appendStep("Lift " + cylinder.needles.half + " needles out of work");
    pattern.appendStep("Work " +  cylinder.rows.toe + " rows of decreases until " + cylinder.needles.target + " needles are left in work");
    pattern.appendStep("Work " +  cylinder.rows.toe + " rows of increases until " + cylinder.needles.half + " needles are back in work");
    pattern.appendStep("Put all needles into working position");
    pattern.appendStep("Pick up stitches from the beginning of toe and place them onto the working needles");
    pattern.endCard();

    pattern.createCard("Knit instep");
    pattern.appendStep("Knit " + instep.rows + " rounds");
    pattern.endCard();

    pattern.createCard("Knit heel");
    pattern.appendStep("Lift " + ( cylinder.needles.half - cylinder.needles.heel ) + " needles out of work");
    pattern.appendStep("Work " +  cylinder.rows.heel + " rows of decreases until " + cylinder.needles.target + " needles are left in work");
    pattern.appendStep("Work " +  cylinder.rows.heel + " rows of increases until " + ( cylinder.needles.half + cylinder.needles.heel ) + " needles are back in work");
    pattern.appendStep("Put all needles into working position");
    pattern.endCard();

    if(ankle.rows > 0) {
        pattern.createCard("Knit ankle");
        pattern.appendStep("Knit " + ankle.rows + " rounds");
        pattern.endCard();
    }

    if(cuff.rows > 0) {
        pattern.createCard("Knit cuff");
        if(cuff.style === "hung") {
            pattern.appendStep("Add marker to each " + (cylinder.needles.total / 4) + "needle");
            pattern.appendStep("Knit " + cuff.rows + " rounds");
            pattern.appendStep("Hang marked stitches onto cylinder needles")
            pattern.appendStep("Continue hanging needles between marked stitches until all needles have a hung stitch.")
        } else {
            pattern.appendStep("Knit " + cuff.rows + " rounds");    
        }
        pattern.endCard();
    }

    pattern.createCard("Bind off");
    if(construction.bindoff === "latchhook") {
        pattern.appendStep("Bind off all stitches using the latch hook bind off");
    } 
    pattern.appendStep("Switch to waste yarn");
    pattern.appendStep("Knit 5 rounds");
    pattern.endCard();

    pattern.createCard("Finishing");
    if(! (construction.bindoff === "latchhook") ) {
        pattern.appendStep("Sew live edge of cuff");        
    }
    pattern.appendStep("Weave in ends");
    pattern.appendStep("Remove waste yarn");
    pattern.endCard();
    
    pattern.endPattern();
}

function cuffDown() {
    var pattern = new patternElement("Pattern: Cuff Down",
    "This pattern will have you creating a sock from the cuff down to the toe.#"
    + "This means you will need to sew the toe closed after taking the sock off the machine.#"
    + "You may also need to add a cast on selvage "
    );

    if(cuff.rows > 0) {
        pattern.createCard("Knit cuff");
        pattern.appendStep("Knit " + cuff.rows + " rows");
        pattern.endCard();
    }

    if(ankle.rows > 0) {
        pattern.createCard("Knit ankle");
        pattern.appendStep("Knit " + ankle.rows + " rows");
        pattern.endCard();
    }

    pattern.createCard("Knit heel");
    pattern.appendStep("Lift " + ( cylinder.needles.half - cylinder.needles.heel ) + " needles out of work");
    pattern.appendStep("Work " +  cylinder.rows.heel + " rows of decreases until " + cylinder.needles.target + " needles are left in work");
    pattern.appendStep("Work " +  cylinder.rows.heel + " rows of increases until " + ( cylinder.needles.half + cylinder.needles.heel ) + " needles are back in work");
    pattern.appendStep("Put all needles into working position");
    pattern.endCard();

    pattern.createCard("Knit instep");
    pattern.appendStep("Knit " + instep.rows + " rows");
    pattern.endCard();

    pattern.createCard("Create toe", "Working the toe and hanging the stitches");
    pattern.appendStep("Lift " + cylinder.needles.half + " needles out of work");
    pattern.appendStep("Work " +  cylinder.rows.toe + " rows of decreases until " + cylinder.needles.target + " needles are left in work");
    pattern.appendStep("Work " +  cylinder.rows.toe + " rows of increases until " + cylinder.needles.half + " needles are back in work");
    pattern.appendStep("Put all needles into working position");
    pattern.endCard();

    pattern.createCard("Bind off");
    pattern.appendStep("Switch to waste yarn");
    pattern.appendStep("Knit at least 5 rounds");
    pattern.appendStep("Add a marker to the first and last stitch of each half of the cylinder")
    pattern.endCard();

    pattern.createCard("Finishing");
    pattern.appendStep("Kitchener stich toe seam");
    pattern.appendStep("Weave in ends")
    pattern.endCard();

    pattern.endPattern();
}