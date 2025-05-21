import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function ErinnerungEintrag({ eintrag, isOverdue }) {
  return (
    <Card className={`mb-4 ${isOverdue ? "bg-red-100 dark:bg-red-800/20" : ""}`}>
      <CardContent className="p-4">
        <p className="font-semibold flex items-center gap-2">
          <Bell size={16} /> {eintrag.titel || "Erinnerung"}
        </p>
        <p className="text-sm text-muted-foreground">
          Fällig: {eintrag.faellig || "–"} {eintrag.tachostand && `• bei ${eintrag.tachostand} km`}
        </p>
        {eintrag.beschreibung && <p className="text-sm mt-1">{eintrag.beschreibung}</p>}
        {eintrag.synced === false && (
          <p className="text-xs text-yellow-500 mt-2">nicht synchronisiert</p>
        )}
      </CardContent>
    </Card>
  );
}