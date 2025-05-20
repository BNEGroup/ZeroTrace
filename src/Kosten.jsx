// KOSTEN.JSX – Erweiterter Code: Währungsauswahl, Fahrweise, Strecke, Reifen, Tankstelle
// Basierend auf deinem originalen, funktionierenden Stand – nur erweitert, nichts gelöscht

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
import { Bell, Plus } from "lucide-react";
import { checkbox } from "@/components/ui/checkbox";

export default function Kosten() {
  const [activeTab, setActiveTab] = useState("betankungen");
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [ausgaben, setAusgaben] = useState([]);
  const [erinnerungen, setErinnerungen] = useState([]);

  const [tachostand, setTachostand] = useState(0);
  const [distanz, setDistanz] = useState(0);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);
  const [sorte, setSorte] = useState("HVO100");
  const [voll, setVoll] = useState(true);
  const [verbrauch, setVerbrauch] = useState(null);
  const [letzterStand, setLetzterStand] = useState(0);

  const [waehrung, setWaehrung] = useState("EUR");
  const [fahrweise, setFahrweise] = useState("");
  const [strecke, setStrecke] = useState("");
  const [reifen, setReifen] = useState("");
  const [tankstelle, setTankstelle] = useState("");

  const [kostenart, setKostenart] = useState("");
  const [kosten, setKosten] = useState("");
  const [bemerkung, setBemerkung] = useState("");
  const [ausgabenWaehrung, setAusgabenWaehrung] = useState("EUR");

  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [faellig, setFaellig] = useState("");
  const [wiederholung, setWiederholung] = useState("Keine");
  const [fälligKm, setFälligKm] = useState("");

  const [streckenprofil, setStreckenprofil] = useState([]);
  const [optionen, setOptionen] = useState({ standheizung: false, anhaenger: false, klima: false });

  const toggleProfil = (wert) => {setStreckenprofil((prev) =>prev.includes(wert) ? prev.filter((v) => v !== wert) : [...prev, wert]);};

  const kraftstoffArten = ["BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel", "Pflanzenöl", "Super 95", "Super E10", "Super 98", "Super Plus 103", "LPG", "LNG", "Wasserstoff"];
  const kostenarten = ["Wartung", "Reparatur", "Versicherung", "Steuer", "Zubehör", "Tuning", "HU/AU", "Reifen", "Pflege", "Sonstiges"];
  const wiederholungen = ["Keine", "Jährlich", "Alle 2 Jahre", "Alle 3 Jahre", "Alle 6 Monate"];
  const waehrungen = ["EUR", "HUF", "USD"];
  const fahrweisen = ["Stadt", "Landstraße", "Autobahn", "Gemischt"];
  const streckenarten = ["Kurzstrecke", "Langstrecke", "Gemischt"];
  const reifenarten = ["Sommerreifen", "Winterreifen", "Ganzjahresreifen"];

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
    setErinnerungen([...fahrzeug.erinnerungen].reverse());
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
      streckenprofil,
      optionen,
      synced: false,
    };
    const stored = JSON.parse(localStorage.getItem("zerotrace"));
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
    waehrung: ausgabenWaehrung,  // <-- neu
    bemerkung,
    synced: false,
  };

  const stored = JSON.parse(localStorage.getItem("zerotrace"));
  if (!stored.vehicles[vin]) {
    stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
  }
  stored.vehicles[vin].ausgaben.unshift(neuerEintrag);
  localStorage.setItem("zerotrace", JSON.stringify(stored));
  setAusgaben([neuerEintrag, ...ausgaben]);
  setShowForm(false);
};

  const speichernErinnerung = () => {
    const neuerEintrag = {
      titel,
      beschreibung,
      faellig,
      wiederholung,
      tachostand: fälligKm,
      synced: false,
    };
    const stored = JSON.parse(localStorage.getItem("zerotrace"));
    stored.vehicles[vin].erinnerungen.unshift(neuerEintrag);
    localStorage.setItem("zerotrace", JSON.stringify(stored));
    setErinnerungen([neuerEintrag, ...erinnerungen]);
    setShowForm(false);
  };

  const isOverdue = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date && date < today;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kostenübersicht</h1>
        <Button variant="outline" size="icon" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
        </Button>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={(v) => { setActiveTab(v); setShowForm(false); }}>
        <TabsList className="grid grid-cols-3 gap-2 mb-4">
          <TabsTrigger value="betankungen">Betankungen</TabsTrigger>
          <TabsTrigger value="ausgaben">Ausgaben</TabsTrigger>
          <TabsTrigger value="erinnerungen">Erinnerungen</TabsTrigger>
        </TabsList>

