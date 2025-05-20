// src/lib/useZerotraceData.js
import { useEffect, useState } from "react";
import localforage from "localforage";

const initialData = {
  vehicles: {},
  activeVin: "WBA8H71020K659220"
};

export function useZerotraceData() {
  const [entries, setEntries] = useState([]);
  const [ausgaben, setAusgaben] = useState([]);
  const [erinnerungen, setErinnerungen] = useState([]);
  const [letzterStand, setLetzterStand] = useState(0);
  const vin = initialData.activeVin;

  useEffect(() => {
    const ladeDaten = async () => {
      const stored = (await localforage.getItem("zerotrace")) || initialData;
      if (!stored.vehicles[vin]) {
        stored.vehicles[vin] = { betankungen: [], ausgaben: [], erinnerungen: [] };
      }
      const fahrzeug = stored.vehicles[vin];
      setEntries([...fahrzeug.betankungen].reverse());
      setAusgaben([...fahrzeug.ausgaben].reverse());
      setErinnerungen([...fahrzeug.erinnerungen].reverse());

      const letzte = fahrzeug.betankungen.at(-1);
      if (letzte) {
        setLetzterStand(letzte.km);
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
    setEntries([eintrag, ...entries]);
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
    speichernBetankung,
    speichernAusgabe,
    speichernErinnerung
  };
}