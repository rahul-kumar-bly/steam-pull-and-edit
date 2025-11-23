import React from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Typography} from '@mui/material';

const UniversalDialog = ({ open, width, title, content, onClose, onAgree }) => {
return (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth={width}
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title"  component="span">
            <Typography>
            {title}
            </Typography>
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" component="div">
                <Typography>
                {content}
                </Typography>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onAgree} autoFocus>
                Agree
            </Button>
        </DialogActions>
    </Dialog>
)
}

export default UniversalDialog;