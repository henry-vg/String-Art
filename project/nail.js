class Nail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {
        noFill();
        stroke(Config.nailColor);
        strokeWeight(Config.nailWeight);

        point(
            this.x,
            this.y,
        );
    }
}