gsap.registerPlugin(ScrollTrigger);

/* ========================================
   LENIS
======================================== */

const lenis = new Lenis({
    infinite: true,
    smoothWheel: true,
    syncTouch: true,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* ========================================
   ELEMENTS
======================================== */

const contactInfo = document.querySelector(".contact-info");
const contactVisual = document.querySelector(".contact-visual");
const contactIcon = document.querySelector(".contact-icon i");
const iconNumber = document.querySelector(".icon-number");

const contactRowMaxGap = window.innerWidth < 1000 ? 5 : 10;

/* ========================================
   IMPORTANT
   CLONE THE WHOLE CONTACT SECTION
======================================== */

for (let i = 0; i < 10; i++) {
    const clone = contactInfo.cloneNode(true);

    contactInfo.parentElement.appendChild(clone);
}

/* ========================================
   GET ALL ROWS AFTER CLONING
======================================== */

const contactRows = document.querySelectorAll(".contact-info-row");

/* ========================================
   VISUAL CENTER
======================================== */

function getVisualCenter() {
    return contactVisual.offsetTop + contactVisual.offsetHeight / 2;
}

/* ========================================
   ROW GAP ANIMATION
======================================== */

contactRows.forEach((row) => {
    ScrollTrigger.create({
        trigger: row,

        start: () => `top+=${getVisualCenter() - 550} center`,

        end: () => `top+=${getVisualCenter() - 450} center`,

        scrub: true,

        onUpdate: (self) => {
            const gap = 1 + (contactRowMaxGap - 1) * self.progress;

            row.style.gap = `${gap}rem`;
        },
    });

    ScrollTrigger.create({
        trigger: row,

        start: () => `top+=${getVisualCenter() - 400} center`,

        end: () => `top+=${getVisualCenter() - 300} center`,

        scrub: true,

        onUpdate: (self) => {
            const gap =
                contactRowMaxGap - (contactRowMaxGap - 1) * self.progress;

            row.style.gap = `${gap}rem`;
        },
    });
});

/* ========================================
   ICONS
======================================== */

const iconMap = {
    "01": "fa-at",
    "02": "fa-clock",
    "03": "fa-envelope",
    "04": "fa-briefcase",
    "05": "fa-handshake",
    "06": "fa-user-tie",
    "07": "fa-phone",
    "08": "fa-share-nodes",
};

const allIcons = Object.values(iconMap);

let lastCenteredRow = null;

/* ========================================
   CHANGE ICON
======================================== */

function changeIcon(row) {
    const number = row.dataset.number;

    if (!number) return;

    const nextIcon = iconMap[number];

    if (!nextIcon) return;

    /* remove previous icons */
    allIcons.forEach((icon) => {
        contactIcon.classList.remove(icon);
    });

    /* add new icon */
    contactIcon.classList.add(nextIcon);

    /* update number */
    if (iconNumber) {
        iconNumber.textContent = number;
    }

    /* icon animation */
    gsap.fromTo(
        contactIcon,
        {
            opacity: 0,
            scale: 0.55,
            rotation: -20,
        },
        {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.45,
            ease: "back.out(1.8)",
            overwrite: true,
        },
    );

    /* active row */
    gsap.to(row.querySelector("p:last-child"), {
        color: "#d9ff65",
        duration: 0.3,
        overwrite: true,
    });
}

/* ========================================
   CENTER DETECTION
======================================== */

function checkCenteredRow() {
    const viewportCenter = window.innerHeight / 2;

    let closestRow = null;
    let minDistance = Infinity;

    contactRows.forEach((row) => {
        const rect = row.getBoundingClientRect();

        const rowCenter = rect.top + rect.height / 2;

        const distance = Math.abs(rowCenter - viewportCenter);

        if (distance < minDistance && distance < 35) {
            minDistance = distance;
            closestRow = row;
        }
    });

    if (closestRow && closestRow !== lastCenteredRow) {
        lastCenteredRow = closestRow;

        changeIcon(closestRow);
    }
}

/* ========================================
   LENIS SCROLL
======================================== */

lenis.on("scroll", () => {
    checkCenteredRow();
});

/* ========================================
   INITIAL ICON
======================================== */

const firstRow = document.querySelector(".contact-info-row");

if (firstRow) {
    changeIcon(firstRow);
}

/* ========================================
   RESIZE
======================================== */

window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});
