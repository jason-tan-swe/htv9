import React, { useRef, useEffect } from "react";

const BezierCurve = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Bézier curve control points
    const startPoint = { x: 50, y: 250 };
    const controlPoint1 = { x: 150, y: 50 };
    const controlPoint2 = { x: 350, y: 450 };
    const endPoint = { x: 450, y: 250 };

    let t = 0;
    const animate = () => {
      t += 0.01;
      if (t > 1) t = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw static Bézier curve
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.bezierCurveTo(
        controlPoint1.x,
        controlPoint1.y,
        controlPoint2.x,
        controlPoint2.y,
        endPoint.x,
        endPoint.y
      );
      ctx.strokeStyle = "#000";
      ctx.stroke();

      // Draw moving point on the Bézier curve
      const x =
        Math.pow(1 - t, 3) * startPoint.x +
        3 * Math.pow(1 - t, 2) * t * controlPoint1.x +
        3 * (1 - t) * Math.pow(t, 2) * controlPoint2.x +
        Math.pow(t, 3) * endPoint.x;

      const y =
        Math.pow(1 - t, 3) * startPoint.y +
        3 * Math.pow(1 - t, 2) * t * controlPoint1.y +
        3 * (1 - t) * Math.pow(t, 2) * controlPoint2.y +
        Math.pow(t, 3) * endPoint.y;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#f00";
      ctx.fill();

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas className="absolute" ref={canvasRef} width={500} height={500} />
  );
};

export default BezierCurve;
