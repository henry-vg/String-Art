class Nail {
    constructor(x, y, index, indexX, indexY, indexLineX, indexLineY) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.indexX = indexX;
        this.indexY = indexY;
        this.indexLineX = indexLineX;
        this.indexLineY = indexLineY;
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

    indexRender() {
        noStroke();
        fill(Config.nailIndexColor);

        textAlign(CENTER);
        textSize(Config.nailIndexSize);

        text(
            this.index,
            this.indexX,
            this.indexY + textDescent(),
        );
    }

    indexLineRender() {
        noFill();
        strokeWeight(Config.nailIndexLineWeight);
        stroke(Config.nailIndexLineColor);

        line(
            this.x,
            this.y,
            this.indexLineX,
            this.indexLineY,
        );
    }
}