// src/components/kosten/ErinnerungForm.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const wiederholungen = ["Keine", "Jährlich", "Alle 2 Jahre", "Alle 3 Jahre", "Alle 6 Monate"];

export default function ErinnerungForm({ speichern, setShowForm }) {
  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [faellig, setFaellig] = useState("");
  const [wiederholung, setWiederholung] = useState("Keine");
  const [tachostand, setTachostand] = useState("");

  const speichernErinnerung = () => {
    const neuerEintrag = {
      titel,
      beschreibung,
      faellig,
      wiederholung,
      tachostand,
      synced: false,
    };
    speichern(neuerEintrag);
    setShowForm(false);
  };

  return (
    <div className="mb-6">
      <div className="p-4 space-y-4 border rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Titel</Label>
            <Input value={titel} onChange={(e) => setTitel(e.target.value)} />
          </div>
          <div>
            <Label>Fällig am</Label>
            <Input type="date" value={faellig} onChange={(e) => setFaellig(e.target.value)} />
          </div>
          <div>
            <Label>Tachostand (optional)</Label>
            <Input type="number" value={tachostand} onChange={(e) => setTachostand(e.target.value)} />
          </div>
          <div>
            <Label>Wiederholung</Label>
            <Select onValueChange={setWiederholung} defaultValue={wiederholung}>
              <SelectTrigger>{wiederholung}</SelectTrigger>
              <SelectContent>
                {wiederholungen.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Beschreibung</Label>
          <Textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} />
        </div>
        <div className="text-right">
          <Button onClick={speichernErinnerung}>Sichern</Button>
        </div>
      </div>
    </div>
  );
}