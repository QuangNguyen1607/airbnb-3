'use client'
import axios from 'axios'
import Container from '@/app/components/Container'
import ListingHead from '@/app/components/listings/ListingHead'
import ListingInfo from '@/app/components/listings/ListingInfo'

import {categories} from '@/app/components/navbar/Categories'
import useLoginModal from '@/app/hooks/useLoginModal'
import {SafeListing, SafeReservation, SafeUser} from '@/app/types'

import {differenceInCalendarDays, eachDayOfInterval} from 'date-fns'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {toast} from 'react-hot-toast'
import {useRouter} from 'next/navigation'
import ListingReservation from '@/app/components/listings/ListingReservation'
import {Range} from 'react-date-range'

const initialDateRange = {
	startDate: new Date(),
	endDate: new Date(),
	key: 'selection',
}

interface ListingClientProps {
	reservations?: SafeReservation[]
	listing: SafeListing & {
		user: SafeUser
	}
	currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({
	listing,
	reservations = [],
	currentUser,
}) => {
	const loginModal = useLoginModal()
	const router = useRouter()

	const disableDates = useMemo(() => {
		let dates: Date[] = []
		reservations.forEach(reservations => {
			const range = eachDayOfInterval({
				start: new Date(reservations.createAt),
				end: new Date(reservations.endDate),
			})
			dates = [...dates, ...range]
		})
		return dates
	}, [reservations])

	const category = useMemo(() => {
		return categories.find(items => items.label === listing.category)
	}, [listing.category])

	const [isLoading, setIsLoading] = React.useState(false)
	const [totalPrice, setTotalPrice] = React.useState(listing.price)
	const [dateRange, setDateRange] = useState<Range>(initialDateRange)

	const onCreateReservation = useCallback(() => {
		if (!currentUser) {
			return loginModal.onOpen()
		}

		setIsLoading(true)

		axios
			.post(`/api/reservations`, {
				totalPrice,
				startDate: dateRange.startDate,
				endDate: dateRange.endDate,
				listingId: listing?.id,
			})
			.then(() => {
				toast.success('Listing reserved!')
				setDateRange(initialDateRange)
				// Redirect to /trips
				// router.refresh()
				router.push('/trips')
			})
			.catch(() => {
				toast.error('Something went wrong.')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [
		currentUser,
		dateRange.endDate,
		dateRange.startDate,
		listing?.id,
		loginModal,
		router,
		totalPrice,
	])

	useEffect(() => {
		if (dateRange.startDate && dateRange.endDate) {
			const dayCount = differenceInCalendarDays(
				dateRange.endDate,
				dateRange.startDate
			)
			if (dayCount && listing.price) {
				setTotalPrice(dayCount * listing.price)
			} else {
				setTotalPrice(listing.price)
			}
		}
	}, [dateRange, listing.price])

	return (
		<Container>
			<div className='max-w-screen-lg mx-auto'>
				<div className='flex flex-col gap-6'>
					<ListingHead
						title={listing.title}
						imageSrc={listing.imageSrc}
						locationValue={listing.locationValue}
						id={listing.id}
						currentUser={currentUser}></ListingHead>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
					<ListingInfo
						user={listing.user}
						category={category}
						description={listing.description}
						roomCount={listing.roomCount}
						guestCount={listing.guestCount}
						bathroomCount={listing.bathroomCount}
						locationValue={listing.locationValue}></ListingInfo>
					<div className='order-first mb-10 md:order-last md:col-span-3'>
						<ListingReservation
							price={listing.price}
							totalPrice={totalPrice}
							onChangeDate={value => setDateRange(value)}
							dateRange={dateRange}
							onSubmit={onCreateReservation}
							disabled={isLoading}
							disabledDates={disableDates}></ListingReservation>
					</div>
				</div>
			</div>
		</Container>
	)
}

export default ListingClient
