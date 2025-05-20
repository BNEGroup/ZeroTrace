// FINAL KORREKTUR – KOMPLETTER FUNKTIONIERENDER KOSTEN.JSX
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

  const [tachostand, setTachostand] = useState(0);
  const [distanz, setDistanz] = useState(0);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);
  const [sorte, setSorte] = useState("HVO100");
  const [voll, setVoll] = useState(true);

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
      setSorte(letzte.sorte);
    }
  }, []);

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
                  <Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} placeholder="Tachostand" />
                  <Input type="number" value={distanz} onChange={(e) => setDistanz(Number(e.target.value))} placeholder="Distanz" />
                  <Input type="number" value={menge} onChange={(e) => setMenge(Number(e.target.value))} placeholder="Menge (l)" />
                  <Input type="number" value={preisProLiter} onChange={(e) => setPreisProLiter(Number(e.target.value))} placeholder="Preis/l" />
                  <Input type="number" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(Number(e.target.value))} placeholder="Gesamtbetrag" />
                  <Select defaultValue={sorte} onValueChange={setSorte}>
                    <SelectTrigger>{sorte}</SelectTrigger>
                    <SelectContent>
                      {kraftstoffArten.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Label>Vollbetankung</Label>
                    <Switch checked={voll} onCheckedChange={setVoll} />
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