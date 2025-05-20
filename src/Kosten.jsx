import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function Kosten() {
  const [activeTab, setActiveTab] = useState("betankungen");
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);

  const vin = "WBA8H71020K659220"; // Platzhalter, später via BLE ersetzt

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("zerotrace")) || {
      vehicles: {},
      activeVin: vin,
    };
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    setEntries(stored.vehicles[vin].betankungen);
  }, []);

  const speichern = () => {
    const neuerEintrag = {
      datum: new Date().toISOString().split("T")[0],
      km: 0,
      menge,
      preis_l: preisProLiter,
      gesamt: gesamtbetrag,
      sorte: "HVO100",
      verbrauch: parseFloat(((gesamtbetrag / menge / 100) * 100).toFixed(2)),
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
    <div className="min-h-screen p-4 bg-background text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kostenübersicht</h1>
        <Button variant="outline" size="icon" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setShowForm(false);
      }} className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 w-full">
          <TabsTrigger value="betankungen">Betankungen</TabsTrigger>
          <TabsTrigger value="ausgaben">Ausgaben</TabsTrigger>
          <TabsTrigger value="erinnerungen">Erinnerungen</TabsTrigger>
        </TabsList>

        <TabsContent value="betankungen">
          <div className="mt-4 space-y-4">
            {showForm && (
              <Card className="border border-gray-200 dark:border-zinc-700">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Menge (Liter)</Label>
                      <Input type="number" step="0.01" value={menge} onChange={(e) => setMenge(parseFloat(e.target.value))} />
                    </div>
                    <div>
                      <Label>Preis pro Liter (EUR)</Label>
                      <Input type="number" step="0.001" value={preisProLiter} onChange={(e) => setPreisProLiter(parseFloat(e.target.value))} />
                    </div>
                    <div>
                      <Label>Gesamtbetrag (EUR)</Label>
                      <Input type="number" step="0.01" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(parseFloat(e.target.value))} />
                    </div>
                  </div>
                  <div className="text-right">
                    <Button onClick={speichern}>Sichern</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {entries.map((e, i) => (
              <Card key={i} className="bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-700">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="text-base font-semibold">{e.datum}</p>
                      <p className="text-sm text-muted-foreground">{e.km} km • {e.sorte}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-red-600">{e.verbrauch} l/100km</p>
                      <p className="text-sm text-muted-foreground">{e.menge} l • {e.gesamt} EUR</p>
                      {!e.synced && <p className="text-xs text-yellow-500">nicht synchronisiert</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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