function fitTextToCell(cellSelector) {
    const el = document.querySelector(cellSelector);
    if (!el) return;

    const parent = el.closest("td");
    let fontSize = 10;
    el.style.fontSize = fontSize + "px";

    const maxWidth = parent.clientWidth * 0.95;
    const maxHeight = parent.clientHeight * 0.95;

    while (el.scrollWidth <= maxWidth && el.scrollHeight <= maxHeight && fontSize < 1000) {
        fontSize += 1;
        el.style.fontSize = fontSize + "px";
    }

    el.style.fontSize = fontSize - 1 + "px";
}

function resizeHandler() {
    fitTextToCell(".cell-text");
}

window.addEventListener("load", resizeHandler);
window.addEventListener("resize", resizeHandler);
