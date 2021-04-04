import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Chip, Avatar, Card, CardHeader, IconButton, Typography } from '@material-ui/core';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { deepPurple, green } from '@material-ui/core/colors'
import OrderProductCard from '../components/OrderProductCard'
import { useReactiveVar, useMutation } from '@apollo/client'
import { user } from '../graphql/cache'
import { GET_ORDERS, GET_PRODUCTS } from '../graphql/queries'
import { REMOVE_ORDER, mutationWrapper } from '../graphql/mutations'
import appConfig from '../appConfig'


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '50vw',
        maxWidth: '50vw',
    },
    avatar: {
        backgroundColor: deepPurple[800],
    },
    price: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: green[600],
    },
}))


export default function OrderCard(props) {
    const classes = useStyles();

    const currentUser = useReactiveVar(user);

    const order = props.order || {}
    const subHeader = `@${order.user.username} on ${new Date(order.dateCreated).toLocaleString()}`;

    const [removeOrder] = useMutation(REMOVE_ORDER)

    const onRemoveOrder = () => {
        mutationWrapper({
            operationName: 'removeOrder',
            mutation: removeOrder({
                variables: {
                    id: order.id
                },
                refetchQueries: [
                    {
                        query: GET_ORDERS,
                        variables: {
                            pagination: {
                                page: 1,
                                itemsPerPage: appConfig.itemsPerPage
                            }
                        }
                    },
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
        })
    }

    let buttons = null;

    if(currentUser) {
        buttons = (
            <IconButton size="small" color="primary" onClick={onRemoveOrder}>
                <DeleteIcon />
            </IconButton>
        )
    }

    const totalPrice = order.products.reduce((acc, i) => acc + (i.quantity * i.price), 0);
    const totalQuantity = order.products.reduce((acc, i) => acc + i.quantity, 0)
    
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {order.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                }
                action={
                    <Grid container className={classes.price} spacing={1}>
                        <Grid item>
                            <Chip color="secondary" icon={<LocalGroceryStoreIcon />} label={totalQuantity}></Chip>
                        </Grid>
                        <Grid item>
                            <Chip color="secondary" icon={<LocalAtmIcon />} label={totalPrice}></Chip>
                        </Grid>
                        <Grid item>
                            {buttons}
                        </Grid>
                    </Grid>
                }
                title={`Order# ${order.id}`}
                subheader={subHeader}
            />
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Products</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container direction="row" spacing={2}>
                        {
                            order.products.map(i => <Grid item key={i.id}><OrderProductCard key={i.id} product={i} /></Grid>)
                        }
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}