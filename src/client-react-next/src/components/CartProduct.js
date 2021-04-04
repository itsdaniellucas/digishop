import { Chip, IconButton, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import StockDialog from '../views/dialogs/StockDialog'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import LocalAtmIcon from '@material-ui/icons/LocalAtm'
import DeleteIcon from '@material-ui/icons/Delete'
import { useMutation } from '@apollo/client'
import { GET_CART } from '../graphql/queries'
import { ADD_QUANTITY, REMOVE_FROM_CART, mutationWrapper } from '../graphql/mutations'

const useStyles = makeStyles((theme) => ({
    content: {
        marginRight: theme.spacing(1),
    }
}))

export default function CartProduct(props) {
    const classes = useStyles();
    const product = props.product

    const [addQuantity] = useMutation(ADD_QUANTITY)
    const [removeFromCart] = useMutation(REMOVE_FROM_CART)

    const onSaveQuantity = (count) => {
        mutationWrapper({
            operationName: 'addQuantity',
            mutation: addQuantity({
                variables: {
                    productId: product.id,
                    quantity: parseInt(count)
                }
            })
        })
    }

    const onRemoveFromCart = () => {
        mutationWrapper({
            operationName: 'removeFromCart',
            mutation: removeFromCart({
                variables: {
                    productId: product.id
                },
                refetchQueries: [
                    { 
                        query: GET_CART 
                    }
                ]
            }),
        })
    }

    return (
        <ListItem button>
            <ListItemIcon className={classes.content}><Chip color="secondary" icon={<LocalGroceryStoreIcon />} label={product.quantity}></Chip></ListItemIcon>
            <ListItemIcon className={classes.content}><Chip color="secondary" icon={<LocalAtmIcon />} label={product.price * product.quantity}></Chip></ListItemIcon>
            <ListItemText primary={product.name} />
            <ListItemSecondaryAction>
                <StockDialog drawer onSave={onSaveQuantity} />
                <IconButton color="primary" onClick={onRemoveFromCart}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}