/**
 * CDC 2000 & WHO Anthropometric Reference Data (Ages 2 to 20 Years)
 * Includes:
 * - Median Stature (cm) & SD by Age & Sex
 * - Median Weight (kg) & SD by Age & Sex
 * - Percentage of Mature Adult Height Multiplier by Age & Sex (Bayley-Pinneau / Khamis-Roche)
 * - Guided Spinal Decompression & Posture Routines
 * - Peer-Reviewed Medical & Anthropometric Citations (Apple Guideline 1.4.1 Compliance)
 */

window.GrowthReferenceData = (function () {
  // Ages 2..20 reference table: [medianHeightCm, sdHeightCm, medianWeightKg, sdWeightKg, pctOfAdultHeight]
  const MALE_REFERENCE = {
    2:  [86.8, 3.4, 12.6, 1.4, 0.490],
    3:  [95.2, 3.8, 14.3, 1.6, 0.538],
    4:  [102.3, 4.2, 16.3, 1.9, 0.578],
    5:  [109.2, 4.6, 18.4, 2.3, 0.616],
    6:  [115.5, 4.9, 20.7, 2.7, 0.652],
    7:  [121.9, 5.3, 23.1, 3.2, 0.689],
    8:  [128.0, 5.6, 25.6, 3.8, 0.723],
    9:  [133.3, 5.9, 28.6, 4.5, 0.753],
    10: [138.4, 6.2, 32.0, 5.4, 0.782],
    11: [143.5, 6.6, 35.9, 6.4, 0.811],
    12: [149.1, 7.1, 40.5, 7.5, 0.842],
    13: [156.2, 7.6, 45.8, 8.5, 0.882],
    14: [163.8, 7.7, 51.5, 9.2, 0.925],
    15: [170.1, 7.4, 56.9, 9.6, 0.961],
    16: [173.4, 7.1, 61.5, 9.8, 0.980],
    17: [175.2, 6.9, 64.9, 9.9, 0.990],
    18: [176.1, 6.8, 67.3, 10.1, 0.995],
    19: [176.6, 6.8, 69.1, 10.2, 0.998],
    20: [177.0, 6.8, 70.6, 10.3, 1.000]
  };

  const FEMALE_REFERENCE = {
    2:  [85.5, 3.4, 12.0, 1.4, 0.523],
    3:  [94.0, 3.8, 13.9, 1.7, 0.575],
    4:  [100.3, 4.2, 15.8, 2.0, 0.613],
    5:  [107.9, 4.6, 17.9, 2.4, 0.660],
    6:  [115.0, 5.0, 20.2, 2.9, 0.703],
    7:  [121.1, 5.4, 22.8, 3.5, 0.740],
    8:  [127.2, 5.7, 25.6, 4.2, 0.778],
    9:  [132.8, 6.0, 29.0, 5.1, 0.812],
    10: [138.6, 6.3, 33.0, 6.1, 0.847],
    11: [144.8, 6.6, 37.5, 7.2, 0.885],
    12: [151.2, 6.7, 42.3, 8.1, 0.925],
    13: [157.1, 6.6, 46.8, 8.6, 0.961],
    14: [160.4, 6.4, 50.3, 8.8, 0.981],
    15: [161.8, 6.3, 52.7, 8.9, 0.990],
    16: [162.5, 6.3, 54.2, 8.9, 0.994],
    17: [162.9, 6.3, 55.2, 8.9, 0.996],
    18: [163.1, 6.3, 56.0, 9.0, 0.998],
    19: [163.3, 6.3, 56.6, 9.0, 0.999],
    20: [163.5, 6.3, 57.1, 9.0, 1.000]
  };

  const POSTURE_ROUTINES = [
    {
      id: "cobra_stretch",
      icon: "🐍",
      title: "Thoracic Extension & Cobra Stretch",
      durationSec: 45,
      target: "Thoracic Spine & Anterior Core",
      steps: "Lie prone, place palms under shoulders, gently extend upper spine while keeping hips grounded and shoulders relaxed."
    },
    {
      id: "hanging_decomp",
      icon: "🙌",
      title: "Overhead Reach & Spinal Decompression",
      durationSec: 60,
      target: "Intervertebral Disc Decompression",
      steps: "Stand tall, interlace fingers overhead with palms facing up, elongate through the crown of your head and breathe deeply."
    },
    {
      id: "cat_cow",
      icon: "🐈",
      title: "Dynamic Cat-Cow Mobility Flow",
      durationSec: 60,
      target: "Full-Spine Segmental Alignment",
      steps: "On hands and knees, alternate between arching the upper back toward the ceiling and gently extending the chest forward."
    },
    {
      id: "wall_angel",
      icon: "🪽",
      title: "Postural Wall Slides (Wall Angels)",
      durationSec: 45,
      target: "Scapular Retraction & Cervical Posture",
      steps: "Stand with back, head, and arms against a flat wall. Slowly slide arms up and down in a 'W' to 'Y' motion."
    },
    {
      id: "pelvic_bridge",
      icon: "🌉",
      title: "Glute & Pelvic Alignment Bridge",
      durationSec: 45,
      target: "Lumbar Support & Hip Flexor Opening",
      steps: "Lie on your back with knees bent, lift hips until knees, hips, and shoulders form a straight diagonal line."
    },
    {
      id: "hamstring_bow",
      icon: "🧘",
      title: "Standing Forward Fold Decompression",
      durationSec: 45,
      target: "Posterior Chain & Lumbar Release",
      steps: "Hinge gently from the hips with soft knees, let the head and arms hang heavy to release lower-back tension."
    }
  ];

  const SCIENTIFIC_CITATIONS = [
    {
      title: "CDC / NCHS 2000 Growth Charts (United States)",
      authors: "Kuczmarski RJ, Ogden CL, Guo SS, et al. National Center for Health Statistics.",
      journal: "Vital and Health Statistics, Series 11, No. 246 (2002)",
      url: "https://www.cdc.gov/growthcharts/cdc-growth-charts.htm"
    },
    {
      title: "Predicting Adult Stature Without Using Skeletal Age: The Khamis-Roche Method",
      authors: "Khamis HJ, Roche AF.",
      journal: "Pediatrics, Vol. 94, No. 4, pp. 504–507 (1994)",
      url: "https://pubmed.ncbi.nlm.nih.gov/7936860/"
    },
    {
      title: "Tanner Mid-Parental Target Height Standard",
      authors: "Tanner JM, Goldstein H, Whitehouse RH.",
      journal: "Archives of Disease in Childhood, Vol. 45, pp. 755–762 (1970)",
      url: "https://pubmed.ncbi.nlm.nih.gov/5491878/"
    },
    {
      title: "WHO Growth Reference Data for 5–19 Years",
      authors: "de Onis M, Onyango AW, Borghi E, Siyam A, Nishida C, Siekmann J.",
      journal: "Bulletin of the World Health Organization, 85(9):660–667 (2007)",
      url: "https://www.who.int/tools/growth-reference-data-for-5to19-years"
    }
  ];

  function interpolateReference(sex, ageYearsFloat) {
    const table = sex === "female" ? FEMALE_REFERENCE : MALE_REFERENCE;
    const clamped = Math.max(2, Math.min(20, Number(ageYearsFloat) || 10));
    const lowAge = Math.floor(clamped);
    const highAge = Math.min(20, lowAge + 1);
    const frac = clamped - lowAge;

    const a = table[lowAge];
    const b = table[highAge];
    return {
      medianHeightCm: a[0] + (b[0] - a[0]) * frac,
      sdHeightCm: a[1] + (b[1] - a[1]) * frac,
      medianWeightKg: a[2] + (b[2] - a[2]) * frac,
      sdWeightKg: a[3] + (b[3] - a[3]) * frac,
      pctAdult: a[4] + (b[4] - a[4]) * frac
    };
  }

  // Standard Normal CDF approximation (Abramowitz & Stegun) for Z-score -> Percentile
  function zScoreToPercentile(z) {
    const clampedZ = Math.max(-4, Math.min(4, z));
    const t = 1 / (1 + 0.2316419 * Math.abs(clampedZ));
    const d = 0.3989423 * Math.exp((-clampedZ * clampedZ) / 2);
    const prob =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    const cdf = clampedZ > 0 ? 1 - prob : prob;
    return Math.max(0.1, Math.min(99.9, Math.round(cdf * 1000) / 10));
  }

  return {
    MALE_REFERENCE,
    FEMALE_REFERENCE,
    POSTURE_ROUTINES,
    SCIENTIFIC_CITATIONS,
    interpolateReference,
    zScoreToPercentile
  };
})();
