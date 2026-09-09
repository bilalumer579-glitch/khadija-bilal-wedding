/* =====================================
TAP TO OPEN + BIG LIGHT EFFECT
===================================== */

const openButton = document.getElementById("openButton");
const openingScreen = document.getElementById("openingScreen");

openButton.addEventListener("click", function () {

    /* MAIN LIGHT */
    const light = document.createElement("div");
    light.className = "opening-light";
    document.body.appendChild(light);

    /* LIGHT RAYS */
    for (let i = 0; i < 18; i++) {

        const ray = document.createElement("div");

        ray.className = "light-ray";

        ray.style.setProperty(
            "--angle",
            (i * 20) + "deg"
        );

        document.body.appendChild(ray);

        setTimeout(() => {
            ray.remove();
        }, 1800);
    }

    /* SPARKLES */
    for (let i = 0; i < 45; i++) {

        const sparkle = document.createElement("div");

        sparkle.className = "opening-sparkle";

        sparkle.style.left =
            Math.random() * 100 + "vw";

        sparkle.style.top =
            Math.random() * 100 + "vh";

        sparkle.style.animationDelay =
            Math.random() * 0.4 + "s";

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1800);
    }

    /* START LIGHT */
    requestAnimationFrame(() => {
        light.classList.add("light-active");
    });

    /* OPEN SCREEN */
    openingScreen.classList.add("opened");

    setTimeout(() => {

        openingScreen.style.display = "none";

    }, 1000);

    setTimeout(() => {

        light.remove();

    }, 1800);

});


/* =====================================
SCRATCH CARD
===================================== */

const canvas = document.getElementById("scratchCanvas");
const heart = document.getElementById("scratchHeart");

const ctx = canvas.getContext("2d");

let scratching = false;

let scratchFinished = false;


/* =====================================
CANVAS SIZE
===================================== */

function setupCanvas() {

    const rect = heart.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawScratchLayer(
        rect.width,
        rect.height
    );

}


/* =====================================
DRAW SCRATCH COVER
===================================== */

function drawScratchLayer(width, height) {

    ctx.globalCompositeOperation =
        "source-over";


    /* Scratch layer gradient */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            width,
            height
        );

    gradient.addColorStop(
        0,
        "#e8b6c6"
    );

    gradient.addColorStop(
        0.5,
        "#d79aae"
    );

    gradient.addColorStop(
        1,
        "#c9849d"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Little shimmer dots */

    for (let i = 0; i < 100; i++) {

        const x =
            Math.random() * width;

        const y =
            Math.random() * height;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            Math.random() * 2 + 0.5,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,255,255," +
            (Math.random() * 0.3 + 0.15) +
            ")";

        ctx.fill();

    }


    /* SCRATCH ME */

    ctx.fillStyle =
        "rgba(255,255,255,.9)";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.font =
        `${Math.max(17, width * 0.04)}px Georgia`;

    ctx.fillText(
        "♡  SCRATCH ME  ♡",
        width / 2,
        height / 2
    );

}


/* =====================================
SCRATCH FUNCTION
===================================== */

function scratch(x, y) {

    const rect =
        canvas.getBoundingClientRect();

    const mouseX =
        x - rect.left;

    const mouseY =
        y - rect.top;

    ctx.globalCompositeOperation =
        "destination-out";


    /* Big soft scratch brush */

    const brushSize =
        Math.max(
            35,
            rect.width * 0.07
        );

    ctx.beginPath();

    ctx.arc(
        mouseX,
        mouseY,
        brushSize,
        0,
        Math.PI * 2
    );

    ctx.fill();

    checkScratchPercentage();

}


/* =====================================
MOUSE
===================================== */

canvas.addEventListener(
    "mousedown",
    function (e) {

        scratching = true;

        scratch(
            e.clientX,
            e.clientY
        );

    }
);


window.addEventListener(
    "mouseup",
    function () {

        scratching = false;

    }
);


