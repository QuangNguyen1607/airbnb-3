import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import {ClientOnly} from '../components/ClientOnly'
import EmptySpace from '../components/EmptySpace'
import getReservations from '../actions/getReservations'
import TripsClient from './TripsClient'

const TripsPage = async () => {
	const currentUser = await getCurrentUser()
	if (!currentUser) {
		return (
			<ClientOnly>
				<EmptySpace subtitle='Please Login' title='Unauthorized'></EmptySpace>
			</ClientOnly>
		)
	}

	const reservations = await getReservations({
		userId: currentUser.id,
	})

	if (reservations?.length === 0) {
		return (
			<ClientOnly>
				<EmptySpace
					title='No trips found'
					subtitle='Looks like you havent reserved any trips'></EmptySpace>
			</ClientOnly>
		)
	}

	return <ClientOnly>
		<TripsClient reservations={reservations} currentUser={currentUser}></TripsClient>
	</ClientOnly>
}

export default TripsPage
