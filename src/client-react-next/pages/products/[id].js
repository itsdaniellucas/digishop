import ProductBigCard from '../../src/components/ProductBigCard'
import { createClient } from '../../src/graphql/client';
import { GET_PRODUCT } from '../../src/graphql/queries'
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { fetching } from '../../src/graphql/cache'

export async function getServerSideProps({ query }) {
    const { data } = await createClient(true).query({ 
		query: GET_PRODUCT,
		variables: {
			id: query.id
		}
	})

    return {
        props: {
            serverData: data,
            id: query.id,
        }
    }
}

export default function ProductById(props) {
    const { data, loading } = useQuery(GET_PRODUCT, {
        variables: {
            id: props.id
        }
    })
    
    let product = props.serverData.product.Data;

    if(loading) {
        fetching(true)
    }

    if(!loading && data) {
		product = data.product.Data
        fetching(false)
	}

    return (
        <>
            <Head>
                <title>DigiShop - Products - {product.name}</title>
            </Head>
            <ProductBigCard product={product} />
        </>
    )
}