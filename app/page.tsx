'useClient'
import {Listing} from '@prisma/client'
import getListings, {IListingParams} from './actions/getListings'
import {ClientOnly} from './components/ClientOnly'
import Container from './components/Container'
import EmptySpace from './components/EmptySpace'
import ListingCard from './components/listings/ListingCard'
import getCurrentUser from './actions/getCurrentUser'

interface HomeProps {
	searchParams: IListingParams
}

const Home = async ({searchParams}: HomeProps) => {
	const listings = await getListings(searchParams)
	const currentUser = await getCurrentUser()
	if (listings?.length === 0) {
		return (
			<ClientOnly>
				<EmptySpace showReset></EmptySpace>
			</ClientOnly>
		)
	}
	return (
		<ClientOnly>
			<Container>
				<div className='pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
					{listings.map(listing => (
						<ListingCard
							key={listing.id}
							data={listing}
							currentUser={currentUser}></ListingCard>
						// <div key={listing.id}>{listing.title}</div>
					))}
				</div>
			</Container>
		</ClientOnly>
	)
}
export default Home
