// src/components/kosten/AusgabeEintrag.jsx

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectContent, SelectItem
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { kostenarten, waehrungen } from "@/lib/utils";
import localforage from "localforage";

export default function AusgabeEintrag({ eintrag, index, ausgaben, setAusgaben }) {
  const [bearbeiten, setBearbeiten] = useState(false);
  const [formular, setFormular] = useState({
    kostenart: eintrag.kostenart,
    betrag: eintrag.betrag,
    waehrung: eintrag.waehrung || "EUR",
    bemerkung: eintrag.bemerkung || "",
    tachostand: eintrag.tachostand,
  });

  const handleUpdate = async () => {
    const updated = [...ausgaben];
    updated[index] = { ...eintrag, ...formular };
    const stored = (await localforage.getItem("zerotrace")) || { vehicles: {}, activeVin: "WBA8H71020K659220" };
    if (!stored.vehicles[stored.activeVin]) return;
    stored.vehicles[stored.activeVin].ausgaben = [...updated].slice().reverse();
    await localforage.setItem("zerotrace", stored);
    setAusgaben(updated);
    setBearbeiten(false);
  };

  const handleDelete = async () => {
    const updated = ausgaben.filter((_, i) => i !== index);
    const stored = (await localforage.getItem("zerotrace")) || { vehicles: {}, activeVin: "WBA8H71020K659220" };
    if (!stored.vehicles[stored.activeVin]) return;
    stored.vehicles[stored.activeVin].ausgaben = [...updated].slice().reverse();
    await localforage.setItem("zerotrace", stored);
    setAusgaben(updated);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="font-semibold">
              {eintrag.datum} – {eintrag.tachostand} km – {eintrag.kostenart}
            </p>
            <p className="text-sm">
              {eintrag.betrag} {eintrag.waehrung || "EUR"}<br />
              {eintrag.bemerkung}
            </p>
            {eintrag.synced === false && (
              <p className="text-xs text-yellow-500">nicht synchronisiert</p>
            )}
          </div>
          <div className="flex gap-2">
            <Dialog open={bearbeiten} onOpenChange={setBearbeiten}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon"><Pencil size={16} /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Ausgabe bearbeiten</DialogTitle></DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <Label>Kostenart</Label>
                    <Select defaultValue={formular.kostenart} onValueChange={(v) => setFormular(f => ({ ...f, kostenart: v }))}>
                      <SelectTrigger>{formular.kostenart}</SelectTrigger>
                      <SelectContent>
                        {kostenarten.map(k => (
                          <SelectItem key={k} value={k}>{k}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Betrag</Label>
                    <Input type="number" value={formular.betrag} onChange={(e) => setFormular(f => ({ ...f, betrag: e.target.value }))} />
                  </div>
                  <div className="grid gap-1">
                    <Label>Währung</Label>
                    <Select defaultValue={formular.waehrung} onValueChange={(v) => setFormular(f => ({ ...f, waehrung: v }))}>
                      <SelectTrigger>{formular.waehrung}</SelectTrigger>
                      <SelectContent>
                        {waehrungen.map(w => (
                          <SelectItem key={w} value={w}>{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Bemerkung</Label>
                    <Textarea value={formular.bemerkung} onChange={(e) => setFormular(f => ({ ...f, bemerkung: e.target.value }))} />
                  </div>
                </div>
                <div className="text-right pt-2">
                  <Button onClick={handleUpdate}>Speichern</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={handleDelete}><Trash2 size={16} /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}