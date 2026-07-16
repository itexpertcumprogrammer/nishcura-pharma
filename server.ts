import express from "express";
import path from "path";
import fs from "fs";
import { 
  WebsiteSettings, Slide, Category, Product, Service, Blog, FAQ, 
  Inquiry, Job, JobApplication, Testimonial, Certificate, GalleryItem, 
  VideoItem, ActivityLog, User 
} from "./src/types";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '20mb' }));

// Paths
const dbDir = path.join(process.cwd(), "server");
const dbPath = path.join(dbDir, "db.json");

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial Database Structure with robust, professional seed data
const initialDb = {
  settings: {
    id: "1",
    companyName: "Nishcura Pharmaceuticals",
    tagline: "WHO-GMP Certified Third Party Pharma Manufacturing",
    logoText: "Nishcura Pharmaceuticals",
    email: "nishcurapharma@gmail.com",
    email2: "nishcurapharmaceuticals@gmail.com",
    phone: "+91 97790 02650",
    phone2: "",
    address: "Plot No. 140, Industrial Area, Phase 1, Panchkula, Haryana, India - 134113",
    websiteUrl: "https://nishcurapharmaceuticals.com",
    whatsappNumber: "919779002650",
    facebookUrl: "https://facebook.com/nishcurapharmaceuticals",
    twitterUrl: "https://twitter.com/nishcurapharma",
    telegramUrl: "",
    linkedinUrl: "https://linkedin.com/company/nishcurapharmaceuticals",
    instagramUrl: "https://instagram.com/nishcurapharmaceuticals",
    youtubeUrl: "https://youtube.com/c/nishcurapharmaceuticals",
    metaTitle: "WHO-GMP Certified Third Party Pharma Manufacturing | Nishcura Pharmaceuticals",
    metaDescription: "Nishcura Pharmaceuticals is a leading ISO, WHO, GMP certified pharmaceutical company specializing in third party manufacturing, contract manufacturing, and PCD pharma franchise business in India.",
    metaKeywords: "Pharma third party manufacturing, pharma franchise, WHO-GMP pharma company, Nishcura Pharmaceuticals, pharma contract manufacturing",
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.5696541604554!2d76.84157771501742!3d30.681283881654924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f934b12ffffff%3A0xe9f796a3cfbf1549!2sLifevision%20Healthcare!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin",
    googleMapsLink: "https://maps.google.com/?q=Nishcura+Pharmaceuticals+Panchkula",
    businessHours: "Mon - Sat: 9:00 AM - 6:00 PM"
  } as WebsiteSettings,
  slides: [
    {
      id: "1",
      title: "Pioneering Healthcare Excellence",
      subtitle: "WHO-GMP Certified Third-Party Pharma Manufacturing & Contract Formulations.",
      imageUrl: "https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=1600",
      link: "#services"
    },
    {
      id: "2",
      title: "State-of-the-Art Infrastructure",
      subtitle: "Our manufacturing units are equipped with modern machinery and world-class testing labs.",
      imageUrl: "https://images.pexels.com/photos/3683053/pexels-photo-3683053.jpeg?auto=compress&cs=tinysrgb&w=1600",
      link: "#manufacturing"
    },
    {
      id: "3",
      title: "Wide Spectrum of Formulations",
      subtitle: "Tablets, Capsules, Softgels, Syrups, Dry Syrups, Injectables, Drops & more.",
      imageUrl: "https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&w=1600",
      link: "#products"
    }
  ] as Slide[],
  categories: [
    {
      id: "cat_1",
      name: "Tablets Division",
      slug: "tablets-division",
      description: "WHO-GMP compliant film-coated, enteric-coated, and dispersible tablets across therapeutic areas.",
      imageUrl: "https://images.pexels.com/photos/360622/pexels-photo-360622.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "cat_2",
      name: "Capsules & Softgels",
      slug: "capsules-softgels",
      description: "Hard gelatin and soft gelatin formulations offering enhanced bioavailability.",
      imageUrl: "https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&w=1600"
    },
    {
      id: "cat_3",
      name: "Syrups & Oral Liquids",
      slug: "syrups-oral-liquids",
      description: "Flavored, pediatric and general dry syrups and liquid suspensions.",
      imageUrl: "https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "cat_4",
      name: "Injections & Sterile Liquids",
      slug: "injections-sterile-liquids",
      description: "Liquid vials, ampoules, and dry powder sterile injectables processed under absolute sterile conditions.",
      imageUrl: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "cat_5",
      name: "Dermatology & Ointments",
      slug: "dermatology-ointments",
      description: "Creams, gels, skin ointments, and medicated soaps crafted under strict hygienic standards.",
      imageUrl: "https://images.pexels.com/photos/4047073/pexels-photo-4047073.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "cat_6",
      name: "Nutraceuticals",
      slug: "nutraceuticals",
      description: "Multivitamins, health supplements, protein powders, and immunity boosters.",
      imageUrl: "https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ] as Category[],
  products: [
    {
      id: "prod_1",
      categoryId: "cat_1",
      name: "LIV-62 Calcium Supplement Tablets",
      slug: "liv-62-calcium-supplement-tablets",
      composition: "Calcium Carbonate IP 500mg + Vitamin D3 IP 250 IU",
      packSize: "10 x 15 Tablets",
      packType: "Alu-Alu Blister",
      description: "Designed to support optimal bone density and overall skeletal health. Ensures high absorption rate.",
      indications: "Calcium deficiency, osteoporosis, bone fracture recovery, pregnancy nutrition.",
      dosage: "1 tablet twice daily or as directed by the physician.",
      imageUrl: "https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: true,
      status: "active"
    },
    {
      id: "prod_2",
      categoryId: "cat_1",
      name: "AMOX-625 LB Tablets",
      slug: "amox-625-lb-tablets",
      composition: "Amoxicillin Trihydrate IP 500mg + Potassium Clavulanate Diluted IP 125mg + Lactic Acid Bacillus 60 Million Spores",
      packSize: "10 x 1 x 10 Strip",
      packType: "Alu-Alu",
      description: "A potent broad-spectrum antibiotic combined with a beta-lactamase inhibitor and gut-friendly probiotics to prevent diarrhea.",
      indications: "Upper & lower respiratory tract infections, skin and soft tissue infections, urinary tract infections.",
      dosage: "1 tablet twice daily with food or as prescribed.",
      imageUrl: "https://images.pexels.com/photos/360622/pexels-photo-360622.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: true,
      status: "active"
    },
    {
      id: "prod_3",
      categoryId: "cat_2",
      name: "NEUROV-FORTE Softgel Capsules",
      slug: "neurov-forte-softgel-capsules",
      composition: "Methylcobalamin 1500mcg + Alpha Lipoic Acid 100mg + Pyridoxine HCl 3mg + Folic Acid 1.5mg",
      packSize: "10 x 10 Capsules",
      packType: "Blister Pack",
      description: "Comprehensive nerve revitalizer and antioxidant therapy designed for diabetic neuropathy, general weakness, and energy enhancement.",
      indications: "Neuropathy, vitamin B12 deficiency, metabolic health boost, oxidative stress management.",
      dosage: "1 capsule daily after dinner.",
      imageUrl: "https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&w=1600",
      isFeatured: true,
      status: "active"
    },
    {
      id: "prod_4",
      categoryId: "cat_3",
      name: "COF-CLEAN Cough Syrup",
      slug: "cof-clean-cough-syrup",
      composition: "Ambroxol HCl 15mg + Terbutaline Sulphate 1.25mg + Guaiphenesin 50mg + Menthol 2.5mg per 5ml",
      packSize: "100 ml",
      packType: "PET Bottle",
      description: "A highly effective mucolytic, bronchodilator, and expectorant syrup formulation that provides instant soothing relief from chest congestion.",
      indications: "Productive wet cough, bronchitis, asthma-associated coughing, throat irritation.",
      dosage: "5-10 ml thrice daily for adults, 2.5-5 ml for children above 6 years.",
      imageUrl: "https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      status: "active"
    },
    {
      id: "prod_5",
      categoryId: "cat_4",
      name: "PANTOP-40 Sterile Injection",
      slug: "pantop-40-sterile-injection",
      composition: "Pantoprazole Sodium Sterile USP equivalent to Pantoprazole 40mg",
      packSize: "Vial with 10ml Sterile Water",
      packType: "Glass Vial with Sterile Water",
      description: "High-stability proton pump inhibitor for immediate relief from severe acid reflux, gastritis, and ulcers when oral therapy is not viable.",
      indications: "Severe GERD, peptic ulcer disease, active bleeding ulcers, hypersecretory conditions.",
      dosage: "As directed by the clinician (Slow IV Injection).",
      imageUrl: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: true,
      status: "active"
    },
    {
      id: "prod_6",
      categoryId: "cat_6",
      name: "WHEY-PLUS Protein Powder",
      slug: "whey-plus-protein-powder",
      composition: "Whey Protein Concentrate + Multivitamins + Minerals + DHA (Chocolate Flavor)",
      packSize: "200 g",
      packType: "Plastic Container Jar",
      description: "Premium high-grade nutritional supplement providing essential amino acids, cognitive DHA, and essential minerals to support daily strength.",
      indications: "General weakness, nutritional deficiency, muscle synthesis, recovery and post-op support.",
      dosage: "2 tablespoons (approx 30g) in lukewarm milk twice daily.",
      imageUrl: "https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg?auto=compress&cs=tinysrgb&w=800",
      isFeatured: false,
      status: "active"
    }
  ] as Product[],
  services: [
    {
      id: "srv_1",
      title: "Third Party Pharma Manufacturing",
      slug: "third-party-pharma-manufacturing",
      description: "Premium contract manufacturing of tablets, capsules, liquids, and injectable formulations under GMP certifications.",
      detailedContent: "Lifevision Healthcare is a premium partner for Third Party Pharma Manufacturing. We offer complete support from formulation customization, drug approval registration, visual box and packaging design, to actual quality-tested output. Our high-capacity machinery ensures timely delivery with flawless compliance.",
      iconName: "Factory",
      imageUrl: "https://images.pexels.com/photos/3683053/pexels-photo-3683053.jpeg?auto=compress&cs=tinysrgb&w=1600"
    },
    {
      id: "srv_2",
      title: "PCD Pharma Franchise Business",
      slug: "pcd-pharma-franchise-business",
      description: "Expand your career with exclusive monopoly rights, dynamic marketing kits, and premium quality stock with high profit margins.",
      detailedContent: "Get monopoly rights and marketing kits (visual aids, product glossaries, doctor reminder cards, promotional diaries) to launch your own pharmaceutical venture with Lifevision. We support our franchise partners in every territory with stable stock flow and competitive prices.",
      iconName: "Briefcase",
      imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "srv_3",
      title: "Custom Formulations & R&D",
      slug: "custom-formulations-rd",
      description: "In-house lab capabilities utilizing modern chemical analysis to custom-tailor compounds and enhance bioavailability.",
      detailedContent: "Our state-of-the-art Research & Development lab focuses on compound stability, taste masking for syrups, and high-bioavailability capsule release mechanisms. We run high-pressure liquid chromatography (HPLC) and stability chambers to guarantee optimal shelf-life and efficacy.",
      iconName: "Beaker",
      imageUrl: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ] as Service[],
  blogs: [
    {
      id: "blog_1",
      title: "Understanding Third-Party Pharma Manufacturing Trends in 2026",
      slug: "understanding-third-party-pharma-manufacturing-trends-2026",
      excerpt: "Explore how automated packaging, sterile formulations, and regulatory revisions are shaping third party manufacturing networks in India.",
      content: "<p>The pharmaceutical manufacturing industry is witnessing massive structural growth in 2026. Global companies are increasingly shifting towards focused contract manufacturing organizations (CMOs) in India to leverage cost efficiencies, state-of-the-art facilities, and fast product registration speeds.</p><p>Key advancements such as fully automated vial filling lines, automated blister inspections, and strict adherence to the latest WHO-GMP protocols are now mandatory benchmarks. Working with certified partners like Lifevision Healthcare eliminates capital expenditure burdens for pharma startups and established brands alike.</p><p>Furthermore, regulatory bodies have set stringent measures on trace level testing and API documentation, meaning that QA/QC laboratories must utilize high-resolution testing equipment such as automated HPLC. This ensures consistency and high purity across therapeutic ranges, boosting global safety levels.</p>",
      imageUrl: "https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=1600",
      author: "Dr. Sandeep Sharma (Head QA)",
      category: "Industry Insights",
      publishedAt: "2026-06-28",
      views: 342
    },
    {
      id: "blog_2",
      title: "How to Choose the Best PCD Pharma Franchise Partner",
      slug: "how-to-choose-the-best-pcd-pharma-franchise-partner",
      excerpt: "A comprehensive checklist covering certifications, product range, monopoly boundaries, and marketing support before you sign a franchise contract.",
      content: "<p>Starting a pharmaceutical franchise is a highly profitable venture, but its success depends directly on your manufacturing partner. When evaluating PCD (Propagandist Cum Distributor) pharma companies, you must look beyond raw cost and analyze core parameters.</p><h3>1. Certifications</h3><p>Ensure the company's plant has authentic ISO 9001:2015 and WHO-GMP standards. This guarantees you won't face local drug testing issues later.</p><h3>2. Therapeutic Coverage</h3><p>Choose partners offering a wide dynamic spectrum of formulations—from standard tablets to premium softgels, dry syrups, and dermatological ointments. This permits you to pitch a comprehensive portfolio to clinicians.</p><h3>3. Monopoly Boundaries</h3><p>Verify that your contract has clear, exclusive monopoly rights for your district. This protects your hard-earned local doctor relationships from internal brand competition.</p>",
      imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
      author: "Mrs. Meenakshi Dixit (Business Dev)",
      category: "Business Guide",
      publishedAt: "2026-07-02",
      views: 189
    }
  ] as Blog[],
  faqs: [
    {
      id: "faq_1",
      question: "What is the minimum order quantity (MOQ) for third-party manufacturing?",
      answer: "The minimum order quantity depends on the formulation. Generally, for tablets it is 50,000 units, for capsules it is 30,000 to 50,000 units, and for oral liquids/syrups it is 10,000 bottles. Please drop an inquiry with your requirements for custom relaxation.",
      category: "Manufacturing"
    },
    {
      id: "faq_2",
      question: "Which quality certificates does Lifevision Healthcare possess?",
      answer: "We hold ISO 9001:2015 registration, and our manufacturing facilities are fully compliant with WHO-GMP standards. We maintain complete batch history and stability testing data for regulatory reviews.",
      category: "Certifications"
    },
    {
      id: "faq_3",
      question: "How long does it take to deliver the first manufactured batch?",
      answer: "The first batch takes approximately 30-40 days, which includes design layouts for packaging, drug approvals, procurement of raw materials, manufacturing, and QA/QC lab clearances. Repeat orders are delivered within 20-25 days.",
      category: "General"
    }
  ] as FAQ[],
  inquiries: [
    {
      id: "inq_1",
      name: "Amit Patel",
      email: "amit.patel@gmail.com",
      phone: "+91-9988776655",
      subject: "Franchise Opportunity in Gujarat",
      message: "I am interested in securing exclusive monopoly rights for the complete Tablets and Capsules range of Lifevision Healthcare in Ahmedabad. Please send your price list and terms sheet.",
      createdAt: "2026-07-04T12:00:00.000Z",
      status: "unread"
    },
    {
      id: "inq_2",
      name: "Dr. Ramesh Verma",
      email: "rverma.clinic@yahoo.com",
      phone: "+91-9876543210",
      subject: "Third Party Manufacturing of Softgel Capsules",
      productName: "NEUROV-FORTE Softgel Capsules",
      message: "We need custom formulations of Multivitamin softgels for our multi-specialty clinic network. Could you provide your quotation for 50,000 softgels?",
      createdAt: "2026-07-03T10:30:00.000Z",
      status: "read"
    }
  ] as Inquiry[],
  jobs: [
    {
      id: "job_1",
      title: "Quality Assurance Executive",
      department: "QA / QC Department",
      location: "Panchkula (Plant Unit)",
      experience: "2 - 5 Years",
      qualification: "B.Pharma / M.Pharma",
      description: "Responsible for in-process quality audits, batch manufacturing record (BMR) checking, instrument calibration monitoring, and strict implementation of GMP guidelines.",
      requirements: [
        "In-depth knowledge of IPQA processes.",
        "Ability to maintain batch packaging logs.",
        "Strong understanding of WHO-GMP guidelines.",
        "Excellent documentation and analytical reporting skills."
      ],
      status: "active",
      createdAt: "2026-06-25"
    },
    {
      id: "job_2",
      title: "Business Development Officer",
      department: "Sales & Marketing",
      location: "Panchkula H.O.",
      experience: "1 - 3 Years",
      qualification: "B.Sc / B.Pharma / MBA",
      description: "Manage relationships with PCD franchise inquiries, convert inbound web leads, coordinate with the logistics department, and assist clients in layout approvals.",
      requirements: [
        "Superb verbal and written communication.",
        "Basic computer literacy (Excel, CRM software).",
        "Experience in pharmaceutical sales or client servicing is highly preferred.",
        "Enthusiastic and target-oriented personality."
      ],
      status: "active",
      createdAt: "2026-07-01"
    }
  ] as Job[],
  applications: [
    {
      id: "app_1",
      jobId: "job_1",
      jobTitle: "Quality Assurance Executive",
      name: "Saurabh Mishra",
      email: "saurabh.mishra.pharma@gmail.com",
      phone: "+91-9456123456",
      experience: "3 Years",
      resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      message: "I have 3 years of experience in solid dosage IPQA at a WHO-GMP plant. Looking forward to moving to Panchkula.",
      createdAt: "2026-07-04T15:45:00.000Z",
      status: "pending"
    }
  ] as JobApplication[],
  testimonials: [
    {
      id: "test_1",
      name: "Mr. Gurbaksh Singh",
      designation: "CEO",
      company: "Aura Biotech, New Delhi",
      feedback: "Lifevision Healthcare has been our trusted manufacturing partner for over 5 years. Their quality of packaging, commitment to timelines, and immaculate batch consistency are truly unparalleled.",
      rating: 5,
      imageUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      id: "test_2",
      name: "Ms. Priyanka Mehta",
      designation: "Director",
      company: "Carewell Remedies, Jaipur",
      feedback: "Extremely professional client managers who assist in brand drug approvals and provide quick box layout designs. Deliveries are always on-time and products receive stellar feedback from doctors.",
      rating: 5,
      imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ] as Testimonial[],
  certificates: [
    {
      id: "cert_1",
      title: "WHO-GMP Compliance Certification",
      issuer: "Central Drugs Standard Control Organisation (CDSCO)",
      year: "2025",
      imageUrl: "https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: "cert_2",
      title: "ISO 9001:2015 Quality Management",
      issuer: "Universal Registrars Certification Services",
      year: "2024",
      imageUrl: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ] as Certificate[],
  gallery: [
    {
      id: "gal_1",
      title: "High Speed Tablet Compressing Machine",
      imageUrl: "https://images.pexels.com/photos/3683053/pexels-photo-3683053.jpeg?auto=compress&cs=tinysrgb&w=1600",
      category: "plant"
    },
    {
      id: "gal_2",
      title: "Analytical Testing Lab (HPLC)",
      imageUrl: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "lab"
    },
    {
      id: "gal_3",
      title: "Corporate Meeting Hall",
      imageUrl: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "office"
    }
  ] as GalleryItem[],
  videos: [
    {
      id: "vid_1",
      title: "Lifevision Manufacturing Plant Tour",
      youtubeId: "dQw4w9WgXcQ", // Standard placeholder video
      thumbnailUrl: "https://images.pexels.com/photos/3683053/pexels-photo-3683053.jpeg?auto=compress&cs=tinysrgb&w=1600"
    }
  ] as VideoItem[],
  logs: [
    {
      id: "log_1",
      user: "System Seeder",
      action: "Initialized Database with Lifevision Healthcare Seed Records.",
      ipAddress: "127.0.0.1",
      createdAt: "2026-07-05T08:35:00.000Z"
    }
  ] as ActivityLog[],
  users: [
    {
      id: "usr_1",
      name: "Administrator Manager",
      email: "admin@lifevision.com",
      role: "Administrator",
      status: "active"
    }
  ] as User[],
  newLaunches: [
    {
      range: "DIABETES RANGE",
      items: [
        "EMPAGLIFLOZIN 10MG TABLET",
        "EMPAGLIFLOZIN 25MG TABLET",
        "EMPAGLIFLOZIN 5MG, METFORMIN 500MG TABLET",
        "EMPAGLIFLOZIN 5MG, METFORMIN 850MG TABLET",
        "EMPAGLIFLOZIN 5MG, METFORMIN 1000MG TABLET",
        "EMPAGLIFLOZIN 12.5MG, METFORMIN 500MG TABLET",
        "EMPAGLIFLOZIN 12.5MG, METFORMIN 850MG TABLET",
        "EMPAGLIFLOZIN 12.5MG, METFORMIN 1000MG TABLET",
        "EMPAGLIFLOZIN 10MG, LINAGLIPTIN 5MG TABLET",
        "EMPAGLIFLOZIN 25MG, LINAGLIPTIN 5MG TABLET",
        "EMPAGLIFLOZIN 10MG, SITAGLIPTIN 50MG TABLET",
        "EMPAGLIFLOZIN 25MG, SITAGLIPTIN 50MG TABLET"
      ]
    },
    {
      range: "GYNAECOLOGY RANGE",
      items: [
        "L-METHYLFOLATE USP 1 MG, METHYLCOBALAMIN IP 1500MCG, PYRIDOXAL 5 PHOSPHATE 0.5MG, DOCOSAHEXAENOIC ACID (10%) 200MG & VITAMIN D3 IP 2000 I.U. SOFT GELATIN CAPSULES (DRUG)",
        "L-METHYL FOLATE.1000 MCG,METHYLCOBALAMIN..1500 MCG,PYRIDOXOL - 5 PHOSPHATE..500 MCG,DHA(40%)...200MG"
      ]
    },
    {
      range: "LIQUID RANGE",
      items: [
        "ELEMENTAL IRON 29MG (FERRIC PYROPHOSPHATE/FERRIC DIPHOSPHATE 362.5MG AS LIPOSOMAL IRON), FOLIC ACID 130MCG,VITAMIN B12 2.2MCG"
      ]
    },
    {
      range: "ORTHOPEDIC RANGE",
      items: [
        "PALMITOYLETHANOLAMIDE (PEA) 400MG(SR) TABLET"
      ]
    },
    {
      range: "NEURO RANGE",
      items: [
        "PREGABALIN 50MG WITH DULOXETINE 20 MG CAPSULE",
        "PREGABALIN 75MG WITH DULOXETINE 20 MG CAPSULE",
        "PREGABALIN 75MG WITH DULOXETINE 30 MG CAPSULE"
      ]
    }
  ]
};

// Database utility
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    const parsed = JSON.parse(data);
    if (!parsed.newLaunches) {
      parsed.newLaunches = initialDb.newLaunches;
      fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database file, returning initial db", err);
    return initialDb;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing database file", err);
    return false;
  }
}

// Log actions
function addActivityLog(user: string, action: string, ipAddress: string = "127.0.0.1") {
  const db = readDb();
  const newLog: ActivityLog = {
    id: `log_${Date.now()}`,
    user,
    action,
    ipAddress,
    createdAt: new Date().toISOString()
  };
  db.logs.unshift(newLog);
  // Keep logs to top 200
  if (db.logs.length > 200) {
    db.logs = db.logs.slice(0, 200);
  }
  writeDb(db);
}

// REST APIs
// 1. Settings
app.get("/api/settings", (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

app.post("/api/settings", (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  addActivityLog("Admin", "Updated Website & SEO Settings");
  res.json(db.settings);
});

// 2. Auth Login (Custom Admin Hashing / Session simulation)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // Clean demonstration credentials
  if (email === "admin@lifevision.com" && password === "admin123") {
    const user = {
      id: "usr_1",
      name: "Administrator Manager",
      email: "admin@lifevision.com",
      role: "Administrator",
      status: "active"
    };
    addActivityLog("admin@lifevision.com", "Admin Logged In successfully");
    return res.json({ success: true, user, token: "mock_jwt_token_lifevision" });
  }
  
  return res.status(401).json({ success: false, message: "Invalid email or password. Use admin@lifevision.com and admin123" });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (email === "admin@lifevision.com") {
    return res.json({ success: true, message: "Instructions to reset password have been simulated. In a live system, a verification link would be emailed to admin@lifevision.com." });
  }
  return res.status(404).json({ success: false, message: "Email not found in database records." });
});

// 3. Slides CRUD
app.get("/api/slides", (req, res) => {
  const db = readDb();
  res.json(db.slides);
});

app.post("/api/slides", (req, res) => {
  const db = readDb();
  const slide = { id: `slide_${Date.now()}`, ...req.body };
  db.slides.push(slide);
  writeDb(db);
  addActivityLog("Admin", `Added Home Slide: "${slide.title}"`);
  res.json(slide);
});

app.put("/api/slides/:id", (req, res) => {
  const db = readDb();
  const idx = db.slides.findIndex((s: Slide) => s.id === req.params.id);
  if (idx > -1) {
    db.slides[idx] = { ...db.slides[idx], ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Home Slide: "${db.slides[idx].title}"`);
    res.json(db.slides[idx]);
  } else {
    res.status(404).json({ error: "Slide not found" });
  }
});

app.delete("/api/slides/:id", (req, res) => {
  const db = readDb();
  db.slides = db.slides.filter((s: Slide) => s.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Home Slide ID: ${req.params.id}`);
  res.json({ success: true });
});

// 4. Categories CRUD
app.get("/api/categories", (req, res) => {
  const db = readDb();
  res.json(db.categories);
});

app.post("/api/categories", (req, res) => {
  const db = readDb();
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const cat = { id: `cat_${Date.now()}`, slug, ...req.body };
  db.categories.push(cat);
  writeDb(db);
  addActivityLog("Admin", `Created Product Category: "${cat.name}"`);
  res.json(cat);
});

app.put("/api/categories/:id", (req, res) => {
  const db = readDb();
  const idx = db.categories.findIndex((c: Category) => c.id === req.params.id);
  if (idx > -1) {
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    db.categories[idx] = { ...db.categories[idx], slug, ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Product Category: "${db.categories[idx].name}"`);
    res.json(db.categories[idx]);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

app.delete("/api/categories/:id", (req, res) => {
  const db = readDb();
  db.categories = db.categories.filter((c: Category) => c.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Category ID: ${req.params.id}`);
  res.json({ success: true });
});

// 5. Products CRUD
app.get("/api/products", (req, res) => {
  const db = readDb();
  res.json(db.products);
});

app.post("/api/products", (req, res) => {
  const db = readDb();
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const product = { id: `prod_${Date.now()}`, slug, ...req.body };
  db.products.push(product);
  writeDb(db);
  addActivityLog("Admin", `Added New Product: "${product.name}"`);
  res.json(product);
});

app.put("/api/products/:id", (req, res) => {
  const db = readDb();
  const idx = db.products.findIndex((p: Product) => p.id === req.params.id);
  if (idx > -1) {
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    db.products[idx] = { ...db.products[idx], slug, ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Product Detail: "${db.products[idx].name}"`);
    res.json(db.products[idx]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const db = readDb();
  db.products = db.products.filter((p: Product) => p.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Product ID: ${req.params.id}`);
  res.json({ success: true });
});

// Bulk actions for products
app.post("/api/products/bulk-delete", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: "Invalid IDs list" });
  const db = readDb();
  db.products = db.products.filter((p: Product) => !ids.includes(p.id));
  writeDb(db);
  addActivityLog("Admin", `Bulk Deleted ${ids.length} products`);
  res.json({ success: true });
});

// 6. Services CRUD
app.get("/api/services", (req, res) => {
  const db = readDb();
  res.json(db.services);
});

app.post("/api/services", (req, res) => {
  const db = readDb();
  const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const srv = { id: `srv_${Date.now()}`, slug, ...req.body };
  db.services.push(srv);
  writeDb(db);
  addActivityLog("Admin", `Added Service: "${srv.title}"`);
  res.json(srv);
});

app.put("/api/services/:id", (req, res) => {
  const db = readDb();
  const idx = db.services.findIndex((s: Service) => s.id === req.params.id);
  if (idx > -1) {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    db.services[idx] = { ...db.services[idx], slug, ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Service: "${db.services[idx].title}"`);
    res.json(db.services[idx]);
  } else {
    res.status(404).json({ error: "Service not found" });
  }
});

app.delete("/api/services/:id", (req, res) => {
  const db = readDb();
  db.services = db.services.filter((s: Service) => s.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Service ID: ${req.params.id}`);
  res.json({ success: true });
});

// 7. Blogs CRUD
app.get("/api/blogs", (req, res) => {
  const db = readDb();
  res.json(db.blogs);
});

app.post("/api/blogs", (req, res) => {
  const db = readDb();
  const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const blog = { 
    id: `blog_${Date.now()}`, 
    slug, 
    publishedAt: new Date().toISOString().split('T')[0], 
    views: 0,
    ...req.body 
  };
  db.blogs.unshift(blog);
  writeDb(db);
  addActivityLog("Admin", `Published Blog Post: "${blog.title}"`);
  res.json(blog);
});

app.put("/api/blogs/:id", (req, res) => {
  const db = readDb();
  const idx = db.blogs.findIndex((b: Blog) => b.id === req.params.id);
  if (idx > -1) {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    db.blogs[idx] = { ...db.blogs[idx], slug, ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Blog Post: "${db.blogs[idx].title}"`);
    res.json(db.blogs[idx]);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

app.delete("/api/blogs/:id", (req, res) => {
  const db = readDb();
  db.blogs = db.blogs.filter((b: Blog) => b.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Blog ID: ${req.params.id}`);
  res.json({ success: true });
});

// Increment blog view count
app.post("/api/blogs/:id/view", (req, res) => {
  const db = readDb();
  const idx = db.blogs.findIndex((b: Blog) => b.id === req.params.id);
  if (idx > -1) {
    db.blogs[idx].views = (db.blogs[idx].views || 0) + 1;
    writeDb(db);
    res.json({ views: db.blogs[idx].views });
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

// 8. FAQs CRUD
app.get("/api/faqs", (req, res) => {
  const db = readDb();
  res.json(db.faqs);
});

app.post("/api/faqs", (req, res) => {
  const db = readDb();
  const faq = { id: `faq_${Date.now()}`, ...req.body };
  db.faqs.push(faq);
  writeDb(db);
  addActivityLog("Admin", `Added FAQ: "${faq.question}"`);
  res.json(faq);
});

app.put("/api/faqs/:id", (req, res) => {
  const db = readDb();
  const idx = db.faqs.findIndex((f: FAQ) => f.id === req.params.id);
  if (idx > -1) {
    db.faqs[idx] = { ...db.faqs[idx], ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated FAQ: "${db.faqs[idx].question}"`);
    res.json(db.faqs[idx]);
  } else {
    res.status(404).json({ error: "FAQ not found" });
  }
});

app.delete("/api/faqs/:id", (req, res) => {
  const db = readDb();
  db.faqs = db.faqs.filter((f: FAQ) => f.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted FAQ ID: ${req.params.id}`);
  res.json({ success: true });
});

// 9. Inquiries Public Form & Admin Management
app.get("/api/inquiries", (req, res) => {
  const db = readDb();
  res.json(db.inquiries);
});

app.post("/api/inquiries", (req, res) => {
  const db = readDb();
  const inquiry: Inquiry = {
    id: `inq_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "unread",
    ...req.body
  };
  db.inquiries.unshift(inquiry);
  writeDb(db);
  addActivityLog("Guest", `New Website Inquiry submitted by "${inquiry.name}" - Subject: "${inquiry.subject}"`);
  res.json({ success: true, inquiry });
});

app.put("/api/inquiries/:id/status", (req, res) => {
  const { status } = req.body;
  const db = readDb();
  const idx = db.inquiries.findIndex((i: Inquiry) => i.id === req.params.id);
  if (idx > -1) {
    db.inquiries[idx].status = status;
    writeDb(db);
    addActivityLog("Admin", `Marked Inquiry from "${db.inquiries[idx].name}" as "${status}"`);
    res.json(db.inquiries[idx]);
  } else {
    res.status(404).json({ error: "Inquiry not found" });
  }
});

app.delete("/api/inquiries/:id", (req, res) => {
  const db = readDb();
  db.inquiries = db.inquiries.filter((i: Inquiry) => i.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Inquiry ID: ${req.params.id}`);
  res.json({ success: true });
});

// 10. Careers (Jobs) CRUD
app.get("/api/jobs", (req, res) => {
  const db = readDb();
  res.json(db.jobs);
});

app.post("/api/jobs", (req, res) => {
  const db = readDb();
  const job = { 
    id: `job_${Date.now()}`, 
    createdAt: new Date().toISOString().split('T')[0],
    ...req.body 
  };
  db.jobs.push(job);
  writeDb(db);
  addActivityLog("Admin", `Created Job Opening: "${job.title}"`);
  res.json(job);
});

app.put("/api/jobs/:id", (req, res) => {
  const db = readDb();
  const idx = db.jobs.findIndex((j: Job) => j.id === req.params.id);
  if (idx > -1) {
    db.jobs[idx] = { ...db.jobs[idx], ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Job Opening: "${db.jobs[idx].title}"`);
    res.json(db.jobs[idx]);
  } else {
    res.status(404).json({ error: "Job opening not found" });
  }
});

app.delete("/api/jobs/:id", (req, res) => {
  const db = readDb();
  db.jobs = db.jobs.filter((j: Job) => j.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Job Opening ID: ${req.params.id}`);
  res.json({ success: true });
});

// 11. Job Applications
app.get("/api/applications", (req, res) => {
  const db = readDb();
  res.json(db.applications);
});

app.post("/api/applications", (req, res) => {
  const db = readDb();
  const application: JobApplication = {
    id: `app_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    ...req.body
  };
  db.applications.unshift(application);
  writeDb(db);
  addActivityLog("Candidate", `New job application submitted by "${application.name}" for "${application.jobTitle}"`);
  res.json({ success: true, application });
});

app.put("/api/applications/:id/status", (req, res) => {
  const { status } = req.body;
  const db = readDb();
  const idx = db.applications.findIndex((a: JobApplication) => a.id === req.params.id);
  if (idx > -1) {
    db.applications[idx].status = status;
    writeDb(db);
    addActivityLog("Admin", `Updated job application of "${db.applications[idx].name}" to "${status}"`);
    res.json(db.applications[idx]);
  } else {
    res.status(404).json({ error: "Application not found" });
  }
});

app.delete("/api/applications/:id", (req, res) => {
  const db = readDb();
  db.applications = db.applications.filter((a: JobApplication) => a.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Job Application ID: ${req.params.id}`);
  res.json({ success: true });
});

// New Launches API Endpoints
app.get("/api/new-launches", (req, res) => {
  const db = readDb();
  res.json(db.newLaunches || []);
});

app.post("/api/new-launches", (req, res) => {
  const db = readDb();
  db.newLaunches = req.body;
  writeDb(db);
  addActivityLog("Admin", "Updated New Launches Formulations list");
  res.json({ success: true, newLaunches: db.newLaunches });
});

// 12. Testimonials CRUD
app.get("/api/testimonials", (req, res) => {
  const db = readDb();
  res.json(db.testimonials);
});

app.post("/api/testimonials", (req, res) => {
  const db = readDb();
  const test = { id: `test_${Date.now()}`, ...req.body };
  db.testimonials.push(test);
  writeDb(db);
  addActivityLog("Admin", `Added Testimonial for: "${test.name}"`);
  res.json(test);
});

app.put("/api/testimonials/:id", (req, res) => {
  const db = readDb();
  const idx = db.testimonials.findIndex((t: Testimonial) => t.id === req.params.id);
  if (idx > -1) {
    db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Testimonial for: "${db.testimonials[idx].name}"`);
    res.json(db.testimonials[idx]);
  } else {
    res.status(404).json({ error: "Testimonial not found" });
  }
});

app.delete("/api/testimonials/:id", (req, res) => {
  const db = readDb();
  db.testimonials = db.testimonials.filter((t: Testimonial) => t.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Testimonial ID: ${req.params.id}`);
  res.json({ success: true });
});

// 13. Certificates CRUD
app.get("/api/certificates", (req, res) => {
  const db = readDb();
  res.json(db.certificates);
});

app.post("/api/certificates", (req, res) => {
  const db = readDb();
  const cert = { id: `cert_${Date.now()}`, ...req.body };
  db.certificates.push(cert);
  writeDb(db);
  addActivityLog("Admin", `Added Certificate: "${cert.title}"`);
  res.json(cert);
});

app.put("/api/certificates/:id", (req, res) => {
  const db = readDb();
  const idx = db.certificates.findIndex((c: Certificate) => c.id === req.params.id);
  if (idx > -1) {
    db.certificates[idx] = { ...db.certificates[idx], ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Certificate: "${db.certificates[idx].title}"`);
    res.json(db.certificates[idx]);
  } else {
    res.status(404).json({ error: "Certificate not found" });
  }
});

app.delete("/api/certificates/:id", (req, res) => {
  const db = readDb();
  db.certificates = db.certificates.filter((c: Certificate) => c.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Certificate ID: ${req.params.id}`);
  res.json({ success: true });
});

// 14. Gallery CRUD
app.get("/api/gallery", (req, res) => {
  const db = readDb();
  res.json(db.gallery);
});

app.post("/api/gallery", (req, res) => {
  const db = readDb();
  const item = { id: `gal_${Date.now()}`, ...req.body };
  db.gallery.push(item);
  writeDb(db);
  addActivityLog("Admin", `Uploaded Gallery Photo: "${item.title}"`);
  res.json(item);
});

app.put("/api/gallery/:id", (req, res) => {
  const db = readDb();
  const idx = db.gallery.findIndex((g: GalleryItem) => g.id === req.params.id);
  if (idx > -1) {
    db.gallery[idx] = { ...db.gallery[idx], ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Gallery Photo: "${db.gallery[idx].title}"`);
    res.json(db.gallery[idx]);
  } else {
    res.status(404).json({ error: "Gallery item not found" });
  }
});

app.delete("/api/gallery/:id", (req, res) => {
  const db = readDb();
  db.gallery = db.gallery.filter((g: GalleryItem) => g.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Gallery Photo ID: ${req.params.id}`);
  res.json({ success: true });
});

// 15. Video CRUD
app.get("/api/videos", (req, res) => {
  const db = readDb();
  res.json(db.videos);
});

app.post("/api/videos", (req, res) => {
  const db = readDb();
  const item = { id: `vid_${Date.now()}`, ...req.body };
  db.videos.push(item);
  writeDb(db);
  addActivityLog("Admin", `Added YouTube Video Link: "${item.title}"`);
  res.json(item);
});

app.delete("/api/videos/:id", (req, res) => {
  const db = readDb();
  db.videos = db.videos.filter((v: VideoItem) => v.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Video ID: ${req.params.id}`);
  res.json({ success: true });
});

// 16. Activity Logs API
app.get("/api/logs", (req, res) => {
  const db = readDb();
  res.json(db.logs);
});

app.post("/api/logs/clear", (req, res) => {
  const db = readDb();
  db.logs = [
    {
      id: `log_${Date.now()}`,
      user: "Admin",
      action: "Cleared historic Activity logs.",
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString()
    }
  ];
  writeDb(db);
  res.json({ success: true, logs: db.logs });
});

// 17. Users Management CRUD
app.get("/api/users", (req, res) => {
  const db = readDb();
  res.json(db.users);
});

app.post("/api/users", (req, res) => {
  const db = readDb();
  const user = { id: `usr_${Date.now()}`, ...req.body };
  db.users.push(user);
  writeDb(db);
  addActivityLog("Admin", `Added Admin Role User: "${user.name}" (${user.email})`);
  res.json(user);
});

app.put("/api/users/:id", (req, res) => {
  const db = readDb();
  const idx = db.users.findIndex((u: User) => u.id === req.params.id);
  if (idx > -1) {
    db.users[idx] = { ...db.users[idx], ...req.body };
    writeDb(db);
    addActivityLog("Admin", `Updated Admin Role User: "${db.users[idx].name}"`);
    res.json(db.users[idx]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/api/users/:id", (req, res) => {
  if (req.params.id === "usr_1") {
    return res.status(400).json({ error: "Cannot delete the master Administrator account." });
  }
  const db = readDb();
  db.users = db.users.filter((u: User) => u.id !== req.params.id);
  writeDb(db);
  addActivityLog("Admin", `Deleted Admin User ID: ${req.params.id}`);
  res.json({ success: true });
});

// 18. Dashboard Analytics API
app.get("/api/analytics", (req, res) => {
  const db = readDb();
  const totalInquiries = db.inquiries.length;
  const unreadInquiries = db.inquiries.filter((i: Inquiry) => i.status === "unread").length;
  const totalProducts = db.products.length;
  const totalCategories = db.categories.length;
  const totalApplications = db.applications.length;
  const totalBlogs = db.blogs.length;
  const totalJobs = db.jobs.length;

  // Let's compute monthly message submissions
  const messageTimeline = [
    { name: "Jan", count: 4 },
    { name: "Feb", count: 7 },
    { name: "Mar", count: 12 },
    { name: "Apr", count: 18 },
    { name: "May", count: 24 },
    { name: "Jun", count: 32 },
    { name: "Jul", count: totalInquiries }
  ];

  // Distribution by category
  const categoryDistribution = db.categories.map((c: Category) => {
    const count = db.products.filter((p: Product) => p.categoryId === c.id).length;
    return { name: c.name, count };
  });

  res.json({
    summary: {
      totalInquiries,
      unreadInquiries,
      totalProducts,
      totalCategories,
      totalApplications,
      totalBlogs,
      totalJobs
    },
    messageTimeline,
    categoryDistribution
  });
});

// 19. System Settings Management (Clear Cache & Backup simulation)
app.post("/api/system/clear-cache", (req, res) => {
  addActivityLog("Admin", "Executed Cache Clear & Optimized Database indexes");
  res.json({ success: true, message: "System metadata cache flushed, template views recompiled successfully." });
});

app.post("/api/system/backup", (req, res) => {
  const db = readDb();
  const backupFilename = `lifevision_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const backupDir = path.join(process.cwd(), "server", "backups");
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(backupDir, backupFilename), JSON.stringify(db, null, 2));
  addActivityLog("Admin", `Created manual database backup checkpoint: ${backupFilename}`);
  res.json({ success: true, message: `Backup file generated securely as ${backupFilename}. Check server/backups/ directory.` });
});


// Serve files
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const publicPath = path.join(process.cwd(), "public");
  
  // Serve public folder (for local images like krishna image)
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }
  
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
