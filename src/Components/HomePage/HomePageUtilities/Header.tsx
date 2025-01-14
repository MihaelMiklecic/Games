import { Box, Typography } from "@mui/material";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";
import i18n from "../../Prijevod/i18n";
import { GB, HR } from "country-flag-icons/react/1x1";

export const Header = () => {
  const { t } = useTranslation();
  const changeLanguage = (lng: string | undefined) => {
    i18n.changeLanguage(lng);
  };
  return (
    <Box
      sx={{
        bgcolor: "#1976d2",
        width: "100%",
        height: "10%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
      }}
    >
      <GB
        onClick={() => changeLanguage("en")}
        style={{
          width: "30px",
          height: "30px",
          cursor: "pointer",
          margin: "10px",
          position: "inherit",
        }}
      />
      <Typography
        variant="h5"
        sx={{
          padding: "3px",
          borderRadius: 2,
          width: "20%",
          color: "white",
        }}
      >
        {t("headerHomePage")}
      </Typography>

      <HR
        onClick={() => changeLanguage("cro")}
        style={{
          width: "30px",
          height: "30px",
          cursor: "pointer",
          margin: "10px",
          position: "inherit",
        }}
      />
    </Box>
  );
};
