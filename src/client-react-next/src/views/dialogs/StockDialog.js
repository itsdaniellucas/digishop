import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Button, IconButton, Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import AddCircleIcon from '@material-ui/icons/AddCircle'
import TextBox from '../../components/TextBox'

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    }
}));

export default function StockDialog(props) {
    const classes = useStyles();
    const [visible, setVisible] = useState(false);
    const [stock, setStock] = useState(0);
    const isStock = props.type === 'stock';
    const type = isStock ? 'Stock' : 'Quantity'
    const isDrawer = props.drawer;
    const isIcon = props.icon;
    const title = `Add ${type}`;

    const handleOpen = () => {
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
    }

    const onStockChange = (value) => {
        setStock(value);
    }

    const handleSave = () => {
        if(props.onSave) {
            props.onSave(stock);
        }
        handleClose();
    }

    let input = null;

    if(isStock && !isDrawer) {
        if(isIcon) {
            input = (
                <IconButton color="primary"
                            onClick={handleOpen} 
                            size={props.size || 'small'} 
                            disabled={props.disabled}>
                    <AddCircleIcon />
                </IconButton>
            )
        } else {
            input = (
                <Button variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={handleOpen} 
                        size={props.size || 'small'} 
                        disabled={props.disabled}>
                        Add Stock
                </Button>
            )
        }
        
    } else if(!isStock && !isDrawer) {
        if(isIcon) {
            input = (
                <IconButton color="primary"
                            onClick={handleOpen} 
                            size={props.size || 'small'} 
                            disabled={props.disabled}>
                    <AddShoppingCartIcon />
                </IconButton>
            )
        } else {
            input = (
                <Button variant="contained"
                        color="primary"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={handleOpen} 
                        size={props.size || 'small'} 
                        disabled={props.disabled}>
                        Add to Cart
                </Button>
            )
        }
        
    } else {
        input = (
            <IconButton className={props.className} color="primary" onClick={handleOpen} disabled={props.disabled}>
                <AddIcon />
            </IconButton>
        )
    }

    return (
        <React.Fragment>
            {input}
            <Dialog open={visible}
                    onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    <TextBox icon={<LocalGroceryStoreIcon />} label={type} onTextBoxChange={onStockChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}