import { Button } from "@mui/material";
import { useState } from "react";
export default function SlanjeAriklaSim() {
    const [counter, setCounter] = useState(0);

    interface Artikl{
        RealStat?: number,
        MATNR?: string,
        MatUID?: boolean,
        locationSrc?: string,
        locationDest?: boolean,
        QTY?: number,
        Rbr?: boolean,
        UID?: string,
        ParentID?: string,
        DateTime?: Date,
        Status?: number,
        MEINH?: boolean,
        Value?: boolean,
        BStat: string,                
        scanEachArtBarcode?: boolean,
        HANDLE?: any,
        NAME?: string,
        MATDESC?: boolean
        GTIN13?: string,
        WEIGHT?: number,
        X?: number,
        Y?: number,
        Z?: number,
        VOL?: number,
        MEAS?: string,
        TRGTIN?: number,
        TRQTY?: number,
        TRX?: number,
        TRY?: number,
        TRZ?: number,
        TRWEIGHT?: number,
        EXPIRE?: Date,
        SRCC?: string,
        ARTSourceType?: null,
        CSStat?: null,
        CEStat?: null,
        DOC_ITEM_ID?: string,
        START_TIME?: null,
        END_TIME?: null,
        TTLOC?: null,
        SERNUM?: null,
        ID_OP?: null,
        BATCH?: string,
        SRLOCPR?: number,
        SSCC?: string | boolean,
        ID?: number,
        STOCKQTY?: number,
        collectedVal?: null,
        DOCID?: string,
        DOCNAME?: string,
        DOCNUM?: string,
        plStatus?: number
    }

    const sendArtikl = () =>{
        const artikl: Artikl = {
            BStat: "BSHC",
            GTIN13: "3614271327611",
            SERNUM: null,
            BATCH: "62XO00",
            SSCC: undefined
        }
        setCounter(counter + 1);
        console.log("Artikl: ", artikl);
        localStorage.setItem(`artikl_${counter}`, JSON.stringify(artikl))
    }
    return(
        <Button variant="contained" onClick={sendArtikl}>Send Artikl</Button>
    );
}