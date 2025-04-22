import { create } from "zustand";

const useSceneStore = create((set) => ({
  flipCoinFn: null,
  fallCoin: true,
  canFlip: true,
  result: null,
  init: false,
  setFlipCoinFn: (val: any) => set({ flipCoinFn: val }),
  setFallCoin: (val: any) => set({ fallCoin: val }),
  setCanFlip: (val: any) => set({ canFlip: val }),
  setResult: (val: any) => set({ result: val }),
  setInit: (val: any) => set({ init: val }),
}));

export default useSceneStore;
