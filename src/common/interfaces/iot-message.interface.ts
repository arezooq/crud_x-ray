export interface RawIotMessage {
  [deviceId: string]: {
    data: [number, [number, number, number]][];
    time: number;
  };
}
