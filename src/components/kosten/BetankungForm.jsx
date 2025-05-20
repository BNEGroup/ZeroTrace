import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const kraftstoffArten = ["BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel", "Pflanzenöl", "Super 95", "Super E10", "Super 98", "Super Plus 103", "LPG", "LNG", "Wasserstoff"];
const reifenarten = ["Sommerreifen", "Winterreifen", "Ganzjahresreifen"];
const waehrungen = ["EUR", "HUF", "USD"];

export default function BetankungForm({
  speichern,
  tachostand,
  letzterStand,
  setTachostand,
  setLetzterStand,
  setShowForm,
}) {
  const [distanz, setDistanz] = useState(0);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);
  const [sorte, setSorte] = useState("HVO100");
  const [voll, setVoll] = useState(true);
  const [verbrauch, setVerbrauch] = useState(null);
  const [streckenprofil, setStreckenprofil] = useState([]);
  const [optionen, setOptionen] = useState({ standheizung: false, anhaenger: false, klima: false });
  const [reifen, setReifen] = useState("");
  const [tankstelle, setTankstelle] = useState("");
  const [waehrung, setWaehrung] = useState("EUR");

  useEffect(() => {
    const dist = tachostand - letzterStand;
    setDistanz(dist);
    if (dist > 0 && menge > 0) setVerbrauch(((menge / dist) * 100).toFixed(2));
  }, [tachostand, menge, letzterStand]);

  useEffect(() => {
    if (menge && preisProLiter) setGesamtbetrag((menge * preisProLiter).toFixed(2));
    else if (menge && gesamtbetrag) setPreisProLiter((gesamtbetrag / menge).toFixed(3));
    else if (preisProLiter && gesamtbetrag) setMenge((gesamtbetrag / preisProLiter).toFixed(2));
  }, [menge, preisProLiter, gesamtbetrag]);

  const toggleProfil = (wert) => {
    setStreckenprofil((prev) =>
      prev.includes(wert) ? prev.filter((v) => v !== wert) : [...prev, wert]
    );
  };

  const handleSave = () => {
    speichern({
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
      waehrung,
      reifen,
      tankstelle,
      synced: false,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Tachostand</Label>
          <Input type="number" value={tachostand} onChange={(e) => setTachostand(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Distanz</Label>
          <Input type="number" value={distanz} readOnly />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Menge (l)</Label>
          <Input type="number" value={menge} onChange={(e) => setMenge(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Preis pro Liter</Label>
          <Input type="number" value={preisProLiter} onChange={(e) => setPreisProLiter(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Gesamtbetrag</Label>
          <Input type="number" value={gesamtbetrag} onChange={(e) => setGesamtbetrag(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Währung</Label>
          <Select onValueChange={setWaehrung} defaultValue={waehrung}>
            <SelectTrigger>{waehrung}</SelectTrigger>
            <SelectContent>{waehrungen.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Kraftstoff</Label>
          <Select onValueChange={setSorte} defaultValue={sorte}>
            <SelectTrigger>{sorte}</SelectTrigger>
            <SelectContent>{kraftstoffArten.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Label>Vollbetankung</Label>
          <Switch checked={voll} onCheckedChange={setVoll} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Verbrauch</Label>
          <Input disabled value={verbrauch ? `${verbrauch} l/100km` : "?"} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
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

      <div className="flex flex-col gap-1">
        <Label>Reifentyp</Label>
        <Select onValueChange={setReifen} defaultValue={reifen}>
          <SelectTrigger className="w-full">{reifen || "Reifentyp wählen"}</SelectTrigger>
          <SelectContent>
            {reifenarten.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-right pt-2">
        <Button onClick={handleSave}>Sichern</Button>
      </div>
    </div>
  );
}