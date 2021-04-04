import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Chip, Divider, Button, IconButton, Drawer, List } from '@material-ui/core'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import CartProduct from '../../components/CartProduct'
import PublishIcon from '@material-ui/icons/Publish';
import { useMutation } from '@apollo/client'
import { ADD_ORDER, mutationWrapper } from '../../graphql/mutations'
import { GET_CART, GET_PRODUCTS, GET_ORDERS } from '../../graphql/queries'
import appConfig from '../../appConfig'

const useStyles = makeStyles((theme) => ({
    list: {
        minWidth: '25vw',
        maxWidth: '25vw',
    },
    details: {
        padding: theme.spacing(2),
    }
}))

export default function CartDrawer(props) {
    const classes = useStyles();

    const products = props.items || [];

    const [visible, setVisible] = useState(false);

    const handleOpen = () => {
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
    }

    const [addOrder] = useMutation(ADD_ORDER)

    const totalPrice = products.reduce((acc, i) => acc + (i.quantity * i.price), 0);
    const totalQuantity = products.reduce((acc, i) => acc + i.quantity, 0)

    const onSubmitOrder = () => {
        mutationWrapper({
            operationName: 'addOrder',
            mutation: addOrder({
                variables: {
                    order: {
                        products: products.map(i => ({
                            product: i.id,
                            quantity: i.quantity
                        }))
                    }
                },
                refetchQueries: [
                    {
                        query: GET_CART
                    },
                    {
                        query: GET_PRODUCTS,
                        variables: {
                            pagination: {
                                page: 1,
                                itemsPerPage: appConfig.itemsPerPage,
                            }
                        }
                    },
                    {
                        query: GET_ORDERS,
                        variables: {
                            pagination: {
                                page: 1,
                                itemsPerPage: appConfig.itemsPerPage,
                            }
                        }
                    }
                ]
            })
        })
    }

    return (
        <React.Fragment>
            <IconButton className={props.className} color="default" onClick={handleOpen} size={props.size} disabled={props.disabled}>
                <LocalGroceryStoreIcon />
            </IconButton>
            <Drawer anchor='right' open={visible} onClose={handleClose}>
                <List className={classes.list}>
                    {
                        products.map(i => (<CartProduct key={i.id} product={i} />))
                    }
                </List>
                <Divider />
                <Grid className={classes.details} container justify="space-between" direction="row" spacing={1}>
                    <Grid item container justify="flex-start" spacing={1} xs={6}>
                        <Grid item>
                            <Chip color="secondary" icon={<LocalGroceryStoreIcon />} label={totalQuantity}></Chip>
                        </Grid>
                        <Grid item>
                            <Chip color="secondary" icon={<LocalAtmIcon />} label={totalPrice}></Chip>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" onClick={onSubmitOrder} startIcon={<PublishIcon />} disabled={products.length == 0}>Submit Order</Button>
                    </Grid>
                </Grid>
            </Drawer>
        </React.Fragment>
    )
}