class Ring {
    constructor(image) {
        this.image = image;
        this.nails = [];
        this.lines = [];
        this.currentFrame = 0;

        this._generateNails();
        this._generateLines();

        if (Config.lineLogging) {
            for (const line_ of this.lines) {
                console.log(`Nail_1 = ${line_.nail0.index}; Nail_2 = ${line_.nail1.index}.`);
            }
        }
    }

    _generateNails() {
        for (let i = 0; i < Config.nailAmount; i++) {
            const angle = (TWO_PI / Config.nailAmount) * i;
            const x = (width / 2) + sin(angle) * Config.ringRadius;
            const y = (height / 2) + cos(angle) * Config.ringRadius;
            const nailIndexDistance = Config.nailIndexDistanceAlternate && i % 2 == 0 ? Config.nailIndexAlternateDistance : Config.nailIndexDistance;
            const indexX = (width / 2) + sin(angle) * (Config.ringRadius + nailIndexDistance);
            const indexY = (height / 2) + cos(angle) * (Config.ringRadius + nailIndexDistance);
            const indexLineX = (width / 2) + sin(angle) * (Config.ringRadius + nailIndexDistance - Config.nailIndexLineDistance);
            const indexLineY = (height / 2) + cos(angle) * (Config.ringRadius + nailIndexDistance - Config.nailIndexLineDistance);

            this.nails.push(
                new Nail(
                    x,
                    y,
                    i,
                    indexX,
                    indexY,
                    indexLineX,
                    indexLineY,
                )
            );
        }
    }

    _generateLines() {
        for (let i = 0; i < Config.lineAmount; i++) {
            this.lines.push(this._generateLine());
        }
    }

    _generateLine() {
        if (Config.lineRandom) {
            return this._generateRandomLines(1)[0];
        }

        const lines = Config.lineContinuous ?
            this._getContinuousLines(
                this.lines.length == 0 ?
                    random(this.nails) :
                    this.lines[this.lines.length - 1].nail1
            ) : this._generateRandomLines(
                Config.lineTestAmount
            )

        return this._getBestLine(lines)
    }

    _getContinuousLines(originNail) {
        const lines = [];
        for (const nail of this.nails) {
            if (nail.x != originNail.x && nail.y != originNail.y) {
                lines.push(new Line(originNail, nail));
            }
        }
        return lines;
    }

    _getBestLine(lines) {
        let bestLine;
        let bestLineScore = 0;
        let bestLineImagePixels;

        for (const line_ of lines) {
            const currentLineImagePixels = this._getLineImagePixels(line_);

            let currentLineScore = 0;

            for (let i = 0; i < currentLineImagePixels.length; i++) {
                const pixel = currentLineImagePixels[i];
                currentLineScore += this.image.imageGrid[pixel[1]][pixel[0]];
            }

            if (currentLineScore >= bestLineScore) {
                bestLineScore = currentLineScore;
                bestLine = line_;
                bestLineImagePixels = currentLineImagePixels;
            }
        }

        for (let i = 0; i < bestLineImagePixels.length; i++) {
            const pixel = bestLineImagePixels[i];
            this.image.imageGrid[pixel[1]][pixel[0]] = constrain(this.image.imageGrid[pixel[1]][pixel[0]] - Config.lineLuminanceEffect, 0, 1);
        }

        return bestLine;
    }

    _getLineImagePixels(line) {
        const nail0X = line.nail0.x;
        const nail0Y = line.nail0.y;
        const nail1X = line.nail1.x;
        const nail1Y = line.nail1.y;

        const distance = dist(
            nail0X,
            nail0Y,
            nail1X,
            nail1Y,
        );

        const gridWidth = this.image.imageGrid[0].length;
        const gridHeight = this.image.imageGrid.length;

        const angle = atan2(
            nail1Y - nail0Y,
            nail1X - nail0X,
        );

        const lineImagePixels = [];
        for (let i = 0; i < distance; i += Config.lineScoreStepSize) {
            const xCanvas = nail0X + i * cos(angle);
            const yCanvas = nail0Y + i * sin(angle);

            const currentX = constrain(
                floor(map(
                    xCanvas,
                    (width / 2) - Config.ringRadius,
                    (width / 2) + Config.ringRadius,
                    0,
                    gridWidth - 1,
                )),
                0,
                gridWidth - 1,
            );

            const currentY = constrain(
                floor(map(
                    yCanvas,
                    (height / 2) - Config.ringRadius,
                    (height / 2) + Config.ringRadius,
                    0,
                    gridHeight - 1,
                )),
                0,
                gridHeight - 1,
            );

            lineImagePixels.push([currentX, currentY]);
        }

        return lineImagePixels;
    }

    _generateRandomLines(amount) {
        const lines = [];
        for (let i = 0; i < amount; i++) {
            let nail0 = random(this.nails);
            let nail1 = random(this.nails);

            const lineMinDistance = Config.lineRandom ? 0 : constrain(Config.lineMinDistance, 0, Config.nailAmount - 3);

            while (abs(nail0.index - nail1.index) <= lineMinDistance) {
                nail1 = random(this.nails);
            }

            lines.push(new Line(
                nail0,
                nail1,
            ));
        }
        return lines;
    }

    render() {
        if (Config.lineAnimation) {
            for (let i = 0; i < Config.lineAnimationSpeed; i++) {
                this.lines[this.currentFrame].render();

                this.currentFrame++;
                if (this.currentFrame >= this.lines.length) {
                    noLoop();
                    console.log("Animation finished.");
                    break;
                }
            }

        } else {
            for (const line_ of this.lines) {
                line_.render();
            }
        }

        if (this.currentFrame <= Config.lineAnimationSpeed) {
            if (Config.ringBorderRender) {
                this._renderRingBorder();
            }

            if (Config.nailRender) {
                for (const nail of this.nails) {
                    nail.render();
                }
            }

            if (Config.nailIndexRender) {
                for (const nail of this.nails) {
                    nail.indexRender();
                }
            }

            if (Config.nailIndexLineRender) {
                for (const nail of this.nails) {
                    nail.indexLineRender();
                }
            }
        }
    }

    _renderRingBorder() {
        noFill();
        stroke(Config.ringBorderColor);
        strokeWeight(Config.ringBorderWeight);

        circle(
            width / 2,
            height / 2,
            Config.ringRadius * 2,
        );
    }
}