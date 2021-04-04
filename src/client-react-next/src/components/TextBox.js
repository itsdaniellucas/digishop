import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export default function TextBox(props) {

    const useStyles = makeStyles(() => ({
        textField: {
          width: props.width ? `${props.width}ch` : '25ch',
        },
    }));

    const classes = useStyles();
    const [value, setValue] = useState(props.value || '');

    const handleChange = (event) => {
        setValue(event.target.value);
        if(props.onTextBoxChange) {
            props.onTextBoxChange(event.target.value);
        }
    }

    return (
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>{props.icon}</Grid>
            <Grid item>
                <TextField label={props.label} 
                            value={value} 
                            onChange={handleChange} 
                            type={props.type} 
                            multiline={props.multiline}
                            rows={props.rows}
                            fullWidth
                            className={classes.textField} />
            </Grid>
        </Grid>
    )
}