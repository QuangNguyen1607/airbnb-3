'use client'
import qs from 'query-string'
import useSearchModal from '@/app/hooks/useSearchModal'
import {Modal} from './Modal'
import {useCallback, useMemo, useState} from 'react'
import {Range} from 'react-date-range'
import dynamic from 'next/dynamic'
import CountrySelect, {CountrySelectValue} from '../inputs/CountrySelect'
import {useRouter, useSearchParams} from 'next/navigation'
import {formatISO} from 'date-fns'
import {Heading} from '../Heading'
import Calendar from '../inputs/Calendar'
import Counter from '../inputs/Counter'

enum STEPS {
	LOCATION = 0,
	DATE = 1,
	INFO = 2,
}

const SearchModal = () => {
	const router = useRouter()
	const searchModal = useSearchModal()
	const params = useSearchParams()

	const [location, setLocation] = useState<CountrySelectValue>()

	const [step, setStep] = useState(STEPS.LOCATION)
	const [guestCount, setGuestCount] = useState(1)
	const [roomCount, setRoomCount] = useState(1)
	const [bathRoomCount, setBathRoomCount] = useState(1)

	const [dateRange, setDateRange] = useState<Range>({
		startDate: new Date(),
		endDate: new Date(),
		key: 'selection',
	})

	const Map = useMemo(
		() =>
			dynamic(() => import('../Map'), {
				ssr: false,
			}),
		[location]
	)

	const onBack = useCallback(() => {
		setStep(value => value - 1)
	}, [])

	const onNext = useCallback(() => {
		setStep(value => value + 1)
	}, [])

	const onSubmit = useCallback(async () => {
		if (step !== STEPS.INFO) {
			return onNext()
		}

		let currentQuery = {}

		if (params) {
			currentQuery = qs.parse(params.toString())
		}

		const updatedQuery: any = {
			...currentQuery,
			locationValue: location?.value,
			guestCount,
			roomCount,
			bathRoomCount,
		}

		if (dateRange.startDate) {
			updatedQuery.startDate = formatISO(dateRange.startDate)
		}

		if (dateRange.endDate) {
			updatedQuery.endDate = formatISO(dateRange.endDate)
		}

		const url = qs.stringifyUrl(
			{
				url: '/',
				query: updatedQuery,
			},
			{skipNull: true}
		)

		setStep(STEPS.LOCATION)
		searchModal.onClose()

		router.push(url)
	}, [
		bathRoomCount,
		dateRange.endDate,
		dateRange.startDate,
		guestCount,
		location?.value,
		onNext,
		params,
		roomCount,
		router,
		searchModal,
		step,
	])

	const actionLabel = useMemo(() => {
		if (step === STEPS.INFO) {
			return 'Search'
		}

		return 'Next'
	}, [step])

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.LOCATION) {
			return undefined
		}
		return 'Back'
	}, [step])

	let bodyContent = (
		<div className='flex flex-col gap-8'>
			<Heading
				title='Where do you want wanna go?'
				subTitle='Find the perfect location!'></Heading>
			<CountrySelect
				value={location}
				onChange={value =>
					setLocation(value as CountrySelectValue)
				}></CountrySelect>
			<hr />
			<Map center={location?.latlng}></Map>
		</div>
	)

	if (step === STEPS.DATE) {
		bodyContent = (
			<div className='flex flex-col gap-8'>
				<Heading
					title='When do you plan to go?'
					subTitle='Make sure everyone is free!'></Heading>
				<Calendar
					value={dateRange}
					onChange={value => setDateRange(value.selection)}></Calendar>
			</div>
		)
	}

	if (step === STEPS.INFO) {
		bodyContent = (
			<div className='flex flex-col gap-8'>
				<Heading
					title='More infomation'
					subTitle='Find your perfect place!'></Heading>
				<Counter
					title='Guests'
					subTitle='How many guests are coming?'
					value={guestCount}
					onChange={value => setGuestCount(value)}></Counter>
				<Counter
					title='Guests'
					subTitle='How many room do you need ?'
					value={roomCount}
					onChange={value => setRoomCount(value)}></Counter>
				<Counter
					title='Bathrooms'
					subTitle='How many batrooms do you need?'
					value={bathRoomCount}
					onChange={value => setGuestCount(value)}></Counter>
			</div>
		)
	}

	return (
		<Modal
			isOpen={searchModal.isOpen}
			onClose={searchModal.onClose}
			body={bodyContent}
			onSubmit={onSubmit}
			actionLabel={actionLabel}
			secondaryActionLabel={secondaryActionLabel}
			secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
			title='Filters'></Modal>
	)
}

export default SearchModal
