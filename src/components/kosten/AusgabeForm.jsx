import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { kostenarten, waehrungen } from "@/lib/utils";

export default function AusgabeForm({
  tachostand,
  setTachostand,
  kostenart,
  setKostenart,
  kosten,
  setKosten,
  ausgabenWaehrung,
  setAusgabenWaehrung,
  bemerkung,
  setBemerkung,
  speichernAusgabe,
}) {
  return (
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
  );
}