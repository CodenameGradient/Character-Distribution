// variables
var inputTextarea = document.getElementById("inputString"),
    outputContainer = document.getElementById("output"),
    caseToggle = document.getElementById("preserveCase"),
    downloadContainer = document.getElementById("download"),
    clearButton = document.getElementById("clearInput");

/**
 * Updates the output based on the input
 */
function processInput() {
    var string = inputTextarea.value,
        chars = string.split(""),
        result = {},
        preserveCase = document.querySelector('input[id="preserveCase"]').checked;

    chars.forEach(function(c) {
        if (!preserveCase) {
            c = c.toLowerCase();
        }

        if (result[c]) {
            result[c]++;
        } else {
            result[c] = 1;
        }
    });

    result = ksort(result);
    
    return result;
}

/**
 * Updates the output container
 * @param {*} result 
 */
function updateOutput(result) {
    outputContainer.innerHTML = '<ul id="outputList"></ul>';
    var outputList = document.getElementById("outputList");

    for (i in result) {

        var encI = encodeURI(i);

        // todo: unencoded values that are not normally visible should be replaced here
        if (encI === "%20") {
            encI = "(space)";
        } else if (encI === "%0A") {
            encI = "(return)";
        }

        outputList.innerHTML += '<li class="item"><span class="index">' + decodeURI(encI) + '</span> <span class="count">' + result[i] + '</span></li>';
    }

    if (inputTextarea.value.length < 1) {
        downloadContainer.style.display = "none";
    } else {
        downloadContainer.style.display = "block";
    }
}

/**
 * Sorts an object by index
 * From: https://gist.github.com/stiekel/95526f20ec6915a594c6
 * @param {*} obj 
 */
function ksort(obj) {
    var keys = Object.keys(obj).sort(),
        sortedObj = {};

    for (var i in keys) {
        sortedObj[keys[i]] = obj[keys[i]];
    }

    return sortedObj;
}

/**
 * Creates a file in the specified format to download/save.
 */
function download(type) {
    var result = processInput();

    if (Object.keys(result).length) {
        
        var linkElement = document.createElement("a");

        if (type === "csv") {
            var csvString = "character,count%0A";
            for (i in result) {
                csvString += i + "," + result[i] + "%0A";
            }
            linkElement.setAttribute("href", "data:text/plain;charset=utf-8," + csvString);
            linkElement.setAttribute("download", "character-distribution.csv");
        } else if (type === "json") {
            linkElement.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(result)));
            linkElement.setAttribute("download", "character-distribution.json");
        }

        linkElement.style.display = "none";
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

    } else {
        alert("Enter some text first!");
    }
}

// attach event listener to the primary textarea
inputTextarea.addEventListener("input", function(e) {
    updateOutput(processInput());
});

// attach event listener to the preserve case checkbox
caseToggle.addEventListener("change", function(e) {
    updateOutput(processInput());
});

// attach event listener to the clear button
clearInput.addEventListener("click", function(e) {
    inputTextarea.value = "";
    updateOutput(processInput());
});
