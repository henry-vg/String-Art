class Field {
    constructor() {
        this.nails = [];
        this.lines = [];
    }

    generateNails() {
        for (let i = 0; i < Config.nailAmount; i++) {
            const angle = (TWO_PI / Config.nailAmount) * i;
            this.nails.push(
                new Nail(
                    (width / 2) + sin(angle) * Config.ringRadius,
                    (height / 2) + cos(angle) * Config.ringRadius,
                )
            );
        }
    }

    generateLines() {
        if (Config.lineRandom) {
            for (let i = 0; i < Config.lineAmount; i++) {
                this.lines.push(new Line(
                    random(this.nails),
                    random(this.nails),
                ));
            }
        }
    }

    render() {
        for (const line_ of this.lines) {
            line_.render();
        }

        if (Config.ringRender) {
            this._renderRing();
        }

        if (Config.nailRender) {
            for (const nail of this.nails) {
                nail.render();
            }
        }
    }

    _renderRing() {
        noFill();
        stroke(Config.ringColor);
        strokeWeight(Config.ringWeight);

        circle(
            width / 2,
            height / 2,
            Config.ringRadius * 2,
        );
    }
}