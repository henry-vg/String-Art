class Image_ {
    constructor(imageRaw) {
        this.imageRaw = imageRaw;
        this.imageGrid = this.generateImageGrid();
    }

    generateImageGrid() {
        const targetSize = Config.ringRadius * 2;
        const buffer = createGraphics(targetSize, targetSize);

        buffer.pixelDensity(1);
        buffer.background(255);
        buffer.imageMode(CENTER);

        const scale = min(
            targetSize / this.imageRaw.width,
            targetSize / this.imageRaw.height,
        );

        buffer.image(
            this.imageRaw,
            targetSize / 2,
            targetSize / 2,
            round(this.imageRaw.width * scale),
            round(this.imageRaw.height * scale),
        );

        buffer.loadPixels();

        const imageWidth = buffer.width;
        const imageHeight = buffer.height;
        const imagePixels = buffer.pixels;
        const imageChunkSize = Config.imageGridChunkSize;

        const imageGrid = [];
        for (let y = 0; y < imageHeight; y += imageChunkSize) {
            const row = [];
            for (let x = 0; x < imageWidth; x += imageChunkSize) {
                const pixelIndex = 4 * (y * imageWidth + x);

                const a = (imagePixels[pixelIndex + 3]) / 255;
                const r = imagePixels[pixelIndex] * a + 255 * (1 - a);
                const g = imagePixels[pixelIndex + 1] * a + 255 * (1 - a);
                const b = imagePixels[pixelIndex + 2] * a + 255 * (1 - a);

                const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

                row.push(constrain(
                    Config.imageNegative ? luminance : 1 - luminance,
                    0,
                    1,
                ));
            }
            imageGrid.push(row);
        }

        return imageGrid;
    }
}