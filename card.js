export class Card {

    constructor({shape, color, number, shade})
    {
        this.shape = shape;
        this.color = color;
        this.number = number;
        this.shade = shade;
    }
}

export const CardFeatures = {
    Shapes: {
        OVAL: 0,
        SQUIGGLE: 1,
        DIAMOND: 2
    },
    Colors: {
        RED: 0,
        GREEN: 1,
        PURPLE: 2
    },
    Numbers: {
        ONE: 0,
        TWO: 1,
        THREE: 2
    },
    Shades: {
        SOLID: 0,
        STRIPED: 1,
        OPEN: 2
    }
}