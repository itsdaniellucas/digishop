import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Chip, Card, CardHeader, CardActionArea, Divider } from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { deepPurple, green } from '@material-ui/core/colors'
import Image from 'next/image'
import { useRouter } from 'next/router'
import appConfig from '../appConfig'


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '48vw',
        maxWidth: '48vw',
    },
    avatar: {
        backgroundColor: deepPurple[800],
    },
    media: {
        height: 50,
        width: 50,
    },
    price: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: green[600],
    },
    divider: {
        backgroundColor: deepPurple[800],
        width: 3
    }
}))


export default function OrderProductCard(props) {
    const classes = useStyles();
    const router = useRouter();

    const product = props.product || {};

    const onProductClick = () => {
        router.push({
            pathname: '/products/[id]',
            query: { id: product.productId }
        })
    }

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={onProductClick}>
                <CardHeader
                    avatar={
                        <Image src={`${appConfig.isSSR() ? appConfig.baseUrlDocker : appConfig.baseUrl}${product.image}`} width={50} height={50} />
                    }
                    action={
                        <Grid container className={classes.price} spacing={1}>
                            <Grid item>
                                <Chip color="secondary" icon={<MonetizationOnIcon />} label={product.price}></Chip>
                            </Grid>
                            <Grid item>
                                <Chip color="secondary" icon={<LocalGroceryStoreIcon />} label={product.quantity}></Chip>
                            </Grid>
                            <Grid item>
                                <Divider className={classes.divider} orientation="vertical" />
                            </Grid>
                            <Grid item>
                                <Chip color="secondary" icon={<LocalAtmIcon />} label={product.price * product.quantity}></Chip>
                            </Grid>
                        </Grid>
                    }
                    title={product.name}
                />
            </CardActionArea>
        </Card>
    )
}