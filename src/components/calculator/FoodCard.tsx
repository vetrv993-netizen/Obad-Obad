import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface FoodItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  servingSize: string;
}

interface FoodCardProps {
  item: FoodItem;
  lang: "en" | "ar";
  onAdd: (item: FoodItem) => void;
}

export const FoodCard = ({ item, lang, onAdd }: FoodCardProps) => {
  const isRtl = lang === "ar";
  const name = isRtl ? item.nameAr : item.nameEn;
  const categoryName = isRtl ? item.categoryAr : item.category;
  
  return (
    <Card className="p-4 flex items-center justify-between glass-morphism border-white/5 bg-gradient-to-br from-card/40 to-background/40 hover:bg-white/5 transition-colors group">
      <div className="flex flex-col gap-1">
        <h4 className="font-bold text-base">{name}</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
            {categoryName}
          </span>
          <span>{item.calories} kcal / 100g</span>
        </div>
        <div className="flex gap-3 text-[10px] mt-1 opacity-70">
          <span>P: {item.protein}g</span>
          <span>C: {item.carbs}g</span>
          <span>F: {item.fat}g</span>
        </div>
      </div>
      
      <Button 
        size="icon" 
        variant="ghost" 
        className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all group-hover:scale-110"
        onClick={() => onAdd(item)}
      >
        <Plus className="w-5 h-5" />
      </Button>
    </Card>
  );
};
