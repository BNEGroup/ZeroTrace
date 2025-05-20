import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { kostenarten, waehrungen } from "@/lib/utils";

export default function AusgabeForm({ speichern, tachostand, setTachostand, setShowForm }) {
  const [kostenart, setKostenart] = useState("");
  const [betrag, setBetrag] = useState("");
  const [bemerkung, setBemerkung] = useState("");
  const [waehrung, setWaehrung] = useState("EUR");

  const handleSpeichern = () => {
    if (!kostenart || !betrag) return;
    speichern({
      datum: new Date().toISOString().split("T")[0],
      tachostand,
      kostenart,
      betrag,
      waehrung,
      bemerkung,
      synced: false,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tachostand</Label>
          <Input
            type="number"
            value={tachostand}
            onChange={(e) => setTachostand(Number(e.target.value))}
          />
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
          <Input
            type="number"
            value={betrag}
            onChange={(e) => setBetrag(e.target.value)}
          />
        </div>
        <div>
          <Label>Währung</Label>
          <Select onValueChange={setWaehrung} defaultValue={waehrung}>
            <SelectTrigger>{waehrung}</SelectTrigger>
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
        <Button onClick={handleSpeichern}>Sichern</Button>
      </div>
    </div>
  );
}