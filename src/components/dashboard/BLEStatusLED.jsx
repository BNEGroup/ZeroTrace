import React from "react";

export function BLEStatusLED({ status }) {
  const color = {
    disconnected: "animate-pulse bg-red-600",
    connected_off: "bg-gray-400",
    connected_on: "bg-green-500",
    connected_service: "bg-yellow-400",
    connected_error: "bg-red-500",
  }[status];

  return (
    <div className={`w-3 h-3 rounded-full ${color} mr-2`} title={`Status: ${status}`}></div>
  );
}
