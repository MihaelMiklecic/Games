import { Container, Box } from "@mui/material";
import { HeaderGI } from "./GlavniIzbornikUtils/HeaderGI";
import { ButtonGrid } from "../Utilities/ButtonGrid";
import "../Prijevod/i18n";
import { useTranslation } from "react-i18next";

export const GlavniIzbornik = () => {
  const { t } = useTranslation();
  const buttons = [
    { label: t("otpremnicaButton") },
    { label: t("ispisNaljepniceButton") },
    { label: t("validacijaNalogaButton") },
    { label: t("raspakiravanje_liste") },
    { label: "Skeniranje Artikala" },
    { label: "Button 6" },
    { label: "Button 7" },
    { label: "Button 8" },
    { label: "Button 9" },
  ];

  const handleButtonClick = (label: string): void => {
    console.log(`Button clicked: ${label}`);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        p: 10,
        flexGrow: 1,
      }}
    >
      <HeaderGI />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonGrid buttons={buttons} onButtonClick={handleButtonClick} />
      </Box>
    </Container>
  );
};
