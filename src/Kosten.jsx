// KOSTEN.JSX – mit sortierten Listen & kompletter Ausgabenfunktion
import { useEffect, useState } from "react";
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import {
  Select, SelectItem, SelectTrigger, SelectContent
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export default function Kosten() {
  const [activeTab, setActiveTab] = useState("betankungen");
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [ausgaben, setAusgaben] = useState([]);

  const [tachostand, setTachostand] = useState(0);
  const [distanz, setDistanz] = useState(0);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);
  const [sorte, setSorte] = useState("HVO100");
  const [voll, setVoll] = useState(true);
  const [verbrauch, setVerbrauch] = useState(null);
  const [letzterStand, setLetzterStand] = useState(0);

  const [kostenart, setKostenart] = useState("");
  const [kosten, setKosten] = useState("");
  const [bemerkung, setBemerkung] = useState("");

  const kraftstoffArten = [
    "BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel", "Pflanzenöl",
    "Super 95", "Super E10", "Super 98", "Super Plus 103", "LPG", "LNG", "Wasserstoff"
  ];

  const kostenarten = [
    "Wartung", "Reparatur", "Versicherung", "Steuer", "Zubehör", "Tuning", "HU/AU", "Reifen", "Pflege", "Sonstiges"
  ];

  const vin = "WBA8H71020K659220";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("zerotrace")) || {
      vehicles: {},
      activeVin: vin,
    };
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    const fahrzeug = stored.vehicles[vin];
    setEntries([...fahrzeug.betankungen].reverse());
    setAusgaben([...fahrzeug.ausgaben].reverse());
    const letzte = fahrzeug.betankungen.at(-1);
    if (letzte) {
      setLetzterStand(letzte.km);
      setTachostand(letzte.km);
      setSorte(letzte.sorte);
    }
  }, []);

  useEffect(() => {
    const dist = tachostand - letzterStand;
    setDistanz(dist);
    if (dist > 0 && menge > 0) setVerbrauch(((menge / dist) * 100).toFixed(2));
  }, [tachostand]);

  useEffect(() => {
    if (distanz > 0 && menge > 0) setVerbrauch(((menge / distanz) * 100).toFixed(2));
  }, [distanz, menge]);

  useEffect(() => {
    if (menge && preisProLiter) setGesamtbetrag((menge * preisProLiter).toFixed(2));
    else if (menge && gesamtbetrag) setPreisProLiter((gesamtbetrag / menge).toFixed(3));
    else if (preisProLiter && gesamtbetrag) setMenge((gesamtbetrag / preisProLiter).toFixed(2));
  }, [menge, preisProLiter, gesamtbetrag]);

  const speichernBetankung = () => {
    const neuerEintrag = {
      datum: new Date().toISOString().split("T")[0],
      km: tachostand,
      distanz,
      menge,
      preis_l: preisProLiter,
      gesamt: gesamtbetrag,
      sorte,
      voll,
      verbrauch,
      synced: false,
    };
    const stored = JSON.parse(localStorage.getItem("zerotrace")) || { vehicles: {}, activeVin: vin };
    if (!stored.vehicles[vin]) stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    stored.vehicles[vin].betankungen.unshift(neuerEintrag);
    localStorage.setItem("zerotrace", JSON.stringify(stored));
    setEntries([neuerEintrag, ...entries]);
    setShowForm(false);
  };

  const speichernAusgabe = () => {
    const neuerEintrag = {
      datum: new Date().toISOString().split("T")[0],
      tachostand,
      kostenart,
      betrag: kosten,
      bemerkung,
      synced: false,
    };
    const stored = JSON.parse(localStorage.getItem("zerotrace")) || { vehicles: {}, activeVin: vin };
    if (!stored.vehicles[vin]) stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    stored.vehicles[vin].ausgaben.unshift(neuerEintrag);
    localStorage.setItem("zerotrace", JSON.stringify(stored));
    setAusgaben([neuerEintrag, ...ausgaben]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kostenübersicht</h1>
        <Button variant="outline" size="icon" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
        </Button>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setShowForm(false);
      }}>
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
                  <div><Label>Tachostand</Label><Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} /></div>
                  <div><Label>Distanz</Label><Input type="number" value={distanz} onChange={(e) => setDistanz(Number(e.target.value))} /></div>
                  <div><Label>Menge (l)</Label><Input type="number" value={menge} onChange={(e) => setMenge(Number(e.target.value))} /></div>
                  <div><Label>Preis pro Liter</Label><Input type="number" value={preisProLiter} onChange={(e) => setPreisProLiter(Number(e.target.value))} /></div>
                  <div><Label>Gesamtbetrag</Label><Input type="number" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(Number(e.target.value))} /></div>
                  <div><Label>Kraftstoff</Label>
                    <Select onValueChange={setSorte} defaultValue={sorte}>
                      <SelectTrigger>{sorte}</SelectTrigger>
                      <SelectContent>
                        {kraftstoffArten.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2"><Label>Vollbetankung</Label><Switch checked={voll} onCheckedChange={setVoll} /></div>
                  <div><Label>Verbrauch</Label><Input disabled value={verbrauch ? `${verbrauch} l/100km` : "?"} /></div>
                </div>
                <div className="text-right"><Button onClick={speichernBetankung}>Sichern</Button></div>
              </CardContent>
            </Card>
          )}

          {entries.map((e, i) => (
            <Card key={i} className="mb-4">
              <CardContent className="p-4">
                <p className="text-base font-semibold">{e.datum} – {e.km} km – {e.sorte}</p>
                <p className="text-sm">{e.menge} l • {e.gesamt} EUR • Verbrauch: {e.verbrauch ?? "?"} l/100km</p>
                {e.synced === false && <p className="text-xs text-yellow-500">nicht synchronisiert</p>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ausgaben">
          {showForm && (
            <Card className="mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Datum</Label><Input type="date" value={new Date().toISOString().split("T")[0]} disabled /></div>
                  <div><Label>Tachostand</Label><Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} /></div>
                  <div><Label>Kostenart</Label>
                    <Select onValueChange={setKostenart} defaultValue={kostenart}>
                      <SelectTrigger>{kostenart || "Bitte wählen"}</SelectTrigger>
                      <SelectContent>
                        {kostenarten.map((k) => (<SelectItem key={k} value={k}>{k}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Betrag (EUR)</Label><Input type="number" value={kosten} onChange={(e) => setKosten(e.target.value)} /></div>
                </div>
                <div><Label>Bemerkung</Label><Textarea value={bemerkung} onChange={(e) => setBemerkung(e.target.value)} placeholder="z. B. Rechnung, Infos, Link…" /></div>
                <div className="text-right"><Button onClick={speichernAusgabe}>Sichern</Button></div>
              </CardContent>
            </Card>
          )}

          {ausgaben.map((e, i) => (
            <Card key={i} className="mb-4">
              <CardContent className="p-4">
                <p className="text-base font-semibold">{e.datum} – {e.tachostand} km – {e.kostenart}</p>
                <p className="text-sm">{e.betrag} EUR<br />{e.bemerkung}</p>
                {e.synced === false && <p className="text-xs text-yellow-500">nicht synchronisiert</p>}
              </CardContent>
            </Card>
          ))}
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