canvas.addEventListener(
    "mousemove",
    function (e) {

        if (!scratching) return;

        scratch(
            e.clientX,
            e.clientY
        );

    }
);


/* =====================================
TOUCH / MOBILE
===================================== */

canvas.addEventListener(
    "pointerdown",
    function (e) {

        scratching = true;

        canvas.setPointerCapture(
            e.pointerId
        );

        scratch(
            e.clientX,
            e.clientY
        );

    }
);


canvas.addEventListener(
    "pointermove",
    function (e) {

        if (!scratching) return;

        scratch(
            e.clientX,
            e.clientY
        );

    }
);


canvas.addEventListener(
    "pointerup",
    function () {

        scratching = false;

    }
);


/* =====================================
CHECK SCRATCH %
===================================== */

let checking = false;

function checkScratchPercentage() {

    if (
        checking ||
        scratchFinished
    ) return;

    checking = true;


    setTimeout(() => {

        const imageData =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

        const pixels =
            imageData.data;

        let transparent = 0;

        let total = 0;


        /* Check every few pixels */

        for (
            let i = 3;
            i < pixels.length;
            i += 40
        ) {

            total++;

            if (pixels[i] < 50) {

                transparent++;

            }

        }


        const percent =
            (transparent / total) * 100;


        /* 35% scratched */

        if (percent > 35) {

            finishScratch();

        }


        checking = false;

    }, 180);

}


/* =====================================
FINISH SCRATCH
===================================== */

function finishScratch() {

    if (scratchFinished) return;

    scratchFinished = true;


    canvas.style.transition =
        "opacity .8s ease";

    canvas.style.opacity = "0";


    setTimeout(() => {

        canvas.style.display = "none";

    }, 800);


    /* BIG CONFETTI */

    createMassiveConfetti();


    /* Extra celebrations */

    setTimeout(
        createMassiveConfetti,
        450
    );

    setTimeout(
        createMassiveConfetti,
        900
    );

}


/* =====================================
MASSIVE CONFETTI
===================================== */

function createMassiveConfetti() {

    const colors = [

        "#c2738e",
        "#fae3e8",
        "#ffffff",
        "#f5d28e",
        "#e8a4ba",
        "#b65f7d",
        "#ffd9a1",
        "#ffb8ca"

    ];


    /* RAIN CONFETTI */

    for (let i = 0; i < 220; i++) {

        const confetti =
            document.createElement("div");

        confetti.className =
            "confetti-piece";


        const size =
            Math.random() * 10 + 5;


        confetti.style.width =
            size + "px";

        confetti.style.height =
            Math.random() * 15 +
            7 +
            "px";


        confetti.style.left =
            Math.random() * 100 +
            "vw";


        confetti.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        confetti.style.setProperty(
            "--moveX",
            (Math.random() * 300 - 150) +
            "px"
        );


        confetti.style.setProperty(
            "--rotate",
            (Math.random() * 1200 - 600) +
            "deg"
        );


        confetti.style.animationDuration =
            Math.random() * 3 +
            3 +
            "s";


        confetti.style.animationDelay =
            Math.random() * 0.8 +
            "s";


        document.body.appendChild(
            confetti
        );


        setTimeout(() => {

            confetti.remove();

        }, 7500);

    }


    /* CENTER EXPLOSION */

    for (let i = 0; i < 160; i++) {

        const piece =
            document.createElement("div");

        piece.className =
            "confetti-burst";


        piece.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        piece.style.setProperty(
            "--x",
            (Math.random() * 1200 - 600) +
            "px"
        );


        piece.style.setProperty(
            "--y",
            (Math.random() * 900 - 450) +
            "px"
        );


        piece.style.setProperty(
            "--r",
            (Math.random() * 1500 - 750) +
            "deg"
        );


        document.body.appendChild(
            piece
        );


        setTimeout(() => {

            piece.remove();

        }, 2500);

    }

}


/* =====================================
START
===================================== */

window.addEventListener(
    "load",
    setupCanvas
);

window.addEventListener(
    "resize",
    setupCanvas
);