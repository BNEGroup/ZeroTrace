// src/lib/useZerotraceData.js
import { useEffect, useState } from "react";
import localforage from "localforage";

const initialData = {
  vehicles: {},
  activeVin: "WBA8H71020K659220"
};

export default function useZerotraceData() {
  const [entries, setEntries] = useState([]);
  const [ausgaben, setAusgaben] = useState([]);
  const [erinnerungen, setErinnerungen] = useState([]);
  const [letzterStand, setLetzterStand] = useState(0);

  const [tachostand, setTachostand] = useState(0);
  const [distanz, setDistanz] = useState(0);
  const [menge, setMenge] = useState(0);
  const [preisProLiter, setPreisProLiter] = useState(0);
  const [gesamtbetrag, setGesamtbetrag] = useState(0);
  const [sorte, setSorte] = useState("HVO100");
  const [voll, setVoll] = useState(true);
  const [verbrauch, setVerbrauch] = useState(null);
  const [waehrung, setWaehrung] = useState("EUR");
  const [reifen, setReifen] = useState("");
  const [tankstelle, setTankstelle] = useState("");
  const [streckenprofil, setStreckenprofil] = useState([]);
  const [optionen, setOptionen] = useState({ standheizung: false, anhaenger: false, klima: false });

  const waehrungen = ["EUR", "HUF", "USD"];
  const kraftstoffArten = [
    "BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel",
    "Pflanzenöl", "Super 95", "Super E10", "Super 98", "Super Plus 103",
    "LPG", "LNG", "Wasserstoff"
  ];
  const reifenarten = ["Sommerreifen", "Winterreifen", "Ganzjahresreifen"];

  const vin = initialData.activeVin;

  useEffect(() => {
    const ladeDaten = async () => {
      const stored = (await localforage.getItem("zerotrace")) || initialData;
      if (!stored.vehicles[vin]) {
        stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
      }
      const fahrzeug = stored.vehicles[vin];
      const sortierte = [...fahrzeug.betankungen].sort((a, b) => b.datum.localeCompare(a.datum));
      setEntries(sortierte);
      setAusgaben([...fahrzeug.ausgaben].reverse());
      setErinnerungen([...fahrzeug.erinnerungen].reverse());

      const letzte = fahrzeug.betankungen.at(-1);
      if (letzte) {
        setLetzterStand(letzte.km);
        setTachostand(letzte.km);
        setSorte(letzte.sorte);
      }
    };

    ladeDaten();
  }, []);

  useEffect(() => {
    const dist = tachostand - letzterStand;
    setDistanz(dist);
    if (dist > 0 && menge > 0) {
      setVerbrauch(((menge / dist) * 100).toFixed(2));
    }
  }, [tachostand]);

  useEffect(() => {
    if (distanz > 0 && menge > 0) {
      setVerbrauch(((menge / distanz) * 100).toFixed(2));
    }
  }, [distanz, menge]);

  useEffect(() => {
    if (menge && preisProLiter) setGesamtbetrag((menge * preisProLiter).toFixed(2));
    else if (menge && gesamtbetrag) setPreisProLiter((gesamtbetrag / menge).toFixed(3));
    else if (preisProLiter && gesamtbetrag) setMenge((gesamtbetrag / preisProLiter).toFixed(2));
  }, [menge, preisProLiter, gesamtbetrag]);

  const speichernBetankung = async (eintrag) => {
    const stored = (await localforage.getItem("zerotrace")) || initialData;
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    stored.vehicles[vin].betankungen.unshift(eintrag);
    await localforage.setItem("zerotrace", stored);
    const updated = [eintrag, ...entries].sort((a, b) => b.datum.localeCompare(a.datum));
    setEntries(updated);
  };

  const speichernAusgabe = async (eintrag) => {
    const stored = (await localforage.getItem("zerotrace")) || initialData;
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    stored.vehicles[vin].ausgaben.unshift(eintrag);
    await localforage.setItem("zerotrace", stored);
    setAusgaben([eintrag, ...ausgaben]);
  };

  const speichernErinnerung = async (eintrag) => {
    const stored = (await localforage.getItem("zerotrace")) || initialData;
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    stored.vehicles[vin].erinnerungen.unshift(eintrag);
    await localforage.setItem("zerotrace", stored);
    setErinnerungen([eintrag, ...erinnerungen]);
  };

  return {
    entries,
    ausgaben,
    erinnerungen,
    letzterStand,
    tachostand,
    setTachostand,
    distanz,
    setDistanz,
    menge,
    setMenge,
    preisProLiter,
    setPreisProLiter,
    gesamtbetrag,
    setGesamtbetrag,
    sorte,
    setSorte,
    voll,
    setVoll,
    verbrauch,
    waehrung,
    setWaehrung,
    reifen,
    setReifen,
    tankstelle,
    setTankstelle,
    streckenprofil,
    setStreckenprofil,
    optionen,
    setOptionen,
    waehrungen,
    kraftstoffArten,
    reifenarten,
    vin,
    setEntries,
    setAusgaben,
    setErinnerungen,
    speichernBetankung,
    speichernAusgabe,
    speichernErinnerung
  };
}