import { Box } from "@mui/material";

interface ChipProps {
  color: string;
}

const Chip = ({ color }: ChipProps) => {
  return (
    <Box
      sx={{
        backgroundColor: color,
        padding: "16px",
        borderRadius: "50%",
        display: "inline-flex",
        height: "30%",
        width: "6%",
        position: "relative",
      }}
    ></Box>
  );
};

export default Chip;
