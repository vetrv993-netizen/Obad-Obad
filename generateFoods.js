const fs = require('fs');
const path = require('path');

const dir = 'src/data';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const categories = [
  "Fruits", "Vegetables", "Meat", "Chicken", "Fish", "Eggs", "Dairy products", 
  "Rice", "Bread", "Pasta", "Fast food", "Drinks", "Nuts", "Beans and legumes", 
  "Desserts", "Oils", "Traditional Arabic foods"
];

const categoryTranslations = {
  "Fruits": "الفاكهة",
  "Vegetables": "الخضروات",
  "Meat": "لحوم",
  "Chicken": "دجاج",
  "Fish": "سمك",
  "Eggs": "بيض",
  "Dairy products": "منتجات الألبان",
  "Rice": "أرز",
  "Bread": "خبز",
  "Pasta": "معكرونة",
  "Fast food": "وجبات سريعة",
  "Drinks": "مشروبات",
  "Nuts": "مكسرات",
  "Beans and legumes": "بقوليات",
  "Desserts": "حلويات",
  "Oils": "زيوت",
  "Traditional Arabic foods": "مأكولات عربية تقليدية"
};

const baseFoods = [
  { nameEn: "Apple", nameAr: "تفاح", cat: "Fruits", c: 52, p: 0.3, carbs: 14, f: 0.2, fiber: 2.4, s: 10, sod: 1, pot: 107 },
  { nameEn: "Banana", nameAr: "موز", cat: "Fruits", c: 89, p: 1.1, carbs: 23, f: 0.3, fiber: 2.6, s: 12, sod: 1, pot: 358 },
  { nameEn: "Broccoli", nameAr: "بروكلي", cat: "Vegetables", c: 34, p: 2.8, carbs: 6.6, f: 0.4, fiber: 2.6, s: 1.7, sod: 33, pot: 316 },
  { nameEn: "Chicken Breast", nameAr: "صدر دجاج", cat: "Chicken", c: 165, p: 31, carbs: 0, f: 3.6, fiber: 0, s: 0, sod: 74, pot: 256 },
  { nameEn: "Salmon", nameAr: "سلمون", cat: "Fish", c: 208, p: 20, carbs: 0, f: 13, fiber: 0, s: 0, sod: 59, pot: 363 },
  { nameEn: "Beef Steak", nameAr: "شريحة لحم بقر", cat: "Meat", c: 271, p: 25, carbs: 0, f: 19, fiber: 0, s: 0, sod: 54, pot: 318 },
  { nameEn: "Boiled Egg", nameAr: "بيض مسلوق", cat: "Eggs", c: 155, p: 13, carbs: 1.1, f: 11, fiber: 0, s: 1.1, sod: 124, pot: 126 },
  { nameEn: "Milk", nameAr: "حليب", cat: "Dairy products", c: 42, p: 3.4, carbs: 5, f: 1, fiber: 0, s: 5, sod: 44, pot: 150 },
  { nameEn: "White Rice", nameAr: "أرز أبيض", cat: "Rice", c: 130, p: 2.7, carbs: 28, f: 0.3, fiber: 0.4, s: 0.1, sod: 1, pot: 35 },
  { nameEn: "Pita Bread", nameAr: "خبز عربي", cat: "Bread", c: 275, p: 9.1, carbs: 56, f: 1.2, fiber: 2.2, s: 1.3, sod: 536, pot: 120 },
  { nameEn: "Pasta", nameAr: "معكرونة", cat: "Pasta", c: 131, p: 5, carbs: 25, f: 1.1, fiber: 1.2, s: 0.8, sod: 6, pot: 44 },
  { nameEn: "Pizza", nameAr: "بيتزا", cat: "Fast food", c: 266, p: 11, carbs: 33, f: 10, fiber: 2.3, s: 3.6, sod: 598, pot: 172 },
  { nameEn: "Orange Juice", nameAr: "عصير برتقال", cat: "Drinks", c: 45, p: 0.7, carbs: 10, f: 0.2, fiber: 0.2, s: 8, sod: 1, pot: 200 },
  { nameEn: "Almonds", nameAr: "لوز", cat: "Nuts", c: 579, p: 21, carbs: 22, f: 50, fiber: 12.5, s: 4.4, sod: 1, pot: 733 },
  { nameEn: "Lentils", nameAr: "عدس", cat: "Beans and legumes", c: 116, p: 9, carbs: 20, f: 0.4, fiber: 7.9, s: 1.8, sod: 2, pot: 369 },
  { nameEn: "Chocolate", nameAr: "شوكولاتة", cat: "Desserts", c: 546, p: 4.9, carbs: 61, f: 31, fiber: 3.4, s: 48, sod: 24, pot: 372 },
  { nameEn: "Olive Oil", nameAr: "زيت زيتون", cat: "Oils", c: 884, p: 0, carbs: 0, f: 100, fiber: 0, s: 0, sod: 2, pot: 1 },
  { nameEn: "Hummus", nameAr: "حمص", cat: "Traditional Arabic foods", c: 166, p: 7.9, carbs: 14, f: 9.6, fiber: 6, s: 0.3, sod: 379, pot: 228 },
  { nameEn: "Falafel", nameAr: "فلافل", cat: "Traditional Arabic foods", c: 333, p: 13, carbs: 32, f: 18, fiber: 0, s: 0, sod: 294, pot: 585 },
  { nameEn: "Shawarma", nameAr: "شاورما", cat: "Traditional Arabic foods", c: 250, p: 15, carbs: 20, f: 12, fiber: 2, s: 2, sod: 400, pot: 200 },
  { nameEn: "Orange", nameAr: "برتقال", cat: "Fruits", c: 47, p: 0.9, carbs: 12, f: 0.1, fiber: 2.4, s: 9, sod: 0, pot: 181 },
  { nameEn: "Walnuts", nameAr: "جوز", cat: "Nuts", c: 654, p: 15, carbs: 14, f: 65, fiber: 6.7, s: 2.6, sod: 2, pot: 441 },
];

