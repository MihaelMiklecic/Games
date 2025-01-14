import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";

interface DialogInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

const DialogInfo = ({ isOpen, onClose }: DialogInfoProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <Typography>Svi artikli su uspješno validirani.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogInfo;
