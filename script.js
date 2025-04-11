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

function resizeBackgroundCircle() {
    const circRadH = window.innerHeight * 0.7;
    const circRadW = window.innerWidth * 0.7;

    const circRad = circRadH < circRadW ? circRadH : circRadW;
    const circleElem = document.getElementById("menu-background");
    circleElem.style.width = circRad + "px";
}

function resizeNavIcon() {
    const circRadH = window.innerHeight * 0.1;
    const circRadW = window.innerWidth * 0.1;
    const circRad = Math.min(circRadH, circRadW);

    const circleElem = document.getElementById("nav-icon");
    circleElem.style.width = circRad + "px";
}

function repositionNavIcon() {
    const circRadH = window.innerHeight * 0.13;
    const circRadW = window.innerWidth * 0.13;
    const circRad = Math.min(circRadH, circRadW);

    const container = document.getElementById("menu-container");

    // Get the computed 'right' value (may be "15vw", "200px", "", etc.)
    const style = window.getComputedStyle(container);
    let rightVal = style.right.trim();

    // Convert from whatever to a pixel number:
    let currentRightPx = 0;

    if (rightVal.endsWith("px")) {
        currentRightPx = parseFloat(rightVal) || 0;
    } else if (rightVal.endsWith("vw")) {
        const numericPart = parseFloat(rightVal) || 0;
        // Convert that many vw to px
        currentRightPx = (numericPart / 100) * window.innerWidth;
    } else {
        // If it's blank or some other unit, just parseFloat or default to 0
        currentRightPx = parseFloat(rightVal) || 0;
    }

    // Now add circRad*5.5 (which is px)
    const newRightPx = currentRightPx + circRad * 0.1;

    container.style.right = newRightPx + "px";
}

window.addEventListener("resize", resizeBackgroundCircle);
window.addEventListener("resize", resizeNavIcon);
window.addEventListener("resize", repositionNavIcon);
resizeNavIcon();
resizeBackgroundCircle();
repositionNavIcon();

function positionMenuItems() {
    // 1) Get the on-page center of the menu-background
    const mbRect = document.getElementById("menu-background").getBoundingClientRect();
    const mbCenterX = mbRect.left + mbRect.width / 2;
    const mbCenterY = mbRect.top + mbRect.height / 2;

    // 2) The parent container of .menu-item elements
    const menuParent = document.getElementById("nav-menu");
    const parentRect = menuParent.getBoundingClientRect();
    const parentOriginX = parentRect.left;
    const parentOriginY = parentRect.top;

    // 3) The offset from the parent’s (0,0) to the background’s center
    const offsetX = mbCenterX - parentOriginX;
    const offsetY = mbCenterY - parentOriginY;

    const arcRadiusH = (mbRect.height / 2) * 0.85;
    const arcRadiusW = (mbRect.width / 2) * 0.85;

    const arcRadius = Math.min(arcRadiusH, arcRadiusW);

    const container = document.getElementById("menu-background");

    const centerAngle = 180;
    const arcSpan = 120;
    const arcSpanRad = arcSpan * (Math.PI / 180);
    const step = arcSpan / (menuItems.length - 1);
    const textHeight = (Math.sin(arcSpanRad) / 8) * arcRadius;
    const reversedItems = Array.from(menuItems).reverse();

    reversedItems.forEach((item, i) => {
        item.style.fontSize = textHeight + "px";
        const angleDeg = centerAngle - arcSpan / 2 + step * i;
        const angleRad = angleDeg * (Math.PI / 180);
        const x = arcRadius * Math.cos(angleRad);
        const y = arcRadius * Math.sin(angleRad);

        const rect = item.getBoundingClientRect();
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;

        item.style.transform = `translate(${x + offsetX}px, ${y + offsetY - halfH}px)`;
    });
}

// Scroll rotation
const orbitGroup = document.getElementById("orbit-group");

window.addEventListener("scroll", () => {
    const rotation = (window.scrollY * 0.7) % 360;
    orbitGroup.setAttribute("transform", `rotate(${rotation} 50 50)`);
});

// Orbit animation and menu logic
const orbitDot = document.querySelector("#orbit-group circle");
const path = document.getElementById("orbit-path");
const pathLength = path.getTotalLength();
const clickArea = document.getElementById("click-area");
const navMenu = document.getElementById("nav-menu");
const menuItems = navMenu.querySelectorAll(".menu-item");
const menuBackground = document.getElementById("menu-background");

let animating = false;
let menuOpen = false;

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
    console.log(progress, point.x, point.y);
}

clickArea.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Clicked clickArea!");

    if (animating) return;

    if (menuOpen) {
        menuItems.forEach((item) => item.classList.remove("visible"));
        document.getElementById("menu-background").classList.remove("visible");
        menuOpen = false;
        return;
    }

    animating = true;
    menuOpen = true;
    document.getElementById("menu-background").classList.add("visible");

    positionMenuItems();
    menuItems.forEach((item) => item.classList.add("visible"));
    animateOrbit();
});

document.addEventListener("click", (e) => {
    const navIcon = document.getElementById("nav-icon");

    if (!navIcon.contains(e.target) && !navMenu.contains(e.target)) {
        document.getElementById("menu-background").classList.remove("visible");
        menuOpen = false;
    }
});
