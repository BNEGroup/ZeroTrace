import { Card, CardContent } from "@/components/ui/card";

export default function BetankungEintrag({ eintrag }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <p className="font-semibold">
          {eintrag.datum} – {eintrag.km} km – {eintrag.sorte}
        </p>
        <p className="text-sm">
          {eintrag.menge} l • {eintrag.gesamt} {eintrag.waehrung || "EUR"} •
          Verbrauch: {eintrag.verbrauch ?? "?"} l/100km
        </p>

        {eintrag.streckenprofil?.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Strecke: {eintrag.streckenprofil.join(", ")}
          </p>
        )}

        {(eintrag.optionen?.standheizung ||
          eintrag.optionen?.anhaenger ||
          eintrag.optionen?.klima) && (
          <p className="text-sm text-muted-foreground">
            Optionen:
            {eintrag.optionen.standheizung ? " Standheizung" : ""}
            {eintrag.optionen.anhaenger ? ", Anhänger" : ""}
            {eintrag.optionen.klima ? ", Klimaanlage" : ""}
          </p>
        )}

        {eintrag.reifen && (
          <p className="text-sm text-muted-foreground">
            Reifen: {eintrag.reifen}
          </p>
        )}

        {eintrag.tankstelle && (
          <p className="text-sm text-muted-foreground">
            Tankstelle: {eintrag.tankstelle}
          </p>
        )}

        {eintrag.synced === false && (
          <p className="text-xs text-yellow-500 mt-2">nicht synchronisiert</p>
        )}
      </CardContent>
    </Card>
  );
}