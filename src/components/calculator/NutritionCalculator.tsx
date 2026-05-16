"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Trash2, Plus, ArrowRight, Sparkles } from "lucide-react";
import foodsData from "@/data/foods.json";
import { FoodItem, FoodCard } from "./FoodCard";
import { MacroChart } from "./MacroChart";
import { MealSummary, Meal } from "./MealSummary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const NutritionCalculator = ({ lang }: { lang: "en" | "ar" }) => {
  const isRtl = lang === "ar";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<(FoodItem & { qty: number, uid: string })[]>([]);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");

  const categories = Array.from(new Set((foodsData as FoodItem[]).map((f) => f.category)));
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    const foods = foodsData as FoodItem[];
    for (const f of foods) {
      if (!map[f.category]) map[f.category] = f.categoryAr;
    }
    return map;
  }, []);

  const filteredFoods = useMemo(() => {
    return (foodsData as FoodItem[]).filter(f => {
      const matchSearch = f.nameEn.toLowerCase().includes(search.toLowerCase()) || 
                          f.nameAr.includes(search);
      const matchCat = selectedCategory ? f.category === selectedCategory : true;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  const handleAdd = (item: FoodItem) => {
    setSelectedItems(prev => [
      ...prev,
      { ...item, qty: 100, uid: Math.random().toString(36).substr(2, 9) }
    ]);
  };

  const handleRemove = (uid: string) => {
    setSelectedItems(prev => prev.filter(i => i.uid !== uid));
  };

  const handleQtyChange = (uid: string, qty: number) => {
    if(qty < 0 || isNaN(qty)) return;
    setSelectedItems(prev => prev.map(i => i.uid === uid ? { ...i, qty } : i));
  };

  const totals = useMemo(() => {
    return selectedItems.reduce((acc, item) => {
      const ratio = item.qty / 100;
      return {
        calories: acc.calories + item.calories * ratio,
        protein: acc.protein + item.protein * ratio,
        carbs: acc.carbs + item.carbs * ratio,
        fat: acc.fat + item.fat * ratio,
      }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [selectedItems]);

  const meals: Meal[] = [
    { type: "breakfast", id: "1", items: mealType === "breakfast" ? selectedItems : [], totalCalories: mealType === "breakfast" ? totals.calories : 0 },
    { type: "lunch", id: "2", items: mealType === "lunch" ? selectedItems : [], totalCalories: mealType === "lunch" ? totals.calories : 0 },
    { type: "dinner", id: "3", items: mealType === "dinner" ? selectedItems : [], totalCalories: mealType === "dinner" ? totals.calories : 0 },
    { type: "snack", id: "4", items: mealType === "snack" ? selectedItems : [], totalCalories: mealType === "snack" ? totals.calories : 0 },
  ];

  const labels = {
    search: { en: "Search foods...", ar: "ابحث عن طعام..." },
    allCats: { en: "All Categories", ar: "جميع الفئات" },
    addSelected: { en: "Selected Foods", ar: "الأطعمة المختارة" },
    emptySelected: { en: "No foods selected yet", ar: "لم يتم اختيار أي طعام بعد" },
    mealSummary: { en: "Daily Summary", ar: "الملخص اليومي" },
    aiTips: { en: "AI Smart Suggestions", ar: "اقتراحات الذكاء الاصطناعي الذكية" },
    highProtein: { en: "High Protein", ar: "عالي البروتين" },
    weightLoss: { en: "Weight Loss", ar: "خسارة الوزن" },
    muscleGain: { en: "Muscle Gain", ar: "بناء العضلات" },
    diabetic: { en: "Diabetic Friendly", ar: "مناسب لمرضى السكري" }
  };

  const applyAISuggestion = (type: string) => {
    let suggestedNames: string[] = [];
    // Only search by English name for simplicity
    if (type === "highProtein") suggestedNames = ["Chicken Breast", "Salmon", "Boiled Egg", "Lentils", "Almonds"];
    else if (type === "weightLoss") suggestedNames = ["Broccoli", "Apple", "Orange", "Chicken Breast", "Boiled Egg"];
    else if (type === "muscleGain") suggestedNames = ["Beef Steak", "White Rice", "Pasta", "Chicken Breast", "Milk"];
    else if (type === "diabetic") suggestedNames = ["Broccoli", "Salmon", "Lentils", "Almonds", "Walnuts"];

    const foods = foodsData as FoodItem[];
    // Find foods that include the name or exactly match
    const itemsToAdd = suggestedNames.map(name => foods.find(f => f.nameEn.includes(name))).filter(Boolean) as FoodItem[];
    
    // add them
    const newItems = itemsToAdd.map(item => ({
      ...item,
      qty: 100,
      uid: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedItems(prev => [...prev, ...newItems]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10" dir={isRtl ? "rtl" : "ltr"}>
      
      <div className="px-6 space-y-6">
        <MacroChart 
          calories={totals.calories} 
          protein={totals.protein} 
          carbs={totals.carbs} 
          fat={totals.fat}
          lang={lang} 
        />
        
        {/* Selected Items */}
        <div className="bg-card/40 rounded-3xl p-5 border border-white/5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">{labels.addSelected[lang]}</h3>
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
              {selectedItems.length} {lang === "ar" ? "عناصر" : "items"}
            </div>
          </div>
          
          <div className="space-y-3">
            {selectedItems.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6 italic">{labels.emptySelected[lang]}</p>
            ) : (
              selectedItems.map(item => (
                <div key={item.uid} className="flex items-center gap-3 bg-background/60 p-3 rounded-2xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold truncate">{isRtl ? item.nameAr : item.nameEn}</h4>
                    <p className="text-[10px] text-muted-foreground">{Math.round(item.calories * (item.qty/100))} kcal</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.uid, parseInt(e.target.value) || 0)}
                      className="w-16 h-8 text-center text-xs bg-black/20 border-none"
                    />
                    <span className="text-xs text-muted-foreground">g</span>
                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-xl ml-2" onClick={() => handleRemove(item.uid)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <h3 className="font-bold text-xl">{labels.mealSummary[lang]}</h3>
        <MealSummary meals={meals} lang={lang} />
      </div>

      <div className="px-6 space-y-6">
        <h3 className="font-bold text-xl text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> {labels.aiTips[lang]}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-3 rounded-2xl flex flex-col gap-2 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/50" onClick={() => applyAISuggestion("highProtein")}>
            <span className="text-blue-400 font-bold">{labels.highProtein[lang]}</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 rounded-2xl flex flex-col gap-2 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 hover:border-green-500/50" onClick={() => applyAISuggestion("weightLoss")}>
            <span className="text-green-400 font-bold">{labels.weightLoss[lang]}</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 rounded-2xl flex flex-col gap-2 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20 hover:border-orange-500/50" onClick={() => applyAISuggestion("muscleGain")}>
            <span className="text-orange-400 font-bold">{labels.muscleGain[lang]}</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 rounded-2xl flex flex-col gap-2 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/50" onClick={() => applyAISuggestion("diabetic")}>
            <span className="text-purple-400 font-bold">{labels.diabetic[lang]}</span>
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="relative">
          <Search className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground", isRtl ? "right-4" : "left-4")} />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder={labels.search[lang]}
            className={cn("h-14 rounded-2xl bg-card border-white/5 shadow-inner", isRtl ? "pr-12" : "pl-12")}
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-2 px-1" style={{ marginRight: isRtl ? "4px" : "0", marginLeft: isRtl ? "0" : "4px" }}>
            <Badge 
              variant={selectedCategory === null ? "default" : "secondary"}
              className="px-4 py-2 rounded-xl cursor-pointer text-sm font-medium mr-2"
              onClick={() => setSelectedCategory(null)}
            >
              {labels.allCats[lang]}
            </Badge>
            {categories.map((cat, idx) => (
              <Badge 
                key={cat}
                variant={selectedCategory === cat ? "default" : "secondary"}
                className={cn("px-4 py-2 rounded-xl cursor-pointer text-sm font-medium", isRtl ? "ml-2" : "mr-2")}
                onClick={() => setSelectedCategory(cat)}
              >
                {isRtl ? categoryMap[cat] : cat}
              </Badge>
            ))}
          </div>
        </ScrollArea>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFoods.slice(0, 50).map(f => (
            <FoodCard key={f.id} item={f} lang={lang} onAdd={handleAdd} />
          ))}
          {filteredFoods.length > 50 && (
            <p className="text-center text-sm text-muted-foreground col-span-full py-4">
              {lang === "ar" ? "يظهر 50 نتيجة، يرجى استخدام البحث لمزيد من النتائج." : "Showing 50 results, use search for more."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
