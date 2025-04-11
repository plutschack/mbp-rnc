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
const menuBackground = document.getElementById("menu-background");

let animating = false;
let menuOpen = false;

function positionMenuItems() {
    // Read the values from CSS custom properties
    const arcRadiusStr = 320;
    const baseOffsetXStr = window.innerWidth * 0;
    const baseOffsetYStr = window.innerHeight * 0;

    const arcRadius = parseFloat(arcRadiusStr);
    const baseOffsetX = parseFloat(baseOffsetXStr);
    const baseOffsetY = parseFloat(baseOffsetYStr);

    const centerAngle = 180;
    const arcSpan = 120;
    const step = arcSpan / (menuItems.length - 1);
    const reversedItems = Array.from(menuItems).reverse();

    reversedItems.forEach((item, i) => {
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
