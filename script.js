// Log script start
console.log("HELLO FROM MY SCRIPT!");

// ============================================================
// TEXT FITTING FUNCTIONS
// ============================================================

function fitTextToCell(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
        const parent = el.closest(".logo-cell");
        if (!parent) return;

        const maxWidth = parent.clientWidth * 0.9;
        const maxHeight = parent.clientHeight * 1.5;

        // Reset styles for calculation
        el.style.whiteSpace = "normal";
        el.style.display = "inline-block";
        el.style.lineHeight = "1.1";
        el.style.fontSize = "10px";

        let fontSize = 10;
        // Increase font size until the element's scroll dimensions exceed parent limits.
        while (el.scrollWidth <= maxWidth && el.scrollHeight <= maxHeight && fontSize < 1500) {
            fontSize += 1;
            el.style.fontSize = fontSize + "px";
        }
        // Use the last valid font size
        el.style.fontSize = fontSize - 1 + "px";
    });
}

function resizeHandler() {
    fitTextToCell(".logo-text");
}

window.addEventListener("load", resizeHandler);
window.addEventListener("resize", resizeHandler);

// ============================================================
// RESIZING & POSITIONING FUNCTIONS
// ============================================================

function resizeBackgroundCircle() {
    // Use 70% of the smaller viewport dimension for consistent scaling.
    const circRad = 0.7 * Math.min(window.innerHeight, window.innerWidth);
    const circleElem = document.getElementById("menu-background");
    if (circleElem) {
        circleElem.style.width = circRad + "px";
    }
}

function resizeNavIcon() {
    const circRad = 0.1 * Math.min(window.innerHeight, window.innerWidth);
    const navIcon = document.getElementById("nav-icon");
    if (navIcon) {
        navIcon.style.width = circRad + "px";
    }
}

function repositionNavIcon() {
    const circRad = 0.13 * Math.min(window.innerHeight, window.innerWidth);
    const menuContainer = document.getElementById("menu-container");
    if (!menuContainer) return;

    // Get the computed 'right' value (could be in px, vw, or other units)
    const style = window.getComputedStyle(menuContainer);
    let rightVal = style.right.trim();
    let currentRightPx = 0;

    if (rightVal.endsWith("px")) {
        currentRightPx = parseFloat(rightVal) || 0;
    } else if (rightVal.endsWith("vw")) {
        const vwValue = parseFloat(rightVal) || 0;
        currentRightPx = (vwValue / 100) * window.innerWidth;
    } else {
        currentRightPx = parseFloat(rightVal) || 0;
    }

    // Adjust position by a fraction of the radius.
    const newRightPx = currentRightPx + circRad * 0.1;
    menuContainer.style.right = newRightPx + "px";
}

// Attach resize events
window.addEventListener("resize", resizeBackgroundCircle);
window.addEventListener("resize", resizeNavIcon);
window.addEventListener("resize", repositionNavIcon);

// Run initial resize functions
resizeNavIcon();
resizeBackgroundCircle();
repositionNavIcon();

// ============================================================
// MENU ITEM POSITIONING
// ============================================================

