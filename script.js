function fitTextToCell(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        const parent = el.closest(".cell");
        if (!parent) return;

        const maxWidth = parent.clientWidth * 0.9;
        const maxHeight = parent.clientHeight * 0.9;

        let fontSize = 10;
        el.style.fontSize = fontSize + "px";

        while (el.scrollWidth <= maxWidth && el.scrollHeight <= maxHeight && fontSize < 1000) {
            fontSize += 1;
            el.style.fontSize = fontSize + "px";
        }

        el.style.fontSize = fontSize - 1 + "px";
    });
}

function resizeHandler() {
    fitTextToCell(".cell-text");
}

window.addEventListener("load", resizeHandler);
window.addEventListener("resize", resizeHandler);
