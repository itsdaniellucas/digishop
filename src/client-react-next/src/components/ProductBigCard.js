import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardActions, Typography, Button } from '@material-ui/core'
import Image from 'next/image'
import DeleteIcon from '@material-ui/icons/Delete'
import ProductDialog from '../views/dialogs/ProductDialog'
import StockDialog from '../views/dialogs/StockDialog'
import { user } from '../graphql/cache'
import { useRouter } from 'next/router'
import { useMutation, useReactiveVar } from '@apollo/client'
import { GET_CART, GET_PRODUCTS } from '../graphql/queries'
import { ADD_TO_CART, ADD_STOCK, MODIFY_PRODUCT, REMOVE_PRODUCT, mutationWrapper } from '../graphql/mutations'
import appConfig from '../appConfig'


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '60vw',
        maxWidth: '60vw',
    },
    media: {
        height: 250,
        width: 250,
    },
    actions: {
        padding: theme.spacing(2),
    }
}))

export default function ProductBigCard(props) {
    const classes = useStyles();
    const product = props.product || {};
    const router = useRouter();

    let currentUser = useReactiveVar(user);

    const [addStock] = useMutation(ADD_STOCK)
    const [addToCart] = useMutation(ADD_TO_CART)
    const [modifyProduct] = useMutation(MODIFY_PRODUCT)
    const [removeProduct] = useMutation(REMOVE_PRODUCT)

    const onRemoveProduct = () => {
        mutationWrapper({
            operationName: 'removeProduct',
            mutation: removeProduct({
                variables: {
                    id: product.id
                },
                refetchQueries: [
                    {
                        query: GET_PRODUCTS,
                        variables: {
                            pagination: {
                                page: 1,
                                itemsPerPage: appConfig.itemsPerPage
                            }
                        }
                    }
                ]
            }),
            action: () => {
                router.push({
                    pathname: '/products'
                })
            }
        })
    }

    const onSaveModifyProduct = (event) => {
        mutationWrapper({
            operationName: 'modifyProduct',
            mutation: modifyProduct({
                variables: {
                    id: product.id,
                    product: {
                        name: event.product.name,
                        description: event.product.description,
                        price: event.product.price,
                        quantity: event.product.quantity,
                    }
                }
            }),
        })
    }

    const onSaveStock = (count) => {
        mutationWrapper({
            operationName: 'addStock',
            mutation: addStock({
                variables: {
                    id: product.id,
                    quantity: parseInt(count)
                }
            })
        })
    }
    
    const onSaveToCart = (count) => {
        mutationWrapper({
            operationName: 'addToCart',
            mutation: addToCart({
                variables: {
                    product: {
                        product: product.id,
                        quantity: parseInt(count)
                    }
                },
                refetchQueries: [
                    {
                        query: GET_CART
                    }
                ]
            }),
        })
    }

    let buttons = null;

	if(currentUser) {
		let role = currentUser.role;

        if(role == 'Admin') {
            buttons = (
                <>
                    <Grid item>
                        <Button variant="contained" 
                                color="primary"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={onRemoveProduct}>
                            Delete Product
                        </Button>
                    </Grid>
                    <Grid item>
                        <ProductDialog mode='modify' product={product} onSave={onSaveModifyProduct} />
                    </Grid>
                    <Grid item>
                        <StockDialog type='stock' onSave={onSaveStock} />
                    </Grid>
                </>
            )
        } else if(role == 'User') {
            buttons = (
                <Grid item>
                    <StockDialog onSave={onSaveToCart} />
                </Grid>
            )
        }
	}

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Image width={350} height={250} src={`${appConfig.isSSR() ? appConfig.baseUrlDocker : appConfig.baseUrl}${product.image}`} />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5">
                            Name:
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            { product.name }
                        </Typography>
                        <Typography variant="h5">
                            Description:
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            { product.description }
                        </Typography>
                        <Typography variant="h5">
                            Price:
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            { product.price }
                        </Typography>
                        <Typography variant="h5">
                            Quantity:
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            { product.quantity }
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions className={classes.actions}>
                <Grid container direction="row-reverse" spacing={1}>
                    {buttons}
                </Grid>
            </CardActions>
        </Card>
    )
}