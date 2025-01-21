import { Dialog, Slide, Typography } from "@mui/material";
import React, { ReactElement, useEffect } from "react";

interface DialogInterface {
  dialogOpen: boolean;
  dialogTitle: string;
  dialogClose: () => void;
  type?: "info" | "error" | "success";
  duration?: number;
}

interface TransitionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any, any>;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfoDialog = ({
  dialogOpen,
  dialogTitle,
  dialogClose,
  type,
  duration = 3000,
}: DialogInterface) => {
  useEffect(() => {
    if (dialogOpen && duration > 0) {
      const timer = setTimeout(() => {
        dialogClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [dialogOpen, duration, dialogClose]);
  return (
    <Dialog
      open={dialogOpen}
      onClose={dialogClose}
      TransitionComponent={Transition}
      keepMounted
      sx={{
        "& .MuiDialog-paper": {
          border: `4px solid ${
            type === "info"
              ? "#1873CC"
              : type === "error"
              ? "red"
              : type === "success"
              ? "#00B246"
              : "transparent"
          }`,
          background: "#373737",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        },
      }}
    >
      <Typography variant="h4" sx={{ color: "white", textAlign: "center" }}>
        {dialogTitle}
      </Typography>
      <Typography variant="h5" sx={{color: "white"}}>Uspješan sken artikla!!</Typography>
    </Dialog>
  );
};

export default InfoDialog;
