import { Button } from '@mui/material';

interface AppSimulatorButtonProps {
    deviceID: string;
    value: string;
    onClick: (deviceID: string, value: string) => void;
}

export const AppSimulatorButton = ({ deviceID, value, onClick }: AppSimulatorButtonProps) => {
    return (
        <Button
            variant="contained"
            onClick={() => onClick(deviceID, value)}
        >
            Simulate {value} from {deviceID}
        </Button>
    );
};
