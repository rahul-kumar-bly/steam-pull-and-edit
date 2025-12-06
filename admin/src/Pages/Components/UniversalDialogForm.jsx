import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const UniversalDialogForm = ({ open, title, content, onClose, sentDataLabel, onAgree }) => {

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
          <form onSubmit={onAgree} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="sentData"
              label={sentDataLabel}
              type="text"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default UniversalDialogForm;

// https://mui.com/material-ui/react-dialog/