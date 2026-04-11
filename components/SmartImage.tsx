"use client";

import Image, { type ImageLoaderProps } from "next/image";

type SmartImageProps = {
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  src: string;
};

function passthroughLoader({ src }: ImageLoaderProps) {
  return src;
}

export default function SmartImage({
  alt,
  className,
  fill = true,
  priority = false,
  sizes = "100vw",
  src,
}: SmartImageProps) {
  return (
    <Image
      alt={alt}
      className={className}
      fill={fill}
      loader={passthroughLoader}
      priority={priority}
      sizes={sizes}
      src={src}
      unoptimized
    />
  );
}
