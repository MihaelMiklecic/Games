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
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";

export const HeaderValidacije = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  const handleClick = () => {
    navigate("/glavni-izbornik");
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
            onClick={handleClick}
          >
            {t("BACK")}
          </Button>

          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {t("validacijaNalogaButton")}
          </Typography>

          <Typography variant="body1">
            {t("user")}
            <TextField disabled sx={{ p: 1 }} value={user}></TextField>
          </Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />
    </Box>
  );
};
