import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Divider, Button, Fab, Dialog, DialogActions, DialogTitle, DialogContent, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import DescriptionIcon from '@material-ui/icons/Description';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import WallpaperIcon from '@material-ui/icons/Wallpaper'
import TextBox from '../../components/TextBox'

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

export default function ProductDialog(props) {
    const classes = useStyles();

    const [name, setName] = useState(props.product ? props.product.name : '');
    const [desc, setDesc] = useState(props.product ? props.product.description : '');
    const [price, setPrice] = useState(props.product ? props.product.price : 0);
    const [quantity, setQuantity] = useState(props.product ? props.product.quantity : 0);
    const [file, setFile] = useState(props.product ? props.product.file : null);
    const [visible, setVisible] = useState(false);
    const isAdd = props.mode === 'add';
    const isIcon = props.icon;
    const title = isAdd ? 'Add Product' : 'Modify Product';

    
    useEffect(() => {
        setName(props.product ? props.product.name : '');
        setDesc(props.product ? props.product.description : '');
        setPrice(props.product ? props.product.price : 0);
        setQuantity(props.product ? props.product.quantity : 0);
    }, [props.product, visible]);

    const handleOpen = () => {
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
        setName('');
        setDesc('');
        setPrice(0);
        setQuantity(0);
    }

    const onValueChange = (value, handler) => {
        handler(value);
    }

    const handleUpload = (event) => {
        setFile(event.target.files[0]);
    }

    const handleSave = () => {
        if(props.onSave) {
            props.onSave({
                mode: props.mode,
                product: {
                    ...props.product,
                    name: name,
                    image: file,
                    description: desc,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                }
            })
        }

        handleClose();
    }


    let button = null;

    if(isAdd) {
        button = (
            <Fab className={props.className} color="primary" onClick={handleOpen} size={props.size} disabled={props.disabled}>
                <AddIcon />
            </Fab>
        )
    } else {
        if(isIcon) {
            button = (
                <IconButton className={props.className} 
                            color="primary" 
                            onClick={handleOpen} 
                            size={props.size || 'small'} 
                            disabled={props.disabled}>
                    <EditIcon />
                </IconButton>
            )
        } else {
            button = (
                <Button variant="contained"
                        startIcon={<EditIcon />}
                        className={props.className} 
                        color="primary" 
                        onClick={handleOpen} 
                        size={props.size || 'small'} 
                        disabled={props.disabled}>
                        Modify
                </Button>
            )
        }
    }

    return (
        <React.Fragment>
            {button}
            <Dialog open={visible}
                    onClose={handleClose}
                    size="md"
                    fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    {
                        isAdd ?
                        (
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary" component="label" onChange={handleUpload} startIcon={<WallpaperIcon />}>
                                        Upload Image
                                        <input type="file" hidden accept="image/*" />
                                    </Button>
                                </Grid>
                            </Grid>
                        ) :
                        null
                    }
                    <TextBox icon={<FingerprintIcon />} label="Product" width="53" value={name} onTextBoxChange={(v) => onValueChange(v, setName)} />
                    <TextBox icon={<DescriptionIcon />} label="Description" width="53" multiline rows={4} value={desc} onTextBoxChange={(v) => onValueChange(v, setDesc)} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextBox icon={<MonetizationOnIcon />} width="20" label="Price" value={price} onTextBoxChange={(v) => onValueChange(v, setPrice)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextBox icon={<LocalGroceryStoreIcon />} width="20" label="Quantity" value={quantity} onTextBoxChange={(v) => onValueChange(v, setQuantity)} />
                        </Grid>
                    </Grid>
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