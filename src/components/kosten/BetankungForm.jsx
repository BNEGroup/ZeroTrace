// src/components/kosten/BetankungForm.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export default function BetankungForm({
  speichern,
  setShowForm,
  tachostand, setTachostand,
  distanz, setDistanz,
  menge, setMenge,
  preisProLiter, setPreisProLiter,
  gesamtbetrag, setGesamtbetrag,
  verbrauch,
  streckenprofil, setStreckenprofil,
  optionen, setOptionen,
  reifen, setReifen,
  tankstelle, setTankstelle,
  waehrung, setWaehrung,
  sorte, setSorte,
  voll, setVoll,
  kraftstoffArten, waehrungen, reifenarten
}) {
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);

  const toggleProfil = (wert) => {
    setStreckenprofil((prev) =>
      prev.includes(wert) ? prev.filter((v) => v !== wert) : [...prev, wert]
    );
  };

  const handleSpeichern = () => {
    speichern({
      datum,
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
      waehrung,
      reifen,
      tankstelle,
      synced: false
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Datum</Label>
          <Input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
        </div>
        <div>
          <Label>Tachostand</Label>
          <Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} />
        </div>
        <div>
          <Label>Distanz</Label>
          <Input type="number" value={distanz} onChange={(e) => setDistanz(Number(e.target.value))} />
        </div>
        <div>
          <Label>Menge (l)</Label>
          <Input type="number" value={menge} onChange={(e) => setMenge(Number(e.target.value))} />
        </div>
        <div>
          <Label>Preis pro Liter</Label>
          <Input type="number" value={preisProLiter} onChange={(e) => setPreisProLiter(Number(e.target.value))} />
        </div>
        <div>
          <Label>Gesamtbetrag</Label>
          <Input type="number" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(Number(e.target.value))} />
        </div>
        <div>
          <Label>Währung</Label>
          <Select onValueChange={setWaehrung} defaultValue={waehrung}>
            <SelectTrigger>{waehrung}</SelectTrigger>
            <SelectContent>
              {waehrungen.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Kraftstoff</Label>
          <Select onValueChange={setSorte} defaultValue={sorte}>
            <SelectTrigger>{sorte}</SelectTrigger>
            <SelectContent>
              {kraftstoffArten.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Label>Vollbetankung</Label>
          <Switch checked={voll} onCheckedChange={setVoll} />
        </div>
        <div>
          <Label>Verbrauch</Label>
          <Input disabled value={verbrauch ? `${verbrauch} l/100km` : "?"} />
        </div>
      </div>

      <div>
        <Label>Tankstelle</Label>
        <Input type="text" value={tankstelle} onChange={(e) => setTankstelle(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Label className="col-span-2">Streckenprofil</Label>
        {["Stadt", "Landstraße", "Autobahn"].map((wert) => (
          <div key={wert} className="flex items-center gap-2">
            <Checkbox id={wert} checked={streckenprofil.includes(wert)} onCheckedChange={() => toggleProfil(wert)} />
            <label htmlFor={wert}>{wert}</label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Label className="col-span-2">Zusatzoptionen</Label>
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

      <div>
        <Label>Reifentyp</Label>
        <Select onValueChange={setReifen} defaultValue={reifen}>
          <SelectTrigger>{reifen || "Reifentyp wählen"}</SelectTrigger>
          <SelectContent>
            {reifenarten.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="text-right pt-2">
        <Button onClick={handleSpeichern}>Sichern</Button>
      </div>
    </div>
  );
}