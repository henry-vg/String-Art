class Line {
    constructor(nail0, nail1) {
        this.nail0 = nail0;
        this.nail1 = nail1;
    }

    render() {
        noFill();
        stroke(Config.lineColor);
        strokeWeight(Config.lineWeight);

        line(
            this.nail0.x,
            this.nail0.y,
            this.nail1.x,
            this.nail1.y,
        );
    }
}   