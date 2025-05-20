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
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kostenübersicht</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={16} /> Ausgaben hinzufügen
        </Button>
      </div>

      <Tabs defaultValue="betankungen" className="w-full">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="betankungen">Betankungen</TabsTrigger>
          <TabsTrigger value="ausgaben">Ausgaben</TabsTrigger>
          <TabsTrigger value="erinnerungen">Erinnerungen</TabsTrigger>
        </TabsList>

        {/* TAB: Betankungen */}
        <TabsContent value="betankungen">
          <div className="mt-4 space-y-4">
            <Card className="bg-white dark:bg-zinc-900 shadow-md border border-gray-200 dark:border-zinc-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-semibold">17.02.2025</p>
                    <p className="text-sm text-gray-500">237.039 km • HVO100</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-red-600">7,12 l/100km</p>
                    <p className="text-sm text-gray-500">53,40 l • 95,00 EUR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: Ausgaben */}
        <TabsContent value="ausgaben">
          <div className="mt-4 space-y-4">
            {showForm && (
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
                      <Select>
                        <SelectItem value="wartung">Wartung</SelectItem>
                        <SelectItem value="reparatur">Reparatur</SelectItem>
                        <SelectItem value="reifen">Reifenwechsel</SelectItem>
                        <SelectItem value="ölwechsel">Ölwechsel</SelectItem>
                        <SelectItem value="versicherung">Versicherung</SelectItem>
                        <SelectItem value="steuer">Steuer</SelectItem>
                        <SelectItem value="hu">HU/AU (TÜV)</SelectItem>
                        <SelectItem value="tuning">Tuning</SelectItem>
                        <SelectItem value="zubehör">Zubehör</SelectItem>
                        <SelectItem value="kauf">Kaufpreis</SelectItem>
                        <SelectItem value="pflege">Wagenpflege</SelectItem>
                        <SelectItem value="leasing">Leasingrate</SelectItem>
                        <SelectItem value="zulassung">Zulassung/Ummeldung</SelectItem>
                        <SelectItem value="finanzierung">Finanzierungsrate</SelectItem>
                        <SelectItem value="erstattung">Erstattung</SelectItem>
                        <SelectItem value="bußgeld">Bußgeld</SelectItem>
                        <SelectItem value="parkgebühr">Parkgebühr</SelectItem>
                        <SelectItem value="maut">Maut</SelectItem>
                        <SelectItem value="ersatzteile">Ersatzteile</SelectItem>
                        <SelectItem value="sonstiges">Sonstiges</SelectItem>
                      </Select>
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
                      <Select>
                        <SelectItem value="keine">Keine</SelectItem>
                        <SelectItem value="1m">Monatlich</SelectItem>
                        <SelectItem value="3m">Alle 3 Monate</SelectItem>
                        <SelectItem value="6m">Alle 6 Monate</SelectItem>
                        <SelectItem value="12m">Jährlich</SelectItem>
                        <SelectItem value="24m">Alle 2 Jahre</SelectItem>
                      </Select>
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
            )}

            {!showForm && (
              <p className="text-muted text-sm text-center">Noch keine Ausgaben erfasst.</p>
            )}
          </div>
        </TabsContent>

        {/* TAB: Erinnerungen */}
        <TabsContent value="erinnerungen">
          <div className="mt-4">
            <p className="text-muted">Erinnerungen folgen in Kürze...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}