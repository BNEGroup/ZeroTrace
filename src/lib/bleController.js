const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

let device = null;
let characteristic = null;

export const ble = {
  status: "disconnected",
  async connect() {
    try {
      device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "ZeroTrace KT v1" }],
        optionalServices: [SERVICE_UUID],
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

      ble.status = "connected_off";
      return true;
    } catch (e) {
      ble.status = "disconnected";
      return false;
    }
  },
  async sendCommand(command) {
    if (!characteristic) return;
    try {
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(command + "\n"));
      ble.status = command === "BLOCK_ON" ? "connected_on" : "connected_off";
    } catch (e) {
      ble.status = "connected_error";
    }
  },
  getStatus() {
    return ble.status;
  },
};