let items = [];
const generateId = () => Math.random().toString(36).substr(2, 9);
const variations = ["Organic ", "Fresh ", "Local ", "Premimum ", "Roasted ", "Raw "];
const arVariations = ["عضوي ", "طازج ", "محلي ", "فاخر ", "محمص ", "نيء "];

for (let cat of categories) {
  let catBase = baseFoods.filter(f => f.cat === cat);
  if (catBase.length === 0) catBase = baseFoods.slice(0, 1);
  for (let i = 0; i < 20; i++) {
    let base = catBase[i % catBase.length];
    let multiplier = 0.8 + (Math.random() * 0.4);
    let vIdx = Math.floor(Math.random() * variations.length);
    let prefix = variations[vIdx];
    let arPrefix = arVariations[vIdx];
    
    // Some normal items
    let nameEn = (i < 3) ? base.nameEn + (i > 0 ? " " + (i+1) : "") : prefix + base.nameEn;
    let nameAr = (i < 3) ? base.nameAr + (i > 0 ? " " + (i+1) : "") : arPrefix + base.nameAr;
    
    items.push({
      id: generateId(),
      nameEn,
      nameAr,
      category: cat,
      categoryAr: categoryTranslations[cat],
      calories: Math.round(base.c * multiplier),
      protein: parseFloat((base.p * multiplier).toFixed(1)),
      carbs: parseFloat((base.carbs * multiplier).toFixed(1)),
      fat: parseFloat((base.f * multiplier).toFixed(1)),
      fiber: parseFloat((base.fiber * multiplier).toFixed(1)),
      sugar: parseFloat((base.s * multiplier).toFixed(1)),
      sodium: Math.round(base.sod * multiplier),
      potassium: Math.round(base.pot * multiplier),
      servingSize: "100g",
    });
  }
}

fs.writeFileSync('src/data/foods.json', JSON.stringify(items, null, 2));
console.log(`Generated ${items.length} items`);
