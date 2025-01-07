"use client";
import React, {useEffect, useState} from "react";

interface DisplayImageProps {
    className?: string
}

const DisplayImage = ({imageBytes, className}) => {
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        if (imageBytes) {
            setImageSrc(`data:image/jpeg;base64,${imageBytes}`);
        }
    }, [imageBytes]);

    return (
        <div>
            {imageSrc ? <img className={className} src={imageSrc} alt="Product"/> : <p>No image found</p>}
        </div>
    );
};

export default DisplayImage;
