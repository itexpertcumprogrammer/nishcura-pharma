export interface DivisionItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  about: string;
  image: string;
  specialties: string[];
  features: string[];
  promoSupport: string[];
  certifications: string[];
}

export const divisionsList: DivisionItem[] = [
  {
    id: "bluewater",
    name: "BLUEWATER RESEARCH",
    tagline: "Empowering Healthcare with Research-Driven Formulations",
    description: "Bluewater Research is a leading division of Nishcura Pharmaceuticals, dedicated to providing high-quality and reliable pharmaceutical formulations. We are recognized as one of the top PCD Pharma franchise partners in India, with a robust portfolio covering tablets, capsules, injectables, and syrups.",
    about: "Bluewater Research operates on a patient-centric, research-driven model. Our state-of-the-art laboratory works in sync with qualified pharmacologists to produce safe, effective, and pure molecular structures. We guarantee exclusive district monopoly rights to our business associates to ensure maximum market footprint and stable profitability.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "Antibiotics & Anti-infectives",
      "Pediatric Drops & Dry Syrups",
      "Analgesics, NSAIDs & Pain Management",
      "Gastrointestinal & PPI Range",
      "Multivitamins & Energy Boosters"
    ],
    features: [
      "Exclusive Monopoly Rights in assigned territories",
      "WHO-GMP and ISO certified high-purity formulations",
      "100% stock availability with prompt logistic support",
      "Full-fledged marketing visual aid and promotional kit support"
    ],
    promoSupport: [
      "Visual Aids (Detailed Product Manuals)",
      "Logo printed Pens, Diaries, and Writing Pads",
      "Custom Catch Covers & Medical Product Cards",
      "Glossy Product Glossaries and Brand Calendars"
    ],
    certifications: [
      "ISO 9001:2015 Certified",
      "WHO-GMP Compliant Units",
      "DCGI Approved Molecules"
    ]
  },
  {
    id: "syntonix",
    name: "SYNTONIX BIOFARM",
    tagline: "Precision Bio-Formulations for a Healthier Tomorrow",
    description: "Syntonix Biofarm stands at the forefront of pharmaceutical innovation. As a premier specialty division, we manufacture and distribute advanced medical therapies across diverse healthcare sectors, specializing in highly bioavailable tablets, softgels, and sterile injections.",
    about: "Syntonix Biofarm has built a robust name in the pharmaceutical sector by supplying highly effective formulations. Our division is backed by top-class machinery and skilled clinicians. We support aspiring entrepreneurs and franchise partners with superior marketing resources, extensive promotional kits, and reliable profit margins.",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "Cardio-Diabetic Specialty Care",
      "Sterile Injectables & Infusions",
      "Soft Gelatin Capsules & Vitamins",
      "Neuro-Psychiatry Range",
      "Gastroenterology Preparations"
    ],
    features: [
      "High profit margin and low initial capital investment",
      "Elegant moisture-proof Alu-Alu and blister packaging",
      "Rigorous batch-to-batch chemical testing and COA verification",
      "Comprehensive clinical support for medical interactions"
    ],
    promoSupport: [
      "Medical Representative Bags & Leather Portfolios",
      "Laminated Visual Aids with scientific details",
      "Customized Leave Behind Cards (LBCs) for physicians",
      "Corporate Diaries, Greeting Cards, and Desk Calendars"
    ],
    certifications: [
      "WHO-GMP Certified",
      "ISO 9001:2015 Approved",
      "State Drug Controller Cleared"
    ]
  },
  {
    id: "greenleaf",
    name: "GREENLEAF",
    tagline: "Revitalizing Wellness Through Pure Ayurvedic Innovations",
    description: "Greenleaf is the dedicated Ayurvedic and herbal division of Nishcura Pharmaceuticals. We integrate the rich, ancient wisdom of Indian Ayurveda with modern, standardized extraction techniques to deliver 100% natural, safe, and effective wellness solutions.",
    about: "Greenleaf is committed to bringing the healing power of Mother Nature to the global market. Our products are formulated using premium, chemical-free herbal raw materials sourced directly from sustainable organic farms. From immune boosters to vitalizing syrups and personal care oils, Greenleaf offers a comprehensive wellness portfolio with high market demand and attractive franchise monopoly terms.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "Herbal Syrups & Vitality Juices",
      "Ayurvedic Capsules & Tablets",
      "Natural Hair Oils & Topical Balms",
      "Immunity Boosters & Detox Formulations",
      "Herbal Skin & Hair Cosmetics"
    ],
    features: [
      "100% organic, heavy-metal tested herbal compounds",
      "Zero synthetic side-effects with long-term healing properties",
      "Approved by the Ministry of AYUSH, Government of India",
      "High-growth herbal PCD pharma franchise opportunity"
    ],
    promoSupport: [
      "Herbal Product Glossaries & Descriptive Leaflets",
      "Organic Brand Bags and custom writing kits",
      "Physician Sample Packs & attractive carton displays",
      "Logo printed keychains and clinic wall clocks"
    ],
    certifications: [
      "Ministry of AYUSH Approved",
      "GMP Certified Herbal Unit",
      "ISO 9001:2015 Quality Ensured"
    ]
  },
  {
    id: "mission",
    name: "MISSION LAB",
    tagline: "Dedicated to Life-Saving Critical Care and Therapeutics",
    description: "Mission Lab specializes in emergency care, critical therapeutics, and highly potent antibiotic formulations. We operate high-efficiency dry powder sterile vial and injectable lines to supply hospital sectors with premium-grade acute care solutions.",
    about: "Mission Lab is driven by a singular mission: providing life-saving medicines with absolute efficacy and high-speed bio-distribution. Our formulation units comply with top international quality standards. We offer exclusive franchise rights for hospital-focused portfolios, supporting our partners with critical emergency-room medicines, cephalosporins, and injectable solutions.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351167?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "Sterile Dry Powder Injectables",
      "Critical Care Cephalosporins & Penems",
      "Anti-Infective Vials & Infusion Lines",
      "Acute Care Analgesics & Anaesthetics",
      "Intravenous Electrolytes & Minerals"
    ],
    features: [
      "Advanced aseptic sterile preparation processes",
      "High stability molecular formulations with longer shelf-life",
      "Direct tie-ups with multi-specialty hospitals and institutions",
      "Monopoly franchise rights for high-value medical markets"
    ],
    promoSupport: [
      "Detailed Hospital Product Folders & Manuals",
      "Premium Writing Instruments & Desk Organizers",
      "Technical Scientific Slide-rules & Dosage Calculators",
      "Glossy scientific monographs and clinical references"
    ],
    certifications: [
      "WHO-GMP Compliant",
      "ISO 9001:2015 Certified",
      "Sterile Process Audited"
    ]
  },
  {
    id: "daniel",
    name: "DANIEL PASTEUR",
    tagline: "Pioneering Scientific Excellence in Specialized Medicine",
    description: "Named in honor of scientific pioneering, Daniel Pasteur is our premium multi-specialty division. We focus on advanced molecular research and high-performance neuro-psychiatry, respiratory, and complex multi-ingredient formulations.",
    about: "Daniel Pasteur represents the pinnacle of medical technology and pharmaceutical research within Nishcura Pharmaceuticals. Our products undergo rigorous clinical validation and bio-equivalence studies to ensure they match global reference standards. We invite professional pharma distributors and medical representatives to head our premium monopoly-rights franchise model.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "Neuro-Psychiatry & Brain Health",
      "Respiratory & Anti-Asthmatic Care",
      "Gastro-Prokinetic Combinations",
      "Advanced Anti-Inflammatory Compositions",
      "Multi-vitamin Rejuvenators"
    ],
    features: [
      "State-of-the-art scientific research and molecular development",
      "Clinically validated, fast-acting tablets and capsules",
      "Strong medical association backing and brand trust",
      "Excellent district-level monopoly protection and support"
    ],
    promoSupport: [
      "Glossy Scientific Literature and Medical Bulletins",
      "Physician Writing Pads, Prescription Pads, and MR Bags",
      "Logo embossed table stands, organizers, and stationery",
      "Dynamic Product Presentation Slides for tablets"
    ],
    certifications: [
      "WHO-GMP Certified Unit",
      "ISO 9001:2015 Accredited",
      "DCGI Molecular Approvals"
    ]
  },
  {
    id: "carebotanicals",
    name: "CARE BOTANICALS",
    tagline: "Holistic Herbal Healing and Botanical Therapeutics",
    description: "Care Botanicals is a premier name in botanical healthcare, ayurvedic franchise, and herbal cosmetics. We design natural wellness solutions that promote holistic lifestyle balance and support long-term organ health.",
    about: "Care Botanicals stands as a pillar of trust in the natural healing segment. Our GMP-certified manufacturing units extract the purest plant actives to formulate highly effective herbal tablets, capsules, powders, and skin-rejuvenating cosmetics. We support PCD franchise associates with an extensive botanical catalog and 100% natural, side-effect-free formulations.",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "Ayurvedic Digestive & Liver Tonics",
      "Botanical Personal Care & Cosmetics",
      "Natural Joint Pain Relief Formulas",
      "Organic Wellness Powders & Granules",
      "Herbal Cough & Cold Liquifiers"
    ],
    features: [
      "Extracted using cold-process standardized herbal actives",
      "Zero toxicity and chemical residues (pesticide-free certified)",
      "Highly competitive PCD franchise prices with high profit potential",
      "Attractive herbal-themed packaging with superior shelf appeal"
    ],
    promoSupport: [
      "Eco-friendly Botanical Bags & Writing Pads",
      "Herbal Therapy Guidebooks & Product Manuals",
      "Physician Sample Packs and herbal product visual aids",
      "Vibrant counter-top display cartons and stickers"
    ],
    certifications: [
      "Ministry of AYUSH Approved",
      "GMP Standard Certified",
      "ISO 9001:2015 Approved"
    ]
  },
  {
    id: "advancerevive",
    name: "ADVANCE REVIVE",
    tagline: "Advanced Nutraceuticals and Rejuvenating Food Supplements",
    description: "Advance Revive is our specialized wellness and nutraceutical division. We focus on daily health optimization, manufacturing high-potency multivitamins, antioxidant matrices, protein formulations, and essential dietary minerals.",
    about: "Advance Revive addresses the nutritional gaps of modern lifestyles. Our formulas combine essential amino acids, key minerals, botanical extracts, and multivitamins to support daily energy, heart health, bone density, and overall vitality. We offer a high-growth franchise model in the fast-expanding nutraceutical and wellness market in India.",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "High-Potency Multivitamins & Minerals",
      "Antioxidant & Energy Booster Formulations",
      "Premium Protein Powders & Sachet Granules",
      "Calcium & Bone Density Support",
      "Immune System Modulators"
    ],
    features: [
      "FSSAI-approved, premium grade nutritional ingredients",
      "Advanced taste-optimized protein and sachet formulations",
      "Lucrative margins in the fastest-growing health sector",
      "Full district monopoly rights and professional promo kits"
    ],
    promoSupport: [
      "Nutraceutical Diet Charts & Product Catalogues",
      "Branded Shakers, Gym Bags, and Writing Pens",
      "Leave-behind product summary cards for dieticians",
      "Glossy desk stands and brand-awareness calendars"
    ],
    certifications: [
      "FSSAI Approved",
      "ISO 22000:2018 (FSMS) Certified",
      "WHO-GMP Standard Facility"
    ]
  },
  {
    id: "heninlukinz",
    name: "HENIN LUKINZ PHARMA",
    tagline: "A Legacy of Trust in Multi-Specialty PCD Pharma Franchise",
    description: "Henin Lukinz Pharma is a widely recognized name in the Indian pharmaceutical franchise landscape. With a legacy of trust, we provide a massive catalog covering gynecology, pediatric, dental, dermatology, and general therapeutic segments.",
    about: "Henin Lukinz Pharma has established a dominant market presence by ensuring premium molecular purity, elegant packaging, and exceptional customer service. We empower franchise partners across India with highly competitive PCD franchise pricing, guaranteed district monopoly rights, and a comprehensive package of promotional materials to establish local leadership.",
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=800&auto=format&fit=crop",
    specialties: [
      "Gynecology & Obstetric Health",
      "Dental Specialty & Oral Hygiene Range",
      "Dermatology & Skin Formulation Range",
      "Pediatric Suspensions & Drops",
      "Critical Care Hospital Products"
    ],
    features: [
      "Highly recognized pharma brand with nationwide reputation",
      "Uncompromised Alu-Alu and light-blocking container packaging",
      "Prompt order execution and delivery within 24-48 hours",
      "Monopoly marketing rights with highly rewarding incentive plans"
    ],
    promoSupport: [
      "Executive MR Bags, Laminated Visual Aids, and Pens",
      "Custom Physician Catch Covers and Brand Calendars",
      "Scientific Product Manuals and Medical Information Guides",
      "Promotional Keychains, desk stands, and corporate diaries"
    ],
    certifications: [
      "WHO-GMP Certified Formulation Units",
      "ISO 9001:2015 Accredited",
      "DCGI & FSSAI Approved Catalog"
    ]
  }
];
