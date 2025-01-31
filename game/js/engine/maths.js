class Point {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    static isBetween(pointMin, pointMax, pointBetween) {
        if (pointMin.x <= pointBetween.x && pointMax.x >= pointBetween.x) {
            if (pointMin.y <= pointBetween.y && pointMax.y >= pointBetween.y) {
                return true;
            }
        }
        return false;
    }
}

class M3x3 {
    constructor() {
        this.matrix = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }
    multiply(m) {
        var output = new M3x3();
        output.matrix = [
            this.matrix[M3x3.M00] * m.matrix[M3x3.M00] + this.matrix[M3x3.M10] * m.matrix[M3x3.M01] + this.matrix[M3x3.M20] * m.matrix[M3x3.M02],
            this.matrix[M3x3.M01] * m.matrix[M3x3.M00] + this.matrix[M3x3.M11] * m.matrix[M3x3.M01] + this.matrix[M3x3.M21] * m.matrix[M3x3.M02],
            this.matrix[M3x3.M02] * m.matrix[M3x3.M00] + this.matrix[M3x3.M12] * m.matrix[M3x3.M01] + this.matrix[M3x3.M22] * m.matrix[M3x3.M02],

            this.matrix[M3x3.M00] * m.matrix[M3x3.M10] + this.matrix[M3x3.M10] * m.matrix[M3x3.M11] + this.matrix[M3x3.M20] * m.matrix[M3x3.M12],
            this.matrix[M3x3.M01] * m.matrix[M3x3.M10] + this.matrix[M3x3.M11] * m.matrix[M3x3.M11] + this.matrix[M3x3.M21] * m.matrix[M3x3.M12],
            this.matrix[M3x3.M02] * m.matrix[M3x3.M10] + this.matrix[M3x3.M12] * m.matrix[M3x3.M11] + this.matrix[M3x3.M22] * m.matrix[M3x3.M12],

            this.matrix[M3x3.M00] * m.matrix[M3x3.M20] + this.matrix[M3x3.M10] * m.matrix[M3x3.M21] + this.matrix[M3x3.M20] * m.matrix[M3x3.M22],
            this.matrix[M3x3.M01] * m.matrix[M3x3.M20] + this.matrix[M3x3.M11] * m.matrix[M3x3.M21] + this.matrix[M3x3.M21] * m.matrix[M3x3.M22],
            this.matrix[M3x3.M02] * m.matrix[M3x3.M20] + this.matrix[M3x3.M12] * m.matrix[M3x3.M21] + this.matrix[M3x3.M22] * m.matrix[M3x3.M22]
        ];
        return output;
    }
    transition(x, y) {
        var output = new M3x3();
        output.matrix = [
            this.matrix[M3x3.M00],
            this.matrix[M3x3.M01],
            this.matrix[M3x3.M02],

            this.matrix[M3x3.M10],
            this.matrix[M3x3.M11],
            this.matrix[M3x3.M12],

            x * this.matrix[M3x3.M00] + y * this.matrix[M3x3.M10] + this.matrix[M3x3.M20],
            x * this.matrix[M3x3.M01] + y * this.matrix[M3x3.M11] + this.matrix[M3x3.M21],
            x * this.matrix[M3x3.M02] + y * this.matrix[M3x3.M12] + this.matrix[M3x3.M22]
        ];
        return output;
    }
    scale(x, y) {
        var output = new M3x3();
        output.matrix = [
            this.matrix[M3x3.M00] * x,
            this.matrix[M3x3.M01] * x,
            this.matrix[M3x3.M02] * x,

            this.matrix[M3x3.M10] * y,
            this.matrix[M3x3.M11] * y,
            this.matrix[M3x3.M12] * y,

            this.matrix[M3x3.M20],
            this.matrix[M3x3.M21],
            this.matrix[M3x3.M22]
        ];
        return output;
    }
    getFloatArray() {
        return new Float32Array(this.matrix);
    }
}
M3x3.M00 = 0;
M3x3.M01 = 1;
M3x3.M02 = 2;
M3x3.M10 = 3;
M3x3.M11 = 4;
M3x3.M12 = 5;
M3x3.M20 = 6;
M3x3.M21 = 7;
M3x3.M22 = 8;

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};