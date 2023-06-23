"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import React, { useCallback, useState } from "react";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { Modal } from "./Modal";
import { Heading } from "../Heading";
import { Input } from "../inputs/Input";
import { toast } from "react-hot-toast";
import { Button } from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

export const LoginModal = () => {
	const router = useRouter();

	const registerModal = useRegisterModal();
	const loginModal = useLoginModal();

	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit: SubmitHandler<FieldValues> = data => {
		setIsLoading(true);
		signIn("credentials", {
			...data,
			redirect: false,
		}).then(callback => {
			setIsLoading(false);
			if (callback?.ok) {
				toast.success("Logged in");
				router.refresh();
				loginModal.onClose();
			}
		});
	};
	const toggle = useCallback(() => {
		loginModal.onClose();
		registerModal.onOpen();
	},[loginModal, registerModal])
	const bodyContent = (
		<div className='flex flex-col gap-4'>
			<Heading title='Welcome back' subTitle='Login to your account' center />
			<Input
				id='email'
				label='Email'
				type='email'
				disabled={isLoading}
				errors={errors}
				required
				register={register}
			></Input>
			<Input
				id='password'
				label='Password'
				type='password'
				disabled={isLoading}
				errors={errors}
				required
				register={register}
			></Input>
		</div>
	);
	const footerContent = (
		<div className='flex flex-col gap-4 mt-3'>
			<hr></hr>
			<Button
				icon={FcGoogle}
				onClick={() => signIn("google")}
				outline
				label='Continue with Google'
			></Button>
			<Button
				icon={AiFillGithub}
				onClick={() => signIn("github")}
				outline
				label='Continue with Github'
			></Button>
			<div className='text-neutral-500 text-center mt-4 font-light'>
				<div className='flex items-center justify-center gap-2'>
					<div>First time using Airbnb ?</div>
					<div
						onClick={toggle}
						className='text-neutral-800 cursor-pointer hover:underline'
					>
						Register
					</div>
				</div>
			</div>
		</div>
	);
	return (
		<Modal
			disabled={isLoading}
			isOpen={loginModal.isOpen}
			title='Login'
			actionLabel='Continue'
			onClose={loginModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		></Modal>
	);
};
