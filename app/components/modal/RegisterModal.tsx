"use client";
import axios from "axios";
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
import { signIn } from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";

export const RegisterModal = () => {
	const registerModal = useRegisterModal();
	const LoginModal = useLoginModal();
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});
	const onSubmit: SubmitHandler<FieldValues> = data => {
		setIsLoading(true);
		axios
			.post("/api/register", data)
			.then(() => {
				toast.success("Success!")
				registerModal.onClose();
				LoginModal.onClose();
			})
			.catch(error => {
				toast.error("Something went wrong");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	const toggle = useCallback(() => {
		registerModal.onClose();
		LoginModal.onOpen();
	}, [LoginModal, registerModal]);
	const bodyContent = (
		<div className='flex flex-col gap-4'>
			<Heading title='Welcome to Airbnb' subTitle='Create an account!' center />
			<Input
				id='email'
				label='email'
				type='email'
				disabled={isLoading}
				errors={errors}
				required
				register={register}
			></Input>
			<Input
				id='name'
				label='name'
				disabled={isLoading}
				errors={errors}
				required
				register={register}
			></Input>
			<Input
				id='password'
				label='password'
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
				label='Continue with Google'
			></Button>
			<div className='text-neutral-500 text-center mt-4 font-light'>
				<div className='flex items-center justify-center gap-2'>
					<div>Already have an account ?</div>
					<div
						onClick={toggle}
						className='text-neutral-800 cursor-pointer hover:underline'
					>
						Log in
					</div>
				</div>
			</div>
		</div>
	);
	return (
		<Modal
			disabled={isLoading}
			isOpen={registerModal.isOpen}
			title='Register'
			actionLabel='Continue'
			onClose={registerModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		></Modal>
	);
};
