import { Grid } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles';
import OrderCard from '../../src/components/OrderCard'
import { useQuery } from '@apollo/client'
import { GET_ORDERS } from '../../src/graphql/queries'
import Head from 'next/head'
import { fetching } from '../../src/graphql/cache'
import appConfig from '../../src/appConfig'

const useStyles = makeStyles((theme) => ({
	pagination: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2)
	}
}))

export default function Orders(props) {
	const classes = useStyles();

	const { data, loading, refetch } = useQuery(GET_ORDERS, { 
		variables: {
			pagination: {
				page: 1,
				itemsPerPage: appConfig.itemsPerPage
			}
		}
	})

	const onPageChange = (event, value) => {
		refetch({
			pagination: {
				page: value,
				itemsPerPage: appConfig.itemsPerPage
			}
		})
	}

	let orders = [];
	let pages = 1;

	if(loading) {
		fetching(true)
	}

	if(!loading && data) {
		orders = data.orders.Data || []
		pages = data.orders.TotalPages
		fetching(false)
	}

	return (
		<>
			<Head>
				<title>DigiShop - Orders</title>
			</Head>
			<Pagination className={classes.pagination} count={pages} onChange={onPageChange} color="primary" />
			<Grid container justify="center" alignItems="center" direction="column" spacing={2}>
				{
					orders.map(i => <Grid item key={i.id}><OrderCard key={i.id} order={i} /></Grid>)
				}
			</Grid>
		</>
	)
}
