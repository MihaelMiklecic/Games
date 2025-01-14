import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/glavni-izbornik");
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        bgcolor: "#1976d2",
        p: 1,
        borderRadius: 2,
      }}
    >
      <Button
        variant="contained"
        sx={{
          width: "500px",
          bgcolor: "red",
        }}
        onClick={handleNavigation}
      >
        {t("homePageButton")}
      </Button>
    </Box>
  );
};
