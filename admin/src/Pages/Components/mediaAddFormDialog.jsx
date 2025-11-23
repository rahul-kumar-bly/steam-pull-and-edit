import React from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Typography, TextField } from '@mui/material';

const MediaAddFormDialog = ({ openMF, contentMF, onCloseMF, onSubmitMF, valueMF }) => {
    return (
        <Dialog
            open={openMF}
            onClose={onCloseMF}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography>
                    Add Media
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ paddingBottom: 0 }}>
                <DialogContentText>
                    {contentMF}
                </DialogContentText>
                <form onSubmit={onSubmitMF}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="trailerUrl"
                        label="Trailer URL"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={valueMF}
                    />
                    <DialogActions>
                        <Button onClick={onCloseMF}>Cancel</Button>
                        <Button type="submit">Add Media</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default MediaAddFormDialog;