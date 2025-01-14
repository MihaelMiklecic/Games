import { Box, Button, Container } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { Checkbox, Typography, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";
export const IspisButton = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Data[]>([]);

  const setOpenDialog = () => {
    setOpen(true);
  };

  useEffect(() => {
    fetch("/ListaPickingListi.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.warn("Error fetching data:", error));
  }, []);

  const closeDialog = () => {
    const updatedData = [...data];
    setData(updatedData);
    console.log("Poslano na print:", data);
    setOpen(false);
  };
  interface Data {
    DOCID: string;
    DOCNUM: string;
    DOCTIME: string;
    DOCNAME: string;
    DOCDESC: string;
    RPT: boolean | null;
    QUEUE: string;
    SRID: boolean | null;
    SRLOC: string;
    SRCC: string;
    WDEV: string;
    DESTLOC: string;
    DESTCC: string;
    CSSTAT: string;
    CESTAT: string;
    DocType: string | null;
    Status: string;
    UID: string;
    MEMO: string | null;
    DateTime: string;
    HodogramUID: string;
    SmartRackUID: string;
    cellDeviceID: string;
    ID: string;
    ID_USER_EXT: string;
    TransUID_CONTSTAT: string | null;
    ParentID: string | null;
    TransUID: string | null;
    currentRealValue: string;
    QTY: string;
    transRecordStatus: string | null;
    rNBoja: string;
  }
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          bgcolor: "#1976d2",
          p: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: "500px",
            bgcolor: "green",
          }}
          onClick={setOpenDialog}
        >
          <PrintIcon />
          {t("PRINT")}
        </Button>
        <Dialog open={open} onClose={closeDialog}>
          <DialogContent>
            <Box>
              <Box sx={{ display: "flex" }}>
                <Checkbox></Checkbox>
                <Typography variant="h6">{t("document")}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Checkbox></Checkbox>
                <Typography variant="h6">{t("sticker")}</Typography>
              </Box>
              <Button
                variant="contained"
                onClick={closeDialog}
                sx={{
                  bgcolor: "green",
                }}
              >
                {t("printAll")}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};
