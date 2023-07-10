import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import {ClientOnly} from '../components/ClientOnly'
import EmptySpace from '../components/EmptySpace'
import getListings from '../actions/getListings'
import PropertiesClient from './PropertiesClient'

const PropertiesPage = async () => {
	const currentUser = await getCurrentUser()
	if (!currentUser) {
		return (
			<EmptySpace subtitle='Please Login' title='Unauthorized'></EmptySpace>
		)
	}
	const listings = await getListings({ userId: currentUser.id });

	if (listings?.length === 0) {
		return (
			<ClientOnly>
				<EmptySpace
					title='No properties found'
					subtitle='Looks like you have no properties'></EmptySpace>
			</ClientOnly>
		)
	}

	return (
		<ClientOnly>
			<PropertiesClient
				listings={listings}
				currentUser={currentUser}></PropertiesClient>
		</ClientOnly>
	)
}

export default PropertiesPage
