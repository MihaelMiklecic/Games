import { TextField, Box, Button, Autocomplete, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import  useAppStore  from './AppSimulatorUtils/useAppStore';  

interface CellParams {
    cellName: string;
    deviceID: string;
}

interface RackCell {
    id: string;
    uniqueName: string;
    layoutType: string;
    layoutName: string;
    docType: string;
    Levels: string[];
    cellParams: CellParams[];
    LevelParams: Record<string, any>;
}

interface WeightChange {
    DeviceID: string;
    Value: string;
}

export const AppSimulator = () => {
    const [cells, setCells] = useState<RackCell[]>([]);
    const [weightChanges, setWeightChanges] = useState<WeightChange[]>([]);
    const [selectedDeviceID, setSelectedDeviceID] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [, setClipboardContent] = useState<string>(''); 

    const { newValue, setNewValue } = useAppStore(); 

    useEffect(() => {
        fetch('/RACK.json')
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data:', data);
                setCells(data);
                setNewValue(data[0]?.cellParams[0]?.cellName || '');
            })
            .catch((error) => console.log('Error:', error));
    }, [setNewValue]);

    useEffect(() => {
        fetch('/WEIGHT_CHANGE.json')
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data WC:', data);
                setWeightChanges(data);
            })
            .catch((error) => console.log('Error:', error));
    }, []);

    const autocompleteOptions = cells.flatMap((cell) => cell.cellParams);

    const handleSetValue = () => {
        if (newValue && selectedDeviceID) {
            console.log('Setting new value:', newValue, 'for DeviceID:', selectedDeviceID);      //SET VALUE
            setWeightChanges((prevWeightChanges) =>
                prevWeightChanges.map((weightChange) => {
                    const dataToSend =  {weightChanges, text, newValue, selectedDeviceID};       //SENT DATAA
                    const jsonString = JSON.stringify(dataToSend);
                    console.log('Sent data: ', jsonString);
                    useAppStore.setState({ weightChanges });
                    useAppStore.setState({ text });
                    useAppStore.setState({ newValue });
                    useAppStore.setState({ selectedDeviceID });
                    if (weightChange.DeviceID === selectedDeviceID) {
                        return { ...weightChange, Value: newValue };
                        
                    }
                    return weightChange;
                })
            );
        }
    };

    const handleCopy = (value: string) => {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                setClipboardContent(value);
                alert('Copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy text:', err);
            });
    };

    const handlePaste = (setter: (value: string) => void) => {
        navigator.clipboard
            .readText()
            .then((clipboardText) => {
                setter(clipboardText);
                console.log('Pasted:', clipboardText);
            })
            .catch((err) => {
                console.error('Failed to paste text:', err);
            });
    };

    const showUpdatedWeightChanges = () => {
        console.log('Updated weightChanges:', weightChanges);
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Button variant="contained" sx={{ width: '100%' }}>
                Override barcode scan
            </Button>
            <Button variant="contained" sx={{ width: '100%', bgcolor: 'green' }}>
                GetCellsData
            </Button>
            <Button variant="contained" sx={{ width: '100%', bgcolor: 'green' }}>
                Show Oper params
            </Button>
            <Autocomplete
                sx={{ width: '100%' }}
                value={autocompleteOptions.find((option) => option.deviceID === selectedDeviceID) || null}  
                options={autocompleteOptions}
                getOptionLabel={(option) => `${option.cellName} - ${option.deviceID}`}
                onChange={(_event, value) => {
                    if (value) setSelectedDeviceID(value.deviceID);
                }}
                renderInput={(params) => <TextField {...params} label="Select cell" />}
/>

            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ width: '25%' }}>
                        Set value manual:
                    </Typography>
                    <TextField
                        sx={{ width: '15%' }}
                        label="Weight Value"
                        value={newValue || ''} 
                        onChange={(e) => setNewValue(e.target.value)} 
                    />
                    <Button variant="contained" sx={{ bgcolor: 'black' }} onClick={() => handlePaste(setNewValue)}>
                        Paste
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: 'black' }} onClick={handleSetValue}>
                        SetValue
                    </Button>
                    <Autocomplete disablePortal sx={{ width: '15%' }} options={[]} renderInput={(params) => <TextField {...params} label="TaskValueField" />} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ width: '25%' }}>
                        Set barcode value:
                    </Typography>
                    <TextField 
                        sx={{ width: '15%' }} 
                        label="Barcode Value"
                        value=""></TextField>
                    <Button variant="contained" sx={{ bgcolor: 'black' }} onClick={() => handlePaste(setText)}>
                        Paste
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: 'black' }} onClick={() => []}>
                        SetValue
                    </Button>
                    <Button onClick={showUpdatedWeightChanges}>NO action/ Display changes</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ width: '25%' }}>taskExpectedValue: </Typography>
                    <TextField sx={{ width: '15%' }} 
                            onChange={(e) => setText(e.target.value)}
                            label="TaskExpectedValueField" 
                            value={text}></TextField>
                    <Button variant='contained' sx={{ bgcolor: 'black' }}  onClick = {()=>handleCopy(text)}>Copy</Button>
                    <Button>NO action</Button>
                    <Button>NO action</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ width: '25%' }}>ART Weight: </Typography>
                    <Autocomplete disablePortal sx={{ width: '15%' }} options={[]} renderInput={(params) => <TextField {...params} label="ART weight field" />} />
                    <Button>NO action</Button>
                    <Button>NO action</Button>
                    <Button>NO action</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ width: '25%' }}>taskValue </Typography>
                    <Autocomplete disablePortal sx={{ width: '15%' }} options={[]} renderInput={(params) => <TextField {...params} label="TaskValueField" />} />
                    <Button>NO action</Button>
                    <Button>NO action</Button>
                    <Button>NO action</Button>
                </Box>
            </Box>

        </Box>
    );
};
