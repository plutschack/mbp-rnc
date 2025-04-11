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
}

clickArea.addEventListener("click", (e) => {
    e.stopPropagation();

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

window.addEventListener("resize", resizeBackgroundCircle);
window.addEventListener("resize", resizeNavIcon);
window.addEventListener("resize", repositionNavIcon);
resizeNavIcon();
resizeBackgroundCircle();
repositionNavIcon();

function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

//----------menu arc----------//
function drawArc(arcRadius, arcSpan, centerAngle) {
    // The center of your nav icon’s SVG is defined by the circles at (50,50).
    const cx = 50;
    const cy = 50;

    // Calculate start and end angles from the center angle and arc span.
    const startAngle = centerAngle - arcSpan / 2; // e.g. -180 - 60 = -240
    const endAngle = centerAngle + arcSpan / 2; // e.g. -180 + 60 = -120

    // Helper to convert degrees to radians.
    const degToRad = (deg) => (deg * Math.PI) / 180;

    // Compute the start and end points, in SVG coordinates.
    const startX = cx + arcRadius * Math.cos(degToRad(startAngle));
    const startY = cy + arcRadius * Math.sin(degToRad(startAngle));
    const endX = cx + arcRadius * Math.cos(degToRad(endAngle));
    const endY = cy + arcRadius * Math.sin(degToRad(endAngle));

    // The largeArcFlag is 1 if the arc span is more than 180°, else 0.
    const largeArcFlag = arcSpan > 180 ? 1 : 0;
    // The sweep flag: 1 draws the arc clockwise.
    const sweepFlag = 1;

    // Build the SVG path data for an arc.
    // Format: M (startX,startY) A (arcRadius,arcRadius) 0 (largeArcFlag) (sweepFlag) (endX,endY)
    const pathData = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;

    // Try to get the path element with id="arc-path". If it doesn’t exist, create it.
    let arcPath = document.getElementById("arc-path");
    if (!arcPath) {
        const svg = document.getElementById("nav-icon"); // our SVG container
        arcPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arcPath.setAttribute("id", "arc-path");
        // Set some default styling for visibility.
        arcPath.setAttribute("stroke", "white");
        arcPath.setAttribute("stroke-width", "2");
        arcPath.setAttribute("fill", "none");
        svg.appendChild(arcPath);
    }
    arcPath.setAttribute("d", pathData);
}

// Example usage:
// Draw an arc with a radius of 40 (which fits the viewBox), an arc span of 120°, and centered at -180°.
drawArc(320, 120, -180);
