import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Car } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Bordcomputer() {
  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Bordcomputer</h1>

      <Tabs defaultValue="trip1" className="w-full">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="trip1"><Car className="inline-block mr-2" />Trip 1</TabsTrigger>
          <TabsTrigger value="trip2"><Car className="inline-block mr-2" />Trip 2</TabsTrigger>
          <TabsTrigger value="total"><Car className="inline-block mr-2" />Gesamt</TabsTrigger>
        </TabsList>

        <TabsContent value="trip1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Geblockte Strecke</h2><p>12,3 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Gesamtstrecke</h2><p>57,9 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Ø Geschwindigkeit</h2><p>63,4 km/h</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Fahrzeit</h2><p>00:52 h</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Ø Verbrauch</h2><p>8,4 l/100 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Restreichweite</h2><p>234 km</p></CardContent></Card>
          </div>
          <div className="mt-4 text-right">
            <Button variant="destructive">Trip 1 zurücksetzen</Button>
          </div>
        </TabsContent>

        <TabsContent value="trip2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Geblockte Strecke</h2><p>7,1 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Gesamtstrecke</h2><p>29,4 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Ø Geschwindigkeit</h2><p>58,2 km/h</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Fahrzeit</h2><p>00:32 h</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Ø Verbrauch</h2><p>7,8 l/100 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Restreichweite</h2><p>289 km</p></CardContent></Card>
          </div>
          <div className="mt-4 text-right">
            <Button variant="destructive">Trip 2 zurücksetzen</Button>
          </div>
        </TabsContent>

        <TabsContent value="total">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Geblockte Kilometer gesamt</h2><p>134,2 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Ungeblockte Kilometer gesamt</h2><p>482,6 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Gesamtkilometer</h2><p>616,8 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Ø Verbrauch gesamt</h2><p>8,2 l/100 km</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Ø Geschwindigkeit gesamt</h2><p>61,3 km/h</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Fahrtzeit gesamt</h2><p>06:38 h</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="text-lg font-semibold">Initialer Kilometerstand (CAN + VIN)</h2><p>112.384 km</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
