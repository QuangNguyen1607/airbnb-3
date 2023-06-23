'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import {Heading} from './Heading'
import {Button} from './Button'
interface EmptyState {
	title?: string
	subtitle?: string
	showReset?: boolean
}

const EmptySpace: React.FC<EmptyState> = ({
	title = 'No extract matches',
	subtitle = 'Try changing or removing some of your filters',
	showReset,
}) => {
	const router = useRouter();
	return (
		<div className='h-[60vh] flex flex-col justify-center items-center gap-2 text-center'>
			<Heading title={title} subTitle={subtitle} center></Heading>
			<div className='w-48 mt-4'>
				{showReset && (
					<Button
						outline
						label='Remove all filters'
						onClick={() => router.push('/')}></Button>
				)}
			</div>
		</div>
	)
}
export default EmptySpace
