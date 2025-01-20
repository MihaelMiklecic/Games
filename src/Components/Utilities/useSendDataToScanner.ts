import { useState } from "react";
import useBarcodeScannerStore from "../useBarcodeScannerStore";
import useScannerInfo from "../useScannerInfo";
interface SendDataToScannerParams {
  feedback_action_id: string;
}

const useSendDataToScanner = () => {
  const { dataObj } = useScannerInfo();
  const [hasSentData, setHasSentData] = useState(false);

  const sendDataToScanner = async ({
    feedback_action_id,
  }: SendDataToScannerParams) => {
    const data = {
      api_version: "1.0",
      event_type: "feedback!",
      event_id: "02114da8-feae-46e3-8b00-a3f7ea8672df",
      time_created: Date.now(),
      device_serial: dataObj?.device_serial,
      feedback_action_id,
    };
    await useBarcodeScannerStore.getState().sendData(data);
    setHasSentData(true); // Set hasSentData to true after sending data
  };

  const sendDataToDCScanner = async () => {
    const data = {
      api_version: "1.0",
      event_type: "scanner_connectivity!",
      event_id: "02114da8-feae-46e3-8b00-a3f7ea8672dk",
      time_created: Date.now(),
      device_serial: dataObj?.device_serial,
      connect: false,
    };
    await useBarcodeScannerStore.getState().sendData(data);
    setHasSentData(true); // Set hasSentData to true after sending data
  };

  const sendDataToConnectScanner = async () => {
    const data = {
      api_version: "1.0",
      event_type: "scanner_connectivity!",
      event_id: "02114da8-feae-46e3-8b00-a3f7ea8672dk",
      time_created: Date.now(),
      device_serial: dataObj?.device_serial,
      connect: true,
    };
    await useBarcodeScannerStore.getState().sendData(data);
    setHasSentData(true); // Set hasSentData to true after sending data
  };

  const resetHasSentData = () => {
    setHasSentData(false);
  };

  return {
    sendDataToScanner,
    hasSentData,
    resetHasSentData,
    sendDataToDCScanner,
    sendDataToConnectScanner,
  };
};

export default useSendDataToScanner;
