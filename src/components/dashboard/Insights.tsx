"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { FoodRecord } from "@/lib/storage";

interface InsightsProps {
  history: FoodRecord[];
  lang: "en" | "ar";
}

export const Insights = ({ history, lang }: InsightsProps) => {
  const latest = history[0];

  const pieData = latest ? [
    { name: "Protein", value: latest.protein, color: "hsl(var(--chart-2))" },
    { name: "Fat", value: latest.fat, color: "hsl(var(--chart-1))" },
    { name: "Carbs", value: latest.carbohydrates, color: "hsl(var(--chart-4))" },
  ] : [];

  const weeklyData = [
    { day: "Mon", kcal: 2100 },
    { day: "Tue", kcal: 1850 },
    { day: "Wed", kcal: 2300 },
    { day: "Thu", kcal: 1950 },
    { day: "Fri", kcal: latest?.calories || 2000 },
    { day: "Sat", kcal: 1800 },
    { day: "Sun", kcal: 1700 },
  ];

  const labels = {
    biometric: { en: "Biometric Insights", ar: "رؤى حيوية" },
    macro: { en: "Latest Macros Breakdown", ar: "توزيع الماكروز الأخير" },
    weekly: { en: "Weekly Caloric Intake", ar: "السعرات الحرارية الأسبوعية" },
    noData: { en: "Scan food to see insights", ar: "امسح الطعام لرؤية النتائج" },
  };

  return (
    <div className="px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">{labels.biometric[lang]}</h2>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-md rounded-3xl border-primary/10 overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            {labels.macro[lang]}
          </h3>
          {latest ? (
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#141217", border: "1px solid #BF89FF", borderRadius: "8px" }}
                    itemStyle={{ color: "#BF89FF" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold">{latest.calories}</span>
                <span className="text-[10px] text-muted-foreground">KCAL</span>
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground italic">
              {labels.noData[lang]}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-md rounded-3xl border-primary/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            {labels.weekly[lang]}
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: "rgba(191,137,255,0.1)" }}
                  contentStyle={{ backgroundColor: "#141217", border: "1px solid #BF89FF", borderRadius: "8px" }}
                />
                <Bar 
                  dataKey="kcal" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
