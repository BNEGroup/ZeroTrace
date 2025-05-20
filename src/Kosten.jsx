// KOSTEN.JSX mit automatischer Verbrauchsberechnung und Distanzlogik
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
  const [verbrauch, setVerbrauch] = useState(null);
  const [letzterStand, setLetzterStand] = useState(0);

  const kraftstoffArten = [
    "BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel", "Pflanzenöl",
    "Super 95", "Super E10", "Super 98", "Super Plus 103", "LPG", "LNG", "Wasserstoff"
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
    setEntries(fahrzeug.betankungen);
    const letzte = fahrzeug.betankungen.at(-1);
    if (letzte) {
      setTachostand(letzte.km);
      setLetzterStand(letzte.km);
      setSorte(letzte.sorte);
    }
  }, []);

  const handleDistanzChange = (value) => {
    const dist = Number(value);
    setDistanz(dist);
    setTachostand(letzterStand + dist);
    if (dist && menge) {
      setVerbrauch(((menge / dist) * 100).toFixed(2));
    }
  };

  const handleTachostandChange = (value) => {
    const stand = Number(value);
    setTachostand(stand);
    const dist = stand - letzterStand;
    setDistanz(dist);
    if (dist && menge) {
      setVerbrauch(((menge / dist) * 100).toFixed(2));
    }
  };

  const handleMengeChange = (value) => {
    const liter = Number(value);
    setMenge(liter);
    if (distanz && liter) {
      setVerbrauch(((liter / distanz) * 100).toFixed(2));
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
      verbrauch,
      synced: false,
    };
    const stored = JSON.parse(localStorage.getItem("zerotrace")) || {
      vehicles: {},
      activeVin: vin,
    };
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    stored.vehicles[vin].betankungen.push(neuerEintrag);
    localStorage.setItem("zerotrace", JSON.stringify(stored));
    setEntries(stored.vehicles[vin].betankungen);
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
                  <div>
                    <Label htmlFor="tachostand">Tachostand (km)</Label>
                    <Input id="tachostand" type="number" placeholder="z. B. 237123" value={tachostand} onChange={(e) => handleTachostandChange(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="distanz">Distanz (km)</Label>
                    <Input id="distanz" type="number" placeholder="z. B. 630" value={distanz} onChange={(e) => handleDistanzChange(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="menge">Menge (Liter)</Label>
                    <Input id="menge" type="number" placeholder="z. B. 53.4" value={menge} onChange={(e) => handleMengeChange(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="preis">Preis pro Liter (EUR)</Label>
                    <Input id="preis" type="number" placeholder="z. B. 1.789" value={preisProLiter} onChange={(e) => setPreisProLiter(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="gesamt">Gesamtbetrag (EUR)</Label>
                    <Input id="gesamt" type="number" placeholder="z. B. 95.00" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="sorte">Kraftstoffsorte</Label>
                    <Select onValueChange={setSorte} defaultValue={sorte}>
                      <SelectTrigger>{sorte}</SelectTrigger>
                      <SelectContent>
                        {kraftstoffArten.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="voll">Vollbetankung</Label>
                    <Switch id="voll" checked={voll} onCheckedChange={setVoll} />
                  </div>
                  <div>
                    <Label>Verbrauch (automatisch)</Label>
                    <Input disabled value={verbrauch ? `${verbrauch} l/100km` : "?"} />
                  </div>
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
                <p className="text-sm">{e.menge} l • {e.gesamt} EUR • Verbrauch: {e.verbrauch ?? "?"} l/100km</p>
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