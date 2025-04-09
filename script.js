function fitTextToCell(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        const parent = el.closest(".logo-cell");
        if (!parent) return;

        const maxWidth = parent.clientWidth * 0.9;
        const maxHeight = parent.clientHeight * 1.5;

        // Allow multi-line growth
        el.style.whiteSpace = "normal";
        el.style.display = "inline-block";
        el.style.lineHeight = "1.1";
        el.style.fontSize = "10px";

        let fontSize = 10;

        while (el.scrollWidth <= maxWidth && el.scrollHeight <= maxHeight && fontSize < 1500) {
            fontSize += 1;
            el.style.fontSize = fontSize + "px";
        }

        el.style.fontSize = fontSize - 1 + "px";
    });
}

function resizeHandler() {
    fitTextToCell(".logo-text");
}

window.addEventListener("load", resizeHandler);
window.addEventListener("resize", resizeHandler);

function fitFloatedText() {
    const topShape = document.querySelector(".shape-floater.top");
    const bottomShape = document.querySelector(".shape-floater.bottom");
    const paragraphs = document.querySelectorAll(".cell-text > p");
    if (paragraphs.length < 2) return;

    const [rightP, leftP] = paragraphs;

    // Reset styles
    rightP.style.display = "block";
    leftP.style.display = "block";
    rightP.style.fontSize = leftP.style.fontSize = "10px";

    const availableHeight = topShape.offsetHeight;
    const maxHeight = availableHeight * 0.85;
    const minHeight = availableHeight * 0.35;

    // Fit font size for top/right paragraph
    let fontSize = 10;
    while (rightP.scrollHeight < maxHeight && fontSize < 100) {
        fontSize++;
        rightP.style.fontSize = fontSize + "px";
    }
    rightP.style.fontSize = fontSize - 1 + "px";

    // If bottom paragraph fits in top, hide it
    const bottomFits = rightP.scrollHeight + leftP.scrollHeight < topShape.offsetHeight;
    if (bottomFits) {
        leftP.style.display = "none";
    } else {
        // Else fit bottom paragraph to the lower left
        let fontSizeLeft = 10;
        while (leftP.scrollHeight < bottomShape.offsetHeight * 0.8 && fontSizeLeft < 100) {
            fontSizeLeft++;
            leftP.style.fontSize = fontSizeLeft + "px";
        }
        leftP.style.fontSize = fontSizeLeft - 1 + "px";
    }
}

window.addEventListener("load", fitFloatedText);
window.addEventListener("resize", fitFloatedText);
