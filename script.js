function fitTextToCell(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        const parent = el.closest(".logo-cell");
        if (!parent) return;

        const maxWidth = parent.clientWidth * 0.9;
        const maxHeight = parent.clientHeight * 1.5;

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

// Scroll rotation
const orbitGroup = document.getElementById("orbit-group");

window.addEventListener("scroll", () => {
    const rotation = (window.scrollY * 0.7) % 360;
    orbitGroup.setAttribute("transform", `rotate(${rotation} 50 50)`);
});

// Orbit animation and menu logic
const orbitDot = document.getElementById("orbit-group");
const path = document.getElementById("orbit-path");
const pathLength = path.getTotalLength();
const clickArea = document.getElementById("click-area");
const navMenu = document.getElementById("nav-menu");
const menuItems = navMenu.querySelectorAll(".menu-item");
const baseOffsetX = -110;
const baseOffsetY = -55;

let animating = false;
let menuOpen = false;

function positionMenuItems() {
    const arcRadius = 320;
    const centerAngle = -180;
    const arcSpan = 120;
    const step = arcSpan / (menuItems.length - 1);

    menuItems.forEach((item, i) => {
        const angleDeg = centerAngle - arcSpan / 2 + step * i;
        const angleRad = angleDeg * (Math.PI / 180);
        const x = arcRadius * Math.cos(angleRad);
        const y = arcRadius * Math.sin(angleRad);
        item.style.transform = `translate(${x + baseOffsetX}px, ${y + baseOffsetY}px)`;
    });
}

function animateOrbit(callback) {
    let progress = 0;
    const step = () => {
        progress += 0.05;
        if (progress >= 1) {
            animating = false;
            callback?.();
            return;
        }
        const point = path.getPointAtLength(pathLength * progress);
        orbitDot.setAttribute("cx", point.x);
        orbitDot.setAttribute("cy", point.y);
        requestAnimationFrame(step);
    };
    step();
}

clickArea.addEventListener("click", (e) => {
    e.stopPropagation();

    if (animating || menuOpen) return;

    animating = true;
    menuOpen = true;

    positionMenuItems();
    menuItems.forEach((item) => item.classList.add("visible"));
    animateOrbit();
});

document.addEventListener("click", (e) => {
    const navIcon = document.getElementById("nav-icon");

    if (!navIcon.contains(e.target) && !navMenu.contains(e.target)) {
        menuItems.forEach((item) => item.classList.remove("visible"));
        menuOpen = false;
    }
});
