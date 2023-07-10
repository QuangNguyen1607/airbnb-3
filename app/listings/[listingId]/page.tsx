import getCurrentUser from '@/app/actions/getCurrentUser'
import getListingById from '@/app/actions/getListingById'
import {ClientOnly} from '@/app/components/ClientOnly'
import EmptySpace from '@/app/components/EmptySpace'
import React from 'react'
import ListingClient from './ListingClient'
import getReservations from '@/app/actions/getReservations'

interface IParams {
	listingId?: string
}

const ListingPage = async ({params}: {params: IParams}) => {
	const listing = await getListingById(params)
	const currentUser = await getCurrentUser()
	const reservations = await getReservations(params)
	console.log("🚀 ~ file: page.tsx:17 ~ ListingPage ~ reservations:", reservations)

	if (!listing) {
		return (
			<ClientOnly>
				<EmptySpace></EmptySpace>
			</ClientOnly>
		)
	}
	return (
		<ClientOnly>
			<ListingClient
				listing={listing}
				reservations={reservations}
				currentUser={currentUser}></ListingClient>
		</ClientOnly>
	)
}

export default ListingPage
