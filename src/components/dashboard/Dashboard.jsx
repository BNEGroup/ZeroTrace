import { useEffect, useState } from "react";
import { ble } from "@/lib/bleController";
import { BLEStatusLED } from "@/components/dashboard/BLEStatusLED";

export default function Dashboard() {
  const [status, setStatus] = useState("disconnected");

  const connect = async () => {
    const success = await ble.connect();
    if (success) {
      setStatus(ble.getStatus());
    } else {
      setStatus("disconnected");
    }
  };

  const toggleSystem = async () => {
    const current = ble.getStatus();
    const newCommand = current === "connected_on" ? "BLOCK_OFF" : "BLOCK_ON";
    await ble.sendCommand(newCommand);
    setStatus(ble.getStatus());
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BLEStatusLED status={status} />
        <h2 className="text-2xl font-semibold">ZeroTrace KT v1 – Steuerung</h2>
      </div>

      <button
        onClick={connect}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {status === "disconnected" ? "Verbinden" : "Neu verbinden"}
      </button>

      <button
        onClick={toggleSystem}
        disabled={status === "disconnected"}
        className={`px-4 py-2 text-white rounded ${
          status === "connected_on"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {status === "connected_on" ? "Ausschalten" : "Einschalten"}
      </button>
    </div>
  );
}
