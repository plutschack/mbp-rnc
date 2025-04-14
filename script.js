// Log script start
console.log("HELLO FROM MBP R&C!");

// ============================================================
// TEXT FITTING FUNCTIONS
// ============================================================

function fitTextToCell(selector) {
    const logoText = document.getElementsByClassName("logo-text")[0];
    if (!logoText) return;
    const textSize = 0.85 * Math.min(window.innerHeight / 2, window.innerWidth / 3);
    logoText.style.fontSize = textSize + "px";
}

function resizeHandler() {
    fitTextToCell(".logo-text");
}

window.addEventListener("load", resizeHandler);
window.addEventListener("resize", resizeHandler);

function adjustParagraphFontSizes() {
    // Calculate polygon area using the shoelace formula.
    function polygonArea(vertices) {
        let area = 0;
        const n = vertices.length;
        for (let i = 0; i < n; i++) {
            const [x_i, y_i] = vertices[i];
            const [x_j, y_j] = vertices[(i + 1) % n]; // wrap-around
            area += x_i * y_j - x_j * y_i;
        }
        return Math.abs(area) / 2;
    }

    // Define your polygon vertices (in percentage units)
    const vertices = [
        [50, 100],
        [100, 100],
        [62.61, 96],
        [42.39, 83.67],
        [26.24, 67.35],
        [13.1, 48.94],
        [4.03, 25.45],
        [0, 0],
        [0, 100]
    ];

    // Assume the container is 100 x 100 (percentage units)
    const totalArea = 100 * 100; // 10,000 square units

    // Calculate the polygon's area and the empty area
    const polyArea = polygonArea(vertices);
    const emptyArea = totalArea - polyArea;

    // Select all the elements you want to adjust
    const rightParagraphs = document.querySelectorAll(".cell-text p.right");
    const leftParagraphs = document.querySelectorAll(".cell-text p.left");
    const neonButtons = document.querySelectorAll(".neon-glow-button");

    if (rightParagraphs.length || leftParagraphs.length || neonButtons.length) {
        // For demonstration, use the text from the first right paragraph for char count
        const sampleText = (rightParagraphs[0] ? rightParagraphs[0].textContent : "") || "";
        const totalChars = sampleText.length;
        const result = Math.sqrt(emptyArea / totalChars);

        // Convert from the 100x100 system to pixels using a reference container.
        const cellText = document.querySelector(".cell-text");
        if (cellText) {
            const containerWidthPx = cellText.offsetWidth;
            const pixelConversionFactor = containerWidthPx / 100;
            const correctionFactor = 0.8;
            const pixelFontSize = result * pixelConversionFactor * correctionFactor;

            // Apply the computed font size to all matching elements.
            rightParagraphs.forEach((el) => (el.style.fontSize = pixelFontSize + "px"));
            leftParagraphs.forEach((el) => (el.style.fontSize = pixelFontSize + "px"));
            neonButtons.forEach((el) => (el.style.fontSize = pixelFontSize + "px"));

            console.log("Total Characters:", totalChars);
            console.log("Polygon area:", polyArea);
            console.log("Empty area:", emptyArea);
            console.log("Computed font-size value (px):", pixelFontSize);
        }
    }
}

// Run the function after page load and on window resize to adjust dynamically.
window.addEventListener("load", adjustParagraphFontSizes);
window.addEventListener("resize", adjustParagraphFontSizes);

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

const clickArea = document.getElementById("click-area");
if (clickArea) {
    const rect = clickArea.getBoundingClientRect();
    const distanceFromRight = window.innerWidth - rect.right;
    console.log("Distance from the right edge of the click-area to the right side of the screen:", distanceFromRight, "px");
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
// Set up event listeners for both #click-area and #center-dot so they trigger the same behavior.
const clickableElements = document.querySelectorAll("#click-area, #center-dot");

if (clickableElements.length) {
    clickableElements.forEach((element) => {
        // Mouseover for both clickable elements.
        element.addEventListener("mouseover", () => {
            console.log("Mouse over clickable element!");
        });

        // Click listener for both clickable elements.
        element.addEventListener("click", (e) => {
            console.log("A clickable element was clicked!");
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
