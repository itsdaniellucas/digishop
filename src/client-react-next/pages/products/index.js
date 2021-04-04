import { Grid } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import ProductCard from '../../src/components/ProductCard'
import ProductDialog from '../../src/views/dialogs/ProductDialog'
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { createClient } from '../../src/graphql/client';
import { GET_PRODUCTS } from '../../src/graphql/queries'
import { user, fetching } from '../../src/graphql/cache'
import Head from 'next/head'
import { ADD_PRODUCT, mutationWrapper } from '../../src/graphql/mutations';
import appConfig from '../../src/appConfig'

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
    },
	pagination: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2)
	}
}))

export async function getServerSideProps() {
	const { data } = await createClient(true).query({ 
		query: GET_PRODUCTS,
		variables: {
			pagination: {
				page: 1,
				itemsPerPage: appConfig.itemsPerPage
			}
		}
	})

	return {
		props: {
			serverData: data
		}
	}
}

export default function Products(props) {
	const classes = useStyles();

	const currentUser = useReactiveVar(user);

	const { data, loading, refetch } = useQuery(GET_PRODUCTS, { 
		variables: {
			pagination: {
				page: 1,
				itemsPerPage: appConfig.itemsPerPage
			}
		}
	})

	const [addProduct] = useMutation(ADD_PRODUCT)

	const onSaveNewProduct = (event) => {
		mutationWrapper({
			operationName: 'addProduct',
			mutation: addProduct({
				variables: {
					product: event.product
				},
			}),
			action: () => {
				refetch()
			}
		})
	}

	const onPageChange = (event, value) => {
		refetch({
			pagination: {
				page: value,
				itemsPerPage: appConfig.itemsPerPage
			}
		})
	}
	
	let products = props.serverData.products.Data;
	let pages = props.serverData.products.TotalPages;

	if(loading) {
		fetching(true);
	}

	if(!loading && data) {
		products = data.products.Data
		pages = data.products.TotalPages
		fetching(false);
	}

	let buttons = null;
	
	if(currentUser) {
		let role = currentUser.role;
		if(role == 'Admin') {
			buttons = (<ProductDialog className={classes.fab} mode={'add'} onSave={onSaveNewProduct} />)
		}
	}

	return (
		<>
			<Head>
				<title>DigiShop - Products</title>
			</Head>
			<Pagination className={classes.pagination} count={pages} onChange={onPageChange} color="primary" />
			<Grid container direction="row" justify="center" spacing={2}>
				{
					products.map(i => <Grid item key={i.id}><ProductCard key={i.id} product={i} /></Grid>)
				}
			</Grid>
			{buttons}
		</>
	)
}
