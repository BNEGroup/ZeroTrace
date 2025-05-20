import { Card, CardContent } from "@/components/ui/card";

export default function AusgabeEintrag({ eintrag }) {
  if (!eintrag) return null;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <p className="font-semibold">
          {eintrag.datum} – {eintrag.tachostand} km – {eintrag.kostenart}
        </p>
        <p className="text-sm">
          {eintrag.betrag} {eintrag.waehrung || "EUR"}
          <br />
          {eintrag.bemerkung}
        </p>
        {eintrag.synced === false && (
          <p className="text-xs text-yellow-500 mt-2">nicht synchronisiert</p>
        )}
      </CardContent>
    </Card>
  );
}