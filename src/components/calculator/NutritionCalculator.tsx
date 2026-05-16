"use client";

import React, { useMemo, useState } from "react";

type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const foods: FoodItem[] = [
  {
    id: 1,
    name: "أرز مطبوخ",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
  },
  {
    id: 2,
    name: "صدر دجاج",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    id: 3,
    name: "بيض",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
  },
  {
    id: 4,
    name: "تفاح",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
  },
  {
    id: 5,
    name: "شوفان",
    calories: 389,
    protein: 16.9,
    carbs: 66,
    fat: 6.9,
  },
];

type SelectedFood = {
  food: FoodItem;
  grams: number;
};

export default function NutritionCalculator() {
  const [selectedFoodId, setSelectedFoodId] = useState<number>(foods[0].id);
  const [grams, setGrams] = useState<number>(100);
  const [meal, setMeal] = useState<SelectedFood[]>([]);

  const addFood = () => {
    const food = foods.find((f) => f.id === selectedFoodId);

    if (!food) return;

    setMeal((prev) => [
      ...prev,
      {
        food,
        grams,
      },
    ]);
  };

  const removeFood = (index: number) => {
    setMeal((prev) => prev.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => {
    return meal.reduce(
      (acc, item) => {
        const factor = item.grams / 100;

        acc.calories += item.food.calories * factor;
        acc.protein += item.food.protein * factor;
        acc.carbs += item.food.carbs * factor;
        acc.fat += item.food.fat * factor;

        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );
  }, [meal]);

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 text-slate-800">
        <h1 className="text-3xl font-bold text-center mb-6">
          الحاسبة الغذائية
        </h1>

        {/* اختيار الطعام */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <select
            className="border rounded-xl p-3 bg-white"
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(Number(e.target.value))}
          >
            {foods.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border rounded-xl p-3 bg-white"
            value={grams}
            onChange={(e) => setGrams(Number(e.target.value))}
            placeholder="الكمية بالجرام"
          />

          <button
            onClick={addFood}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-3 font-bold"
          >
            إضافة
          </button>
        </div>

        {/* قائمة الوجبة */}
        <div className="space-y-3 mb-8">
          {meal.length === 0 ? (
            <div className="text-center text-gray-500">
              لا توجد عناصر مضافة
            </div>
          ) : (
            meal.map((item, index) => {
              const factor = item.grams / 100;

              return (
                <div
                  key={index}
                  className="bg-gray-50 border rounded-2xl p-4 flex justify-between items-center"
                >
                  <div className="text-right w-full">
                    <h2 className="font-bold text-lg">
                      {item.food.name}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {item.grams} جرام
                    </p>

                    <div className="text-sm mt-2 space-y-1">
                      <p>
                        السعرات:
                        {" "}
                        {(item.food.calories * factor).toFixed(1)}
                      </p>

                      <p>
                        البروتين:
                        {" "}
                        {(item.food.protein * factor).toFixed(1)} g
                      </p>

                      <p>
                        الكربوهيدرات:
                        {" "}
                        {(item.food.carbs * factor).toFixed(1)} g
                      </p>

                      <p>
                        الدهون:
                        {" "}
                        {(item.food.fat * factor).toFixed(1)} g
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFood(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl mr-4 whitespace-nowrap"
                  >
                    حذف
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* النتائج النهائية */}
        <div className="bg-green-50 rounded-3xl p-6 border">
          <h2 className="text-2xl font-bold mb-4 text-center">
            إجمالي الوجبة
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <p className="text-gray-500">السعرات</p>
              <p className="text-2xl font-bold text-green-700">
                {totals.calories.toFixed(1)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <p className="text-gray-500">البروتين</p>
              <p className="text-2xl font-bold text-blue-700">
                {totals.protein.toFixed(1)} g
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <p className="text-gray-500">الكربوهيدرات</p>
              <p className="text-2xl font-bold text-orange-700">
                {totals.carbs.toFixed(1)} g
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <p className="text-gray-500">الدهون</p>
              <p className="text-2xl font-bold text-yellow-600">
                {totals.fat.toFixed(1)} g
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
