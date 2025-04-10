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

const orbitGroup = document.getElementById("orbit-group");

window.addEventListener("scroll", () => {
    const rotation = (window.scrollY * 0.7) % 360;
    orbitGroup.setAttribute("transform", `rotate(${rotation} 50 50)`);
});

const orbitDot = document.getElementById("orbit-group");
const path = document.getElementById("orbit-path");
const pathLength = path.getTotalLength();

let animationFrame;
let progress = 0;
let animating = false;

document.getElementById("nav-icon").addEventListener("click", () => {
    if (animating) return;
    animating = true;
    progress = 0;

    const animate = () => {
        progress += 0.01;
        if (progress >= 1) {
            progress = 1;
            animating = false;
        }

        const point = path.getPointAtLength(pathLength * progress);
        orbitDot.setAttribute("cx", point.x);
        orbitDot.setAttribute("cy", point.y);

        if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            // Trigger fade-in menu
            document.querySelectorAll(".menu-item").forEach((item, i) => {
                setTimeout(() => item.classList.add("visible"), i * 100);
            });
        }
    };

    animate();
});
