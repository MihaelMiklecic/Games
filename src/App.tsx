import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./Components/HomePage/HomePage";
import { GlavniIzbornik } from "./Components/GlavniIzbornik/GlavniIzbornik";
import { Otpremnica } from "./Components/Otpremnica/Otpremnica";
import { IspisNaljepnice } from "./Components/IspisNaljepnice/IspisNaljepnice";
import { SnackbarProvider } from "notistack";
import ListaPickingListi from "./Components/ValidacijaNaloga/ListaPickingListi";
import ValidacijaListe from "./Components/ValidacijaNaloga/ValidacijaUtils/ValidacijaListe";
import RaspakiravanjePickingListe from "./Components/RaspakiravanjePickingListe/RaspakiravanjePickingListe";
import ListaKartona from "./Components/RaspakiravanjePickingListe/RPL_utils/ListaKartona/ListaKartona";
import KreiranjeKartona from "./Components/RaspakiravanjePickingListe/RPL_utils/KreiranjeKartona/KreiranjeKartona";
import SkeniranjeSRCKontejnera from "./Components/RaspakiravanjePickingListe/RPL_utils/SkeniranjeSRC/SkeniranjeSRCKontejnera";
import PrebacivanjeArtikla from "./Components/RaspakiravanjePickingListe/RPL_utils/PrebacivanjeArtikla/PrebacivanjeArtikla";
function App() {
  return (
    <SnackbarProvider maxSnack={1}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/glavni-izbornik" element={<GlavniIzbornik />} />
          <Route path="/otpremnica" element={<Otpremnica />} />
          <Route path="/ispis-naljepnice" element={<IspisNaljepnice />} />
          <Route path="/validacija-naloga" element={<ListaPickingListi />} />
          <Route path="/validacija-liste" element={<ValidacijaListe />} />
          <Route
            path="/raspakiravanje-liste"
            element={<RaspakiravanjePickingListe />}
          />
          <Route path="/lista-kartona" element={<ListaKartona />} />
          <Route path="/kreiranje-kartona" element={<KreiranjeKartona />} />
          <Route path="/skeniranje-src" element={<SkeniranjeSRCKontejnera />} />
          <Route
            path="/prebacivanje-artikla"
            element={<PrebacivanjeArtikla />}
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
