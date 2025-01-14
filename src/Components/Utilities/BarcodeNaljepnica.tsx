import React from "react";
import Box from "@mui/material/Box";
import Barcode from "react-barcode";

interface BarcodeProps {
  data: string;
  gap: number;
}

const BarcodeComponent: React.FC<BarcodeProps> = ({ data, gap }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: `${gap}px`,
      }}
    >
      <Barcode value={data} />
    </Box>
  );
};

export default BarcodeComponent;
