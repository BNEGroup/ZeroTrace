// FINAL COMPLETE BETANKUNGSFORMULAR – KOMPLETTER BLOCK
// Alle Imports am Anfang
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";

export default function Kosten() {
  const [activeTab, setActiveTab] = useState("betankungen");
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);

  const [tachostand, setTachostand] = useState(0);
  const [distanz, setDistanz] = useState(0);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);
  const [sorte, setSorte] = useState("HVO100");
  const [voll, setVoll] = useState(true);
  const [bemerkung, setBemerkung] = useState("");
  const [reifen, setReifen] = useState("");
  const [fahrweise, setFahrweise] = useState("");
  const [strecke, setStrecke] = useState([]);
  const [extras, setExtras] = useState([]);
  const [tankstelle, setTankstelle] = useState({ marke: "", land: "", name: "" });

  const vin = "WBA8H71020K659220";

  const kraftstoffArten = ["BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel", "Pflanzenöl", "Super 95", "Super E10", "Super 98", "Super Plus 103", "LPG", "LNG", "Wasserstoff"];
  const streckenarten = ["Autobahn", "Stadt", "Landstraße"];
  const extraOptionen = ["Klimaanlage", "Anhänger", "Standheizung"];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("zerotrace")) || {
      vehicles: {},
      activeVin: vin,
    };
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    const fahrzeug = stored.vehicles[vin];
    setEntries(fahrzeug.betankungen);
    const letzte = fahrzeug.betankungen.at(-1);
    if (letzte) {
      setTachostand(letzte.km);
      setSorte(letzte.sorte);
    }
  }, []);

  const toggle = (list, value, setter) => {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else {
      setter([...list, value]);
    }
  };

  const speichern = () => {
    const neuerEintrag = {
      datum: new Date().toISOString().split("T")[0],
      km: tachostand,
      distanz,
      menge,
      preis_l: preisProLiter,
      gesamt: gesamtbetrag,
      sorte,
      voll,
      bemerkung,
      reifen,
      fahrweise,
      strecke,
      extras,
      tankstelle,
      synced: false,
    };
    const stored = JSON.parse(localStorage.getItem("zerotrace")) || { vehicles: {}, activeVin: vin };
    if (!stored.vehicles[vin]) stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    stored.vehicles[vin].betankungen.push(neuerEintrag);
    localStorage.setItem("zerotrace", JSON.stringify(stored));
    setEntries(stored.vehicles[vin].betankungen);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Betankungen</h1>
        <Button variant="outline" size="icon" onClick={() => setShowForm(!showForm)}><Plus size={18} /></Button>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={(value) => { setActiveTab(value); setShowForm(false); }}>
        <TabsList className="grid grid-cols-3 gap-2 mb-4">
          <TabsTrigger value="betankungen">Betankungen</TabsTrigger>
          <TabsTrigger value="ausgaben">Ausgaben</TabsTrigger>
          <TabsTrigger value="erinnerungen">Erinnerungen</TabsTrigger>
        </TabsList>
        <TabsContent value="betankungen">
          {showForm && (
            <Card className="mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} placeholder="Tachostand" />
                  <Input type="number" value={distanz} onChange={(e) => setDistanz(Number(e.target.value))} placeholder="Distanz" />
                  <Input type="number" value={menge} onChange={(e) => setMenge(Number(e.target.value))} placeholder="Menge (l)" />
                  <Input type="number" value={preisProLiter} onChange={(e) => setPreisProLiter(Number(e.target.value))} placeholder="Preis/l" />
                  <Input type="number" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(Number(e.target.value))} placeholder="Gesamtbetrag" />
                  <Select defaultValue={sorte} onValueChange={setSorte}>
                    {kraftstoffArten.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </Select>
                  <div className="flex items-center gap-2">
                    <Label>Voll?</Label>
                    <Switch checked={voll} onCheckedChange={setVoll} />
                  </div>
                </div>

                <Textarea placeholder="Bemerkung" value={bemerkung} onChange={(e) => setBemerkung(e.target.value)} />

                <div>
                  <Label className="block mb-1">Reifen</Label>
                  <div className="flex gap-2">
                    {["Sommer", "Winter", "Übergang"].map((r) => (
                      <Button key={r} variant={reifen === r ? "default" : "outline"} onClick={() => setReifen(r)}>{r}</Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="block mb-1">Fahrweise</Label>
                  <div className="flex gap-2">
                    {["sparsam", "normal", "sportlich"].map((fw) => (
                      <Button key={fw} variant={fahrweise === fw ? "default" : "outline"} onClick={() => setFahrweise(fw)}>{fw}</Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Streckenart</Label>
                  <div className="flex gap-2 flex-wrap">
                    {streckenarten.map((typ) => (
                      <Button key={typ} variant={strecke.includes(typ) ? "default" : "outline"} onClick={() => toggle(strecke, typ, setStrecke)}>{typ}</Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Extras</Label>
                  <div className="flex gap-2 flex-wrap">
                    {extraOptionen.map((x) => (
                      <Button key={x} variant={extras.includes(x) ? "default" : "outline"} onClick={() => toggle(extras, x, setExtras)}>{x}</Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Tankstelle (Name)" value={tankstelle.name} onChange={(e) => setTankstelle({ ...tankstelle, name: e.target.value })} />
                  <Input placeholder="Marke" value={tankstelle.marke} onChange={(e) => setTankstelle({ ...tankstelle, marke: e.target.value })} />
                  <Input placeholder="Land" value={tankstelle.land} onChange={(e) => setTankstelle({ ...tankstelle, land: e.target.value })} />
                </div>

                <div className="text-right">
                  <Button onClick={speichern}>Sichern</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {entries.map((e, i) => (
            <Card key={i} className="mb-4">
              <CardContent className="p-4">
                <p className="text-base font-semibold">{e.datum} – {e.km} km – {e.sorte}</p>
                <p className="text-sm">{e.menge} l • {e.gesamt} EUR • Verbrauch: {(e.menge && e.distanz ? ((e.menge / e.distanz) * 100).toFixed(1) : "?")} l/100km</p>
                {e.synced === false && <p className="text-xs text-yellow-500">nicht synchronisiert</p>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ausgaben">
          <div className="mt-4">
            <p className="text-muted text-sm text-center">Ausgaben folgen...</p>
          </div>
        </TabsContent>

        <TabsContent value="erinnerungen">
          <div className="mt-4">
            <p className="text-muted text-sm text-center">Erinnerungen folgen...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}