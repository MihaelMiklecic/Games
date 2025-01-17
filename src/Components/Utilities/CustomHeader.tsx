import React from "react";
import {
  Box,
  Typography,
  AppBar,
  Button,
  Toolbar,
  AppBarProps,
  ButtonProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface CustomHeaderProps extends AppBarProps {
  title: string; 
  onBackClick: () => void; 
  backButtonLabel?: string;
  additionalContent?: React.ReactNode;
  buttonProps?: ButtonProps; 
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onBackClick,
  backButtonLabel,
  additionalContent,
  buttonProps,
  ...appBarProps
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar position="fixed" {...appBarProps}>
        <Toolbar>
          <Button onClick={onBackClick} {...buttonProps}>
            {backButtonLabel || t("BACK")}
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            {title}
          </Typography>
          {additionalContent}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default CustomHeader;
