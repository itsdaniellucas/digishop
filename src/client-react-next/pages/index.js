import { useEffect } from 'react' 
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		if(router.pathname == '/') {
			router.push({
				pathname: '/products',
			})
		}
	})

	return (
		<Head>
			<title>DigiShop</title>
		</Head>
	)
}
