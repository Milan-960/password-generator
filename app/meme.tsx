"use client";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

const MemeGenerator = () => {
  // States for image source, top text, and bottom text
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  // State for stage dimensions
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // State for image dimensions
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // useImage is a custom hook to load an image
  const [image] = useImage(imageSrc || "");

  // Set image dimensions when a new image is loaded
  useEffect(() => {
    if (image) {
      setImageDimensions({
        width: image.width,
        height: image.height,
      });
    }
  }, [image]);

  // Reference to the stage component
  const stageRef = useRef<Konva.Stage | null>(null);

  // Function to handle image upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create a URL for the uploaded image file
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Function to download the generated meme
  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    // Stop the propagation of the click event
    link.addEventListener("click", (event) => event.stopPropagation());
    link.click();
    document.body.removeChild(link);
  };

  // Function to export the meme as an image
  const handleExport = (format: "jpg" | "png") => {
    if (stageRef.current) {
      // Convert the stage to a data URL
      const dataURL = stageRef.current.toDataURL({
        mimeType: `image/${format}`,
      });
      // Download the data URL as an image file
      downloadURI(dataURL, `meme.${format}`);
    }
  };

  // Add event listener on mount and remove on unmount
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    // cleanup this component
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const adjustedImageDimensions = React.useMemo(() => {
    let imageWidth = imageDimensions.width;
    let imageHeight = imageDimensions.height;

    // If the image is wider than the canvas
    if (imageWidth > dimensions.width) {
      // Scale it down to fit the width of the canvas
      const scaleFactor = dimensions.width / imageWidth;
      imageWidth *= scaleFactor;
      imageHeight *= scaleFactor;
    }

    return { width: imageWidth, height: imageHeight };
  }, [imageDimensions, dimensions]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 justify-center">
        <h1 className="text-2xl font-bold mb-2">Meme Generator</h1>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <input type="file" onChange={handleUpload} className="mb-2" />
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 justify-center p-5">
        <label>Top Text:</label>
        <input
          type="text"
          className="border border-gray-700 bg-gray-800 text-white rounded px-2 py-1 w-full md:w-auto"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />

        <label>Bottom Text:</label>
        <input
          type="text"
          className="border border-gray-700 bg-gray-800 text-white rounded px-2 py-1 w-full md:w-auto"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center space-x-2 justify-center">
        <button className="btn" onClick={() => handleExport("jpg")}>
          Download JPG
        </button>
        <button className="btn" onClick={() => handleExport("png")}>
          Download PNG
        </button>
      </div>

      <div className="">
        <Stage
          width={dimensions.width * 0.8}
          height={dimensions.height * 0.8}
          ref={stageRef}
        >
          <Layer>
            {image && (
              <Image
                image={image}
                width={adjustedImageDimensions.width}
                height={adjustedImageDimensions.height}
                alt="img"
              />
            )}
            <Text
              text={topText}
              fontSize={20}
              x={20}
              y={20}
              draggable
              fill="white"
              stroke="black"
              strokeWidth={1}
            />
            <Text
              text={bottomText}
              fontSize={20}
              x={20}
              y={dimensions.height * 0.8 - 40} // adjust Y position based on canvas size!
              draggable
              fill="white"
              stroke="black"
              strokeWidth={1}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default MemeGenerator;
