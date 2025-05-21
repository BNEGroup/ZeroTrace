// src/components/kosten/BetankungEintrag.jsx

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { kraftstoffArten, waehrungen, reifenarten } from "@/lib/utils";
import localforage from "localforage";

export default function BetankungEintrag({ eintrag, index, entries, setEntries }) {
  const [bearbeiten, setBearbeiten] = useState(false);
  const [formular, setFormular] = useState({
    km: eintrag.km,
    menge: eintrag.menge,
    preis_l: eintrag.preis_l,
    gesamt: eintrag.gesamt,
    sorte: eintrag.sorte,
    waehrung: eintrag.waehrung || "EUR",
    tankstelle: eintrag.tankstelle || "",
    reifen: eintrag.reifen || "",
  });

  const handleUpdate = async () => {
    const updated = [...entries];
    updated[index] = { ...eintrag, ...formular };
    const stored = (await localforage.getItem("zerotrace")) || {
      vehicles: {},
      activeVin: "WBA8H71020K659220",
    };
    if (!stored.vehicles[stored.activeVin]) return;
    stored.vehicles[stored.activeVin].betankungen = [...updated].slice().reverse();
    await localforage.setItem("zerotrace", stored);
    setEntries(updated);
    setBearbeiten(false);
  };

  const handleDelete = async () => {
    const updated = entries.filter((_, i) => i !== index);
    const stored = (await localforage.getItem("zerotrace")) || {
      vehicles: {},
      activeVin: "WBA8H71020K659220",
    };
    if (!stored.vehicles[stored.activeVin]) return;
    stored.vehicles[stored.activeVin].betankungen = [...updated].slice().reverse();
    await localforage.setItem("zerotrace", stored);
    setEntries(updated);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="font-semibold">
              {eintrag.datum} – {eintrag.km} km – {eintrag.sorte}
            </p>
            <p className="text-sm">
              {eintrag.menge} l • {eintrag.gesamt} {eintrag.waehrung || "EUR"} • Verbrauch: {eintrag.verbrauch ?? "?"} l/100km
            </p>
            {eintrag.tankstelle && (
              <p className="text-sm text-muted-foreground">Tankstelle: {eintrag.tankstelle}</p>
            )}
            {eintrag.reifen && (
              <p className="text-sm text-muted-foreground">Reifen: {eintrag.reifen}</p>
            )}
            {eintrag.synced === false && (
              <p className="text-xs text-yellow-500">nicht synchronisiert</p>
            )}
          </div>
          <div className="flex gap-2">
            <Dialog open={bearbeiten} onOpenChange={setBearbeiten}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Betankung bearbeiten</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <Label>Tachostand</Label>
                    <Input
                      type="number"
                      value={formular.km}
                      onChange={(e) => setFormular((f) => ({ ...f, km: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Menge (l)</Label>
                    <Input
                      type="number"
                      value={formular.menge}
                      onChange={(e) => setFormular((f) => ({ ...f, menge: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Gesamtbetrag</Label>
                    <Input
                      type="number"
                      value={formular.gesamt}
                      onChange={(e) => setFormular((f) => ({ ...f, gesamt: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Kraftstoff</Label>
                    <Select
                      defaultValue={formular.sorte}
                      onValueChange={(v) => setFormular((f) => ({ ...f, sorte: v }))}
                    >
                      <SelectTrigger>{formular.sorte}</SelectTrigger>
                      <SelectContent>
                        {kraftstoffArten.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Währung</Label>
                    <Select
                      defaultValue={formular.waehrung}
                      onValueChange={(v) => setFormular((f) => ({ ...f, waehrung: v }))}
                    >
                      <SelectTrigger>{formular.waehrung}</SelectTrigger>
                      <SelectContent>
                        {waehrungen.map((w) => (
                          <SelectItem key={w} value={w}>
                            {w}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1">
                    <Label>Tankstelle</Label>
                    <Input
                      value={formular.tankstelle}
                      onChange={(e) => setFormular((f) => ({ ...f, tankstelle: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Reifen</Label>
                    <Select
                      defaultValue={formular.reifen}
                      onValueChange={(v) => setFormular((f) => ({ ...f, reifen: v }))}
                    >
                      <SelectTrigger>{formular.reifen || "Reifentyp wählen"}</SelectTrigger>
                      <SelectContent>
                        {reifenarten.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-right pt-2">
                  <Button onClick={handleUpdate}>Speichern</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}