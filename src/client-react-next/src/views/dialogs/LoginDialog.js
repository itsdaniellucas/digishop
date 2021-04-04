import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Button, IconButton, Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockIcon from '@material-ui/icons/Lock';
import TextBox from '../../components/TextBox'
import { useReactiveVar } from '@apollo/client'
import { user } from '../../graphql/cache'

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    }
}));

export default function LoginDialog(props) {
    const classes = useStyles();
    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const currentUser = useReactiveVar(user);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(currentUser != null);
    });

    const onUsernameChange = (value) => {
        setUsername(value);
    }

    const onPasswordChange = (value) => {
        setPassword(value);
    }

    const handleOpen = () => {
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
    }

    const handleSubmit = () => {
        if(isLoggedIn) {
            if(props.onLogout) {
                props.onLogout();
            }
        } else {
            if(props.onLogin) {
                props.onLogin({
                    username,
                    password
                });
            }
        }

        handleClose();
    }

    const title = !isLoggedIn ? 'Login' : 'Logout';

    const body = !isLoggedIn 
    ?   (<React.Fragment>
            <TextBox icon={<AccountCircleIcon />} label="Username" onTextBoxChange={onUsernameChange} />
            <TextBox icon={<LockIcon />} label="Password" type="password" onTextBoxChange={onPasswordChange} />
        </React.Fragment>) 
    : 'Are you sure you want to logout?';

    return (
        <React.Fragment>
            <IconButton className={props.className} onClick={handleOpen} color={isLoggedIn ? 'secondary' : 'default'}>
                <AccountCircleIcon />
            </IconButton>
            <Dialog open={visible}
                    onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    {body}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>
                        {title}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
