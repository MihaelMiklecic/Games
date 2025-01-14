import { Button } from "@mui/material";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";
import useBarcodeScannerStore from "../../useBarcodeScannerStore";

interface IspisButtonProps {
  logData: () => void;
  onClick: () => void;
}

export const IspisButton = ({ logData, onClick }: IspisButtonProps) => {
  const { t } = useTranslation();
  const { setReceivedData } = useBarcodeScannerStore();
  return (
    <Button
      variant="contained"
      onClick={() => {
        logData();
        onClick();
        setReceivedData("");
      }}
      sx={{
        mt: 2,
        width: "80%",
        bgcolor: "green",
      }}
    >
      {t("PRINT")}
    </Button>
  );
};
