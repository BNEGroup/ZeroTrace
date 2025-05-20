import { useState } from "react";
import {
  Input,
  Button,
  Label,
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  Switch,
  Textarea,
  Checkbox,
} from "@/components/ui";
import localforage from "localforage";

export default function BetankungForm({
  tachostand,
  setTachostand,
  letzterStand,
  entries,
  setEntries,
  setShowForm,
  kraftstoffArten,
  waehrungen,
  reifenarten,
  vin,
}) {
  const [distanz, setDistanz] = useState(0);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);
  const [sorte, setSorte] = useState("HVO100");
  const [voll, setVoll] = useState(true);
  const [verbrauch, setVerbrauch] = useState(null);
  const [waehrung, setWaehrung] = useState("EUR");
  const [reifen, setReifen] = useState("");
  const [tankstelle, setTankstelle] = useState("");
  const [streckenprofil, setStreckenprofil] = useState([]);
  const [optionen, setOptionen] = useState({
    standheizung: false,
    anhaenger: false,
    klima: false,
  });

  const toggleProfil = (wert) => {
    setStreckenprofil((prev) =>
      prev.includes(wert) ? prev.filter((v) => v !== wert) : [...prev, wert]
    );
  };

  const speichernBetankung = async () => {
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
      waehrung,
      reifen,
      tankstelle,
      synced: false,
    };

    const stored = (await localforage.getItem("zerotrace")) || {
      vehicles: {},
      activeVin: vin,
    };

    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = {
        betankungen: [],
        ausgaben: [],
        erinnerungen: [],
      };
    }

    stored.vehicles[vin].betankungen.unshift(neuerEintrag);
    await localforage.setItem("zerotrace", stored);

    setEntries([neuerEintrag, ...entries]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Alle Eingabefelder wie oben gezeigt hier einfügen */}
      {/* Button zum Sichern */}
      <div className="text-right pt-2">
        <Button onClick={speichernBetankung}>Sichern</Button>
      </div>
    </div>
  );
}