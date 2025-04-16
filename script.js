// Log script start
console.log("HELLO FROM MBP R&C!");

// At load time:
// Run initial resize functions
let initialInnerHeight = window.innerHeight;
let initialInnerWidth = window.innerWidth;
const dimensionThreshold = 75; // Ignore changes smaller than 75px

resizeNavIcon();
repositionNavIcon();
adjustParagraphFontSizes();
fitTextToCell();
fitSmallLogoTextToCell();

// Consolidated resizeHandler: Only recalc if the difference is significant.
function resizeHandler() {
    if (
        Math.abs(window.innerHeight - initialInnerHeight) > dimensionThreshold ||
        Math.abs(window.innerWidth - initialInnerWidth) > dimensionThreshold
    ) {
        initialInnerHeight = window.innerHeight;
        initialInnerWidth = window.innerWidth;
        // All functions which need recalculation
        resizeNavIcon();
        repositionNavIcon();
        adjustParagraphFontSizes();
        fitTextToCell();
        fitSmallLogoTextToCell();
    }
}

// Remove duplicate listeners by combining them:
let resizeScheduled = false;
let resizeTimeout;

window.addEventListener("resize", () => {
    // Immediate update on the next available frame
    if (!resizeScheduled) {
        resizeScheduled = true;
        requestAnimationFrame(() => {
            resizeHandler();
            resizeScheduled = false;
        });
    }
    // Debounced call (fires after 300ms inactivity)
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeHandler();
    }, 300);
});

// Orientation change - allow layout to settle
window.addEventListener("orientationchange", () => {
    setTimeout(() => {
        initialInnerHeight = window.innerHeight;
        initialInnerWidth = window.innerWidth;
        resizeNavIcon();
        repositionNavIcon();
        adjustParagraphFontSizes();
        fitTextToCell();
        fitSmallLogoTextToCell();
    }, 300);
});

// ============================================================
// TEXT FITTING FUNCTIONS
// ============================================================
// LARGE LOGO TEXT FITTING
function fitTextToCell() {
    const logoText = document.getElementsByClassName("logo-text")[0];
    const logoPlaceholder = document.getElementsByClassName("logo-placeholder")[0];
    if (!logoText) return;
    const textSize = 0.85 * Math.min(initialInnerHeight / 2, initialInnerWidth / 3);
    logoText.style.fontSize = textSize + "px";
    logoText.classList.add("visible");
    if (initialInnerHeight / 2 == Math.min(initialInnerHeight / 2, initialInnerWidth / 3)) {
        logoPlaceholder.style.height = initialInnerHeight + "px";
    } else {
        logoPlaceholder.style.height = (initialInnerWidth * 2) / 3 + "px";
    }
}

function fitSmallLogoTextToCell() {
    const logoText = document.getElementsByClassName("small-logo-text")[0];
    const logoPlaceholder = document.getElementsByClassName("small-logo-placeholder")[0];
    if (!logoText) return;
    const textSize = 0.1 * Math.min(initialInnerHeight / 2, initialInnerWidth / 3);
    logoText.style.fontSize = textSize + "px";
    logoText.style.top = initialInnerHeight * 0.05 + "px";
    if (initialInnerHeight / 2 == Math.min(initialInnerHeight / 2, initialInnerWidth / 3)) {
        logoPlaceholder.style.height = initialInnerHeight * 0.1 + "px";
    } else {
        logoPlaceholder.style.height = ((initialInnerWidth * 2) / 3) * 0.1 + "px";
    }
}

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

    // Get container dimensions from the background container element.
    const backgroundContainer = document.querySelector(".background-container");
    const containerHeight = backgroundContainer.offsetHeight;
    const containerWidth = backgroundContainer.offsetWidth;
    const totalArea = containerHeight * containerWidth; // in px²

    // Calculate the polygon's area (converting from normalized area to pixel area)
    const polyArea = polygonArea(vertices) * (totalArea / 10000);
    const emptyArea = totalArea - polyArea;

    // Select all paragraphs (both right and left) and neon buttons
    const rightParagraphs = document.querySelectorAll("p.right");
    const leftParagraphs = document.querySelectorAll("p.left");
    const neonButtons = document.querySelectorAll(".neon-glow-button");

    // Combine all paragraph elements to determine the longest text
    const allParagraphs = [...rightParagraphs, ...leftParagraphs];
    let longestText = "";
    allParagraphs.forEach((el) => {
        if (el.textContent.length > longestText.length) {
            longestText = el.textContent;
        }
    });
    const totalChars = longestText.length;

    if (totalChars > 0 && (rightParagraphs.length || leftParagraphs.length || neonButtons.length)) {
        // Calculate font size based on the empty area and the length of the longest text.
        // (2 * totalChars) adjusts the result; tweak the divisor as needed.
        const result = Math.sqrt(emptyArea / (2 * totalChars));

        // Use the result (times a correction factor if necessary) as the pixel font size.
        const correctionFactor = 1.0;
        const pixelFontSize = result * correctionFactor;

        // Apply the computed font size to all matching elements.
        rightParagraphs.forEach((el) => (el.style.fontSize = pixelFontSize + "px"));
        leftParagraphs.forEach((el) => (el.style.fontSize = pixelFontSize + "px"));
        neonButtons.forEach((el) => (el.style.fontSize = pixelFontSize + "px"));

        console.log("Longest text character count:", totalChars);
        console.log("Polygon area (px²):", polyArea);
        console.log("Empty area (px²):", emptyArea);
        console.log("Computed font-size value (px):", pixelFontSize);
    }
}

