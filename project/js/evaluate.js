console.log("evaluate.js has been loaded");

// Data fields
const myWorksheet = new worksheet();

$(document).ready(function () {
    $('#input-extra-heel').prop('checked', false);
});

/**
 * Entrypoint, this is what happens when someone clicks 'generate pattern'
 */
$(function () {
    //Listen for button click
    $('#btn-generate').on('click', function () {

        //Reset hidden items from previous submission
        $('#diagram').addClass('d-none');
        $('#diagram').text("");
        $('#pattern').text("");

        loadAndVerifyData();
        createSockDiagram();
        createSockPattern();
    });

    //Listen for checkbox click
    $('#input-extra-heel').click(function() {
        if($('#input-extra-heel').is(':checked')) {
            $('#heelNeedles').removeClass('d-none');
        } else {
            $('#heelNeedles').addClass('d-none');
        }
    })
})

/**
 * Loads in all the data from the worksheet
 */
function loadAndVerifyData() {
    //Get data from form
    myWorksheet.setStretchyYarn($('#input-stretch').is(':checked'));
    myWorksheet.setLargeHeel($('#input-extra-heel').is(':checked'));
    myWorksheet.setStitchPerInch(Number($('#input-stitches-per-inch').val()));
    myWorksheet.setRowPerInch(Number($('#input-row-per-inch').val()));
    myWorksheet.setCuffStyle($('#input-cuff-style').val());
    myWorksheet.setDirection($('#input-direction').val());
    myWorksheet.setCuffLength(Number($('#input-cuff-length').val()));
    myWorksheet.setAnkleLength(Number($('#input-ankle-length').val()));
    myWorksheet.setFootLength(Number($('#input-foot-length').val()) - 0.5);
    myWorksheet.setCylinderSize(Number($('#input-cylinder').val()));
    myWorksheet.setTargetNeedles(Number($('#input-target-needles').val()));
    myWorksheet.setHeelNeedles(Number($('#input-heel-needles').val()));
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