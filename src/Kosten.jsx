import { useState } from "react";
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

  // Betankung State für automatische Berechnung
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);

  const berechneVonPreisProLiter = () => {
    if (menge && preisProLiter) {
      setGesamtbetrag((menge * preisProLiter).toFixed(2));
    }
  };

  const berechneVonGesamtbetrag = () => {
    if (menge && gesamtbetrag) {
      setPreisProLiter((gesamtbetrag / menge).toFixed(3));
    }
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
                      <Label>Datum</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Tachostand</Label>
                      <Input type="number" placeholder="z. B. 237039" />
                    </div>
                    <div>
                      <Label>Distanz (km)</Label>
                      <Input type="number" step="0.1" />
                    </div>
                    <div>
                      <Label>Menge (Liter)</Label>
                      <Input type="number" step="0.01" value={menge} onChange={(e) => setMenge(parseFloat(e.target.value))} />
                    </div>
                    <div>
                      <Label>Preis pro Liter (EUR)</Label>
                      <Input type="number" step="0.001" value={preisProLiter} onChange={(e) => {
                        setPreisProLiter(parseFloat(e.target.value));
                        berechneVonPreisProLiter();
                      }} />
                    </div>
                    <div>
                      <Label>Gesamtbetrag (EUR)</Label>
                      <Input type="number" step="0.01" value={gesamtbetrag} onChange={(e) => {
                        setGesamtbetrag(parseFloat(e.target.value));
                        berechneVonGesamtbetrag();
                      }} />
                    </div>
                    <div>
                      <Label>Sorte</Label>
                      <Input placeholder="z. B. HVO100" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Button>Sichern</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-700">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p className="text-base font-semibold">17.02.2025</p>
                    <p className="text-sm text-muted-foreground">237.039 km • HVO100</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-red-600">7,12 l/100km</p>
                    <p className="text-sm text-muted-foreground">53,40 l • 95,00 EUR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ausgaben">
          <div className="mt-4 space-y-4">
            {showForm ? (
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Datum</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Tachostand</Label>
                      <Input type="number" placeholder="z. B. 237677" />
                    </div>
                    <div>
                      <Label>Kostenart</Label>
                      <Input placeholder="z. B. Ladegrundgebühr" />
                    </div>
                    <div>
                      <Label>Kosten</Label>
                      <Input type="number" step="0.01" placeholder="z. B. 95.00" />
                    </div>
                    <div>
                      <Label>Währung</Label>
                      <Select>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="huf">HUF</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <Label>Wiederholung</Label>
                      <Input placeholder="z. B. alle 36 Monate" />
                    </div>
                  </div>
                  <div>
                    <Label>Bemerkung</Label>
                    <Textarea placeholder="z. B. Artikelnummern, Beschreibung etc." />
                  </div>
                  <div>
                    <Label>Anhang</Label>
                    <Input type="file" />
                  </div>
                  <div className="text-right">
                    <Button>Sichern</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted text-sm text-center">Noch keine Ausgaben erfasst.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="erinnerungen">
          <div className="mt-4">
            {showForm ? (
              <Card className="p-4 text-center">
                <p className="text-muted">Formular für Erinnerungen folgt ...</p>
              </Card>
            ) : (
              <p className="text-muted text-sm text-center">Noch keine Erinnerungen gespeichert.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}