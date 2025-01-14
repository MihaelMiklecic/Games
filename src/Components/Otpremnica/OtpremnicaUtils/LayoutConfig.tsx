import { useNavigate } from "react-router-dom";
import { ButtonGrid } from "../../Utilities/ButtonGrid";

interface Button {
  label: string;
}

export const Layout: React.FC = () => {
  const navigate = useNavigate();

  const buttons: Button[] = [
    { label: "Otpremnica" },
    { label: "Ispis naljepnice" },
  ];

  const handleButtonClick = (label: string): void => {
    console.log("Navigating for label:", label);
    switch (label) {
      case "Otpremnica":
        navigate("/otpremnica");
        break;
      case "Ispis naljepnice":
        navigate("/ispis-naljepnice");
        break;
      default:
        console.log(`No route defined for ${label}`);
    }
  };

  return <ButtonGrid buttons={buttons} onButtonClick={handleButtonClick} />;
};
