
// https://stackoverflow.com/a/33946647
function copyToClipboard(textToCopy) {
    // Create a dummy input to copy the string array inside it
    var dummy = document.createElement("textarea");

    // Add it to the document
    document.body.appendChild(dummy);

    // Set its ID
    dummy.setAttribute("id", "dummy_id");

    // Output the array into it
    document.getElementById("dummy_id").value=textToCopy;

    // Select it
    dummy.select();

    // Copy its contents
    document.execCommand("copy");

    // Remove it as its not needed anymore
    document.body.removeChild(dummy);
}

function hoverInfoIcon(element) {
    element.setAttribute('src', 'images/info-icon-64x64.png');
}

function unhoverInfoIcon(element) {
    element.setAttribute('src', 'images/info-icon-grey-64x64.png');
}
