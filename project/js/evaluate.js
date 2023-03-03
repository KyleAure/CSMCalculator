console.log("evaluate.js has been loaded");

// Data fields
const myWorksheet = new worksheet();

//Setup page after window is loaded
window.addEventListener('load', event => {
    console.log("document has been loaded");

    //Add listener for generate button
    var generateButton = document.getElementById('btn-generate');
    generateButton.addEventListener('click', event => {
        var worksheet = document.getElementById('worksheet');
        var pattern = document.getElementById('pattern');

        worksheet.classList.add('d-none');
        while( pattern.firstChild ) {
            pattern.removeChild(pattern.firstChild);
        }

        loadAndVerifyData();
        createSockPattern();
        createSockDiagram();

        pattern.classList.remove('d-none');
    });

    //Handle heel needles when page is refreshed
    var extraHeel = document.getElementById("input-extra-heel");
    var heelNeedles = document.getElementById("heelNeedles");
    if(extraHeel.checked) {
        heelNeedles.classList.remove('d-none');
    }

    //Add listener for extra heel toggle
    extraHeel.addEventListener('click', event => {
        if(extraHeel.checked) {
            heelNeedles.classList.remove('d-none');
        } else {
            heelNeedles.classList.add('d-none');
        }
    });
});

/**
 * Loads in all the data from the worksheet
 */
function loadAndVerifyData() {
    //Get data from form
    myWorksheet.setStretchyYarn(document.getElementById("input-stretch").checked);
    myWorksheet.setLargeHeel(   document.getElementById("input-extra-heel").checked);
    myWorksheet.setStitchPerInch(Number(document.getElementById("input-stitches-per-inch").value));
    myWorksheet.setRowPerInch(   Number(document.getElementById("input-row-per-inch").value));
    myWorksheet.setCuffStyle(document.getElementById("input-cuff-style").value);
    myWorksheet.setDirection(document.getElementById("input-direction").value);
    myWorksheet.setCuffLength(   Number(document.getElementById('input-cuff-length').value));
    myWorksheet.setAnkleLength(  Number(document.getElementById('input-ankle-length').value));
    myWorksheet.setFootLength(   Number(document.getElementById('input-foot-length').value) - 0.5);
    myWorksheet.setCylinderSize( Number(document.getElementById('input-cylinder').value));
    myWorksheet.setTargetNeedles(Number(document.getElementById('input-target-needles').value));
    myWorksheet.setHeelNeedles(  Number(document.getElementById('input-heel-needles').value));
}

/**
 * Creates the sock diagram using the 
 */
function createSockDiagram() {
    const mySockDiagram = new sockdiagram(myWorksheet);
    mySockDiagram.draw();
}

function createSockPattern() {
    const mySockPattern = new sockpattern(myWorksheet);
    mySockPattern.print();
}