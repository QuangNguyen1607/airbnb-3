'use client'
import useRentModal from '@/app/hooks/useRentModal'
import React, {useMemo, useState} from 'react'
import {Modal} from './Modal'
import {Heading} from '../Heading'
import {categories} from '../navbar/Categories'
import CategoryInput from '../inputs/CategoryInput'
import {Field, FieldValues, SubmitHandler, useForm} from 'react-hook-form'
import CountrySelect from '../inputs/CountrySelect'
import Map from '../Map'
import dynamic from 'next/dynamic'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import {Input} from '../inputs/Input'
import {error} from 'console'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import {useRouter} from 'next/navigation'

enum STEPS {
	CATEGORY = 0,
	LOCATION = 1,
	INFO = 2,
	IMAGES = 3,
	DESCRIPTION = 4,
	PRICE = 5,
} // enum kike var stores and object

const RentModal = () => {
	const router = useRouter()
	const RentModal = useRentModal()
	const [step, setStep] = useState(STEPS.CATEGORY)
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: {errors},
		reset,
	} = useForm<FieldValues>({
		defaultValues: {
			email: '',
			location: null,
			guestCount: 1,
			roomCount: 1,
			bathroomCount: 1,
			imageSrc: '',
			price: 1,
			title: '',
			description: '',
		},
	}) // Why we use FieldValues which it will help automaticaly infer type to each property, because email: '' then it will automaticaly set type

	const category = watch('category')
	const location = watch('location')
	const guestCount = watch('guestCount')
	const roomCount = watch('roomCount')
	const bathroomCount = watch('bathroomCount')
	const imageSrc = watch('imageSrc')

	const Map = useMemo(
		() =>
			dynamic(() => import('../Map'), {
				ssr: false,
			}),
		[]
	)

	const setCustomValue = (id: string, value: any) => {
		setValue(id, value, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		})
	}

	const onBack = () => {
		setStep(value => value - 1)
	}
	const onNext = () => {
		setStep(value => value + 1)
	}

	const onSubmit: SubmitHandler<FieldValues> = data => {
		if (step !== STEPS.PRICE) {
			return onNext()
		}
		setIsLoading(true)
		axios
			.post('/api/listings', data)
			.then(() => {
				toast.success('Listing Created !')
				router.refresh()
				reset()
				setStep(STEPS.CATEGORY)
				RentModal.onClose()
			})
			.catch(() => {
				toast.error('Something went wrong.')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	const actionLabel = useMemo(() => {
		if (step === STEPS.PRICE) {
			return 'Create'
		}
		return 'Next'
	}, [step])

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.CATEGORY) {
			return undefined
		}
		return 'Back'
	}, [step])

	let bodyContent = (
		<div className='flex flex-col gap-8'>
			<Heading
				title='Which of these best describes your place?'
				subTitle='Pick a category'
			/>
			<div className='grid grid-cols--1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
				{categories.map(item => (
					<div key={item.label} className='col-span-1'>
						<CategoryInput
							onClick={category => setCustomValue('category', category)}
							selected={category === item.label}
							label={item.label}
							icon={item.icon}></CategoryInput>
					</div>
				))}
			</div>
		</div>
	)

	if (step === STEPS.LOCATION) {
		bodyContent = (
			<div className='flex flex-col gap-8'>
				<Heading
					title='Where is your place located?'
					subTitle='Help guests find you!'></Heading>
				<h1>{location?.latLng}</h1>
				<CountrySelect
					value={location}
					onChange={value => setCustomValue('location', value)}></CountrySelect>
				<Map center={location?.latlng}></Map>
			</div>
		)
	}
	if (step === STEPS.INFO) {
		bodyContent = (
			<div className='flex flex-col gap-8'>
				<Heading
					title='Share some basics about your place'
					subTitle='What amenisties do you have ?'></Heading>
				<Counter
					title='Guests'
					subTitle='How many guests do you allow?'
					value={guestCount}
					onChange={value => setCustomValue('guestCount', value)}></Counter>
				<hr />
				<Counter
					title='Rooms'
					subTitle='How many rooms do you have'
					value={roomCount}
					onChange={value => setCustomValue('roomCount', value)}></Counter>
				<hr />
				<Counter
					title='Bathrooms'
					subTitle='how many bathrooms do you have?'
					value={bathroomCount}
					onChange={value => setCustomValue('bathroomCount', value)}></Counter>
			</div>
		)
	}

	if (step === STEPS.IMAGES) {
		bodyContent = (
			<div className='flex flex-col gap-7'>
				<Heading
					title='Upload Image'
					subTitle='You should upload image'></Heading>
				<ImageUpload
					value={imageSrc}
					onChange={value => setCustomValue('imageSrc', value)}></ImageUpload>
			</div>
		)
	}

	if (step === STEPS.DESCRIPTION) {
		bodyContent = (
			<div className='flex flex-col gap-8'>
				<Heading
					title='How would you describe your place?'
					subTitle='Short and sweet works best!'></Heading>
				<Input
					id='title'
					label='Title'
					disabled={isLoading}
					errors={errors}
					register={register}
					required></Input>
				<hr />
				<Input
					id='description'
					label='Description'
					disabled={isLoading}
					errors={errors}
					register={register}
					required></Input>
			</div>
		)
	}

	if (step === STEPS.PRICE) {
		bodyContent = (
			<div className='flex flex-col gap-8'>
				<Heading
					title='Now, set your price'
					subTitle='How much do you charge per night?'></Heading>
				<Input
					id='price'
					label='Price'
					formatPrice={true}
					type='number'
					disabled={isLoading}
					register={register}
					errors={errors}
					required></Input>
			</div>
		)
	}

	return (
		<Modal
			isOpen={RentModal.isOpen}
			onClose={RentModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			title='Airbnb your home!'
			actionLabel={actionLabel}
			secondaryActionLabel={secondaryActionLabel}
			secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
			body={bodyContent}></Modal>
	)
}

export default RentModal
