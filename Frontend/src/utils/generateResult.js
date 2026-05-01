export default function generateResult() {
  const p = Math.floor(Math.random() * 45) + 42;
  return {
    hydrationPercent: p,
    status: p >= 70 ? "Well Hydrated" : p >= 55 ? "Moderately Dehydrated" : "Severely Dehydrated",
    level: p >= 70 ? "good" : p >= 55 ? "moderate" : "low",
    moistureLevel: p < 55 ? "Critical" : p < 70 ? "Moderate" : "Optimal",
    skinType: p < 55 ? "Very Dry" : p < 70 ? "Dry-Normal" : "Normal-Oily",
    confidence: Math.floor(Math.random() * 7) + 89,
    tips: p >= 70
      ? [
          "Maintain your current water intake of 8+ glasses daily.",
          "Skin barrier is healthy — protect it with SPF 30+ daily.",
          "Your routine is working well — keep it consistent.",
        ]
      : p >= 55
      ? [
          "Increase water intake by 2–3 extra glasses per day.",
          "Apply hyaluronic acid serum before your moisturizer.",
          "Reduce caffeine and alcohol which dehydrate skin.",
        ]
      : [
          "Immediately increase water to 10+ glasses daily.",
          "Use a ceramide-rich moisturizer twice a day.",
          "Consult a dermatologist if severe dryness persists.",
        ],
  };
}
