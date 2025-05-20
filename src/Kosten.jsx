// src/Kosten.jsx
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import BetankungForm from "@/components/kosten/BetankungForm";
import BetankungEintrag from "@/components/kosten/BetankungEintrag";
import AusgabeForm from "@/components/kosten/AusgabeForm";
import AusgabeEintrag from "@/components/kosten/AusgabeEintrag";
import ErinnerungForm from "@/components/kosten/ErinnerungForm";
import ErinnerungEintrag from "@/components/kosten/ErinnerungEintrag";
import useZerotraceData from "@/lib/useZerotraceData";

const kraftstoffArten = ["BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel", "Pflanzenöl", "Super 95", "Super E10", "Super 98", "Super Plus 103", "LPG", "LNG", "Wasserstoff"];
const reifenarten = ["Sommerreifen", "Winterreifen", "Ganzjahresreifen"];
const waehrungen = ["EUR", "HUF", "USD"];

export default function Kosten() {
  const [activeTab, setActiveTab] = useState("betankungen");
  const [showForm, setShowForm] = useState(false);

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

  const {
    entries,
    ausgaben,
    erinnerungen,
    speichernBetankung,
    speichernAusgabe,
    speichernErinnerung,
    tachostand,
    setTachostand,
    letzterStand,
    setLetzterStand,
    setEntries,
    setAusgaben,
    setErinnerungen,
  } = useZerotraceData();

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
            <BetankungForm
              speichern={speichernBetankung}
              tachostand={tachostand}
              letzterStand={letzterStand}
              setTachostand={setTachostand}
              setLetzterStand={setLetzterStand}
              setShowForm={setShowForm}
              distanz={distanz}
              setDistanz={setDistanz}
              menge={menge}
              setMenge={setMenge}
              preisProLiter={preisProLiter}
              setPreisProLiter={setPreisProLiter}
              gesamtbetrag={gesamtbetrag}
              setGesamtbetrag={setGesamtbetrag}
              verbrauch={verbrauch}
              streckenprofil={streckenprofil}
              setStreckenprofil={setStreckenprofil}
              optionen={optionen}
              setOptionen={setOptionen}
              reifen={reifen}
              setReifen={setReifen}
              tankstelle={tankstelle}
              setTankstelle={setTankstelle}
              waehrung={waehrung}
              setWaehrung={setWaehrung}
              kraftstoffArten={kraftstoffArten}
              waehrungen={waehrungen}
              reifenarten={reifenarten}
              vin={"WBA8H71020K659220"}
              entries={entries}
              setEntries={setEntries}
            />
          )}
          {entries.map((e, i) => (
            <BetankungEintrag key={i} eintrag={e} />
          ))}
        </TabsContent>

        <TabsContent value="ausgaben">
          {showForm && activeTab === "ausgaben" && (
            <AusgabeForm
              speichern={speichernAusgabe}
              tachostand={tachostand}
              setTachostand={setTachostand}
              setShowForm={setShowForm}
            />
          )}
          {ausgaben.map((e, i) => (
            <AusgabeEintrag key={i} eintrag={e} />
          ))}
        </TabsContent>

        <TabsContent value="erinnerungen">
          {showForm && activeTab === "erinnerungen" && (
            <ErinnerungForm speichern={speichernErinnerung} setShowForm={setShowForm} />
          )}
          {erinnerungen.map((e, i) => (
            <ErinnerungEintrag key={i} eintrag={e} isOverdue={isOverdue(e.faellig)} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}