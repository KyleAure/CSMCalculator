// This is the entrypoint for the site.
console.info("entrypoint.js is loaded");

//Once window is loaded, load other javascript files
window.addEventListener('load', event=> {
    includeProjectFiles();
    handleReload();
    addConstructionListener();
    addGenerateButtonListener();
})

/**
 * Appends all scripts to document
 */
function includeProjectFiles() {
    var dir = "js/";
    var extension = ".js";
    var files = [ 'worksheet', 'pattern' ];

    for(var file of files) {
        var path = dir + file + extension;
        console.debug("Adding script: " + path);
        var script = document.createElement("script");
        script.src = path;
        document.body.appendChild(script);
    }
}

/**
 * Manually check listener items to make sure the form is correctly displaying
 */
function handleReload() {
    for(var element of document.getElementsByClassName("dynamic-item")) {
        try{
            console.debug("resetting " + element.id);
            element.selectedIndex=0;
        } catch (error) {
            console.warning("Possible error resetting dynamic items: " + error);
        }
    }
}

/**
 * Adds a listener to the generate pattern button that will create the diagram and pattern
 */
function addGenerateButtonListener() {
    var generateButton = document.getElementById('btn-generate');
    generateButton.addEventListener('click', event => {
        var worksheet = document.getElementById('worksheet');
        var pattern = document.getElementById('pattern');

        worksheet.classList.add('d-none');
        while( pattern.firstChild ) {
            pattern.removeChild(pattern.firstChild);
        }

        parse();
        createPattern();

        pattern.classList.remove('d-none');
    });
}

function addConstructionListener() {
    var constructionSelector = document.getElementById('select-direction');
    constructionSelector.addEventListener("change", event => {
        var changedTo = document.getElementById(event.target.id).value;
        if(changedTo === "") {
            document.getElementById("form-selvage").classList.add("d-none");
            document.getElementById("form-bind-off").classList.add("d-none");
        } else if(changedTo === "toeup") {
            document.getElementById("form-selvage").classList.add("d-none");
            document.getElementById("form-bind-off").classList.remove("d-none");
        } else if(changedTo === "cuffdown") {
            document.getElementById("form-selvage").classList.remove("d-none");
            document.getElementById("form-bind-off").classList.add("d-none");
        }
    });
}