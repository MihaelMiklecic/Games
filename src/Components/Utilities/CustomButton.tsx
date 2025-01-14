import { Button } from "@mui/material";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      sx={{
        height: "160px",
        width: "160px",
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
