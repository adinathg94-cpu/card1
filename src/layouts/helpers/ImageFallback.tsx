"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

const ImageFallback = ({
  src,
  alt,
  fallbackSrc = "/images/image-placeholder.png",
  ...rest
}: ImageFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  // Bypass image optimization for uploaded images starting with /uploads/
  const isUpload = typeof imgSrc === "string" && imgSrc.startsWith("/uploads/");

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      unoptimized={rest.unoptimized || isUpload}
      onError={() => {
        if (!isError) {
          setImgSrc(fallbackSrc);
          setIsError(true);
        }
      }}
    />
  );
};

export default ImageFallback;
