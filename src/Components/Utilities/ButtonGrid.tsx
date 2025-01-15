import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Button = {
  label: string;
};

type ButtonGridProps = {
  buttons: Button[];
  onButtonClick: (label: string) => void;
};

export const ButtonGrid: React.FC<ButtonGridProps> = ({ buttons }) => {
  const navigate = useNavigate();

  const handleButtonClick = (label: string) => {
    switch (label) {
      case "Otpremnica":
        navigate("/otpremnica");
        break;
      case "Ispis naljepnice":
        navigate("/ispis-naljepnice");
        break;
      case "Shipping receipt":
        navigate("/otpremnica");
        break;
      case "Label printing":
        navigate("/ispis-naljepnice");
        break;
      case "Validacija naloga":
        navigate("/validacija-naloga");
        break;
      case "Order validation":
        navigate("/validacija-naloga");
        break;
      case "Raspakiravanje Liste":
        navigate("/raspakiravanje-liste");
        break;
      case "Picking list unloading":
        navigate("/raspakiravanje-liste");
        break;
      default:
        console.log(`${label} ne vodi nikam.`);
    }
  };

  return (
    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="contained"
          sx={{
            height: "150px",
            width: "150px",
          }}
          onClick={() => handleButtonClick(button.label)}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  );
};
