import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Chip, Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from '@material-ui/core';
import Image from 'next/image'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import DeleteIcon from '@material-ui/icons/Delete'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import ProductDialog from '../../src/views/dialogs/ProductDialog'
import StockDialog from '../../src/views/dialogs/StockDialog'
import { useRouter } from 'next/router'
import { user } from '../graphql/cache'
import { useMutation, useReactiveVar } from '@apollo/client'
import { GET_CART, GET_PRODUCTS } from '../graphql/queries'
import { ADD_TO_CART, ADD_STOCK, MODIFY_PRODUCT, REMOVE_PRODUCT, mutationWrapper } from '../graphql/mutations'
import appConfig from '../appConfig'

const useStyles = makeStyles({
    root: {
        minWidth: 300,
        maxWidth: 300,
    },
    desc: {
        minHeight: 80,
        maxHeight: 80,
    }
})

export default function ProductCard(props) {
    const classes = useStyles();
    const router = useRouter();

    const product = props.product || {};

    let currentUser = useReactiveVar(user);

    let buttons = null;

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
            })
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

	if(currentUser) {
		let role = currentUser.role;

        if(role == 'Admin') {
            buttons = (
                <>
                    <Grid item>
                        <IconButton color="primary"
                                    size="small"
                                    onClick={onRemoveProduct}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <ProductDialog icon mode='modify' product={product} onSave={onSaveModifyProduct} />
                    </Grid>
                    <Grid item>
                        <StockDialog icon type='stock' onSave={onSaveStock} />
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

    const onProductClick = () => {
        router.push({
            pathname: '/products/[id]',
            query: { id: product.id }
        })
    }

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={onProductClick}>
                <Grid container justify="center">
                    <Grid item>
                        <Image width={280} height={150} src={`${appConfig.isSSR() ? appConfig.baseUrlDocker : appConfig.baseUrl}${product.image}`} />
                    </Grid>
                </Grid>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                    </Typography>
                    <Typography gutterBottom variant="body2" color="textSecondary" component="p" className={classes.desc}>
                        {product.description}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Chip color="secondary" icon={<MonetizationOnIcon />} label={product.price}></Chip>
                        </Grid>
                        <Grid item>
                            <Chip color="secondary" icon={<LocalGroceryStoreIcon />} label={product.quantity}></Chip>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Grid container direction="row-reverse" spacing={1}>
                    {buttons}
                </Grid>
            </CardActions>
        </Card>
    )
}