import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Fade } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { alert } from '../../graphql/cache'
import { useReactiveVar } from '@apollo/client'

const useStyles = makeStyles((theme) => ({
    progress: {
        marginRight: theme.spacing(0.5),
        marginBottom: theme.spacing(-0.5),
    },
    statusBar: {
        width: 'auto',
        maxWidth: 300,
        position: 'fixed',
        bottom: 10,
        right: 20,
        zIndex: 2000,
    }
}));

export default function AlertBox() {
    const classes = useStyles();
    const alertConfig = useReactiveVar(alert)

    return (
        <Fade in={alertConfig.visible}>
            {
                alertConfig.isProgress ?
                <Alert className={classes.statusBar} icon={false} variant="filled" severity={alertConfig.severity}>
                    <CircularProgress className={classes.progress} size={18} color="inherit" />
                    {alertConfig.text}
                </Alert> :
                <Alert className={classes.statusBar} variant="filled" severity={alertConfig.severity}>
                    {alertConfig.text}
                </Alert>
            }
        </Fade>
    )
}