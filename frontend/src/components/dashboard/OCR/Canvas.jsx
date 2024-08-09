import React, { useEffect, useRef, useState } from "react";

function Canvas({ uploadedImage, activeField, setFormData }) {
  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    fetchRectangles();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (rectangles.length > 0 && imageRef.current) {
      resizeCanvas();
    }
  }, [rectangles, uploadedImage]);

const fetchRectangles = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/static/rectangles.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    setRectangles(data);
  } catch (error) {
    console.error("Error loading rectangles:", error);
  }
};


  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const imageContainer = imageContainerRef.current;

    if (!canvas || !image || !imageContainer) return;

    const containerRect = imageContainer.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    drawRectangles();
  };

  const drawRectangles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = imageRef.current;

    const imageRect = image.getBoundingClientRect();
    const scaleX = imageRect.width / image.naturalWidth;
    const scaleY = imageRect.height / image.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach((rect) => {
      ctx.fillStyle = "rgba(255, 255, 113, 0.5)";
      ctx.fillRect(
        rect.x * scaleX,
        rect.y * scaleY,
        rect.w * scaleX,
        rect.h * scaleY
      );
    });

    if (isDrawing) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        startPoint.x,
        startPoint.y,
        endPoint.x - startPoint.x,
        endPoint.y - startPoint.y
      );
    }
  };

  const handleMouseDown = (event) => {
    if (!activeField) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedRect = findClickedRectangle(x, y);
    if (clickedRect) {
      setFormData((prevData) => ({
        ...prevData,
        [activeField]: clickedRect.text,
      }));
    } else {
      setIsDrawing(true);
      setStartPoint({ x, y });
      setEndPoint({ x, y });
    }
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawing) {
      setEndPoint({ x, y });
      drawRectangles();
    } else {
      canvas.style.cursor = findClickedRectangle(x, y)
        ? "pointer"
        : "crosshair";
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      extractTextFromRectangle();
    }
  };

  const findClickedRectangle = (x, y) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const imageRect = image.getBoundingClientRect();
    const scaleX = imageRect.width / image.naturalWidth;
    const scaleY = imageRect.height / image.naturalHeight;

    return rectangles.find(
      (rect) =>
        x >= rect.x * scaleX &&
        x <= (rect.x + rect.w) * scaleX &&
        y >= rect.y * scaleY &&
        y <= (rect.y + rect.h) * scaleY
    );
  };

  const extractTextFromRectangle = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const imageRect = image.getBoundingClientRect();
    const scaleX = image.naturalWidth / imageRect.width;
    const scaleY = image.naturalHeight / imageRect.height;

    const rect = {
      x: Math.min(startPoint.x, endPoint.x) * scaleX,
      y: Math.min(startPoint.y, endPoint.y) * scaleY,
      width: Math.abs(endPoint.x - startPoint.x) * scaleX,
      height: Math.abs(endPoint.y - startPoint.y) * scaleY,
    };

    const wordsInRectangle = rectangles.filter(
      (word) =>
        word.x >= rect.x &&
        word.x + word.w <= rect.x + rect.width &&
        word.y >= rect.y &&
        word.y + word.h <= rect.y + rect.height
    );

    const extractedText = wordsInRectangle
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map((word) => word.text)
      .join(" ");

    if (activeField) {
      setFormData((prevData) => ({
        ...prevData,
        [activeField]: extractedText,
      }));
    }
  };

  return (
    <div id="image-container" ref={imageContainerRef} className="relative">
      <img
        ref={imageRef}
        src={uploadedImage}
        alt="Uploaded Bill"
        className="max-w-full h-auto"
        onLoad={resizeCanvas}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}

export default Canvas;
