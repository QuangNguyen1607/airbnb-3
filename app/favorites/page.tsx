import React from 'react'
import EmptySpace from '../components/EmptySpace'
import {ClientOnly} from '../components/ClientOnly'

import getCurrentUser from '../actions/getCurrentUser'
import getFavoriteListings from '../actions/getFavoriteListings'
import FavoritesClient from './FavoritesClient'

const ListingPage = async () => {
	const listings = await getFavoriteListings()
	const currentUser = await getCurrentUser()

	if (listings.length === 0) {
		return (
			<ClientOnly>
				<EmptySpace
					title='No favorites found'
					subtitle='Looks like you have no favorite listings'></EmptySpace>
			</ClientOnly>
		)
	}

	return (
		<ClientOnly>
			<FavoritesClient
				listings={listings}
				currentUser={currentUser}></FavoritesClient>
		</ClientOnly>
	)
}

export default ListingPage
