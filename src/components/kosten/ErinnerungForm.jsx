import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const erinnerungInitial = {
  titel: "",
  beschreibung: "",
  faellig: "",
  wiederholung: "Keine",
  tachostand: "",
};

const wiederholungen = [
  "Keine",
  "Jährlich",
  "Alle 2 Jahre",
  "Alle 3 Jahre",
  "Alle 6 Monate",
];

export default function ErinnerungForm({ onSave }) {
  const [form, setForm] = useState(erinnerungInitial);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (value) => {
    setForm({ ...form, wiederholung: value });
  };

  const speichern = () => {
    const neuerEintrag = {
      ...form,
      synced: false,
    };
    onSave(neuerEintrag);
    setForm(erinnerungInitial);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Titel</Label>
            <Input name="titel" value={form.titel} onChange={handleChange} />
          </div>
          <div>
            <Label>Fällig am</Label>
            <Input name="faellig" type="date" value={form.faellig} onChange={handleChange} />
          </div>
          <div>
            <Label>Tachostand (optional)</Label>
            <Input name="tachostand" type="number" value={form.tachostand} onChange={handleChange} />
          </div>
          <div>
            <Label>Wiederholung</Label>
            <Select onValueChange={handleSelect} defaultValue={form.wiederholung}>
              <SelectTrigger>{form.wiederholung}</SelectTrigger>
              <SelectContent>
                {wiederholungen.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Beschreibung</Label>
          <Textarea name="beschreibung" value={form.beschreibung} onChange={handleChange} />
        </div>
        <div className="text-right">
          <Button onClick={speichern}>Sichern</Button>
        </div>
      </CardContent>
    </Card>
  );
}