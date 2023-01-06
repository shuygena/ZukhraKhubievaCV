export default class Renderer {
    constructor(opt) {
    }

    render(ctx, eyes) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        eyes.forEach(eye => {
            const globalZero = eye._coords.getCopy();
            eye._sparks.forEach(spark => {
                ctx.save()
                ctx.fillStyle = spark.color;
                ctx.strokeStyle = spark.color;
                const x = globalZero.x + spark.x;
                const y = globalZero.y + spark.y;

                const scale = 2;
                const sizeMax = 5 * scale;
                const sizeMin = 3 * scale;
                const offset = scale;
                const margin = 2 * scale;
                const smallStripSize = 3 * scale;
                const bigStripSize = 6 * scale;

                const sectorAngle = Math.PI / 3;


                ctx.beginPath();
                ctx.translate(x, y)
                ctx.rotate(spark._angle)
                ctx.moveTo(sizeMin, 0);
                for (let i = 0; i < 6; i++) {
                    const currentAngleMax = sectorAngle * i + sectorAngle / 2;
                    const currentAngleMin = sectorAngle * i + sectorAngle;
                    ctx.lineTo(Math.cos(currentAngleMax) * sizeMax, Math.sin(currentAngleMax) * sizeMax);
                    ctx.lineTo(Math.cos(currentAngleMin) * sizeMin, Math.sin(currentAngleMin) * sizeMin);
                }
                ctx.fill();



                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const currentAngle = i * sectorAngle;
                    const intermediateAngle = currentAngle + sectorAngle / 2;

                    ctx.moveTo(
                        (sizeMin + offset) * Math.cos(currentAngle),
                        (sizeMin + offset) * Math.sin(currentAngle)
                    );

                    ctx.lineTo(
                        (sizeMin + offset + smallStripSize) * Math.cos(currentAngle),
                        (sizeMin + offset + smallStripSize) * Math.sin(currentAngle)
                    );

                    ctx.moveTo(
                        (sizeMin + offset + smallStripSize + margin) * Math.cos(currentAngle),
                        (sizeMin + offset + smallStripSize + margin) * Math.sin(currentAngle)
                    );

                    ctx.lineTo(
                        (sizeMin + offset + smallStripSize * 2 + margin) * Math.cos(currentAngle),
                        (sizeMin + offset + smallStripSize * 2 + margin) * Math.sin(currentAngle)
                    );

                    ctx.moveTo(
                        (sizeMax + offset) * Math.cos(intermediateAngle),
                        (sizeMin + offset) * Math.sin(intermediateAngle)
                    );

                    ctx.lineTo(
                        (sizeMax + offset + bigStripSize) * Math.cos(intermediateAngle),
                        (sizeMin + offset + bigStripSize) * Math.sin(intermediateAngle)
                    );
                }
                ctx.rotate(-spark._angle)
                ctx.stroke();

                ctx.restore();
            })
        })
    }
}
