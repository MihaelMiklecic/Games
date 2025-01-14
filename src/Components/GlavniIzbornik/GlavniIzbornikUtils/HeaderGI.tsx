import {
  Box,
  Typography,
  AppBar,
  Button,
  Toolbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../useAuthStore";
import useBarcodeScannerStore from "../../useBarcodeScannerStore";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import "../../Prijevod/i18n";

export const HeaderGI = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { t } = useTranslation();
  const handleLogout = (): void => {
    logout();
    navigate("/");
    enqueueSnackbar(t("logoutMessage"), {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "center" },
      autoHideDuration: 3000,
    });
    useBarcodeScannerStore.setState({ receivedData: "" });
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ bgcolor: "red" }}
            onClick={handleLogout}
          >
            {t("logoutButton")}
          </Button>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {t("mainPage")}
          </Typography>
          <Typography variant="body1">
            {t("user")}
            <TextField disabled sx={{ p: 1 }} value={user} />
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};
