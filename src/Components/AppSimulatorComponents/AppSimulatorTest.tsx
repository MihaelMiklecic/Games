import { Typography, Box, Button } from "@mui/material";
import useAppStore from "./AppSimulatorUtils/useAppStore";


const  AppSimulatorTest = () => {

    const { weightChanges, text, newValue, selectedDeviceID } = useAppStore();

    const receiveData = () =>{
        const dataToSend =  {weightChanges, text, newValue, selectedDeviceID};
        const jsonString = JSON.stringify(dataToSend);
        console.log('Received data: ', jsonString);
    }


    return (
        <Box>
            <Typography>AppSimulatorTest</Typography>
            <Button variant="contained"onClick={receiveData}>
                Receive data
            </Button>
        </Box>
    );
}

export default AppSimulatorTest;