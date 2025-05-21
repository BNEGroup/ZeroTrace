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
  const kraftstoffArten = ["BioDiesel", "Diesel", "GTL Diesel", "HVO100", "Premium Diesel", "Pflanzenöl", "Super 95", "Super E10", "Super 98", "Super Plus 103", "LPG", "LNG", "Wasserstoff"];
  const reifenarten = ["Sommerreifen", "Winterreifen", "Ganzjahresreifen"];

  const vin = initialData.activeVin;

  useEffect(() => {
    const ladeDaten = async () => {
      const stored = (await localforage.getItem("zerotrace")) || initialData;
      if (!stored.vehicles[vin]) {
        stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
      }
      const fahrzeug = stored.vehicles[vin];
      const sortiert = [...fahrzeug.betankungen].sort((a, b) => b.datum.localeCompare(a.datum));
      setEntries(sortiert);
      setAusgaben([...fahrzeug.ausgaben].sort((a, b) => b.datum.localeCompare(a.datum)));
      setErinnerungen([...fahrzeug.erinnerungen].sort((a, b) => b.datum.localeCompare(a.datum)));

      const letzte = sortiert.at(0);
      if (letzte) {
        setLetzterStand(letzte.km);
        setTachostand(letzte.km);
        setSorte(letzte.sorte);
      }
    };

    ladeDaten();
  }, []);

  const speichernBetankung = async (eintrag) => {
    const stored = (await localforage.getItem("zerotrace")) || initialData;
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    stored.vehicles[vin].betankungen.unshift(eintrag);
    await localforage.setItem("zerotrace", stored);
    const neueListe = [eintrag, ...entries].sort((a, b) => b.datum.localeCompare(a.datum));
    setEntries(neueListe);
    setLetzterStand(eintrag.km);
    setTachostand(eintrag.km);
    setSorte(eintrag.sorte);
  };

  const speichernAusgabe = async (eintrag) => {
    const stored = (await localforage.getItem("zerotrace")) || initialData;
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    stored.vehicles[vin].ausgaben.unshift(eintrag);
    await localforage.setItem("zerotrace", stored);
    const neueListe = [eintrag, ...ausgaben].sort((a, b) => b.datum.localeCompare(a.datum));
    setAusgaben(neueListe);
  };

  const speichernErinnerung = async (eintrag) => {
    const stored = (await localforage.getItem("zerotrace")) || initialData;
    if (!stored.vehicles[vin]) {
      stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
    }
    stored.vehicles[vin].erinnerungen.unshift(eintrag);
    await localforage.setItem("zerotrace", stored);
    const neueListe = [eintrag, ...erinnerungen].sort((a, b) => b.datum.localeCompare(a.datum));
    setErinnerungen(neueListe);
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