"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";
interface CategoryBoxProps {
	label: string;
	selected?: Boolean;
	icon: IconType;
}
const CategoryBox: React.FC<CategoryBoxProps> = ({icon: Icon, label, selected }) => {
	const router = useRouter();
	const params = useSearchParams();
	const handleClick = useCallback(() => {
		let currentQuery = {};
		if (params) {
			currentQuery = qs.parse(params.toString()); // Why do we need to use this thing ? // params.toString() => category=Beach  // parse in query-string which it will convert to object like this {category: Beach}
		}
		const updatedQuery: any = {
			...currentQuery,
			category: label,
		};
		if (params?.get("category") === label) {
			delete updatedQuery.category;
		}
		const url = qs.stringifyUrl(
			{
				url: "/",
				query: updatedQuery,
			},
			{ skipNull: true }
		);
		router.push(url);
	}, [label, params, router]);
	return (
		<div
			className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
			${selected ? "border-b-neutral-800" : "border-transparent"}
			${selected ? "text-neutral-800" : "text-neutral-500"}
			`}
			onClick={handleClick}
		>
			<Icon size={26}></Icon>
			<div className='font-medium text-sm'>{label}</div>
		</div>
	);
};

export default CategoryBox;
