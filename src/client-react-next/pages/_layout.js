import React, { useEffect } from 'react' 
import { AppBar, Toolbar, Typography, Button, Grid, LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { blueGrey, deepPurple } from '@material-ui/core/colors';
import Link from 'next/link'
import LoginDialog from '../src/views/dialogs/LoginDialog'
import CartDrawer from '../src/views/dialogs/CartDrawer'
import AlertBox from '../src/views/content/AlertBox'
import storageService from '../src/services/storageService'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { GET_CART } from '../src/graphql/queries'
import { LOGIN, mutationWrapper } from '../src/graphql/mutations'
import { user, fetching, alertSuccess } from '../src/graphql/cache'
import { registerEvent, runEvent } from '../src/services/serviceHub'

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'fixed',
        background: deepPurple[800],
        color: deepPurple[50],
    },
    layout: {
        width: 'auto',
        paddingTop: theme.spacing(14),
        paddingBottom: theme.spacing(6),
        padding: theme.spacing(20),
        background: blueGrey[50],
        minHeight: '100vh',
    },
    title: {
        flexGrow: 1,
    },
    siteName: {
        marginRight: theme.spacing(4),
    },
    button: {
        marginLeft: theme.spacing(1),
    }
}))

export default function Layout({ children }) {
    const classes = useStyles();
    const router = useRouter();

    const [login, { data: loginData, loading: loginLoading }] = useMutation(LOGIN)
    const { data: cartData, loading: cartLoading, refetch: cartRefetch } = useQuery(GET_CART)
    const currentUser = useReactiveVar(user)
    const isFetching = useReactiveVar(fetching)

    let cartItems = [];

    if(!cartLoading && cartData) {
        cartItems = cartData.cart.Data || [];
    }

    if(global.window) {
        const localStorageUser = storageService.getUser()

        if(localStorageUser) {
            user(localStorageUser);
        }
    }

    if(!loginLoading && loginData) {
        const result = loginData.login.Data;
        if(result) {
            storageService.setToken(result.Token)
            storageService.setTokenExpiration(result.TokenExpiration)
            storageService.setUser(result.User)
            user(result.User);
        }
    }

    const onLogin = (user) => {
        mutationWrapper({
            operationName: 'login',
            mutation: login({
                variables: {
                    username: user.username,
                    password: user.password
                }
            }),
            action: () => {
                cartRefetch()
            },
            savingMsg:  'Logging in...',
            successMsg: 'You have successfully logged in',
        })
    }

    useEffect(() => {
        registerEvent('logout', () => {
            login({
                variables: {
                    username: '',
                    password: ''
                }
            })
            storageService.setToken()
            storageService.setTokenExpiration()
            storageService.setUser()
            user(null);
            cartRefetch();
            router.push({
                pathname: '/products',
            })
            alertSuccess('You have successfully logged out')
        })
    }, []);

    const onLogout = () => {
        runEvent('logout');
    }

    return (
        <>
            <AppBar className={classes.appBar} color="transparent">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <span className={classes.siteName}>DigiShop</span>
                        <Link href="/products"><Button className={classes.button} variant="contained" color="primary">Catalog</Button></Link>
                        {
                            currentUser ?
                            <Link href="/orders"><Button className={classes.button} variant="contained" color="primary">Orders</Button></Link>
                            : null
                        }
                    </Typography>
                    <CartDrawer items={cartItems} />
                    <LoginDialog onLogin={onLogin} onLogout={onLogout} />
                </Toolbar>
                { isFetching ? <LinearProgress color="secondary" /> : null }
            </AppBar>
            <main className={classes.layout}>
                <Grid container justify="center">
                    {children}
                    <AlertBox />
                </Grid>
            </main>
        </>
    )
}