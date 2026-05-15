import { ScanFoodForNutritionOutput } from "@/ai/flows/scan-food-for-nutrition-flow";

export interface FoodRecord extends ScanFoodForNutritionOutput {
  id: string;
  timestamp: number;
  isFavorite: boolean;
  photoUrl?: string;
}

const STORAGE_KEY = "nutriscan_ledger";

export const getLedger = (): FoodRecord[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRecord = (record: Omit<FoodRecord, "id" | "timestamp" | "isFavorite">, photoUrl?: string): FoodRecord => {
  const ledger = getLedger();
  const newRecord: FoodRecord = {
    ...record,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    isFavorite: false,
    photoUrl,
  };
  const updated = [newRecord, ...ledger];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newRecord;
};

export const toggleFavorite = (id: string) => {
  const ledger = getLedger();
  const updated = ledger.map((r) =>
    r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearLedger = () => {
  localStorage.removeItem(STORAGE_KEY);
};
