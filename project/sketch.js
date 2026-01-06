let image;
let field;

function preload() {
    image = loadImage(
        Config.imageFilePath,
        _image => { image = _image; },
        () => { alert(`Error loading image "${Config.imageFilePath}".`) }
    );
}

function setup() {
    field = new Field();

    createCanvas(
        windowWidth,
        windowHeight,
    );
    background(Config.backgroundColor);

    field.generateNails();
    field.generateLines();
    field.render();
}