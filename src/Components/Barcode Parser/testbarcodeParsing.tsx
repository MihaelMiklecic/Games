import { parseBarcode } from 'gs1-barcode-parser-mod';

  const testBarcodeParsing = () => {
    const barcode = "011234567890123410ABC12317250101";
    console.log("Testing Barcode:", barcode);
 
    try {
      const parsedData = parseBarcode(barcode);
      console.log("Parsed Barcode Data:", parsedData);
    } catch (error) {
      console.error("Error parsing barcode:", error);
    }
  };
 
  useEffect(() => {
    testBarcodeParsing();
  }, []);