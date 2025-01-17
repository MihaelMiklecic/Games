import {
Box,
Typography,
AppBar,
Button,
Toolbar,
TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthStore from "../useAuthStore";

export default function CustomHeader(props: any) {
const navigate = useNavigate();
const { t } = useTranslation();
const { logout } = useAuthStore();

const handleLogout = (): void => {
    logout();
    navigate("/");
};

return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
    <AppBar position="fixed">    
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button variant="contained" sx={{ bgcolor: "red" }} onClick={handleLogout}>
                {t("BACK")}
            </Button>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                {props.title}
            </Typography>
        </Toolbar>
    </AppBar>
    </Box>
);
}