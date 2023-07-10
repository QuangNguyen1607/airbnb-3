import EmptySpace from '../components/EmptySpace'
import {ClientOnly} from '../components/ClientOnly'

import getCurrentUser from '../actions/getCurrentUser'
import getReservations from '../actions/getReservations'
import ReservationClient from './ReservationClient'

const ReservationsPage = async () => {
	const currentUser = await getCurrentUser()
	if (!currentUser) {
		return (
			<ClientOnly>
				<EmptySpace title='Unauthorized' subtitle='Please login'></EmptySpace>
			</ClientOnly>
		)
	}
	const reservations = await getReservations({ authorId: currentUser.id });

	if (reservations?.length === 0) {
		return (
			<ClientOnly>
				<EmptySpace
					title='No reservations found'
					subtitle='Looks like you have no reservations on your properties'></EmptySpace>
			</ClientOnly>
		)
	}
	return (
		<ClientOnly>
			<ReservationClient
				reservations={reservations}
				currentUser={currentUser}></ReservationClient>
		</ClientOnly>
	)
}

export default ReservationsPage
