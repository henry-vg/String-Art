let imageRaw;
let image_;
let ring;

function preload() {
    imageRaw = loadImage(
        Config.imageFilePath,
        undefined,
        () => {
            alert(`Error loading image "${Config.imageFilePath}".`);
        },
    );
}

function setup() {
    // frameRate(1);
    createCanvas(
        windowWidth,
        windowHeight,
    );

    background(Config.backgroundColor);

    image_ = new Image_(imageRaw);

    ring = new Ring(image_);

    if (!Config.lineAnimation) {
        noLoop();
    }
}

function draw() {
    ring.render();
}