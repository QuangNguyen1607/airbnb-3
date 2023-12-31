"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Avatar } from "./Avatar";
import { MenuItem } from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";
interface UserMenuProps {
	currentUser?: SafeUser | null;
}
export const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
	const router = useRouter()

	const registerModal = useRegisterModal();
	const loginModal = useLoginModal();
	const rentModal = useRentModal();

	const [isOpen, setIsOpen] = useState(false);
	const toggleOpen = useCallback(() => {
		setIsOpen(prev => !prev);
	}, []);
	const onRent = useCallback(() => {
		if (!currentUser) {
			return loginModal.onOpen();
		}
		rentModal.onOpen();
	}, [currentUser, loginModal, rentModal]);
	return (
		<div className='relative'>
			<div className='flex flex-row items-center gap-3'>
				<div
					onClick={onRent}
					className='hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-600 transition cursor-pointer hover:text-white'
				>
					Airbnb your home
				</div>
				<div
					onClick={toggleOpen}
					className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-sm transition'
				>
					<AiOutlineMenu></AiOutlineMenu>
					<div className='hidden md:block'>
						<Avatar src={currentUser?.image}></Avatar>
					</div>
				</div>
			</div>
			{isOpen && (
				<div className='absolute rounded-xl shadow-md w-[40w] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
					<div className='flex flex-col cursor-pointer'>
						{!currentUser ? (
							<>
								<MenuItem onClick={loginModal.onOpen} label='Login'></MenuItem>
								<MenuItem onClick={registerModal.onOpen} label='Signup'></MenuItem>
							</>
						) : (
							<>
								<MenuItem onClick={() => router.push('/trips')} label='My trips'></MenuItem>
								<MenuItem onClick={() => router.push('/favorites')} label='My favorites'></MenuItem>
								<MenuItem onClick={() => router.push('/reservations')} label='My reservations'></MenuItem>
								<MenuItem onClick={() => router.push('/properties')} label='My properties'></MenuItem>
								<MenuItem onClick={() => rentModal.onOpen} label='Airbnb my home'></MenuItem>
								<hr />
								<MenuItem onClick={() => signOut()} label='Logout'></MenuItem>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
