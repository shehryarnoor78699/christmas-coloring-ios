/**
 * Maternal Lactation Energy, Micronutrient & Meal Database
 * Derived from published clinical references:
 * 1. National Academies of Sciences, Engineering, and Medicine (NASEM 2023) — Dietary Reference Intakes for Energy
 * 2. Mifflin-St Jeor Resting Energy Expenditure Equation (AJCN, 1990)
 * 3. CDC Maternal Diet & Breastfeeding Micronutrient Guidelines (Iodine 290mcg, Choline 550mg)
 * 4. WHO / FAO Human Energy Requirements (Technical Report Series 935)
 */

window.LactationReferenceData = (function () {
  const NURSING_STAGES = [
    {
      id: "exclusive_0_6",
      label: "Exclusive Breastfeeding (0–6 Months)",
      shortLabel: "Exclusive (0–6m)",
      milkEnergyKcal: 500,
      tissueMobilizationKcal: 170,
      netAddKcal: 330,
      fullAddKcal: 500,
      proteinAddG: 25,
      hydrationAddMl: 700,
      note: "NASEM 2023 standard: +500 kcal milk energy cost minus 170 kcal gradual postpartum tissue mobilization (+330 kcal net, or +500 kcal if maintaining current weight)."
    },
    {
      id: "complementary_6_12",
      label: "Complementary Nursing (6–12+ Months)",
      shortLabel: "Nursing (6–12m+)",
      milkEnergyKcal: 400,
      tissueMobilizationKcal: 0,
      netAddKcal: 400,
      fullAddKcal: 400,
      proteinAddG: 20,
      hydrationAddMl: 600,
      note: "NASEM 2023 second-half lactation standard: +400 kcal/day above baseline energy expenditure as complementary solids are introduced."
    },
    {
      id: "combo_partial",
      label: "Combination / Partial Breastfeeding",
      shortLabel: "Combo Feeding",
      milkEnergyKcal: 260,
      tissueMobilizationKcal: 50,
      netAddKcal: 210,
      fullAddKcal: 260,
      proteinAddG: 15,
      hydrationAddMl: 450,
      note: "Scaled maternal energy add-on for mixed breastmilk and formula feeding (~50–60% daily milk output)."
    },
    {
      id: "tandem_twins",
      label: "Tandem Nursing / Twins",
      shortLabel: "Twins / Tandem",
      milkEnergyKcal: 850,
      tissueMobilizationKcal: 150,
      netAddKcal: 700,
      fullAddKcal: 850,
      proteinAddG: 45,
      hydrationAddMl: 1100,
      note: "High-output maternal lactation demand for nursing twins or tandem nursing two siblings."
    },
    {
      id: "pumping_custom",
      label: "Exclusive Pumping (By Expressed Volume)",
      shortLabel: "Pumping (Custom oz)",
      milkEnergyKcal: 520,
      tissueMobilizationKcal: 120,
      netAddKcal: 400,
      fullAddKcal: 520,
      proteinAddG: 25,
      hydrationAddMl: 750,
      note: "Calculates exact milk energy expenditure at ~20 kcal per fluid ounce (0.67 kcal/mL) with 80% maternal synthesis efficiency (~25 kcal expended per oz)."
    }
  ];

  const ACTIVITY_LEVELS = [
    { id: "sedentary", label: "Sedentary (Rest & Early Postpartum)", pal: 1.2 },
    { id: "light", label: "Light Activity (Stroller Walks, 1–3d/wk)", pal: 1.375 },
    { id: "moderate", label: "Moderate Exercise (Active Lifestyle, 3–5d/wk)", pal: 1.55 },
    { id: "active", label: "High Activity (Daily Training, 6–7d/wk)", pal: 1.725 },
    { id: "very_active", label: "Intense Physical Demand / Athlete", pal: 1.9 }
  ];

  const SUPERFOODS_LIBRARY = [
    { id: "oats", icon: "🥣", name: "Rolled Oats & Chia Bowl", kcal: 310, proteinG: 11, carbsG: 48, fatG: 8, tag: "Beta-Glucan & Iron" },
    { id: "salmon", icon: "🍣", name: "Wild Atlantic Salmon (150g)", kcal: 340, proteinG: 34, carbsG: 0, fatG: 21, tag: "Rich in DHA & Vitamin D" },
    { id: "eggs", icon: "🥚", name: "2 Pasture-Raised Eggs & Toast", kcal: 290, proteinG: 16, carbsG: 24, fatG: 13, tag: "290mg Maternal Choline" },
    { id: "yogurt", icon: "🍨", name: "Greek Yogurt, Berries & Flax", kcal: 245, proteinG: 20, carbsG: 24, fatG: 7, tag: "Calcium, Iodine & Probiotics" },
    { id: "almonds", icon: "🥜", name: "Roasted Almonds & Walnuts (35g)", kcal: 210, proteinG: 7, carbsG: 6, fatG: 18, tag: "Healthy Essential Fats" },
    { id: "lentils", icon: "🍲", name: "Warm Red Lentil & Spinach Dal", kcal: 330, proteinG: 18, carbsG: 52, fatG: 5, tag: "Folate & Plant Iron" },
    { id: "avocado", icon: "🥑", name: "Avocado & Turkey Whole-Grain Wrap", kcal: 420, proteinG: 28, carbsG: 36, fatG: 19, tag: "Sustained B-Vitamins" },
    { id: "smoothie", icon: "🥤", name: "Lactation Berry & Oat Smoothie", kcal: 325, proteinG: 22, carbsG: 42, fatG: 7, tag: "Hydration + Electrolytes" }
  ];

  const EXPERT_GUIDES = [
    {
      icon: "🌸",
      title: "How Many Extra Calories Do You Need While Breastfeeding?",
      summary: "According to the National Academies (NASEM 2023) and CDC guidelines, exclusive breastfeeding during the first 6 months requires approximately 500 kcal/day of milk energy synthesis. When factoring in gradual mobilization of postpartum tissue stores (~170 kcal/day), the net recommended dietary addition is +330 to +400 kcal/day above your baseline maintenance needs, or +500 kcal/day if maintaining current weight."
    },
    {
      icon: "🥣",
      title: "Top Nutrient Priorities: Protein, Iodine, Choline & DHA",
      summary: "Maternal diet directly influences key micronutrients in breast milk. The CDC and NIH Office of Dietary Supplements highlight Iodine (290 mcg/day), Choline (550 mg/day), DHA Omega-3 (200–300 mg/day), Vitamin D, and +25 g/day of complete protein from eggs, seafood, dairy, legumes, nuts, and whole grains."
    },
    {
      icon: "💧",
      title: "Hydration & Milk Volume: Practical Evidence",
      summary: "Breast milk is approximately 87% water. Nursing mothers typically require 2.7 to 3.1 liters (11–13 cups) of total daily fluids. Drinking a glass of water alongside each nursing or pumping session helps prevent maternal dehydration and fatigue."
    },
    {
      icon: "🛡️",
      title: "Safe Postpartum Energy Floor (1,800 kcal/day)",
      summary: "Clinical lactation guidelines advise against dropping daily caloric intake below 1,800 kcal/day while breastfeeding. Gentle gradual pacing of 0.45 kg (1 lb) per week after the first 6–8 weeks postpartum supports maternal recovery without compromising milk supply."
    }
  ];

  const CLINICAL_CITATIONS = [
    {
      title: "National Academies (NASEM 2023) — Dietary Reference Intakes for Energy",
      authors: "National Academies of Sciences, Engineering, and Medicine.",
      journal: "The National Academies Press, Washington, DC (2023)",
      url: "https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-energy"
    },
    {
      title: "CDC Breastfeeding Guidelines — Maternal Diet & Micronutrients",
      authors: "Centers for Disease Control and Prevention (CDC).",
      journal: "U.S. Department of Health & Human Services",
      url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/maternal-diet.html"
    },
    {
      title: "A New Predictive Equation for Resting Energy Expenditure in Healthy Individuals",
      authors: "Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.",
      journal: "The American Journal of Clinical Nutrition, 51(2):241–247 (1990)",
      url: "https://pubmed.ncbi.nlm.nih.gov/2305711/"
    },
    {
      title: "WHO / FAO / UNU Human Energy Requirements — Lactation Chapter",
      authors: "World Health Organization & Food and Agriculture Organization.",
      journal: "WHO Technical Report Series 935",
      url: "https://www.who.int/publications/i/item/9241592923"
    }
  ];

  return {
    NURSING_STAGES,
    ACTIVITY_LEVELS,
    SUPERFOODS_LIBRARY,
    EXPERT_GUIDES,
    CLINICAL_CITATIONS
  };
})();
