'use client';
import {useEffect} from 'react'
import EmptySpace from './components/EmptySpace';

interface ErrorStateProps {
	error: Error
}

const ErrorState: React.FC<ErrorStateProps> = ({error}) => {
	useEffect(() => {
		console.error(error)
	}, [error])
	return (
		<EmptySpace title='Uh Oh' subtitle='Something went wrong!'></EmptySpace>
	)
}

export default ErrorState;