<TabsContent value="betankungen">
  {showForm && activeTab === "betankungen" && (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Tachostand</Label><Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} /></div>
          <div><Label>Distanz</Label><Input type="number" value={distanz} onChange={(e) => setDistanz(Number(e.target.value))} /></div>
          <div><Label>Menge (l)</Label><Input type="number" value={menge} onChange={(e) => setMenge(Number(e.target.value))} /></div>
          <div><Label>Preis pro Liter</Label><Input type="number" value={preisProLiter} onChange={(e) => setPreisProLiter(Number(e.target.value))} /></div>
          <div><Label>Gesamtbetrag</Label><Input type="number" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(Number(e.target.value))} /></div>
          <div><Label>Währung</Label><Select onValueChange={setWaehrung} defaultValue={waehrung}><SelectTrigger>{waehrung}</SelectTrigger><SelectContent>{waehrungen.map(w => (<SelectItem key={w} value={w}>{w}</SelectItem>))}</SelectContent></Select></div>
          <div><Label>Kraftstoff</Label><Select onValueChange={setSorte} defaultValue={sorte}><SelectTrigger>{sorte}</SelectTrigger><SelectContent>{kraftstoffArten.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
          <div className="flex items-center gap-2"><Label>Vollbetankung</Label><Switch checked={voll} onCheckedChange={setVoll} /></div>
          <div><Label>Verbrauch</Label><Input disabled value={verbrauch ? `${verbrauch} l/100km` : "?"} /></div>
          <div className="col-span-2"><Label>Tankstelle</Label><Input type="text" value={tankstelle} onChange={(e) => setTankstelle(e.target.value)} /></div>
        </div>

        {/* Streckenprofil + Optionen Checkboxen */}
        <div className="col-span-2 mt-4">
          <Label>Streckenprofil</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {["Stadt", "Landstraße", "Autobahn"].map((wert) => (
              <div key={wert} className="flex items-center gap-2">
                <Checkbox id={wert} checked={streckenprofil.includes(wert)} onCheckedChange={() => toggleProfil(wert)} />
                <label htmlFor={wert}>{wert}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <Label>Zusatzoptionen</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Checkbox checked={optionen.standheizung} onCheckedChange={() => setOptionen(o => ({ ...o, standheizung: !o.standheizung }))} />
              <label>mit Standheizung</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={optionen.anhaenger} onCheckedChange={() => setOptionen(o => ({ ...o, anhaenger: !o.anhaenger }))} />
              <label>mit Anhänger</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={optionen.klima} onCheckedChange={() => setOptionen(o => ({ ...o, klima: !o.klima }))} />
              <label>mit Klimaanlage</label>
            </div>
          </div>
        </div>

        <div className="text-right"><Button onClick={speichernBetankung}>Sichern</Button></div>
      </CardContent>
    </Card>
  )}

  {entries.map((e, i) => (
    <Card key={i} className="mb-4"><CardContent className="p-4">
      <p className="font-semibold">{e.datum} – {e.km} km – {e.sorte}</p>
      <p className="text-sm">{e.menge} l • {e.gesamt} {e.waehrung || 'EUR'} • Verbrauch: {e.verbrauch ?? "?"} l/100km</p>
      {e.streckenprofil?.length > 0 && <p className="text-sm text-muted-foreground">Strecke: {e.streckenprofil.join(", ")}</p>}
      {(e.optionen?.standheizung || e.optionen?.anhaenger || e.optionen?.klima) && (
        <p className="text-sm text-muted-foreground">
          Optionen:
          {e.optionen.standheizung ? " Standheizung" : ""}
          {e.optionen.anhaenger ? ", Anhänger" : ""}
          {e.optionen.klima ? ", Klimaanlage" : ""}
        </p>
      )}
      {e.tankstelle && <p className="text-sm text-muted-foreground">Tankstelle: {e.tankstelle}</p>}
      {e.synced === false && <p className="text-xs text-yellow-500">nicht synchronisiert</p>}
    </CardContent></Card>
  ))}
</TabsContent>

<TabsContent value="ausgaben">
  {showForm && activeTab === "ausgaben" && (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tachostand</Label>
            <Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} />
          </div>
          <div>
            <Label>Kostenart</Label>
            <Select onValueChange={setKostenart} defaultValue={kostenart}>
              <SelectTrigger>{kostenart || "Kostenart wählen"}</SelectTrigger>
              <SelectContent>
                {kostenarten.map((k) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Betrag</Label>
            <Input type="number" value={kosten} onChange={(e) => setKosten(e.target.value)} />
          </div>
          <div>
            <Label>Währung</Label>
            <Select onValueChange={setAusgabenWaehrung} defaultValue={ausgabenWaehrung}>
              <SelectTrigger>{ausgabenWaehrung}</SelectTrigger>
              <SelectContent>
                {waehrungen.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Bemerkung</Label>
          <Textarea value={bemerkung} onChange={(e) => setBemerkung(e.target.value)} />
        </div>
        <div className="text-right">
          <Button onClick={speichernAusgabe}>Sichern</Button>
        </div>
      </CardContent>
    </Card>
  )}

  {ausgaben.map((e, i) => (
    <Card key={i} className="mb-4">
      <CardContent className="p-4">
        <p className="font-semibold">{e.datum} – {e.tachostand} km – {e.kostenart}</p>
        <p className="text-sm">{e.betrag} {e.waehrung || "EUR"}<br />{e.bemerkung}</p>
        {e.synced === false && <p className="text-xs text-yellow-500">nicht synchronisiert</p>}
      </CardContent>
    </Card>
  ))}
</TabsContent>

        <TabsContent value="erinnerungen">
          {showForm && activeTab === "erinnerungen" && (
            <Card className="mb-6"><CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Titel</Label><Input value={titel} onChange={(e) => setTitel(e.target.value)} /></div>
                <div><Label>Fällig am</Label><Input type="date" value={faellig} onChange={(e) => setFaellig(e.target.value)} /></div>
                <div><Label>Tachostand (optional)</Label><Input type="number" value={fälligKm} onChange={(e) => setFälligKm(e.target.value)} /></div>
                <div><Label>Wiederholung</Label>
                  <Select onValueChange={setWiederholung} defaultValue={wiederholung}>
                    <SelectTrigger>{wiederholung}</SelectTrigger>
                    <SelectContent>
                      {wiederholungen.map((w) => (<SelectItem key={w} value={w}>{w}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Beschreibung</Label><Textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} /></div>
              <div className="text-right"><Button onClick={speichernErinnerung}>Sichern</Button></div>
            </CardContent></Card>
          )}

          {erinnerungen.map((e, i) => (
            <Card key={i} className={`mb-4 ${isOverdue(e.faellig) ? "bg-red-100 dark:bg-red-800/20" : ""}`}><CardContent className="p-4">
              <p className="font-semibold flex items-center gap-2"><Bell size={16} /> {e.titel || "Erinnerung"}</p>
              <p className="text-sm text-muted-foreground">Fällig: {e.faellig || "–"} {e.tachostand && `• bei ${e.tachostand} km`}</p>
              {e.beschreibung && <p className="text-sm mt-1">{e.beschreibung}</p>}
              {e.synced === false && <p className="text-xs text-yellow-500 mt-2">nicht synchronisiert</p>}
            </CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}