// ============================================================
// RESIZING & POSITIONING FUNCTIONS
// ============================================================

// Select the small-logo-text element.
// Select the small-logo-text element.
const largeLogo = document.querySelector(".logo-cell");

if (largeLogo) {
    // Create an observer instance with a callback
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log("Large logo is on the screen");
                } else {
                    console.log("Large logo is off the screen");
                }
            });
        },
        {
            // You can adjust the threshold as needed; a threshold of 0 means even a pixel visible counts.
            threshold: [0]
        }
    );

    const totalScrollHeight = document.documentElement.scrollHeight;
    const largeLogoScrollHeight = largeLogo.scrollHeight;
    console.log("Total scroll height in px:", totalScrollHeight);
    console.log("Large logo scroll height in px:", largeLogoScrollHeight);

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        console.log("Current scroll position:", currentScroll);
    });

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        console.log("Current scroll position:", currentScroll);
        // Check the scroll position and update the 'top' CSS property accordingly.
        if (currentScroll < largeLogoScrollHeight / 2) {
            largeLogo.style.position = "fixed";
            largeLogo.classList.remove("faded");
        } else {
            largeLogo.classList.remove("visible");
            largeLogo.classList.add("faded");
        }
    });

    // Start observing the target element
    observer.observe(largeLogo);
}

function resizeBackgroundCircle() {
    // Use 70% of the smaller viewport dimension for consistent scaling.
    const circRad = 1.0 * initialInnerHeight;
    const circleElem = document.getElementById("menu-background");
    if (circleElem) {
        circleElem.style.width = circRad + "px";
    }
}

function resizeNavIcon() {
    const circRad = 0.1 * Math.min(initialInnerHeight, initialInnerWidth);
    const navIcon = document.getElementById("nav-icon");
    const marginCells = document.getElementsByClassName("margin-cell");
    const contentCells = document.getElementsByClassName("background-container");

    if (navIcon) {
        navIcon.style.width = circRad + "px";
        // Check if marginCells exists and then convert it to an array to iterate over it.
        if (marginCells) {
            Array.from(marginCells).forEach((cell) => {
                cell.style.width = circRad * 1.5 + "px";
            });
        }
        if (contentCells) {
            Array.from(contentCells).forEach((cell) => {
                cell.style.width = initialInnerWidth - circRad * 3.5 + "px";
            });
        }
    }
}

function repositionNavIcon() {
    const circRad = 0.1 * Math.min(initialInnerHeight, initialInnerWidth);
    const menuContainer = document.getElementById("menu-container");
    if (menuContainer) {
        menuContainer.style.left = circRad * 2.5 + initialInnerWidth - circRad * 3.5 + "px";
    }
}

const clickArea = document.getElementById("click-area");
if (clickArea) {
    const rect = clickArea.getBoundingClientRect();
    const distanceFromRight = initialInnerWidth - rect.right;
    console.log("Distance from the right edge of the click-area to the right side of the screen:", distanceFromRight, "px");
}

// Attach resize events
//window.addEventListener("resize", resizeBackgroundCircle);
//window.addEventListener("resize", resizeNavIcon);
//window.addEventListener("resize", repositionNavIcon);

// ============================================================
// MENU ITEM POSITIONING
// ============================================================

function positionMenuItems() {
    resizeBackgroundCircle();
    const menuItems = document.querySelectorAll(".menu-item");
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
    const arcRadius = (0.9 * mbRect.height) / 2;

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
            console.log("menu item", i);
            if (i == 0) {
                item.style.transform = `translate(${x + offsetX + -20}px, ${y + offsetY - halfHeight + 5}px)`;
            } else if (i == 8) {
                item.style.transform = `translate(${x + offsetX + 20}px, ${y + offsetY - halfHeight + -5}px)`;
            } else {
                item.style.transform = `translate(${x + offsetX}px, ${y + offsetY - halfHeight}px)`;
            }
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
let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            if (orbitGroup) {
                // Use a stable innerWidth/innerHeight instead of outer dimensions if possible.
                const rotation = (window.scrollY * 0.7) % 360;
                orbitGroup.setAttribute("transform", `rotate(${rotation} 50 50)`);
            }
            ticking = false;
        });
        ticking = true;
    }
});
