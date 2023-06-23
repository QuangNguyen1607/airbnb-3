"use client";
import React from "react";
import Image from "next/image";
interface AvatarProps {
	src: string | null | undefined;
}
export const Avatar: React.FC<AvatarProps> = ({ src }) => {
	return (
		<Image
			className='rounded-full'
			height='30'
			width='30'
			alt='avatar'
			src={src || `/images/placeholder.jpeg`}
		></Image>
	);
};