function positionMenuItems() {
    const menuBackgroundElem = document.getElementById("menu-background");
    const navMenu = document.getElementById("nav-menu");
    if (!menuBackgroundElem || !navMenu) return;

    // Calculate the center of the menu background
    const mbRect = menuBackgroundElem.getBoundingClientRect();
    const mbCenterX = mbRect.left + mbRect.width / 2;
    const mbCenterY = mbRect.top + mbRect.height / 2;

    // Determine offset from the navMenu's origin
    const menuRect = navMenu.getBoundingClientRect();
    const offsetX = mbCenterX - menuRect.left;
    const offsetY = mbCenterY - menuRect.top;

    // Calculate the radius for placing items (85% of half the smaller dimension)
    const arcRadius = (0.85 * Math.min(mbRect.width, mbRect.height)) / 2;

    // Configure arc display
    const centerAngle = 180;
    const arcSpan = 120;
    const step = arcSpan / (menuItems.length - 1);
    const arcSpanRad = (arcSpan * Math.PI) / 180;
    const textHeight = (Math.sin(arcSpanRad) / 8) * arcRadius;

    // Position each menu item along the arc (reversed order)
    Array.from(menuItems)
        .reverse()
        .forEach((item, i) => {
            item.style.fontSize = textHeight + "px";
            const angleDeg = centerAngle - arcSpan / 2 + step * i;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = arcRadius * Math.cos(angleRad);
            const y = arcRadius * Math.sin(angleRad);

            // Adjust vertical centering of text
            const rect = item.getBoundingClientRect();
            const halfHeight = rect.height / 2;

            item.style.transform = `translate(${x + offsetX}px, ${y + offsetY - halfHeight}px)`;
        });
}

// ============================================================
// ORBIT ANIMATION & MENU INTERACTION
// ============================================================

// Get elements needed for orbit animation and menu logic
const orbitGroup = document.getElementById("orbit-group");
const orbitDot = document.querySelector("#orbit-group circle");
const path = document.getElementById("orbit-path");
const pathLength = path ? path.getTotalLength() : 0;
const clickArea = document.getElementById("click-area");
const navMenu = document.getElementById("nav-menu");
const menuBackground = document.getElementById("menu-background");
// Ensure menuItems is defined even if navMenu is missing
const menuItems = navMenu ? navMenu.querySelectorAll(".menu-item") : [];

let animating = false;
let menuOpen = false;

// Animate orbit along the SVG path
function animateOrbit(callback) {
    let progress = 0;
    console.log("animateOrbit started, progress=0, pathLength=", pathLength);

    function step() {
        console.log("Frame start | progress =", progress);
        if (!menuOpen) {
            animating = false;
            return;
        }
        progress += 0.05;
        if (progress >= 1) {
            animating = false;
            console.log("Orbit complete: progress >= 1. Calling callback if any...");
            if (callback) callback();
            return;
        }
        const point = path.getPointAtLength(pathLength * progress);
        console.log("Frame update | progress =", progress, "| x =", point.x, "| y =", point.y);

        orbitDot.setAttribute("cx", point.x);
        orbitDot.setAttribute("cy", point.y);
        requestAnimationFrame(step);
    }
    step();
}

// Set up clickArea event listeners for interaction
if (clickArea) {
    clickArea.addEventListener("mouseover", () => {
        console.log("Mouse over circle!");
    });

    clickArea.addEventListener("click", (e) => {
        console.log("clickArea was clicked!");
        e.stopPropagation();

        if (menuOpen) {
            console.log("Menu is open, closing it.");
            menuItems.forEach((item) => item.classList.remove("visible"));
            menuBackground.classList.remove("visible");
            menuOpen = false;
            animating = false;
            return;
        }

        if (animating) {
            console.log("…but animating is true, so ignoring click");
            return;
        }

        console.log("Opening menu and starting orbit animation.");
        animating = true;
        menuOpen = true;
        menuBackground.classList.add("visible");

        positionMenuItems();
        menuItems.forEach((item) => item.classList.add("visible"));
        animateOrbit(() => {
            console.log("Orbit animation completed.");
        });
    });
}

// Close menu if clicking outside navigation elements
document.addEventListener("click", (e) => {
    const navIcon = document.getElementById("nav-icon");
    if (!navIcon.contains(e.target) && !navMenu.contains(e.target)) {
        menuBackground.classList.remove("visible");
        menuItems.forEach((item) => item.classList.remove("visible"));
        menuOpen = false;
        animating = false;
    }
});

// Rotate orbitGroup based on scroll position
window.addEventListener("scroll", () => {
    if (orbitGroup) {
        const rotation = (window.scrollY * 0.7) % 360;
        orbitGroup.setAttribute("transform", `rotate(${rotation} 50 50)`);
    }
});
