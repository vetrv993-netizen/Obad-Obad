"use client";

import React, { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Sparkles, RefreshCcw, X, Check } from "lucide-react";
import { scanFoodForNutrition, ScanFoodForNutritionOutput } from "@/ai/flows/scan-food-for-nutrition-flow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { saveRecord } from "@/lib/storage";

interface VisionScannerProps {
  lang: "en" | "ar";
  onSuccess: () => void;
}

export const VisionScanner = ({ lang, onSuccess }: VisionScannerProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanFoodForNutritionOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (dataUri: string) => {
    setScanning(true);
    try {
      const nutrition = await scanFoodForNutrition({ photoDataUri: dataUri });
      setResult(nutrition);
      saveRecord(nutrition, dataUri);
    } catch (error) {
      console.error("Scanning failed", error);
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setScanning(false);
  };

  const labels = {
    title: { en: "AI Vision Scanner", ar: "ماسح الرؤية الذكي" },
    desc: { en: "Point your camera at food to analyze", ar: "وجه الكاميرا نحو الطعام للتحليل" },
    scanning: { en: "Analyzing Nutrition...", ar: "جاري تحليل العناصر الغذائية..." },
    upload: { en: "Upload Image", ar: "رفع صورة" },
    take: { en: "Open Camera", ar: "فتح الكاميرا" },
    back: { en: "Scan Again", ar: "مسح جديد" },
    done: { en: "View History", ar: "عرض السجل" },
  };

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-headline font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          {labels.title[lang]}
        </h2>
        <p className="text-muted-foreground">{labels.desc[lang]}</p>
      </div>

      {!photo ? (
        <Card className="aspect-square bg-muted/20 border-2 border-dashed border-border flex flex-col items-center justify-center p-8 gap-6 rounded-3xl group hover:border-primary/50 transition-colors">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Camera className="w-10 h-10" />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={() => fileInputRef.current?.click()} className="h-14 rounded-2xl text-lg font-bold gap-3 shadow-lg">
              <Camera className="w-6 h-6" />
              {labels.take[lang]}
            </Button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={fileInputRef}
              onChange={handleCapture}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-14 rounded-2xl gap-3 border-2">
              <ImageIcon className="w-5 h-5" />
              {labels.upload[lang]}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="relative aspect-square overflow-hidden rounded-3xl bg-black border-4 border-primary/20">
            <img src={photo} alt="Food capture" className="w-full h-full object-cover" />
            
            {scanning && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="w-full h-2 bg-primary/30 absolute top-0 animate-scan-pulse shadow-[0_0_20px_rgba(191,137,255,0.8)]" />
                <RefreshCcw className="w-12 h-12 text-primary animate-spin" />
                <p className="text-white font-bold text-lg">{labels.scanning[lang]}</p>
              </div>
            )}

            {result && !scanning && (
              <div className="absolute top-4 right-4 animate-in zoom-in">
                <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
              </div>
            )}
          </Card>

          {result && (
            <Card className="p-6 bg-card/80 backdrop-blur-md border-primary/20 rounded-3xl space-y-6 animate-in fade-in slide-in-from-top-4">
              <div className="text-center">
                <h3 className="text-3xl font-headline font-bold text-primary">{result.foodName}</h3>
                <p className="text-muted-foreground">{result.servingSize}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-2xl font-bold">{result.calories}</span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Calories</span>
                </div>
                <div className="bg-secondary/10 p-4 rounded-2xl flex flex-col items-center text-secondary-foreground">
                  <span className="text-2xl font-bold">{result.protein}g</span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Protein</span>
                </div>
                <div className="bg-chart-2/10 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-2xl font-bold">{result.fat}g</span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Fats</span>
                </div>
                <div className="bg-chart-4/10 p-4 rounded-2xl flex flex-col items-center">
                  <span className="text-2xl font-bold">{result.carbohydrates}g</span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Carbs</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={reset} variant="outline" className="flex-1 h-14 rounded-2xl text-lg font-bold border-2">
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  {labels.back[lang]}
                </Button>
                <Button onClick={onSuccess} className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg">
                  {labels.done[lang]}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
