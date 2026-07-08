import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, Shield, Award, Users, CheckCircle, Clock, MapPin, 
  Phone, Mail, MessageSquare, Plus, ChevronRight, Play, Eye, 
  Download, HelpCircle, Briefcase, Calendar, Upload, Star, ChevronLeft,
  Building, ChevronDown, Check, Sparkles, Database, HeartPulse
} from "lucide-react";
import { 
  WebsiteSettings, Slide, Category, Product, Service, Blog, FAQ, 
  Inquiry, Job, JobApplication, Testimonial, Certificate, GalleryItem, 
  VideoItem 
} from "../types";
import { divisionsList, DivisionItem } from "../data/divisionsData";
const krishnaImg = "/src/assets/images/krishna_divine_1783492123098.jpg";

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val);
  } catch (e) {
    return val;
  }
}

interface FrontendProps {
  currentPath: string;
  onChangePath: (path: string) => void;
  settings: WebsiteSettings;
  slides: Slide[];
  categories: Category[];
  products: Product[];
  services: Service[];
  blogs: Blog[];
  faqs: FAQ[];
  jobs: Job[];
  testimonials: Testimonial[];
  certificates: Certificate[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  newLaunches?: any[];
  onOpenQuickInquiry: (productName?: string) => void;
}

export default function FrontendWebsite({
  currentPath,
  onChangePath,
  settings,
  slides,
  categories,
  products,
  services,
  blogs,
  faqs,
  jobs,
  testimonials,
  certificates,
  gallery,
  videos,
  newLaunches = [],
  onOpenQuickInquiry
}: FrontendProps) {
  // Extract route path and query parameters
  const [route, setRoute] = useState("home");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [newLaunchSearch, setNewLaunchSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null);

  // Form states
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactCity, setContactCity] = useState("");
  const [applicationForm, setApplicationForm] = useState({ name: "", email: "", phone: "", experience: "", message: "", resume: "" });
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [sidebarForm, setSidebarForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sidebarSuccess, setSidebarSuccess] = useState(false);
  const [divisionInquiryForm, setDivisionInquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [divisionInquirySuccess, setDivisionInquirySuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Facility Form/Tab states
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeSpecTab, setActiveSpecTab] = useState<string>("tablet");
  const [facilitySuccess, setFacilitySuccess] = useState(false);
  const [facilityForm, setFacilityForm] = useState({
    name: "",
    phone: "",
    email: "",
    productType: "Tablets",
    message: ""
  });

  const rangeItems = [
    {
      title: "Syrups",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
      categoryId: "cat_syrup",
    },
    {
      title: "Capsules",
      imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=400&auto=format&fit=crop",
      categoryId: "cat_capsule",
    },
    {
      title: "Tablets",
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=400&auto=format&fit=crop",
      categoryId: "cat_pharmatablets",
    },
    {
      title: "Nutraceuticals",
      imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop",
      categoryId: "cat_nutraceutical",
    },
    {
      title: "Injections",
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?q=80&w=400&auto=format&fit=crop",
      categoryId: "cat_pediatric",
    },
    {
      title: "Ointments",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop",
      categoryId: "cat_ointment",
    }
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const divisionsScrollRef = useRef<HTMLDivElement>(null);
  const clientsScrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    let animationFrameId: number;
    let isHovering = false;
    
    const scroll = () => {
      if (isHovering) return;
      if (container.scrollLeft >= (container.scrollWidth / 2)) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 0.8; // Smooth, slow continuous translation
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    container.scrollLeft = 0;
    animationFrameId = requestAnimationFrame(scroll);
    
    const handleMouseEnter = () => { isHovering = true; };
    const handleMouseLeave = () => { isHovering = false; animationFrameId = requestAnimationFrame(scroll); };
    
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [route]);

  // Divisions scroll effect
  useEffect(() => {
    const container = divisionsScrollRef.current;
    if (!container) return;
    
    let animationFrameId: number;
    let isHovering = false;
    
    const scroll = () => {
      if (isHovering) return;
      if (container.scrollLeft >= (container.scrollWidth / 2)) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 0.8;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    container.scrollLeft = 0;
    animationFrameId = requestAnimationFrame(scroll);
    
    const handleMouseEnter = () => { isHovering = true; };
    const handleMouseLeave = () => { isHovering = false; animationFrameId = requestAnimationFrame(scroll); };
    
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [route]);

  // Clients scroll effect
  useEffect(() => {
    const container = clientsScrollRef.current;
    if (!container) return;
    
    let animationFrameId: number;
    let isHovering = false;
    
    const scroll = () => {
      if (isHovering) return;
      if (container.scrollLeft >= (container.scrollWidth / 2)) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 0.8;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    container.scrollLeft = 0;
    animationFrameId = requestAnimationFrame(scroll);
    
    const handleMouseEnter = () => { isHovering = true; };
    const handleMouseLeave = () => { isHovering = false; animationFrameId = requestAnimationFrame(scroll); };
    
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [route]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -312, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 312, behavior: "smooth" });
    }
  };

  // Hero slider auto-transition
  useEffect(() => {
    if (route === "home" && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [route, slides]);

  // Handle route and query parameter extraction from path string (e.g., 'products?category=cat_1')
  useEffect(() => {
    const parts = currentPath.split("?");
    const viewName = parts[0];
    setRoute(viewName);

    if (parts[1]) {
      const params = new URLSearchParams(parts[1]);
      if (params.get("category")) {
        setSelectedCategoryId(params.get("category"));
      } else {
        setSelectedCategoryId(null);
      }
      if (params.get("search")) {
        setProductSearch(safeDecode(params.get("search") || ""));
      } else {
        setProductSearch("");
      }
      if (params.get("id")) {
        if (viewName === "product-details") {
          setSelectedProductId(params.get("id"));
        } else if (viewName === "blog-details") {
          setSelectedBlogId(params.get("id"));
        } else if (viewName === "divisions") {
          setSelectedDivisionId(params.get("id"));
        }
      } else {
        setSelectedDivisionId(null);
      }
    } else {
      setSelectedDivisionId(null);
      if (viewName === "products") {
        setSelectedCategoryId(null);
        setProductSearch("");
      }
    }

    // Scroll to top on route change instantly and set a short delay fallback to ensure full scroll completion
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 80);

    return () => clearTimeout(scrollTimer);
  }, [currentPath]);

  // Contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone || !contactForm.message) return;

    try {
      const finalMessage = contactCity 
        ? `City/Location: ${contactCity}\n\n${contactForm.message}`
        : contactForm.message;

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          subject: contactForm.subject || "General Inquiry",
          message: finalMessage
        })
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setContactCity("");
        setTimeout(() => setContactSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error submitting inquiry", err);
    }
  };

  // Job application submission
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob.id,
          jobTitle: selectedJob.title,
          name: applicationForm.name,
          email: applicationForm.email,
          phone: applicationForm.phone,
          experience: applicationForm.experience,
          resumeUrl: applicationForm.resume || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          message: applicationForm.message
        })
      });

      if (response.ok) {
        setApplicationSuccess(true);
        setApplicationForm({ name: "", email: "", phone: "", experience: "", message: "", resume: "" });
        setTimeout(() => {
          setApplicationSuccess(false);
          setSelectedJob(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Error applying for job", err);
    }
  };

  // Division franchise request submission
  const handleDivisionInquirySubmit = async (e: React.FormEvent, divisionName: string) => {
    e.preventDefault();
    if (!divisionInquiryForm.name || !divisionInquiryForm.email || !divisionInquiryForm.phone || !divisionInquiryForm.message) return;

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: divisionInquiryForm.name,
          email: divisionInquiryForm.email,
          phone: divisionInquiryForm.phone,
          subject: `PCD Franchise Request for ${divisionName}`,
          message: divisionInquiryForm.message
        })
      });

      if (response.ok) {
        setDivisionInquirySuccess(true);
        setDivisionInquiryForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setDivisionInquirySuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error submitting division franchise request", err);
    }
  };

  // Sidebar dynamic manufacturing enquiry submission
  const handleSidebarSubmit = async (e: React.FormEvent, productName: string) => {
    e.preventDefault();
    if (!sidebarForm.name || !sidebarForm.phone || !sidebarForm.email || !sidebarForm.message) return;

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sidebarForm.name,
          phone: sidebarForm.phone,
          email: sidebarForm.email,
          subject: `PCD & Third Party Manufacturing for ${productName}`,
          productName: productName,
          message: sidebarForm.message
        })
      });

      if (response.ok) {
        setSidebarSuccess(true);
        setSidebarForm({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setSidebarSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error submitting sidebar inquiry", err);
    }
  };

  // Facility form submission
  const handleFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFacilitySuccess(true);
    setTimeout(() => {
      setFacilityForm({ name: "", phone: "", email: "", productType: "Tablets", message: "" });
    }, 8000);
  };

  // Active blog details extraction
  const activeBlog = blogs.find(b => b.id === selectedBlogId);

  // Dynamic product detail page resolver
  const resolveProductDetails = (productIdOrName: string) => {
    if (!productIdOrName) return null;
    const decoded = safeDecode(productIdOrName);
    
    // Find in db first
    const dbProd = products.find(p => p.id === decoded || p.name.toLowerCase() === decoded.toLowerCase());
    
    let name = "";
    let composition = "";
    let categoryName = "";
    let packSize = "";
    let packType = "";
    let description = "";
    let image = "";
    
    if (dbProd) {
      name = dbProd.name;
      composition = dbProd.composition;
      packSize = dbProd.packSize || "10x10 Tablets";
      packType = dbProd.packType || "Alu-Alu";
      description = dbProd.description;
      image = dbProd.imageUrl;
      
      const dbCat = categories.find(c => c.id === dbProd.categoryId);
      categoryName = dbCat ? dbCat.name : "PHARMA TABLETS";
    } else {
      name = decoded;
      const lowerName = name.toLowerCase();
      
      if (lowerName.includes("empagliflozin")) {
        categoryName = "CARDIAC AND DIABETIC RANGE";
        packSize = "10x10 Tablets";
        packType = "Alu-Alu";
        
        if (lowerName.includes("metformin")) {
          composition = name;
          description = `${name} is a powerful dual-action anti-diabetic combination of Empagliflozin (SGLT2 inhibitor) and Metformin Hydrochloride (biguanide) designed to achieve superior glycemic control in adult patients with type 2 diabetes mellitus.`;
        } else if (lowerName.includes("linagliptin")) {
          composition = name;
          description = `${name} represents a synergistic combination of Empagliflozin (SGLT2 inhibitor) and Linagliptin (DPP-4 inhibitor) providing comprehensive dual pathway control for type 2 diabetes mellitus.`;
        } else if (lowerName.includes("sitagliptin")) {
          composition = name;
          description = `${name} combines Empagliflozin and Sitagliptin to deliver high-efficacy glycemic regulation and cardiovascular risk mitigation in type 2 diabetes.`;
        } else {
          composition = "Empagliflozin 10mg" + (lowerName.includes("25mg") ? " or 25mg" : "");
          description = "Empagliflozin 10 Mg Tablet can be used alone or in combination with other medications to treat type 2 diabetes mellitus. It helps regulate high blood sugar levels in diabetes, lowering the risk of significant consequences and preventing heart disease.";
        }
      } else if (lowerName.includes("methylfolate") || lowerName.includes("methyl folate")) {
        categoryName = "GYNAE PRODUCTS";
        packSize = "10x1x10 Capsules";
        packType = "Blister / Soft Gelatin";
        composition = name;
        description = "A premium prenatal and gestational health formulation featuring highly bioactive L-Methylfolate, Methylcobalamin, Pyridoxal 5-Phosphate, Docosahexaenoic Acid (DHA), and Vitamin D3 to support fetal neuro-development, prevent neural tube defects, and manage maternal anemia.";
      } else if (lowerName.includes("elemental iron") || lowerName.includes("iron")) {
        categoryName = "LIQUID RANGE";
        packSize = "200ml Bottle";
        packType = "PET Amber Bottle";
        composition = name;
        description = "Innovative liposomal iron suspension with unmatched absorption parameters, formulated to restore elemental iron and hemoglobin levels efficiently without metallic taste, gastric distress, or teeth staining.";
      } else if (lowerName.includes("palmitoylethanolamide") || lowerName.includes("pea")) {
        categoryName = "ORTHOPEDIC RANGE";
        packSize = "10x10 Tablets";
        packType = "Alu-Alu";
        composition = "Palmitoylethanolamide 400mg (SR)";
        description = "Sustained-release Palmitoylethanolamide (PEA) formulation targeting chronic pain, neuro-inflammation, neuropathic orthopedic concerns, joint degeneration, and persistent muscular pain pathways safely.";
      } else if (lowerName.includes("pregabalin")) {
        categoryName = "NEURO RANGE";
        packSize = "10x10 Capsules";
        packType = "Alu-Alu";
        composition = name;
        description = "Highly specialized neuropathic therapeutic pairing Pregabalin with Duloxetine, designed to synergistically manage moderate-to-severe diabetic neuropathic pain, fibromyalgia, and chronic general neuralgia.";
      } else {
        categoryName = "PHARMA TABLETS";
        packSize = "10x10 Tablets";
        packType = "Alu-Alu";
        composition = name;
        description = `${name} is an advanced formulation, produced at our WHO-GMP and ISO certified units under rigorous sterile environments to guarantee high therapeutic response and chemical purity.`;
      }
    }
    
    // Assign generic Unsplash images if no image exists
    if (!image) {
      const lowerCat = categoryName.toLowerCase();
      const lowerName = name.toLowerCase();
      
      if (
        lowerCat.includes("syrup") || 
        lowerCat.includes("liquid") || 
        lowerName.includes("syrup") || 
        lowerName.includes("liquid") || 
        lowerName.includes("suspension") || 
        lowerName.includes("iron")
      ) {
        // Liquids/Syrups/Suspension/Oral liquid
        image = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop"; // syrup amber bottle
      } else if (
        lowerCat.includes("capsule") || 
        lowerCat.includes("softgel") || 
        lowerCat.includes("gynae") || 
        lowerName.includes("capsule") || 
        lowerName.includes("softgel") || 
        lowerName.includes("gelatin")
      ) {
        // Capsules / Softgels / Gynaecology Prenatal formulations
        if (lowerName.includes("methylfolate") || lowerName.includes("folate")) {
          image = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=400&auto=format&fit=crop"; // softgel capsules
        } else if (lowerName.includes("pregabalin")) {
          image = "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=400&auto=format&fit=crop"; // red-white capsules
        } else {
          image = "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=400&auto=format&fit=crop"; // blister capsules
        }
      } else if (
        lowerCat.includes("diabetic") || 
        lowerCat.includes("cardiac") || 
        lowerName.includes("empagliflozin") || 
        lowerName.includes("metformin")
      ) {
        // Diabetic and Cardiac Tablet formulations
        if (lowerName.includes("metformin")) {
          if (lowerName.includes("500mg")) {
            image = "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=400&auto=format&fit=crop";
          } else if (lowerName.includes("850mg")) {
            image = "https://images.unsplash.com/photo-1628771065518-0d82f1116562?q=80&w=400&auto=format&fit=crop";
          } else {
            image = "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=400&auto=format&fit=crop";
          }
        } else if (lowerName.includes("linagliptin")) {
          image = "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=400&auto=format&fit=crop";
        } else if (lowerName.includes("sitagliptin")) {
          image = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop";
        } else {
          if (lowerName.includes("10mg")) {
            image = "https://images.unsplash.com/photo-1628771065518-0d82f1116562?q=80&w=400&auto=format&fit=crop";
          } else {
            image = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop";
          }
        }
      } else if (
        lowerName.includes("palmitoylethanolamide") || 
        lowerName.includes("pea") || 
        lowerCat.includes("ortho")
      ) {
        // Orthopedic / PEA formulation
        image = "https://images.unsplash.com/photo-1577403357331-5f33d79a2444?q=80&w=400&auto=format&fit=crop";
      } else if (
        lowerName.includes("pregabalin") || 
        lowerCat.includes("neuro")
      ) {
        // Neuro range capsules
        if (lowerName.includes("50mg")) {
          image = "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=400&auto=format&fit=crop";
        } else if (lowerName.includes("75mg")) {
          image = "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=400&auto=format&fit=crop";
        } else {
          image = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=400&auto=format&fit=crop";
        }
      } else {
        // Dynamic fallback based on character sum of product name to ensure unique visual identity per formulation
        const imageOptions = [
          "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1628771065518-0d82f1116562?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=400&auto=format&fit=crop"
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
          hash += name.charCodeAt(i);
        }
        image = imageOptions[hash % imageOptions.length];
      }
    }
    
    // Custom clinical content depending on category
    let usesList = ["This medication is used to treat type 2 diabetes mellitus"];
    let benefitsText = "";
    let sideEffectsIntro = "";
    let sideEffectsList = ["Nausea", "Vaginal yeast infection", "Increased thirst", "Hypoglycemia", "Nasopharyngitis", "Urinary tract infection", "Vomiting", "Constipation", "Polyuria", "Genital fungal infection"];
    let sideEffectsOutro = "Practicing proper hygiene can help prevent some fungal side effects. If any symptoms persist, contact your medical representative.";
    let howToTake = "Take this medication as advised by your doctor. Swallow it as a whole with a glass of water. Do not chew or crush. It can be taken with or without food, but it is recommended to take it at the same time each day.";
    let howItWorks = "This formulation belongs to a premium clinical therapeutic class. It acts on targeted physiological receptors to optimize clinical response and clear systemic blockages.";
    let precautions = [
      { title: "Alcohol", desc: "Consumption of alcohol is unsafe while taking this medication." },
      { title: "Pregnancy", desc: "Consult with your doctor before taking this medication as pregnancy guidelines apply." },
      { title: "Breastfeeding", desc: "This drug should only be used by lactating mothers if explicitly prescribed by a clinical supervisor." },
      { title: "Driving", desc: "Do not drive if you experience low alertness, dizziness, or vision fluctuations after consumption." },
      { title: "Kidney", desc: "Dosage adjustment may be needed for patients with moderate to severe renal impairment." },
      { title: "Liver", desc: "Use with caution in patients with hepatic concerns under active clinical supervision." }
    ];
    let relatedServices = [
      "EMPAGLIFLOZIN 10MG, LINAGLIPTIN 5MG TABLET",
      "EMPAGLIFLOZIN 25MG TABLET",
      "EMPAGLIFLOZIN 5MG, METFORMIN 500MG TABLET",
      "EMPAGLIFLOZIN 5MG, METFORMIN 850MG TABLET",
      "EMPAGLIFLOZIN 5MG, METFORMIN 1000MG TABLET"
    ];
    
    const lowerCategory = categoryName.toLowerCase();
    
    if (lowerCategory.includes("diabetic") || lowerCategory.includes("diabetes") || lowerCategory.includes("cardiac")) {
      usesList = [
        "This medication is used to treat type 2 diabetes mellitus",
        "Assists in lowering hemoglobin A1c (HbA1c) levels",
        "Reduces risks of chronic cardiovascular incidents in diabetic patients"
      ];
      benefitsText = "Empagliflozin 10 Mg Tablet helps control diabetes and keep blood sugar levels by slowing sugar absorption and increasing insulin sensitivity in the body. This medication does not create a quick fall in blood glucose or cause serious hypoglycemia. The sole suggested treatment for prediabetes is Jardiance 10 mg Tablet. Empagliflozin 10 Mg Tablet also helps to prevent significant diabetes consequences such as kidney damage (Diabetic Nephropathy), blindness (Diabetic Retinopathy), loss of sensation in the hands and feet (Diabetic Neuropathy), and even foot loss! Empagliflozin 10 Mg Tablet also reduces your risk of suffering a heart attack or stroke.";
      sideEffectsIntro = "As with other drugs, this one has certain side effects. These side effects do not require medical treatment and go away as fast as your body responds to the medicine. However, if you have these side effects, talk with your doctor and seek medical attention.";
      sideEffectsOutro = "It may cause the body to lose excess water. Drink plenty of drinks to stay hydrated and combat the medication's negative effects. Some persons may get fungal infections in their vaginal area. Practicing proper hygiene can help prevent this.";
      howToTake = "Take this medication as advised by your doctor. To get optimum results take this medication in the dose and duration as prescribed by your healthcare specialist. Do not chew or crush this medication, swallow this medication as a whole with a glass of water. You can take Empagliflozin 10 Mg Tablet with or without food but take it at a fixed time every day. Empagliflozin 10 Mg Tablet can be taken with or without meals at any time of day, but it is recommended that you take it at the same time each day. Your doctor will determine the dosage. Do not stop taking it without consulting your doctor. If you do, your blood sugar levels may rise, increasing your risk of serious problems such as kidney damage and blindness. This medication is merely part of a treatment plan that should include a nutritious diet, frequent exercise, and weight loss, as recommended by your doctor.";
      howItWorks = "This medication belongs to a class of medication known as anti-diabetic that works by removing excess sugar from your body through urine.";
    } else if (lowerCategory.includes("gynae")) {
      usesList = [
        "Treatment and prevention of pregnancy-induced folic acid and vitamin deficiencies",
        "Supports healthy fetal brain, spinal cord, and overall neuro-development",
        "Aids maternal red blood cell production to prevent gestational anemia"
      ];
      benefitsText = "This rich combination delivers crucial co-active nutrients that are highly bioavailable. L-Methylfolate avoids metabolic conversion blocks, ensuring optimal folate levels to protect against neural tube defects. Added DHA provides critical building blocks for fetal ocular and cerebral development, while Vitamin D3 maintains bone health and immunologic parameters during the entire gestational lifecycle.";
      sideEffectsIntro = "This nutritional medicine is highly safe and well-tolerated. Minor physiological transitions can occur initially as the body acclimates to active vitamin supplementation:";
      sideEffectsList = ["Mild nausea", "Minor abdominal flatulence", "Somnolence (slight sleepiness)", "Altered taste sensations", "Slight headache"];
      sideEffectsOutro = "Most symptoms disappear within 48 hours without any clinical intervention. Take with an evening meal to minimize initial gastrointestinal acclimation.";
      howToTake = "Take one softgel capsule daily, preferably after the heaviest meal of the day, or as directed by your obstetrician-gynecologist. Swallow whole with water. Do not break or chew the capsule.";
      howItWorks = "It works at the cellular level: L-Methylfolate acts as the direct cofactor for DNA synthesis and methylation pathways, while DHA incorporates into the phospholipid bilayers of fetal neural cells to optimize development.";
      relatedServices = [
        "L-METHYLFOLATE USP 1 MG, METHYLCOBALAMIN IP 1500MCG, PYRIDOXAL 5 PHOSPHATE 0.5MG, DOCOSAHEXAENOIC ACID (10%) 200MG & VITAMIN D3 IP 2000 I.U. SOFT GELATIN CAPSULES (DRUG)",
        "L-METHYL FOLATE.1000 MCG,METHYLCOBALAMIN..1500 MCG,PYRIDOXOL - 5 PHOSPHATE..500 MCG,DHA(40%)...200MG",
        "Saccharomyces Boulardii + Zinc Sachets"
      ];
    } else if (lowerCategory.includes("liquid") || lowerCategory.includes("syrup")) {
      usesList = [
        "Treats acute iron-deficiency anemia in children and adults",
        "Restores energy levels, hemoglobin count, and immune resilience",
        "Overcomes fatigue, focus deficits, and physiological exhaustion from low iron reserves"
      ];
      benefitsText = "Utilizing advanced liposomal encapsulation, the ferric pyrophosphate is shielded by a phospholipid bilayer. This prevents the iron from reacting with gastric tissues, completely eliminating the standard side-effects of iron syrups such as abdominal cramps, black stools, and teeth discoloration. It delivers a massive boost in systemic iron absorption rates.";
      sideEffectsIntro = "Liposomal iron formulations exhibit outstanding safety indexes. However, exceptionally sensitive systems might show:";
      sideEffectsList = ["Mild transient constipation", "Slight bloating", "Mild stomach discomfort"];
      sideEffectsOutro = "Stay well-hydrated. These minor digestive acclimations resolve quickly within a few days of consistent dosage.";
      howToTake = "Measure the exact liquid dosage as indicated by your clinical officer using the enclosed measuring cup. Shake the bottle vigorously before usage. Can be taken on an empty stomach or with meals.";
      howItWorks = "The liposomal structure matches cell membrane lipid bilayers, permitting direct absorption through microfold cells in the small intestine directly into lymphatic circulation, bypassing standard gastric absorption blocks.";
      relatedServices = [
        "ELEMENTAL IRON 29MG (FERRIC PYROPHOSPHATE/FERRIC DIPHOSPHATE 362.5MG AS LIPOSOMAL IRON), FOLIC ACID 130MCG,VITAMIN B12 2.2MCG",
        "Saccharomyces Boulardii + Zinc Sachets",
        "Deflazacort 6mg / 30mg Tablets"
      ];
    } else if (lowerCategory.includes("ortho")) {
      usesList = [
        "Sustained relief from chronic orthopedic inflammation, osteoarthritis, and joint pain",
        "Reduces neuro-inflammation and neuropathic sciatic and lumbago pain",
        "Mitigates chronic low-back pain and muscular fatigue pathways"
      ];
      benefitsText = "Palmitoylethanolamide (PEA) is an endogenous fatty acid amide belonging to the nuclear factor agonist class. By binding to peroxisome proliferator-activated receptor-alpha (PPAR-α), it acts as a potent biological mast cell stabilizer and microglia modulator, down-regulating inflammatory cytokines and providing profound sustained relief without the gastric toxicity of NSAIDs.";
      sideEffectsIntro = "PEA is a natural substance produced within the body and is remarkably safe with no documented severe toxicities. Extremely rare occurrences can include:";
      sideEffectsList = ["Mild nausea", "Transitory soft stool", "Slight skin flush"];
      sideEffectsOutro = "These are temporary reactions and require zero medical counter-action.";
      howToTake = "Swallow one sustained-release tablet daily with a main meal. Do not crush, cut, or dissolve the tablet, as this defeats the sustained-release polymer matrix formulation.";
      howItWorks = "It down-regulates hyperactive mast cells and glial cells that generate peripheral neuropathic pain signals, acting as an endogenous analgesic agent.";
      relatedServices = [
        "PALMITOYLETHANOLAMIDE (PEA) 400MG(SR) TABLET",
        "Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg",
        "Deflazacort 6mg / 30mg Tablets"
      ];
    } else if (lowerCategory.includes("neuro")) {
      usesList = [
        "Management of moderate-to-severe diabetic peripheral neuropathy",
        "Alleviates severe chronic fibromyalgia and burning/tingling neural pain",
        "Treats central neuropathic pain and generalized post-herpetic neuralgia"
      ];
      benefitsText = "Pregabalin acts on voltage-gated calcium channels to reduce the release of excitatory neurotransmitters like glutamate and substance P. Combined with Duloxetine, a potent serotonin-norepinephrine reuptake inhibitor (SNRI), it delivers a double-barreled effect that stops pain signals in the central nervous system, restoring physical mobility and sleep quality.";
      sideEffectsIntro = "Combined neural active agents can induce moderate neurological accommodations. Common mild reactions include:";
      sideEffectsList = ["Dizziness", "Somnolence / drowsiness", "Dry mouth", "Mild weight variation", "Blurred vision", "Mild fatigue"];
      sideEffectsOutro = "Avoid operating heavy machinery or driving until your personal physical response is fully cataloged. Symptoms typically fade within 1-2 weeks of consistent usage.";
      howToTake = "Take exactly as prescribed by your neurologist. Typically initiated as a single night capsule to minimize daytime sleepiness. Can be taken with or without food.";
      howItWorks = "By combining GABA-ergic calcium channel modulation with synaptic monoamine neurotransmitter reuptake blocks, it stabilizes hyper-excited nerve cells and strengthens natural descending pain-inhibitory pathways.";
      relatedServices = [
        "PREGABALIN 50MG WITH DULOXETINE 20 MG CAPSULE",
        "PREGABALIN 75MG WITH DULOXETINE 20 MG CAPSULE",
        "PREGABALIN 75MG WITH DULOXETINE 30 MG CAPSULE"
      ];
    }
    
    const filteredServices = relatedServices.filter(rs => {
      const lowerRs = rs.trim().toLowerCase();
      const lowerName = name.trim().toLowerCase();
      const lowerComp = composition.trim().toLowerCase();
      return lowerRs !== lowerName && lowerRs !== lowerComp;
    });
    
    return {
      name,
      composition,
      categoryName,
      packSize,
      packType,
      description,
      image,
      usesList,
      benefitsText,
      sideEffectsIntro,
      sideEffectsList,
      sideEffectsOutro,
      howToTake,
      howItWorks,
      precautions,
      relatedServices: filteredServices
    };
  };

  const resolvedProduct = resolveProductDetails(selectedProductId || "");

  // Active product details extraction (supporting both static database items and dynamically resolved new launch molecules)
  const activeProduct = products.find(p => p.id === selectedProductId) || (resolvedProduct ? {
    id: selectedProductId || "",
    name: resolvedProduct.name,
    composition: resolvedProduct.composition,
    categoryId: "cat_pharmatablets",
    packSize: resolvedProduct.packSize,
    packType: resolvedProduct.packType,
    description: resolvedProduct.description,
    imageUrl: resolvedProduct.image,
    indications: "",
    dosage: ""
  } as Product : undefined);

  // Local state for product-details sidebar inquiry form
  const [detailsForm, setDetailsForm] = useState({ name: "", email: "", city: "", contact: "", message: "" });
  const [detailsSuccess, setDetailsSuccess] = useState(false);

  const handleDetailsFormSubmit = async (e: React.FormEvent, prodName: string) => {
    e.preventDefault();
    if (!detailsForm.name || !detailsForm.email || !detailsForm.contact || !detailsForm.message) return;
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: detailsForm.name,
          email: detailsForm.email,
          phone: detailsForm.contact,
          subject: `PCD & Third Party Manufacturing for ${prodName}`,
          productName: prodName,
          message: `City: ${detailsForm.city || "Not Specified"}. Message: ${detailsForm.message}`
        })
      });
      if (response.ok) {
        setDetailsSuccess(true);
        setDetailsForm({ name: "", email: "", city: "", contact: "", message: "" });
        setTimeout(() => setDetailsSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error submitting details sidebar form", err);
    }
  };

  // Dynamic filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    const matchesSearch = productSearch 
      ? p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
        p.composition.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(productSearch.toLowerCase())
      : true;
    const matchesStatus = p.status === "active";
    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 leading-relaxed">
      
      {/* Global Dynamic Breadcrumbs Bar */}
      {route !== "home" && (
        <div className="bg-[#f5f8fa] border-b border-slate-200 py-3.5">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center flex-wrap gap-2 text-xs font-bold text-slate-500 font-sans">
            <span 
              onClick={() => {
                onChangePath("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} 
              className="hover:text-[#cc0000] cursor-pointer uppercase transition-colors"
            >
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[3]" />
            
            {/* Dynamic middle & end parts based on route */}
            {route === "about" && (
              <span className="text-slate-800 uppercase font-black">About Us</span>
            )}
            
            {route === "facility" && (
              <span className="text-slate-800 uppercase font-black">Our Facility</span>
            )}
            
            {route === "divisions" && (
              <span className="text-slate-800 uppercase font-black">Our Divisions</span>
            )}
            
            {route === "new-launches" && (
              <span className="text-slate-800 uppercase font-black">New Launches</span>
            )}
            
            {route === "contact" && (
              <span className="text-slate-800 uppercase font-black">Contact Us</span>
            )}
            
            {route === "products" && (
              <>
                <span 
                  onClick={() => {
                    onChangePath("products");
                    setSelectedCategoryId(null);
                    setProductSearch("");
                  }} 
                  className={`uppercase transition-colors hover:text-[#cc0000] cursor-pointer ${!selectedCategoryId && !productSearch ? "text-slate-800 font-black" : ""}`}
                >
                  Product Range
                </span>
                {selectedCategoryId && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[3]" />
                    <span className="text-slate-800 uppercase font-black">
                      {categories.find(c => c.id === selectedCategoryId)?.name || "Category"}
                    </span>
                  </>
                )}
                {!selectedCategoryId && productSearch && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[3]" />
                    <span className="text-slate-800 uppercase font-black">
                      Search: {productSearch}
                    </span>
                  </>
                )}
              </>
            )}
            
            {route === "product-details" && resolvedProduct && (
              <>
                <span 
                  onClick={() => onChangePath("products")} 
                  className="hover:text-[#cc0000] cursor-pointer uppercase transition-colors"
                >
                  Product Range
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[3]" />
                <span 
                  onClick={() => {
                    const dbProd = products.find(p => p.id === selectedProductId);
                    const cat = dbProd ? categories.find(c => c.id === dbProd.categoryId) : null;
                    if (cat) {
                      onChangePath(`products?category=${cat.id}`);
                    } else {
                      onChangePath("products");
                    }
                  }} 
                  className="hover:text-[#cc0000] cursor-pointer uppercase transition-colors"
                >
                  {resolvedProduct.categoryName}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[3]" />
                <span className="text-slate-800 uppercase font-black truncate max-w-[150px] sm:max-w-none">
                  {resolvedProduct.name}
                </span>
              </>
            )}
            
            {route === "blog-details" && activeBlog && (
              <>
                <span 
                  onClick={() => onChangePath("blogs")} 
                  className="hover:text-[#cc0000] cursor-pointer uppercase transition-colors"
                >
                  Blogs
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[3]" />
                <span className="text-slate-800 uppercase font-black truncate max-w-[200px] sm:max-w-none">
                  {activeBlog.title}
                </span>
              </>
            )}
            
            {route !== "about" && route !== "facility" && route !== "divisions" && route !== "new-launches" && route !== "contact" && route !== "products" && route !== "product-details" && route !== "blog-details" && (
              <span className="text-slate-800 uppercase font-black">
                {route.replace("-", " ")}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* 1. HOME VIEW */}
      {route === "home" && (
        <div className="animate-in fade-in duration-200">
          {/* Restored Hero Slider Block */}
          <div className="relative w-full h-[360px] sm:h-[460px] md:h-[560px] overflow-hidden bg-slate-950 select-none">
            {(slides.length > 0 ? slides : [
              {
                id: "slide_1",
                title: "PCD Pharma Franchise Company in India",
                description: "Get monopoly rights and premium promotion kits for your territory with WHO-GMP approved formulations.",
                imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop",
                linkUrl: "products"
              },
              {
                id: "slide_2",
                title: "Pharma Third Party Contract Manufacturing",
                description: "State-of-the-art sterile liquid, capsules, tablets, and syrup high-capacity production units in India.",
                imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?q=80&w=1200&auto=format&fit=crop",
                linkUrl: "facility"
              },
              {
                id: "slide_3",
                title: "WHO-GMP & ISO 9001:2015 Certified Units",
                description: "Dedicated sterile production facilities adhering to premium global pharmaceutical quality standards.",
                imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
                linkUrl: "quality"
              }
            ]).map((slide, idx) => (
              <div 
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${(slides.length > 0 ? slides : [1, 2, 3]).length === 1 ? "opacity-100 z-10" : (idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0")}`}
              >
                {/* Visual Backdrop Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-transparent z-10" />
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title} 
                  className="w-full h-full object-cover transform scale-100 transition-transform duration-[5000ms] ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center z-20 max-w-7xl mx-auto px-6 md:px-12 text-left">
                  <div className="max-w-2xl text-white space-y-4 md:space-y-6">
                    <span className="inline-block bg-[#ff7a22] text-white font-sans font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                      Lifevision Healthcare
                    </span>
                    <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-tight drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed drop-shadow-sm font-sans">
                      {slide.description}
                    </p>
                    <div className="flex gap-4 pt-2">
                      <button 
                        onClick={() => {
                          if (slide.linkUrl.startsWith("#")) {
                            const el = document.getElementById(slide.linkUrl.substring(1));
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          } else {
                            onChangePath(slide.linkUrl);
                          }
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-[11px] uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg cursor-pointer"
                      >
                        Explore More
                      </button>
                      <button 
                        onClick={() => onOpenQuickInquiry(slide.title)}
                        className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-[11px] uppercase tracking-wider px-6 py-3 rounded-xl border border-white/20 transition-all cursor-pointer"
                      >
                        Inquire Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Navigation Dots */}
            {(slides.length > 0 ? slides : [1, 2, 3]).length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {(slides.length > 0 ? slides : [1, 2, 3]).map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full border border-white/50 transition-all cursor-pointer ${idx === currentSlide ? "bg-white scale-125" : "bg-white/30"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Seamless Custom CSS Marquee Styling */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 35s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}} />

          {/* 1. Welcome Intro Section (At the very top) */}
          <section className="py-16 px-4 max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004a80] tracking-wide text-center uppercase mb-8 font-sans">
              WELCOME TO LIFEVISION HEALTHCARE
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-sans text-justify sm:text-center">
              <span onClick={() => onChangePath("services")} className="text-[#004a80] font-bold hover:underline cursor-pointer">PHARMA THIRD PARTY MANUFACTURING COMPANY</span> -Established in the year 2010, "Lifevision Healthcare", has achieved tremendous growth as most efficient manufacturer and supplier of high quality and safe to use Pharmaceutical Products. Due to our processing knowledge, we offering <span onClick={() => onChangePath("products?category=cat_pharmatablets")} className="text-[#004a80] font-bold hover:underline cursor-pointer">Pharmaceutical Tablets</span>, <span onClick={() => onChangePath("products?category=cat_capsule")} className="text-[#004a80] font-bold hover:underline cursor-pointer">Pharmaceutical Capsules</span> and Pharmaceutical Ointment. We have gained huge appreciation and acceptance in their market because we believe in providing only genuine products that are prepared from lab examined chemicals. Thus with these prospects, our offered medicines are known for high effectiveness, precise formulation and excellent finishing.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-sans text-justify sm:text-center">
              We have been widely appreciated by our clients as dependable business partner, which can guide them in the consumer markets with expertise and tenacity. We are a customer centric organization which can be clearly seen from the long term relations that we have established with our clients. Our infrastructure consists of a huge area which also has dedicated facilities for R&D, pilot and commercial operations. We use latest and most advance technology to optimize our fully equipped infrastructure and wide distribution network, which helps use to provide top notch products to client at right time to suffice the anticipations of consumers. So if you are looking for <span onClick={() => onChangePath("services")} className="text-[#004a80] font-bold hover:underline cursor-pointer">best third party pharma manufacturers in India</span> or <span onClick={() => onChangePath("services")} className="text-[#004a80] font-bold hover:underline cursor-pointer">PCD Pharma manufacturer</span> then contact <span onClick={() => onChangePath("contact")} className="text-[#004a80] font-bold hover:underline cursor-pointer">Life Vision Healthcare</span> Now.
            </p>
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => onChangePath("about")} 
                className="text-[#004a80] hover:underline flex items-center gap-1.5 cursor-pointer font-extrabold text-xs uppercase tracking-wider"
              >
                Read more <span className="text-xs">➔</span>
              </button>
            </div>
          </section>

          {/* Divine Inspiration & Blessings Section */}
          <section className="bg-gradient-to-br from-[#0c1a30] via-[#081225] to-[#040815] text-white py-16 px-4 border-y border-slate-900 shadow-inner relative overflow-hidden">
            {/* Ambient Celestial Backdrop Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Image Column */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative group max-w-[290px] sm:max-w-[330px] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] border-2 border-amber-400/30 hover:border-amber-400 transition-all duration-500 bg-slate-950">
                    <img 
                      src={krishnaImg} 
                      alt="Lord Krishna - Divine Source of Healing and Wellness" 
                      className="w-full h-auto object-cover transform hover:scale-[1.03] transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 text-center">
                      <span className="text-amber-300 font-sans font-black text-[10px] tracking-widest uppercase">
                        Our Guiding Light
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#ff7a22]/15 border border-[#ff7a22]/30 px-4 py-1.5 rounded-full text-[#ff7a22]">
                    <span className="w-2 h-2 rounded-full bg-[#ff7a22] animate-pulse"></span>
                    <span className="text-[10px] font-sans font-black uppercase tracking-widest">
                      Divine Inspiration & Blessings
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-amber-300 font-sans leading-tight">
                    HOLISTIC WELLNESS & DIVINE GRACE
                  </h2>
                  
                  <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed font-sans text-justify sm:text-left">
                    At <strong className="text-white">Lifevision Healthcare</strong>, we hold the conviction that healing and healthcare are sacred callings. While our laboratories excel in scientific precision and molecular perfection, we draw our deepest inspiration and spiritual energy from <strong className="text-[#ff7a22]">Lord Krishna</strong>, who epitomizes compassion, complete rejuvenation, and the divine harmony of life.
                  </p>

                  <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed font-sans text-justify sm:text-left">
                    Our commitment to offering pure chemicals, WHO-GMP-approved medicines, and state-of-the-art formulations is rooted in the philosophy of selfless service. Every drug manufactured in our sterile units is processed with the highest sense of dedication, hoping to bring robust health and divine solace to every patient.
                  </p>

                  <div className="border-l-4 border-amber-400 pl-4 py-2 bg-white/5 rounded-r-xl max-w-xl text-left">
                    <p className="text-amber-200 text-sm sm:text-base font-serif italic tracking-wide">
                      "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।"
                    </p>
                    <p className="text-slate-400 text-xs font-sans mt-1">
                      (May all beings be happy, may all be healthy and free from illness.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. OUR THIRD PARTY PHARMA MANUFACTURING RANGE (Product category sliding carousel with red see all buttons) */}
          <section className="bg-slate-50 py-16 border-y border-slate-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004a80] tracking-tight text-center mb-10 uppercase font-sans">
                OUR THIRD PARTY PHARMA MANUFACTURING RANGE
              </h2>
              
              <div className="relative group overflow-hidden">
                <div className="overflow-hidden flex">
                  <div className="animate-marquee flex gap-6 py-4">
                    {categories.concat(categories).map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => onChangePath(`products?category=${item.id}`)}
                        className="shrink-0 w-[240px] bg-[#f5f5f5] border border-slate-300 p-4 flex flex-col justify-between h-[340px] text-center shadow-sm cursor-pointer hover:bg-slate-100/80 transition-all group"
                      >
                        <div className="bg-white border border-slate-200 aspect-[4/3] flex items-center justify-center overflow-hidden mb-3">
                          <img 
                            src={item.imageUrl || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop"} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center">
                          <h3 className="font-sans font-bold text-[#004a80] group-hover:text-[#cc0000] text-xs uppercase tracking-wider mb-3 transition-colors text-center line-clamp-2">
                            {item.name}
                          </h3>
                        </div>
                        <div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onChangePath(`products?category=${item.id}`);
                            }}
                            className="w-full bg-[#cc0000] hover:bg-[#aa0000] text-white font-extrabold text-[11px] py-2.5 uppercase tracking-wider rounded-none cursor-pointer transition-colors shadow-md"
                          >
                            See all
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Circular Red Badges / Attributes Grid (Perfect Screenshot Replica) */}
          <section className="bg-white py-16 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[
                  {
                    title: "ISO 9001:2008 CERTIFIED",
                    desc: "Our manufacturing units are setup with most advanced concepts for convenient delivery of our developed quality drugs.",
                    icon: Shield
                  },
                  {
                    title: "OUR QUALITY APPROACH",
                    desc: "We ensure all products are processed under the most sterile and sanitary conditions adhering to strict industry parameters.",
                    icon: CheckCircle
                  },
                  {
                    title: "DEDICATED WORKFORCE",
                    desc: "Our team members are highly skilled and dedicated to deliver optimum quality pharmaceutical products on-time, every time.",
                    icon: Users
                  },
                  {
                    title: "ETHICS AND COMPLIANCE",
                    desc: "We believe in honest work ethics, complying with WHO-GMP cleanroom standards and state-of-the-art analytical checks.",
                    icon: Award
                  },
                  {
                    title: "AWARDS & ACHIEVEMENTS",
                    desc: "Recognized as the most trusted commercial manufacturer and PCD formulation pioneer in the Indian healthcare market.",
                    icon: Sparkles
                  },
                  {
                    title: "PACKAGING",
                    desc: "Our packaging is leak-proof, highly moisture-resistant, and climate-stable to maintain supreme efficacy profiles.",
                    icon: Building
                  }
                ].map((attr, index) => {
                  const IconComponent = attr.icon;
                  return (
                    <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 bg-[#fdfdfd] p-6 rounded-none shadow-sm border border-slate-200">
                      <div className="w-14 h-14 rounded-full bg-[#cc0000] text-white flex items-center justify-center shrink-0 shadow-md">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-sans font-black text-[#004a80] text-[13px] tracking-wider mb-2 uppercase">
                          {attr.title}
                        </h3>
                        <p className="text-slate-600 font-sans text-xs leading-relaxed">
                          {attr.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 4. Pharma Third Party Manufacturing Section with Progress Bars and Scientists */}
          <section className="bg-slate-50 py-16 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004a80] tracking-tight uppercase font-sans mb-6">
                    PHARMA THIRD PARTY MANUFACTURING
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 text-justify font-sans">
                    Our company is a well known <span onClick={() => onChangePath("services")} className="text-[#004a80] font-bold hover:underline cursor-pointer">pharma contract manufacturer</span> &amp; supplier in India for pharmaceuticals drugs. We have covered different market segments like tablets, capsules, softgels, powders, ointments etc. You will enjoy professional services. Our units have large scale production capacity, qualified manpower, best quality control staff, latest machines &amp; devices etc to meet the rising demand for better third party <span onClick={() => onChangePath("services")} className="text-[#004a80] font-bold hover:underline cursor-pointer">pharma manufacturing</span> services. We assure you quality deals for strategic partner who search for best manufacturing facilities.
                  </p>
                  <button 
                    onClick={() => onChangePath("about")}
                    className="text-[#004a80] hover:underline flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider"
                  >
                    Read more <span className="text-xs">➔</span>
                  </button>
                </div>

                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 border border-slate-200 rounded-none w-full">
                  {[
                    { label: "Product Efficiency", val: 97 },
                    { label: "Product Packing", val: 100 },
                    { label: "Customer Satisfaction", val: 98 },
                    { label: "Product Quality", val: 98 }
                  ].map((bar, bIdx) => (
                    <div key={bIdx} className="w-full">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-slate-800 font-sans font-extrabold text-[11px] uppercase tracking-wider">{bar.label}</span>
                        <span className="text-red-600 font-mono font-bold text-xs">{bar.val}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                        <div 
                          className="bg-[#004a80] h-full rounded-full transition-all duration-1000"
                          style={{ width: `${bar.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row of three lab scientists / plant images */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop",
                    alt: "Analytical Lab Testing"
                  },
                  {
                    url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=400&auto=format&fit=crop",
                    alt: "Pharma Sterile cleanroom"
                  },
                  {
                    url: "https://images.unsplash.com/photo-1582719471384-894fbb16e024?q=80&w=400&auto=format&fit=crop",
                    alt: "Finished Bulk Packaging"
                  }
                ].map((imgItem, iIdx) => (
                  <div key={iIdx} className="border border-slate-300 overflow-hidden shadow-sm rounded-none bg-slate-100 group">
                    <img 
                      src={imgItem.url} 
                      alt={imgItem.alt} 
                      className="w-full h-56 object-cover rounded-none transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Our Divisions Carousel (Continuous horizontal infinite loop scrolling right to left) */}
          <section className="bg-white py-16 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004a80] tracking-tight text-center mb-10 uppercase font-sans">
                OUR DIVISIONS
              </h2>
              
              <div className="relative group overflow-hidden">
                <div className="overflow-hidden flex">
                  <div className="animate-marquee flex gap-6 py-4">
                    {divisionsList.concat(divisionsList).map((divi, dIdx) => {
                      const styles = [
                        { bg: "bg-emerald-50 text-emerald-600", icon: "🍃" },
                        { bg: "bg-amber-50 text-amber-600", icon: "👶" },
                        { bg: "bg-rose-50 text-rose-500", icon: "🌸" },
                        { bg: "bg-blue-50 text-blue-600", icon: "💧" },
                        { bg: "bg-red-50 text-red-600", icon: "📈" }
                      ];
                      const style = styles[dIdx % styles.length];
                      return (
                        <div 
                          key={dIdx} 
                          onClick={() => {
                            onChangePath("divisions?id=" + divi.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="shrink-0 w-[260px] bg-[#f5f5f5] border border-slate-300 p-6 flex flex-col justify-between h-[300px] text-center shadow-sm cursor-pointer hover:bg-slate-100 transition-colors group"
                        >
                          <div className="flex-1 flex flex-col justify-center items-center">
                            <div className={`w-14 h-14 ${style.bg} rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner`}>
                              {style.icon}
                            </div>
                            <div className="font-sans font-black text-xs tracking-wider uppercase mb-2 text-[#004a80] group-hover:text-[#cc0000] transition-colors line-clamp-1">
                              {divi.name}
                            </div>
                            <div className="w-10 h-0.5 bg-[#cc0000] mb-3" />
                            <p className="text-slate-500 font-sans text-[11px] leading-relaxed max-w-[220px] line-clamp-3">
                              {divi.tagline}
                            </p>
                          </div>
                          <div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onChangePath("divisions?id=" + divi.id);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="w-full bg-[#cc0000] hover:bg-[#aa0000] text-white font-extrabold text-[10px] px-6 py-2.5 uppercase tracking-wider rounded-none cursor-pointer transition-colors shadow-md"
                            >
                              See Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Why Choose Us For Pharma Third Party Manufacturing Company in India (6 Boxes Grid) */}
          <section className="bg-slate-50 py-16 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#004a80] tracking-tight text-center mb-12 uppercase font-sans max-w-4xl mx-auto leading-snug">
                WHY CHOOSE US FOR PHARMA THIRD PARTY MANUFACTURING COMPANY IN INDIA
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Nature of Business", val: "Manufacturer", icon: Briefcase },
                  { label: "Total Number of Employees", val: "800 to 1200 People", icon: Users },
                  { label: "Year of Establishment", val: "2010", icon: Calendar },
                  { label: "Our Divisions", val: "8 Specialty Divisions", icon: Sparkles },
                  { label: "Annual Turnover", val: "Rs. 100 - 200 Crore", icon: Award },
                  { label: "GST No.", val: "04AADFL7870J1Z3", icon: Shield }
                ].map((stat, sIdx) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={sIdx}
                      className="border-2 border-[#00a0e9] p-6 flex flex-col items-center text-center rounded-none bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="w-14 h-14 bg-sky-50 text-[#00a0e9] rounded-full flex items-center justify-center mb-4 border border-sky-200">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-sans font-extrabold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                        {stat.label}
                      </h3>
                      <p className="font-sans font-extrabold text-[#004a80] text-base">
                        {stat.val}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 7. Google Reviews Section (Perfect Replica with Marquee Carousel) */}
          <section className="bg-white py-16 border-b border-slate-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004a80] tracking-tight text-center mb-12 uppercase font-sans">
                GOOGLE REVIEWS
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-center">
                {/* Left Column: Overall Rating Block */}
                <div className="col-span-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="font-sans font-extrabold text-slate-900 text-3xl tracking-tight mb-2">GOOD</div>
                  <div className="flex gap-1 mb-2">
                    <Star className="w-8 h-8 fill-current text-[#10b981]" />
                    <Star className="w-8 h-8 fill-current text-[#10b981]" />
                    <Star className="w-8 h-8 fill-current text-[#10b981]" />
                    <Star className="w-8 h-8 fill-current text-[#10b981]" />
                    <Star className="w-8 h-8 fill-current text-[#dadce0]" />
                  </div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Based on 78 REVIEWS</div>
                  
                  {/* Styled Google Wordmark */}
                  <div className="flex items-center justify-center gap-[1px] font-sans font-black text-4xl tracking-tighter select-none">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>
                </div>

                {/* Right Column: Marquee Infinite Review Slider */}
                <div className="lg:col-span-3 overflow-hidden w-full relative py-4">
                  {/* Left and Right Fade Gradients for Premium Visual Effect */}
                  <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                  
                  <div className="flex animate-marquee gap-6">
                    {[
                      {
                        name: "Tanisha Chawla",
                        time: "5 months ago",
                        feedback: "This user only left a rating.",
                        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Aman thakur",
                        time: "5 months ago",
                        feedback: "This user only left a rating.",
                        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Aman Thakur",
                        time: "5 months ago",
                        feedback: "This user only left a rating.",
                        avatarUrl: null
                      },
                      {
                        name: "Rajesh Kumar",
                        time: "4 months ago",
                        feedback: "Best WHO-GMP medicines franchise. Highly satisfied with their packaging.",
                        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Divya Sharma",
                        time: "2 months ago",
                        feedback: "Outstanding client management and helpful franchise promotional kit.",
                        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Sanjay Patel",
                        time: "1 month ago",
                        feedback: "Excellent third party manufacturing rates and fast shipment delivery.",
                        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
                      }
                    ].concat([
                      {
                        name: "Tanisha Chawla",
                        time: "5 months ago",
                        feedback: "This user only left a rating.",
                        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Aman thakur",
                        time: "5 months ago",
                        feedback: "This user only left a rating.",
                        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Aman Thakur",
                        time: "5 months ago",
                        feedback: "This user only left a rating.",
                        avatarUrl: null
                      },
                      {
                        name: "Rajesh Kumar",
                        time: "4 months ago",
                        feedback: "Best WHO-GMP medicines franchise. Highly satisfied with their packaging.",
                        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Divya Sharma",
                        time: "2 months ago",
                        feedback: "Outstanding client management and helpful franchise promotional kit.",
                        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        name: "Sanjay Patel",
                        time: "1 month ago",
                        feedback: "Excellent third party manufacturing rates and fast shipment delivery.",
                        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
                      }
                    ]).map((review, rIdx) => (
                      <div 
                        key={rIdx} 
                        className="shrink-0 w-[320px] sm:w-[350px] bg-white p-6 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between h-[190px] relative text-left"
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              {review.avatarUrl ? (
                                <img 
                                  src={review.avatarUrl} 
                                  alt={review.name} 
                                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-[#e0e0e0] flex items-center justify-center shrink-0 overflow-hidden">
                                  <svg className="w-8 h-8 text-[#bdbdbd]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <span className="font-sans font-extrabold text-slate-800 text-[13px] block leading-snug">
                                  {review.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                                  {review.time}
                                </span>
                              </div>
                            </div>
                            
                            {/* Colorful Google G Logo */}
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                          </div>
                          
                          {/* Stars Row with Verified Icon Badge */}
                          <div className="flex items-center gap-0.5 mb-2.5">
                            <div className="flex text-[#10b981] gap-0.5">
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-black ml-1.5 shrink-0" title="Verified Reviewer">
                              <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />
                            </span>
                          </div>
                          
                          {/* Feedback text */}
                          <p className="text-slate-600 text-xs sm:text-[13px] leading-normal font-sans">
                            {review.feedback}
                          </p>
                        </div>
                        
                        {/* Elegant Quote Icon Background */}
                        <div className="absolute bottom-2 right-4 text-slate-100 text-6xl font-serif select-none pointer-events-none leading-none">
                          “
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Our Third Party Pharma Manufacturing Clients Carousel (Horizontal Infinite Scroll Slider right to left) */}
          <section className="bg-slate-50 py-16 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004a80] tracking-tight text-center mb-10 uppercase font-sans">
                OUR THIRD PARTY PHARMA MANUFACTURING CLIENTS
              </h2>
              
              <div className="relative overflow-hidden">
                <div className="overflow-hidden flex">
                  <div className="animate-marquee flex gap-6 py-4">
                    {[
                      { name: "AASA PHARMA", color: "border-emerald-300 text-emerald-800", icon: "🌱" },
                      { name: "Aayu Medisciences", color: "border-slate-300 text-slate-800", icon: "🌿" },
                      { name: "ABAX ELIMER", color: "border-blue-300 text-blue-800", icon: "🧬" },
                      { name: "ABHINCO PHARMA", color: "border-orange-300 text-orange-800", icon: "🔶" },
                      { name: "SANOFI INDIA", color: "border-rose-300 text-rose-800", icon: "🧪" },
                      { name: "ARLAK BIOTECH", color: "border-teal-300 text-teal-800", icon: "🔬" }
                    ].concat([
                      { name: "AASA PHARMA", color: "border-emerald-300 text-emerald-800", icon: "🌱" },
                      { name: "Aayu Medisciences", color: "border-slate-300 text-slate-800", icon: "🌿" },
                      { name: "ABAX ELIMER", color: "border-blue-300 text-blue-800", icon: "🧬" },
                      { name: "ABHINCO PHARMA", color: "border-orange-300 text-orange-800", icon: "🔶" },
                      { name: "SANOFI INDIA", color: "border-rose-300 text-rose-800", icon: "🧪" },
                      { name: "ARLAK BIOTECH", color: "border-teal-300 text-teal-800", icon: "🔬" }
                    ]).map((client, cIdx) => (
                      <div 
                        key={cIdx} 
                        className={`shrink-0 w-[240px] bg-white border ${client.color} p-4 h-[100px] flex items-center gap-3 justify-center text-center shadow-sm rounded-none`}
                      >
                        <span className="text-xl">{client.icon}</span>
                        <span className="font-sans font-black text-slate-700 text-xs uppercase tracking-wider leading-snug">
                          {client.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Products Category Navigation Pills Grid */}
          <section className="bg-white py-16 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004a80] tracking-tight text-center mb-10 uppercase font-sans">
                Our Products Category
              </h2>
              
              <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
                <button 
                  onClick={() => onChangePath("products")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-4 py-2.5 uppercase tracking-wider rounded-none cursor-pointer shadow-md transition-colors"
                >
                  Top Products
                </button>

                {[
                  "Cosmetic Range",
                  "Pediatric Range",
                  "Cardiac & Diabetic Range",
                  "Dental Range",
                  "Antibiotics Range",
                  "Capsule Range",
                  "Pharma Tablets",
                  "PPI & Gastro Range",
                  "Nutraceutical Range",
                  "Gynae Products",
                  "Syrup Range",
                  "Softgel Range",
                  "Soft Gelatin Range",
                  "Sachet Range",
                  "Shot Range",
                  "Mouthwash Range",
                  "Gargle Range",
                  "Gum Paint Range",
                  "Nasal Spray Range",
                  "Oral Paste Range",
                  "Toothpaste Range",
                  "Drug Range",
                  "Food Range",
                  "Ointment Range",
                  "COVID-19 Range",
                  "Unique Molecules",
                  "Tablet & Capsule Section"
                ].map((rangeName, rIdx) => (
                  <button 
                    key={rIdx}
                    onClick={() => onChangePath(`products?search=${encodeURIComponent(rangeName)}`)}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px] px-4 py-2.5 uppercase tracking-wider rounded-none cursor-pointer transition-colors shadow-sm"
                  >
                    {rangeName}
                  </button>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}

      {/* 2. ABOUT VIEW */}
      {route === "about" && (
        <div className="animate-in fade-in duration-200 w-full bg-white">
          {/* Blue title banner */}
          <div className="bg-[#004a80] w-full py-6 text-center border-b border-slate-200">
            <h1 className="text-white font-extrabold text-xl md:text-2xl tracking-wider font-sans uppercase">
              ABOUT US
            </h1>
          </div>

          {/* Intro paragraph section */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify mb-6 font-sans">
              Endowed in 2010, &quot;Lifevision Healthcare&quot;, is the most reputed manufacturer and supplier of Pharmaceutical Products .With the purpose to make people's lives healthier we are dedicated to provide premium quality Pharmaceutical Tablets, Pharmaceutical Capsules and Pharmaceutical Ointment to our clients. Our products are prepared by using authorized technology and packaged under the sterile condition which are very effective and are offered at very affordable prices. Due to our diverse range of products and most affordable prices, we have created reputed in the market and also helped to build long term relationship with our clients.
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify mb-8 font-sans">
              Every day we make sure that we gain a huge client base and that is done with the help of team of skilled professionals who are specifically trained to analyze highly effective Pharmaceutical products. Our products are appreciated for purity, accurate composition, quick relief and long lasting effect owing to their testing that is carried under strict norms and parameters and also as per guidelines of the industry. Our skilled, manpower has expertise in the wide diversity of fields that makes them one of reason where we stand today. We focus on every parameter starting from procurement of products, to best possible technology.
            </p>
          </div>

          {/* WHY US? Section */}
          <div className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="text-left">
                <h2 className="text-2xl font-extrabold text-[#004a80] mb-6 tracking-wide uppercase font-sans">
                  WHY US?
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify mb-6 font-sans">
                  Our main focus is to produce cost effective, high quality and secure solutions to customers, to accomplish this goal we make use of the best of technology, methods, and personalities. Our innovative approaches and ideas and moreover our outstanding client assistance at every step is the intrigue behind the prestige of our brand. We work jointly with our clients to know and identify their needs and expectations. Apart from this we also have self assessment through a voluntary self audit of our operations in order to remain competitive in the market.
                </p>
                <h4 className="text-sm font-extrabold text-slate-800 mb-4 font-sans uppercase">
                  Parameters:
                </h4>
                <ul className="space-y-2 text-slate-500 text-sm md:text-base font-sans pl-1 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>High Quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Self Sufficient capacities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Impeccable supply chain efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Trust and Integrity</span>
                  </li>
                </ul>
              </div>

              {/* Right Column - Circular Infographic Loop */}
              <div className="flex justify-center items-center py-6">
                <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center rounded-full p-4 select-none">
                  
                  {/* Central Green Question Mark */}
                  <div className="z-10 bg-white border-2 border-slate-100 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                    <span className="text-[#5cd65c] text-6xl font-black font-sans">?</span>
                  </div>

                  {/* Bubble 1: We Listen (Top) */}
                  <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[120px] sm:w-[130px] text-center z-20">
                    <div className="bg-[#ff7a22] text-white py-2 px-3 rounded-2xl shadow-md border border-orange-400 relative">
                      <p className="font-extrabold text-xs sm:text-xs leading-tight">We Listen</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-90">Step 1</p>
                      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#ff7a22]" />
                    </div>
                  </div>

                  {/* Bubble 2: We Understand (Top Right) */}
                  <div className="absolute top-[22%] right-[2%] w-[120px] sm:w-[130px] text-center z-20">
                    <div className="bg-[#5cd65c] text-white py-2 px-3 rounded-2xl shadow-md border border-green-400 relative">
                      <p className="font-extrabold text-xs sm:text-xs leading-tight">We Understand</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-90">Step 2</p>
                      <div className="absolute bottom-[20%] left-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-[#5cd65c]" />
                    </div>
                  </div>

                  {/* Bubble 3: We Analyze (Bottom Right) */}
                  <div className="absolute bottom-[22%] right-[2%] w-[120px] sm:w-[130px] text-center z-20">
                    <div className="bg-[#0000ff] text-white py-2 px-3 rounded-2xl shadow-md border border-blue-500 relative">
                      <p className="font-extrabold text-xs sm:text-xs leading-tight">We Analyze</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-90">Step 3</p>
                      <div className="absolute top-[20%] left-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-[#0000ff]" />
                    </div>
                  </div>

                  {/* Bubble 4: We Discuss Solutions (Bottom) */}
                  <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[120px] sm:w-[130px] text-center z-20">
                    <div className="bg-[#ff1a75] text-white py-2 px-3 rounded-2xl shadow-md border border-pink-400 relative">
                      <p className="font-extrabold text-xs sm:text-xs leading-tight">We Discuss Solutions</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-90">Step 4</p>
                      <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#ff1a75]" />
                    </div>
                  </div>

                  {/* Bubble 5: We Execute (Bottom Left) */}
                  <div className="absolute bottom-[22%] left-[2%] w-[120px] sm:w-[130px] text-center z-20">
                    <div className="bg-[#732673] text-white py-2 px-3 rounded-2xl shadow-md border border-purple-500 relative">
                      <p className="font-extrabold text-xs sm:text-xs leading-tight">We Execute</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-90">Step 5</p>
                      <div className="absolute top-[20%] right-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-[#732673]" />
                    </div>
                  </div>

                  {/* Bubble 6: We Take Feedbacks (Top Left) */}
                  <div className="absolute top-[22%] left-[2%] w-[120px] sm:w-[130px] text-center z-20">
                    <div className="bg-[#00a2ff] text-white py-2 px-3 rounded-2xl shadow-md border border-sky-400 relative">
                      <p className="font-extrabold text-xs sm:text-xs leading-tight">We Take Feedbacks</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-90">Step 6</p>
                      <div className="absolute bottom-[20%] right-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-[#00a2ff]" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* OUR INFRASTRUCTURE Section */}
          <div className="bg-white border-t border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e024?q=80&w=800&auto=format&fit=crop" 
                  alt="Our advanced infrastructure and pharmaceutical laboratory"
                  className="w-full rounded-none shadow-md border border-slate-200 object-cover h-[320px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-extrabold text-[#004a80] mb-6 tracking-wide uppercase font-sans">
                  OUR INFRASTRUCTURE
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify font-sans">
                  We own an extreme infrastructure that is setup with the most advanced concept for convenient delivery of our developed quality drugs. Moreover, the quality control laboratory, packaging and shipping units are devised to regulate the goals and aspirations keeping in mind the standards of the Industry. Our infrastructure also compromises of research and development center where we carry out different researches to make sure that we delivery optimum quality products to our clients.
                </p>
              </div>
            </div>
          </div>

          {/* OUR TEAM Section */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-left">
              <h2 className="text-2xl font-extrabold text-[#004a80] mb-6 tracking-wide uppercase font-sans">
                OUR TEAM
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify font-sans">
                We have skilled pool of professionals and over the time we have earned a strong bond with them. Our team has helped us to answer the challenging requirements of our esteemed clients. On regular interval of time, we train our clients to enhance their skills and make them efficient so that they can cope up with changing competition in the market. Our team of professionals includes medical experts, quality controllers, R&D personnel and marketing and sales executives who work in closely with our clients to meet up their expectations.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 3. SERVICES VIEW */}
      {route === "services" && (
        <div className="animate-in fade-in duration-200 max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs tracking-widest font-bold text-brand-600 uppercase block mb-2">Our Services</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-900 tracking-tight">
              Pharma contractual formulations
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div key={srv.id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-md">
                <div className="bg-brand-50 text-brand-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Building className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-xl text-slate-900 mb-3">{srv.title}</h2>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">{srv.description}</p>
                <div className="bg-slate-50 p-4 rounded-xl text-[11px] text-slate-600 leading-normal border border-slate-100 mb-6">
                  {srv.detailedContent}
                </div>
                <button 
                  onClick={() => onOpenQuickInquiry(srv.title)}
                  className="w-full bg-brand-600 text-white font-semibold text-xs py-3 rounded-xl shadow-md hover:bg-brand-700 transition-colors cursor-pointer text-center"
                >
                  Submit Service Request
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PRODUCTS VIEW */}
      {route === "products" && (() => {
        const activeCategory = categories.find(c => c.id === selectedCategoryId);
        const activeCategoryName = activeCategory ? activeCategory.name : "All Divisions";

        // Helper to extract rich category SEO text dynamically
        const getCategorySEOContent = (catId: string | null) => {
          if (catId === "cat_syrup") {
            return {
              heading: "SYRUP THIRD PARTY MANUFACTURING COMPANY IN INDIA",
              intro: "Lifevision Healthcare is an ISO 9001:2015 certified pharmaceutical company specializing in high-quality oral liquid suspensions and syrups. We provide customized third-party contract manufacturing services to pharmaceutical brands, marketing groups, and distributors across India. Our state-of-the-art facilities use high-grade SS316 stainless steel mixing vessels, automatic filling lines, and rigorous quality inspection units to deliver superior oral liquid formulations.",
              benefitsHeading: "COMMON HEALTH BENEFITS OF LIFEVISION SYRUPS",
              benefitsList: [
                "Effective in cough, cold, chest congestion, and allergy relief with fast-acting bronchial relaxants.",
                "Pediatric ranges with delicious child-safe flavor-masking technologies.",
                "Supplements that restore digestive health, appetite, and gut-microflora.",
                "High bioavailability of multivitamins, trace minerals, and calcium complexes for standard systemic absorption."
              ],
              marketHeading: "MARKET SIZE OF PHARMA SYRUP IN INDIA",
              marketText: "The demand for liquid pharmaceutical formulations, particularly pediatric syrups, cough suppressants, and multivitamin tonics, has grown exponentially. Currently accounting for nearly 25% of the overall Indian pharmaceutical formulations market, the syrup segment is expected to grow at a CAGR of 8.4% through 2030, driven by the increasing need for convenient geriatric and pediatric drug delivery.",
              whyChoose: [
                "WHO-GMP Compliant Manufacturing Facilities.",
                "Sophisticated chemical and biological analytical testing.",
                "Elegant amber PET bottles preventing photo-degradation.",
                "On-time dispatch and competitive contract manufacturing prices."
              ],
              faqs: [
                { q: "What is the minimum order quantity (MOQ) for syrup manufacturing?", a: "Our standard starting MOQ for customized liquid syrups is 5,000 bottles per formulation." },
                { q: "Does Lifevision provide product registration and trademark support?", a: "Yes! We provide complete technical assistance for trademark registration, FSSAI licensing, and drug controller approval." }
              ]
            };
          } else if (catId === "cat_capsule") {
            return {
              heading: "CAPSULE THIRD PARTY MANUFACTURING COMPANY",
              intro: "We provide comprehensive contract manufacturing for both hard gelatin and softgel capsules. Our units are equipped with advanced automatic capsule filling machines, dehumidified storage zones, and specialized sorting systems.",
              benefitsHeading: "THERAPEUTIC ADVANTAGES OF CAPSULES",
              benefitsList: [
                "No unpleasant taste or odor from active pharmaceutical ingredients.",
                "Fast dissolution in the stomach resulting in quicker therapeutic effect.",
                "Superior protection for sensitive powdered formulations from moisture and air.",
                "Enables combination of incompatible drugs in a single pellet capsule."
              ],
              marketHeading: "GROWING MARKET DEMAND FOR CAPSULES",
              marketText: "Capsules are the second most popular solid oral dosage form globally. With the surging popularity of dietary supplements, sports nutrition, and preventative healthcare, the demand for herbal, vegetarian (HPMC), and soft gelatin capsules has experienced a massive CAGR of 9.2% in the domestic market.",
              whyChoose: [
                "Both gelatin and HPMC vegetarian options available.",
                "Advanced nitrogen-purged blister and alu-alu packaging.",
                "Strict weight-variation and dissolution tests for every batch.",
                "State-of-the-art climate-controlled production cleanrooms."
              ],
              faqs: [
                { q: "What is the typical lead time for capsule production?", a: "For new formulations, the first batch takes 25-30 days including raw material procurement and packaging approvals; repeat orders are delivered in 15-20 days." },
                { q: "Can we supply our own raw materials for manufacturing?", a: "Yes, we accept active ingredients from approved vendors, subject to rigorous standard laboratory testing." }
              ]
            };
          } else if (catId === "cat_pharmatablets") {
            return {
              heading: "TABLET CONTRACT MANUFACTURING SERVICES",
              intro: "Lifevision Healthcare is a leading tablet contract manufacturer. Our high-speed rotary compression machinery handles single-layered, bilayered, film-coated, enteric-coated, and mouth-dissolving tablet formulations with supreme quality control.",
              benefitsHeading: "QUALITY CRITERIA FOR TABLET COMPRESSION",
              benefitsList: [
                "Precise dose uniformity and chemical stability under extreme environmental stress.",
                "Controlled disintegrating properties customized for immediate or sustained drug release.",
                "Elegant coating styles protecting light-sensitive compounds and masking bitter taste.",
                "High fracture resistance preventing breakage during transport and retail handling."
              ],
              marketHeading: "TABLET COMPOSITION DOMINANCE IN PHARMACEUTICS",
              marketText: "Solid oral tablets remain the undisputed king of pharmaceutical delivery, holding over 55% of the total formulation market share in India. Their exceptional shelf life, dosage accuracy, and low manufacturing cost make them the first choice for both doctors and patients.",
              whyChoose: [
                "High-volume manufacturing capacity exceeding 1 million tablets daily.",
                "Custom embossing and coating options for brand identity.",
                "Alu-Alu and blister packaging configurations.",
                "NABL accredited laboratory validation of all active ingredients."
              ],
              faqs: [
                { q: "What types of tablet coatings do you offer?", a: "We offer aqueous coating, organic solvent-based coating, enteric coating, sugar coating, and sustained-release film coatings." },
                { q: "Is the tablet formulation optimized for dissolution?", a: "Absolutely. We test each formulation in simulated gastric and intestinal fluids to guarantee bio-equivalence." }
              ]
            };
          } else if (catId === "cat_nutraceutical") {
            return {
              heading: "NUTRACEUTICALS & DIETARY SUPPLEMENTS THIRD PARTY MANUFACTURING",
              intro: "We help brands manufacture top-selling dietary supplements, multivitamin blends, protein powders, and immunity support complexes. All our nutraceutical formulations are FSSAI-approved and made with pure, premium-grade extracts.",
              benefitsHeading: "WELLNESS IMPROVEMENTS WITH NUTRACEUTICALS",
              benefitsList: [
                "Combats nutritional deficiencies with highly absorbable vitamins and minerals.",
                "Supports preventive cardiovascular, joint, and nerve health.",
                "Boosts daily energy levels and systemic immunological resistance.",
                "Enhances metabolic rate and overall physiological homeostasis."
              ],
              marketHeading: "THE NUTRACEUTICAL BOOM IN THE INDIAN MARKET",
              marketText: "Driven by rising health awareness and preventative care post-pandemic, the Indian nutraceuticals market is currently valued at $4 Billion and is projected to reach $18 Billion by 2030, presenting an unparalleled opportunity for new and established brands.",
              whyChoose: [
                "FSSAI and GMP compliant separate manufacturing area.",
                "Sourcing of raw herbs and extracts with certified assay levels.",
                "Delicious fruit and chocolate flavors for powders and chewables.",
                "Attractive, modern retail-ready packaging designs (tins, jars, pouches)."
              ],
              faqs: [
                { q: "Do your nutraceuticals contain animal-derived ingredients?", a: "We provide both vegan/vegetarian (HPMC) and non-vegetarian (gelatin-based) product options depending on client specifications." },
                { q: "Do you assist with nutritional labeling compliance?", a: "Yes, our regulatory team handles all mandatory FSSAI labeling declarations and nutrition fact charting." }
              ]
            };
          }

          // Generic backup SEO info
          return {
            heading: `${activeCategoryName.toUpperCase()} THIRD PARTY MANUFACTURING COMPANY`,
            intro: `Lifevision Healthcare is your trusted partner for premium ${activeCategoryName} contract manufacturing. Our facility is equipped with certified machinery and skilled professionals ensuring your medical formulations are prepared, packed, and delivered to meet high regulatory and health parameters.`,
            benefitsHeading: `ADVANTAGES OF OUR ${activeCategoryName.toUpperCase()} RANGE`,
            benefitsList: [
              `Formulated using pure-grade raw materials sourced from audited vendors.`,
              `Manufactured under climate-controlled WHO-GMP guidelines.`,
              `Custom packaging options to keep the formulation stable and effective.`,
              `Subject to intensive analytical validation before dispatch.`
            ],
            marketHeading: "GROWING PHARMACEUTICAL DEMAND IN INDIA",
            marketText: "India is known as the pharmacy of the world. Partnering with a professional third-party manufacturer like Lifevision Healthcare allows brands to launch high-quality products quickly without incurring major capital costs on manufacturing units.",
            whyChoose: [
              "Fully certified state-of-the-art facilities.",
              "Fast product turnaround and secure distribution logistics.",
              "Complete licensing, trademark, and analytical support.",
              "High standard of customer service and business transparency."
            ],
            faqs: [
              { q: `What is the standard delivery timeline for the ${activeCategoryName} range?`, a: "First orders are completed within 25 to 30 days. Subsequent recurring orders can be filled and shipped in 15 to 20 days." },
              { q: "Do you supply testing certificates with the shipment?", a: "Yes, every batch is dispatched with a comprehensive Certificate of Analysis (COA) from our state-approved quality lab." }
            ]
          };
        };

        const seo = getCategorySEOContent(selectedCategoryId);

        return (
          <div className="animate-in fade-in duration-200 bg-slate-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              
              {/* Centered Page Title */}
              <div className="text-center mb-10 border-b border-slate-200 pb-8">
                <span className="text-xs tracking-widest font-extrabold text-[#cc0000] uppercase block mb-2">
                  {selectedCategoryId ? "Lifevision Product Division" : "Lifevision Group Portfolio"}
                </span>
                <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#004a80] tracking-tight uppercase leading-tight">
                  {selectedCategoryId ? `${activeCategoryName}` : "OUR THIRD PARTY PHARMA MANUFACTURING RANGE"}
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-2xl mx-auto font-sans leading-relaxed">
                  Explore approved commercial formulations, therapeutic segments, and full-scale WHO-GMP contract manufacturing facilities.
                </p>
              </div>

              {/* Main Sidebar Grid Block */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* LEFT MAIN AREA: Wide Product List Column */}
                <div className="lg:col-span-3 flex flex-col gap-8 order-1 lg:order-1">
                  
                  {/* Top Control Bar: Search & View Mode Switch */}
                  <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    {/* Catalog Search input with indicator */}
                    <div className="relative w-full sm:max-w-md">
                      <input 
                        type="text" 
                        placeholder="Search composition, formulation name..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full p-2.5 pl-9 rounded-none border border-slate-300 text-xs focus:outline-none focus:border-[#004a80] font-sans"
                      />
                      <span className="absolute left-3 top-3.5 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </span>
                      {productSearch && (
                        <button 
                          onClick={() => setProductSearch("")} 
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Interactive Tab Toggle Buttons */}
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${viewMode === "table" ? "bg-[#004a80] text-white border border-[#004a80]" : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"}`}
                      >
                        Table List
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${viewMode === "grid" ? "bg-[#004a80] text-white border border-[#004a80]" : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"}`}
                      >
                        Catalog Cards
                      </button>
                    </div>

                  </div>

                  {/* Dynamic Products Display */}
                  <div>
                    {filteredProducts.length === 0 ? (
                      <div className="bg-white border border-slate-200 p-12 text-center text-slate-500 font-sans text-xs">
                        No product formulations match the active segment or query parameters. Please refine your filter.
                      </div>
                    ) : viewMode === "table" ? (
                      
                      /* 1. TABLE FORMULATION LISTING (Exact Screenshot Style) */
                      <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans text-xs">
                          <thead>
                            <tr className="bg-[#f5f8fa] border-b border-slate-200 text-[#004a80] font-black uppercase tracking-wider text-[11px]">
                              <th className="py-3.5 px-4 text-center w-12">S.No.</th>
                              <th className="py-3.5 px-4">Product Formulation Name</th>
                              <th className="py-3.5 px-4">Active Chemical Composition</th>
                              <th className="py-3.5 px-4">Packaging Type & Size</th>
                              <th className="py-3.5 px-4 text-center w-28">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((prod, index) => (
                              <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-semibold">
                                  {index + 1}
                                </td>
                                <td className="py-3.5 px-4">
                                  <button
                                    onClick={() => onChangePath(`product-details?id=${prod.id}`)}
                                    className="font-bold text-[#004a80] hover:text-[#cc0000] text-left hover:underline focus:outline-none uppercase"
                                  >
                                    {prod.name}
                                  </button>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600 leading-normal font-mono text-[11px]">
                                  {prod.composition}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="bg-slate-100 border border-slate-200 px-2 py-1 text-[10px] text-slate-700 font-semibold uppercase">
                                    {prod.packSize} ({prod.packType})
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => onOpenQuickInquiry(prod.name)}
                                    className="bg-[#cc0000] hover:bg-[#aa0000] text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-none transition-colors cursor-pointer"
                                  >
                                    Inquire
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      
                      /* 2. CARD FORMULATION LISTING */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((prod) => (
                          <div key={prod.id} className="bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                            <div>
                              {/* Product Thumbnail Mockup */}
                              <div className="h-44 bg-slate-50 border-b border-slate-200 relative overflow-hidden flex items-center justify-center p-3">
                                {prod.imageUrl ? (
                                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Database className="w-5 h-5 text-slate-400" />
                                  </div>
                                )}
                                <div className="absolute top-2.5 right-2.5 bg-[#004a80] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                  {categories.find(c => c.id === prod.categoryId)?.name || "Formulation"}
                                </div>
                              </div>

                              <div className="p-5 font-sans">
                                <h3 
                                  onClick={() => onChangePath(`product-details?id=${prod.id}`)}
                                  className="font-bold text-[#004a80] text-sm hover:text-[#cc0000] cursor-pointer uppercase transition-colors line-clamp-1 mb-1.5"
                                >
                                  {prod.name}
                                </h3>
                                <p className="text-slate-500 text-xs font-mono line-clamp-2 border-b border-slate-100 pb-2.5 mb-2.5">
                                  Composition: {prod.composition}
                                </p>
                                <div className="text-[11px] text-slate-600 flex flex-col gap-1">
                                  <span>Pack Size: <strong>{prod.packSize}</strong></span>
                                  <span>Pack Type: <strong>{prod.packType}</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="p-5 pt-0 flex gap-2">
                              <button 
                                onClick={() => onChangePath(`product-details?id=${prod.id}`)}
                                className="w-1/2 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider rounded-none cursor-pointer text-center bg-white transition-colors"
                              >
                                Details
                              </button>
                              <button 
                                onClick={() => onOpenQuickInquiry(prod.name)}
                                className="w-1/2 py-2 bg-[#cc0000] hover:bg-[#aa0000] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-none cursor-pointer text-center transition-colors"
                              >
                                Inquire
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    )}
                  </div>

                  {/* 3. SEO DYNAMIC TEXT CONTENT AREA (Rendered below list exactly like screenshot) */}
                  <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm font-sans flex flex-col gap-6">
                    
                    <div>
                      <h2 className="text-[#004a80] font-black text-xl border-b border-slate-100 pb-3 uppercase tracking-tight">
                        {seo.heading}
                      </h2>
                      <p className="text-slate-600 text-xs sm:text-[13px] mt-4 leading-relaxed">
                        {seo.intro}
                      </p>
                    </div>

                    {/* Steel facilities visual section mockup */}
                    <div className="my-2 border border-slate-300 p-2 bg-[#f5f8fa]">
                      <div className="h-64 sm:h-72 w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=1200&auto=format&fit=crop" 
                          alt="Pharma Manufacturing Cleanroom" 
                          className="w-full h-full object-cover brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex flex-col justify-end p-5">
                          <span className="text-[10px] uppercase tracking-widest font-black text-[#00a0e9]">Sterile Infrastructure Cleanrooms</span>
                          <span className="text-white text-sm font-bold uppercase mt-1 leading-normal">Approved WHO-GMP Liquid & Tablet Dosage Compression Lines</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#004a80] font-bold text-sm uppercase mb-3">
                        {seo.benefitsHeading}
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {seo.benefitsList.map((ben, i) => (
                          <li key={i} className="flex gap-2 items-start text-xs text-slate-600">
                            <span className="text-[#cc0000] text-sm shrink-0">✔</span>
                            <span className="leading-relaxed">{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 border-l-4 border-[#004a80] p-4">
                      <h3 className="text-[#004a80] font-bold text-sm uppercase mb-2">
                        {seo.marketHeading}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {seo.marketText}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-[#004a80] font-bold text-sm uppercase mb-3">
                        WHY PARTNER WITH US FOR CONTRACT MANUFACTURING?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {seo.whyChoose.map((point, idx) => (
                          <div key={idx} className="border border-slate-150 p-3.5 bg-slate-50/50 flex gap-3 items-start">
                            <span className="bg-[#cc0000] text-white font-mono text-[10px] w-5 h-5 rounded-none flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-xs text-slate-700 leading-relaxed font-semibold">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#004a80] font-bold text-sm uppercase mb-4">
                        FREQUENTLY ASKED QUESTIONS (FAQs)
                      </h3>
                      <div className="flex flex-col gap-4 divide-y divide-slate-100">
                        {seo.faqs.map((faq, i) => (
                          <div key={i} className={`pt-4 ${i === 0 ? "pt-0" : ""}`}>
                            <span className="text-xs font-bold text-[#cc0000] block uppercase mb-1">
                              Q: {faq.q}
                            </span>
                            <span className="text-xs text-slate-600 leading-relaxed block">
                              A: {faq.a}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6 text-center">
                      <span className="text-xs font-bold text-slate-500 block uppercase mb-2">Ready to manufacture your customized branded formulation?</span>
                      <button 
                        onClick={() => onOpenQuickInquiry()}
                        className="bg-[#004a80] hover:bg-[#003860] text-white font-extrabold text-[11px] uppercase tracking-wider py-3 px-6 rounded-none shadow-md cursor-pointer transition-colors"
                      >
                        Contact Manufacturing Dept
                      </button>
                    </div>

                  </div>

                </div>

                {/* RIGHT SIDEBAR COLUMN: Product Categories List & PCD Form */}
                <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-2">
                  
                  {/* 1. PRODUCT CATEGORIES SIDEBAR LIST (Screenshot Style) */}
                  <div className="bg-white border border-slate-200 shadow-sm font-sans">
                    <div className="bg-[#004a80] text-white px-4 py-3 border-b border-slate-200">
                      <h3 className="font-sans font-black text-xs uppercase tracking-wider">
                        PRODUCT CATEGORIES
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategoryId(null);
                          onChangePath("products");
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold uppercase transition-all flex justify-between items-center ${!selectedCategoryId ? "bg-slate-100 text-[#cc0000]" : "text-slate-600 hover:bg-slate-50 hover:text-[#004a80]"}`}
                      >
                        <span>Show All Range</span>
                        <span className="font-mono text-[10px]">➔</span>
                      </button>
                      {categories.map((cat) => {
                        const isSelected = selectedCategoryId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategoryId(cat.id);
                              onChangePath(`products?category=${cat.id}`);
                            }}
                            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase transition-all flex justify-between items-center ${isSelected ? "bg-[#cc0000] text-white font-black" : "text-slate-600 hover:bg-slate-50 hover:text-[#004a80]"}`}
                          >
                            <span className="truncate pr-2">{cat.name}</span>
                            <span className="font-mono text-[10px] shrink-0">➔</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. GET PCD & THIRD PARTY MANUFACTURING QUOTE FORM */}
                  <div className="bg-white border-2 border-[#cc0000] shadow-sm font-sans overflow-hidden">
                    <div className="bg-[#cc0000] text-white px-4 py-3 text-center">
                      <h3 className="font-sans font-black text-xs uppercase tracking-widest leading-none">
                        GET QUICK QUOTE
                      </h3>
                      <p className="text-[10px] text-white/90 uppercase tracking-wider mt-1 font-semibold leading-none">
                        PCD & Third Party Manufacturing
                      </p>
                    </div>

                    <div className="p-4 bg-white">
                      {sidebarSuccess ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 text-xs font-sans text-center leading-normal animate-in zoom-in-95">
                          <span className="text-lg block mb-1">✔</span>
                          <strong className="block mb-1">Inquiry Submitted!</strong>
                          Our commercial department will contact you within 24 hours with exact formulation pricelists.
                        </div>
                      ) : (
                        <form 
                          onSubmit={(e) => handleSidebarSubmit(e, activeCategoryName)} 
                          className="flex flex-col gap-3 text-xs font-sans"
                        >
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Full Name</label>
                            <input 
                              type="text" required
                              value={sidebarForm.name}
                              onChange={(e) => setSidebarForm({ ...sidebarForm, name: e.target.value })}
                              placeholder="Your full name"
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Mobile Number</label>
                            <input 
                              type="tel" required
                              value={sidebarForm.phone}
                              onChange={(e) => setSidebarForm({ ...sidebarForm, phone: e.target.value })}
                              placeholder="Your mobile phone"
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Email Address</label>
                            <input 
                              type="email" required
                              value={sidebarForm.email}
                              onChange={(e) => setSidebarForm({ ...sidebarForm, email: e.target.value })}
                              placeholder="Your email address"
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Formulation Division</label>
                            <input 
                              type="text" disabled
                              value={activeCategoryName}
                              className="w-full p-2.5 rounded-none border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold select-none cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Inquiry Message</label>
                            <textarea 
                              required rows={3}
                              value={sidebarForm.message}
                              onChange={(e) => setSidebarForm({ ...sidebarForm, message: e.target.value })}
                              placeholder="Specify composition dosage or packaging requirement..."
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs resize-none"
                            ></textarea>
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-[#cc0000] hover:bg-[#aa0000] text-white font-black text-[11px] uppercase tracking-widest py-3 mt-1.5 rounded-none transition-colors cursor-pointer"
                          >
                            Submit Quote Request
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* 3. WHO-GMP Quality Certificate badge box */}
                  <div className="bg-[#f5f8fa] border border-slate-200 p-4 font-sans text-center">
                    <span className="text-[10px] uppercase font-black text-[#004a80] tracking-wider block mb-1">Lifevision Credentials</span>
                    <strong className="text-xs text-slate-800 block uppercase mb-2">WHO-GMP & ISO 9001:2015</strong>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      All products are manufactured under rigorous clinical control, packaging standards, and analytical certifications.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        );
      })()}


      {/* 6. CAREERS VIEW */}
      {route === "careers" && (
        <div className="animate-in fade-in duration-200 max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs tracking-widest font-bold text-brand-600 uppercase block mb-2">Build Your Career</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-900 tracking-tight">
              Join Our Formulation Units
            </h1>
            <p className="text-slate-500 text-sm mt-3">
              Work under elite pharma professionals and advance your research capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-6">
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Current Active Openings</h2>
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-slate-100 text-brand-700 font-semibold px-2.5 py-0.5 rounded-md uppercase">{job.department}</span>
                      <h3 className="font-display font-bold text-slate-900 text-lg mt-2 mb-1">{job.title}</h3>
                    </div>
                    <span className="text-xs text-brand-600 font-bold">{job.experience}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500 my-3">
                    <span>Location: <strong>{job.location}</strong></span>
                    <span>Qualification: <strong>{job.qualification}</strong></span>
                  </div>
                  <p className="text-slate-600 text-xs mt-3 leading-relaxed border-b border-slate-50 pb-3">{job.description}</p>
                  
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-slate-800 block mb-1">Key Requirements:</span>
                    <ul className="list-disc pl-4 text-[11px] text-slate-500 flex flex-col gap-0.5">
                      {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                  </div>

                  <button 
                    onClick={() => { setSelectedJob(job); setApplicationSuccess(false); }}
                    className="w-full bg-slate-100 hover:bg-brand-600 hover:text-white text-brand-700 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center mt-6"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            {/* Application side panel/modal */}
            {selectedJob ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl sticky top-28">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Applying For Job</span>
                    <h3 className="font-display font-bold text-slate-900 text-lg leading-tight mt-0.5">{selectedJob.title}</h3>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
                </div>

                <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">Email *</label>
                      <input 
                        type="email" 
                        required
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs"
                        placeholder="janedoe@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">Phone *</label>
                      <input 
                        type="tel" 
                        required
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs"
                        placeholder="+91-XXXXX-XXXXX"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">Years of Experience *</label>
                      <input 
                        type="text" 
                        required
                        value={applicationForm.experience}
                        onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs"
                        placeholder="3 Years"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">Resume PDF Link (Optional)</label>
                      <input 
                        type="url" 
                        value={applicationForm.resume}
                        onChange={(e) => setApplicationForm({...applicationForm, resume: e.target.value})}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs"
                        placeholder="https://drive.google.com/resume.pdf"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block mb-1">Introduction & Strengths</label>
                    <textarea 
                      rows={3}
                      value={applicationForm.message}
                      onChange={(e) => setApplicationForm({...applicationForm, message: e.target.value})}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs"
                      placeholder="Briefly state your industrial exposure..."
                    />
                  </div>

                  {applicationSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-100 font-medium">
                      ✓ Application logged successfully. Our HR will contact you back shortly.
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-md cursor-pointer"
                  >
                    Submit Application Form
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-200 p-8 rounded-2xl text-center text-slate-400 text-sm h-72 flex flex-col justify-center items-center">
                <Briefcase className="w-12 h-12 text-slate-300 mb-3" />
                Select any active opening on the left to activate the application form dashboard.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. BLOGS VIEW */}
      {route === "blogs" && (
        <div className="animate-in fade-in duration-200 max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs tracking-widest font-bold text-brand-600 uppercase block mb-2">Publications</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-900 tracking-tight">
              Lifevision pharma publications
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="h-56 relative bg-slate-100">
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-brand-950 text-white text-[10px] px-2.5 py-1 rounded-md font-semibold font-display tracking-wider uppercase">
                      {blog.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] text-slate-400 font-medium block mb-2">{blog.publishedAt}</span>
                    <h3 
                      onClick={() => onChangePath(`blog-details?id=${blog.id}`)}
                      className="font-display font-bold text-slate-900 text-lg mb-3 hover:text-brand-600 cursor-pointer line-clamp-2"
                    >
                      {blog.title}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-6">{blog.excerpt}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center text-xs">
                  <span className="text-slate-400">By <strong>{blog.author}</strong></span>
                  <button 
                    onClick={() => onChangePath(`blog-details?id=${blog.id}`)}
                    className="text-brand-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Read Post <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. BLOG DETAILS VIEW */}
      {route === "blog-details" && activeBlog && (
        <div className="animate-in fade-in duration-200 max-w-4xl mx-auto px-4 py-16">
          <button 
            onClick={() => onChangePath("blogs")}
            className="flex items-center gap-1 text-slate-500 hover:text-brand-600 font-semibold text-xs mb-8 cursor-pointer"
          >
            ← Back to Blogs
          </button>

          <article className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 shadow-xl">
            <header className="mb-8">
              <span className="text-xs bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-md">{activeBlog.category}</span>
              <h1 className="font-display font-bold text-2xl md:text-4xl text-slate-900 mt-4 tracking-tight leading-tight">
                {activeBlog.title}
              </h1>
              <div className="flex gap-4 text-xs text-slate-400 mt-4 font-medium">
                <span>Published on: <strong>{activeBlog.publishedAt}</strong></span>
                <span>By: <strong>{activeBlog.author}</strong></span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {activeBlog.views} views</span>
              </div>
            </header>

            <div className="rounded-xl overflow-hidden mb-8 h-80">
              <img src={activeBlog.imageUrl} alt={activeBlog.title} className="w-full h-full object-cover" />
            </div>

            {/* Render blog html body content */}
            <div 
              className="text-slate-600 text-sm leading-relaxed space-y-4 prose prose-slate"
              dangerouslySetInnerHTML={{ __html: activeBlog.content }}
            />
          </article>
        </div>
      )}

      {/* 9. FAQs VIEW */}
      {route === "faq" && (
        <div className="animate-in fade-in duration-200 max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <span className="text-xs tracking-widest font-bold text-brand-600 uppercase block mb-2">Resolution Center</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
                <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-3 pl-6 border-l border-slate-100">
                  {faq.answer}
                </p>
                <span className="text-[10px] bg-slate-100 text-slate-400 font-semibold px-2 py-0.5 rounded-md mt-4 inline-block ml-6">
                  Category: {faq.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. CONTACT VIEW */}
      {route === "contact" && (
        <div className="animate-in fade-in duration-200 w-full bg-white text-left font-sans">
          
          {/* Centered gray breadcrumb header section exactly like screenshot */}
          <div className="bg-[#f5f5f5] py-8 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-slate-800 font-bold text-2xl md:text-3xl tracking-wider font-sans uppercase mb-2">
                CONTACT US
              </h1>
              <div className="flex justify-center items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <button 
                  onClick={() => onChangePath("home")} 
                  className="hover:text-[#cc0000] transition-colors"
                >
                  Home
                </button>
                <span className="text-slate-400">›</span>
                <span className="text-slate-400">Contact Us</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
            
            {/* Coordinates Grid (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              
              {/* Card 1: Registered / Corporate Office */}
              <div className="bg-white border border-slate-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[#004a80]/5 text-[#004a80] flex items-center justify-center rounded-none border border-[#004a80]/10">
                  <Building className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-slate-900 text-sm uppercase tracking-wider mb-2">
                    Registered Corporate Office
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-sans font-semibold">
                    Plot No. 11-12, Dainik Bhaskar Building, <br />
                    Sector 25-D, Chandigarh - 160014, India
                  </p>
                </div>
              </div>

              {/* Card 2: Manufacturing Facility Units */}
              <div className="bg-white border border-slate-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[#004a80]/5 text-[#004a80] flex items-center justify-center rounded-none border border-[#004a80]/10">
                  <MapPin className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-slate-900 text-sm uppercase tracking-wider mb-2">
                    Manufacturing Facility Units
                  </h3>
                  <div className="flex flex-col gap-2.5 text-slate-600 text-xs font-sans">
                    <p className="leading-relaxed font-semibold">
                      <strong className="text-slate-800 uppercase text-[10px]">Unit-I (Panchkula):</strong> <br />
                      Plot No. 140, Industrial Area, Phase-1, Panchkula, Haryana - 134113
                    </p>
                    <p className="leading-relaxed font-semibold">
                      <strong className="text-slate-800 uppercase text-[10px]">Unit-II (Baddi):</strong> <br />
                      Plot No. 140-141, E.P.I.P, Phase-1, Jharmajri, Baddi, District Solan, Himachal Pradesh - 173205
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Direct Communications */}
              <div className="bg-white border border-slate-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[#004a80]/5 text-[#004a80] flex items-center justify-center rounded-none border border-[#004a80]/10">
                  <Phone className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-slate-900 text-sm uppercase tracking-wider mb-2">
                    Direct Communications
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-0.5">Phone Channels</span>
                      <p className="text-slate-800 text-xs font-mono font-bold leading-relaxed">
                        +91-78888 75222, +91-78888 75224<br />
                        +91-98789 77174
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-0.5">Email Communications</span>
                      <p className="text-[#004a80] text-xs font-semibold leading-relaxed break-all font-mono">
                        sales@lifevisionhealthcarechd.com<br />
                        support@lifevisionhealthcarechd.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Split Inquiry Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-slate-200 p-6 sm:p-8 md:p-10 shadow-sm mb-16">
              
              {/* Left Column: Why Partner / Working Hours */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-8 border-b lg:border-b-0 lg:border-r border-slate-200 pb-8 lg:pb-0 lg:pr-8">
                <div>
                  <h2 className="font-sans font-black text-slate-900 text-lg uppercase tracking-wide mb-4">
                    Why Partner With Us?
                  </h2>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                    Lifevision Healthcare® is a leading WHO-GMP certified, ISO 9001:2015 pharmaceutical manufacturer in India. We support extensive third-party contracts and high-margin PCD monopoly franchises across over 20 product categories.
                  </p>

                  <div className="flex flex-col gap-3 text-xs text-slate-700 font-bold">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="uppercase text-[11px] tracking-normal">Advanced WHO-GMP compliant formulations</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="uppercase text-[11px] tracking-normal">Quick product approval and dispatch timelines</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="uppercase text-[11px] tracking-normal">Attractive packaging visual designs & foils</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="uppercase text-[11px] tracking-normal">Monopoly franchise rights for vacant districts</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200/60 flex items-start gap-3 mt-4">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans font-black text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                      Business Operating Hours
                    </h4>
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                      Monday - Saturday: 9:30 AM to 6:30 PM <br />
                      Sunday: Closed (Inquiries received via form are checked on Monday)
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Form */}
              <div className="lg:col-span-7">
                <h2 className="font-sans font-black text-slate-900 text-lg uppercase tracking-wide mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#cc0000]" />
                  Send Commercial Enquiry
                </h2>

                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 font-sans text-xs">
                  
                  {/* Name field */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1.5">
                      Your Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full border border-slate-300 p-3 rounded-none focus:outline-none focus:border-[#004a80] focus:ring-1 focus:ring-[#004a80] bg-slate-50 focus:bg-white transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Grid for Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1.5">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full border border-slate-300 p-3 rounded-none focus:outline-none focus:border-[#004a80] focus:ring-1 focus:ring-[#004a80] bg-slate-50 focus:bg-white transition-colors"
                        placeholder="e.g. name@company.com"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1.5">
                        Phone Number / Mobile *
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full border border-slate-300 p-3 rounded-none focus:outline-none focus:border-[#004a80] focus:ring-1 focus:ring-[#004a80] bg-slate-50 focus:bg-white transition-colors"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Grid for City and Subject Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1.5">
                        City / District / State *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={contactCity}
                        onChange={(e) => setContactCity(e.target.value)}
                        className="w-full border border-slate-300 p-3 rounded-none focus:outline-none focus:border-[#004a80] focus:ring-1 focus:ring-[#004a80] bg-slate-50 focus:bg-white transition-colors"
                        placeholder="e.g. Panchkula, Haryana"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1.5">
                        Interested In *
                      </label>
                      <select 
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        className="w-full border border-slate-300 p-3 rounded-none focus:outline-none focus:border-[#004a80] focus:ring-1 focus:ring-[#004a80] bg-slate-50 text-slate-700 focus:bg-white transition-colors font-semibold"
                      >
                        <option value="">-- Select Partnership Type --</option>
                        <option value="Third Party Manufacturing">Third Party Manufacturing Contract</option>
                        <option value="PCD Pharma Franchise">PCD Pharma Franchise (Monopoly)</option>
                        <option value="Bulk Formulations Commercial Order">Bulk Formulation Commercial Supply</option>
                        <option value="New Molecules Launch Consultation">New Molecule Launch Enquiry</option>
                        <option value="General Commercial Query">General Commercial Query</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1.5">
                      Detailed Commercial Message *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full border border-slate-300 p-3 rounded-none focus:outline-none focus:border-[#004a80] focus:ring-1 focus:ring-[#004a80] bg-slate-50 focus:bg-white transition-colors leading-relaxed"
                      placeholder="Specify your product line volumes, drug licenses info, or geographical monopoly district request..."
                    />
                  </div>

                  {/* Success banner */}
                  {contactSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 text-xs p-3.5 border border-emerald-200 font-bold tracking-normal uppercase leading-relaxed animate-in fade-in duration-300">
                      ✓ Your commercial partnership request has been logged. Our Business Director will contact you within 2 to 4 working hours.
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="w-full bg-[#004a80] hover:bg-[#003860] text-white font-extrabold text-xs uppercase tracking-wider py-4 px-6 rounded-none shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
                  >
                    Send Partnership Request
                  </button>

                  <span className="text-[9px] text-slate-400 block text-center font-medium mt-1">
                    🔒 Security Notice: We treat all commercial specifications and formulations with absolute NDA secrecy.
                  </span>

                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 11. QUALITY, MANUFACTURING & CERTIFICATIONS VIEW */}
      {(route === "quality" || route === "manufacturing") && (
        <div className="animate-in fade-in duration-200 max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs tracking-widest font-bold text-brand-600 uppercase block mb-2">Industrial Integrity</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-900 tracking-tight">
              WHO-GMP formulation standard
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-4">Cleanroom HVAC System & Sterile Air Quality</h2>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                Our manufacturing areas operate in cleanroom facilities with pressure differentials, dynamic pass boxes, and dedicated HEPA filter banks. This ensures zero trace chemical cross-contamination and an absolute sterile environment.
              </p>
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-4 mt-8">Analytical Chemistry Testing Laboratories</h2>
              <p className="text-slate-600 text-xs leading-relaxed">
                Equipped with automated High-Pressure Liquid Chromatography (HPLC) columns, dissolution chambers, stability monitoring ovens, and infrared scanners, our pharmacologists verify active compounds of every batch before shipping certificates.
              </p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1579154204601-01588f351167?q=80&w=600&auto=format&fit=crop" 
              alt="Lab HPLC test" 
              className="rounded-2xl shadow-xl h-96 object-cover"
            />
          </div>

          {/* Certificates block */}
          <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight text-center mb-8">Authentic Certification Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4">
                <div className="bg-brand-50 p-3 rounded-xl text-brand-600 shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">{cert.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Issued by: {cert.issuer}</p>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-md mt-2 inline-block">Year: {cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. PRIVACY POLICY */}
      {route === "privacy-policy" && (
        <div className="animate-in fade-in duration-200 max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-xl">
            <h1 className="font-display font-bold text-3xl text-slate-900 tracking-tight mb-6">Privacy Policy</h1>
            <p className="text-slate-400 text-xs mb-8">Last Updated: July 2026</p>
            
            <div className="text-slate-600 text-xs leading-relaxed space-y-4">
              <p>At Lifevision Healthcare, accessible from our corporate portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Lifevision Healthcare and how we use it.</p>
              <h3 className="font-display font-bold text-sm text-slate-800 pt-4">1. Information We Collect</h3>
              <p>When you submit a contact inquiry, newsletter signup, or job application resume on our website, we securely record your full name, email address, telephone contact coordinates, years of industrial exposure, and custom introductory texts into our container server database.</p>
              <h3 className="font-display font-bold text-sm text-slate-800 pt-4">2. How We Use Your Information</h3>
              <p>We utilize database records to process your third-party contract calculations, authorize exclusive district monopoly bounds for PCD franchise requests, evaluate candidate applications for open QA/QC lab openings, and defend our systems against spam.</p>
              <h3 className="font-display font-bold text-sm text-slate-800 pt-4">3. Data Integrity & Security</h3>
              <p>Your logged inquiries are strictly stored within localized sandboxed servers and are never shared or sold to marketing aggregators. We enforce validation layers to protect database routes.</p>
            </div>
          </div>
        </div>
      )}

      {/* 13. TERMS AND CONDITIONS */}
      {route === "terms-conditions" && (
        <div className="animate-in fade-in duration-200 max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-xl">
            <h1 className="font-display font-bold text-3xl text-slate-900 tracking-tight mb-6">Terms & Conditions</h1>
            <p className="text-slate-400 text-xs mb-8">Last Updated: July 2026</p>
            
            <div className="text-slate-600 text-xs leading-relaxed space-y-4">
              <p>Welcome to Lifevision Healthcare! These terms and conditions outline the rules and regulations for the use of Lifevision Healthcare's website and commercial manufacturing facilities.</p>
              <h3 className="font-display font-bold text-sm text-slate-800 pt-4">1. Third-Party MOQs</h3>
              <p>All third-party manufacturing requests, prices, and initial drug layouts are subject to minimum order quantity (MOQ) clearances (e.g. 50,000 tablets per formulation). Batch formulations are only finalized upon drug registration clearances and advance sign-off.</p>
              <h3 className="font-display font-bold text-sm text-slate-800 pt-4">2. Monopoly Boundaries</h3>
              <p>PCD franchise territory rights are bounded strictly by the signed written agreements. Franchise owners are restricted from selling catalog materials outside their assigned district codes to avoid territorial overlaps.</p>
              <h3 className="font-display font-bold text-sm text-slate-800 pt-4">3. Intellectual Property</h3>
              <p>The generic compositions, package designs, box typography blocks, custom illustrations, and product descriptions hosted on this website are original materials and may not be copied without explicit permission.</p>
            </div>
          </div>
        </div>
      )}

      {/* 13.5. FACILITY VIEW */}
      {route === "facility" && (() => {
        const specs = {
          tablet: {
            title: "Tablet Compression Department",
            desc: "Our tablet facility operates high-speed double rotary compression machines housed in specialized positive-pressure cabins. Complete dust extraction systems and online metal detectors ensure absolute formulation purity.",
            machinery: [
              "Double-Rotary 37-Station tablet compression press",
              "Automatic Rapid Mixer Granulator (RMG) - 250 Liters",
              "Modern fluid bed dryer (FBD) with pneumatic lifting",
              "Computerized Auto-Coater with organic solvent spray",
              "Pneumatic De-dusting and polishing apparatus"
            ],
            climate: "Temperature: 21°C ± 2°C | Relative Humidity: < 45%",
            image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=800&auto=format&fit=crop"
          },
          capsule: {
            title: "Hard Gelatin & Softgel Capsule Department",
            desc: "Fully automated encapsulation machinery fills micro-pellets and powder blends with supreme precision. Specialized low-humidity dehumidifiers operate continuously to maintain capsule shell integrity.",
            machinery: [
              "Automatic Capsule Filling Machine (90,000 capsules/hour)",
              "Precision Capsule Polishing and sorting machine",
              "Vacuum powder conveyor systems",
              "Semi-automatic capsule shell separator",
              "Pneumatic capsule sorting and damage rejection lines"
            ],
            climate: "Temperature: 19°C ± 2°C | Relative Humidity: < 35%",
            image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop"
          },
          liquid: {
            title: "Oral Liquid Oral & Syrup Department",
            desc: "Our oral liquid manufacturing department utilizes advanced closed-loop SS316 mixing, storage, and transfer lines. Direct filtration pipelines connect vessels directly to high-speed automatic filling arrays.",
            machinery: [
              "SS316 Stainless Steel manufacturing vessel (2000 Liter capacity)",
              "Online zero-hold filtration units",
              "Automatic bottle washing and air-purging tunnel",
              "Rotary 8-head bottle filling and screw capping line",
              "Optical batch label inspection scanner"
            ],
            climate: "Temperature: 22°C ± 2°C | HEPA air-handling loop",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
          },
          lab: {
            title: "Analytical Testing & Quality Control Lab",
            desc: "Our state-approved testing lab conducts physical, chemical, and microbiological validation on all raw ingredients, packaging foils, and finished batches before granting commercial dispatch authorization.",
            machinery: [
              "High-Performance Liquid Chromatography (HPLC) system",
              "Double-Beam UV-Visible Spectrophotometer",
              "Digital 6-station dissolution testing apparatus",
              "Environmental Stability Chambers for shelf-life logging",
              "Aseptic microbiological testing hoods"
            ],
            climate: "ISO Class 5 Laminar Airflow Hoods",
            image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop"
          }
        };

        const steps = [
          { num: "01", title: "Formulation Pick", desc: "Select from our vast pool of approved compositions, or provide your custom molecule specifications." },
          { num: "02", title: "Commercial Quotation", desc: "We calculate ingredient, foil, and labor fees to supply a transparent, highly-competitive price sheet." },
          { num: "03", title: "License & Verification", desc: "We gather and upload your drug license copy and GSTIN to register the product brand profile." },
          { num: "04", title: "Box & Artwork Design", desc: "Our creative designers build your custom carton boxes, bottle labels, and aluminum foils precisely." },
          { num: "05", title: "WHO-GMP Production", desc: "Your product undergoes automated compression, liquid filling, blister packing, and final quality check." },
          { num: "06", title: "COA & Batch Dispatch", desc: "Our laboratory issues a Certificate of Analysis (COA) and routes your secure shipment directly." }
        ];

        const documents = [
          { title: "Drug Licensing Credentials", desc: "Clear copy of active state Drug Licenses in Form 25 and Form 28 required for manufacturing registration." },
          { title: "Taxation Certificates", desc: "Active Goods and Services Tax Identification Number (GSTIN) certificate copy of your marketing group." },
          { title: "Brand Identity Approvals", desc: "Trademark registration copies or non-resemblance affidavit on non-judicial stamp paper." },
          { title: "Company Profile Records", desc: "Partnership deed, Certificate of Incorporation (COI), or Proprietorship declarations." },
          { title: "Promoters' Identity Proof", desc: "PAN cards and Aadhaar records of corporate directors, partners, or sole owner." },
          { title: "Manufacturing Agreement", desc: "Formally executed third party agreement on legal stamp paper (template provided by us)." }
        ];

        const moqs = [
          { name: "Pharmaceutical Tablets", moq: "50,000 Tablets", packaging: "Alu-Alu or PVC Blister", leadTime: "25 - 30 Days" },
          { name: "Pharma Capsules (Hard Gelatin)", moq: "50,000 Capsules", packaging: "Alu-Alu or Blister Foil", leadTime: "25 - 30 Days" },
          { name: "Nutraceutical Softgels", moq: "30,000 Softgels", packaging: "Amber Plastic Bottles / Blisters", leadTime: "30 Days" },
          { name: "Oral Liquids & Syrups", moq: "5,000 Bottles", packaging: "Amber PET Bottles (100ml / 200ml)", leadTime: "20 - 25 Days" },
          { name: "Pediatric Oral Drops", moq: "5,000 Bottles", packaging: "Glass Bottles with calibrated droppers", leadTime: "20 Days" },
          { name: "Dermatology Ointments & Gels", moq: "10,000 Tubes", packaging: "Laminated aluminum collapsible tubes", leadTime: "30 Days" },
          { name: "Nutraceutical Sachet Powders", moq: "20,000 Sachets", packaging: "Multi-layered secure poly sachets", leadTime: "25 Days" }
        ];

        const faqs = [
          { q: "What is the typical starting capital required for third party manufacturing?", a: "To register a brand and commission a custom batch of tablets or syrups, the typical starting cost varies between ₹20,000 to ₹50,000 per product formulation. This covers raw material sourcing, packaging foil printing, state licensing clearances, and artwork production." },
          { q: "How long does it take to deliver the first batch of manufactured medicines?", a: "For a new product, the first batch takes about 25 to 30 days. This duration is required to acquire active ingredients, finalize packaging graphic designs, complete stability testing of the formulation, and secure molecular approval. Repeat orders are processed much faster, taking only 15 to 20 days." },
          { q: "Who handles the graphic designs of cartons, boxes, and bottle labels?", a: "Lifevision Healthcare has an in-house expert design department. We design your cartons, foils, stickers, and box packs completely free of charge. All packaging materials are fully customized according to current FDA guidelines, drug labeling acts, and your brand color scheme." },
          { q: "Can you supply formulation batches under our own proprietary formulation?", a: "Yes, we specialize in custom contract manufacturing. If your medical team has a customized molecular ratio, we can prepare, homogenize, and pack the formulation subject to local drug controller approvals and active ingredient assay validation." },
          { q: "What certifications are provided with the pharmaceutical dispatch?", a: "Every batch is shipped with a comprehensive Certificate of Analysis (COA) issued by our state-certified quality assurance laboratory. This certificate documents physical parameters, disintegration times, chemical purity assays, and microbiology reports, guaranteeing compliance with IP/BP/USP standards." }
        ];

        return (
          <div className="animate-in fade-in duration-200 bg-slate-50 min-h-screen">
            
            {/* 1. HERO BANNER SECTION */}
            <div className="bg-[#004a80] text-white py-16 sm:py-20 relative overflow-hidden border-b-4 border-[#cc0000]">
              {/* Pattern Mockup */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 font-sans">
                
                {/* Left Side Copy */}
                <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                  <span className="text-[11px] font-black tracking-widest text-[#00a0e9] bg-[#002f52] px-3.5 py-1.5 w-fit uppercase">
                    WHO-GMP & ISO 9001:2015 Approved Facility
                  </span>
                  <h1 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
                    THIRD PARTY PHARMA MANUFACTURING COMPANY IN INDIA
                  </h1>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl">
                    Scale your pharma business with Lifevision Healthcare. We provide complete end-to-end contract manufacturing, molecular formulation, graphic packaging, and licensing support inside certified, eco-friendly industrial zones in Baddi & Panchkula.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <button 
                      onClick={() => {
                        const target = document.getElementById("quote-form-section");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-[#cc0000] hover:bg-[#aa0000] text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-none transition-colors cursor-pointer"
                    >
                      Get Price Estimation
                    </button>
                    <button 
                      onClick={() => {
                        const target = document.getElementById("moq-grid-section");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-transparent hover:bg-white/10 text-white border border-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-none transition-colors cursor-pointer"
                    >
                      Check Commercial MOQs
                    </button>
                  </div>
                </div>

                {/* Right Side Visual Block */}
                <div className="lg:col-span-5 relative">
                  <div className="border-4 border-white shadow-2xl overflow-hidden aspect-[4/3] bg-slate-900 relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop" 
                      alt="Pharmaceutical Liquid Syrup Plant" 
                      className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/75 border-l-4 border-[#cc0000] p-3 text-left">
                      <span className="text-[10px] text-[#00a0e9] font-black uppercase tracking-wider block">Production Hub</span>
                      <strong className="text-white text-xs block uppercase">Baddi Formulation Sector 2</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. DYNAMIC SPECIFICATION TABS */}
            <div className="max-w-7xl mx-auto px-6 py-16 font-sans">
              <div className="text-center mb-12">
                <span className="text-xs tracking-widest font-extrabold text-[#cc0000] uppercase block mb-1">State-Of-The-Art Cleanrooms</span>
                <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#004a80] uppercase tracking-tight">
                  PRODUCTION LINES & TECHNOLOGY SPECS
                </h2>
                <div className="h-1.5 w-16 bg-[#004a80] mx-auto mt-3" />
              </div>

              {/* Tabs selector */}
              <div className="flex flex-wrap gap-2 justify-center mb-8 border-b border-slate-200 pb-4">
                {Object.keys(specs).map((key) => {
                  const isActive = activeSpecTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSpecTab(key)}
                      className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all rounded-none cursor-pointer border ${isActive ? "bg-[#004a80] text-white border-[#004a80]" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}
                    >
                      {key === "tablet" && "Tablet Compression"}
                      {key === "capsule" && "Capsules Sector"}
                      {key === "liquid" && "Oral Liquids & Syrups"}
                      {key === "lab" && "Quality Control Lab"}
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Panel */}
              {(() => {
                const spec = specs[activeSpecTab as keyof typeof specs];
                return (
                  <div className="bg-white border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 overflow-hidden animate-in fade-in duration-300">
                    <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[#cc0000] text-[10px] uppercase font-black tracking-widest block mb-1">Industrial Highlight</span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#004a80] uppercase tracking-tight mb-4">{spec.title}</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">{spec.desc}</p>
                        
                        <strong className="text-xs text-slate-800 uppercase block mb-3">Key Process Machinery Installed:</strong>
                        <ul className="flex flex-col gap-2 mb-6">
                          {spec.machinery.map((mach, i) => (
                            <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600">
                              <span className="text-[#cc0000] font-bold">✔</span>
                              <span>{mach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-50 border-l-4 border-[#004a80] p-3 text-xs text-slate-700 font-mono font-bold">
                        Climate Standard: {spec.climate}
                      </div>
                    </div>
                    <div className="lg:col-span-5 h-72 lg:h-auto min-h-[300px] relative">
                      <img src={spec.image} alt={spec.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 3. STEP-BY-STEP PROCESS TIMELINE */}
            <div className="bg-[#f5f8fa] border-y border-slate-200 py-16 font-sans">
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="text-center mb-12">
                  <span className="text-xs tracking-widest font-extrabold text-[#cc0000] uppercase block mb-1">Streamlined Integration</span>
                  <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#004a80] uppercase tracking-tight">
                    CONTRACT MANUFACTURING ONBOARDING STEPS
                  </h2>
                  <p className="text-slate-500 text-xs mt-2 max-w-xl mx-auto">
                    We have standardized the brand onboarding sequence into six simple phases, allowing you to launch formulation sales smoothly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {steps.map((st, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 flex gap-4 text-left hover:border-[#cc0000] transition-colors relative group">
                      <span className="text-4xl font-sans font-black text-slate-200 group-hover:text-[#cc0000]/10 transition-colors shrink-0">
                        {st.num}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm uppercase mb-1.5">{st.title}</h4>
                        <p className="text-slate-500 text-[11px] sm:text-xs leading-normal">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* 4. REQUIRED LEGAL DOCUMENTS */}
            <div className="max-w-7xl mx-auto px-6 py-16 font-sans text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-5">
                  <span className="text-xs tracking-widest font-extrabold text-[#cc0000] uppercase block mb-1">Regulatory Approvals</span>
                  <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#004a80] uppercase tracking-tight leading-none mb-4">
                    DOCUMENTS REQUIRED FOR CONTRACT CO-MANUFACTURING
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    To comply with the Ministry of Health and FSSAI guidelines, specific corporate credentials must be registered prior to batch fabrication. Our regulatory desk will assist you with fast approvals.
                  </p>
                  <div className="bg-[#cc0000]/5 border-l-4 border-[#cc0000] p-4 text-xs text-slate-700 leading-normal font-semibold">
                    💡 Do not have a Trademark or Drug License? No worries! Our expert trademark attorneys and drug liaisons will help you secure them within 7-10 working days.
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 shadow-sm">
                      <div className="flex gap-2 items-center mb-1.5 border-b border-slate-100 pb-2">
                        <span className="text-emerald-600 font-bold text-sm">✔</span>
                        <h4 className="font-extrabold text-xs text-[#004a80] uppercase truncate">{doc.title}</h4>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{doc.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* 5. COMMERCIAL MOQS SPECTRUM */}
            <div id="moq-grid-section" className="bg-white border-t border-slate-200 py-16 font-sans">
              <div className="max-w-7xl mx-auto px-6 text-left">
                
                <div className="text-center mb-10">
                  <span className="text-xs tracking-widest font-extrabold text-[#cc0000] uppercase block mb-1">Batch Sizing Matrix</span>
                  <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#004a80] uppercase tracking-tight">
                    COMMERCIAL MOQS & PRODUCTION LEAD TIMES
                  </h2>
                  <div className="h-1.5 w-16 bg-[#004a80] mx-auto mt-3" />
                </div>

                <div className="border border-slate-200 shadow-sm overflow-x-auto bg-white">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-[#f5f8fa] border-b border-slate-200 text-[#004a80] font-black uppercase text-[11px] tracking-wider">
                        <th className="p-4">Product Dosage Category</th>
                        <th className="p-4 text-center">Minimum Order Quantity (MOQ)</th>
                        <th className="p-4">Packaging Configurations</th>
                        <th className="p-4 text-center">Standard Dispatch Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {moqs.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4 font-extrabold text-[#004a80] uppercase text-xs">{m.name}</td>
                          <td className="p-4 text-center font-mono font-bold text-slate-800 bg-slate-50/50">{m.moq}</td>
                          <td className="p-4 text-slate-600 font-semibold">{m.packaging}</td>
                          <td className="p-4 text-center text-[#cc0000] font-bold">{m.leadTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* 6. EXPANDABLE CO-MANUFACTURING FAQS */}
            <div className="bg-[#f5f8fa] border-y border-slate-200 py-16 font-sans text-left">
              <div className="max-w-4xl mx-auto px-6">
                
                <div className="text-center mb-10">
                  <span className="text-xs tracking-widest font-extrabold text-[#cc0000] uppercase block mb-1">Clear Answers</span>
                  <h2 className="font-sans font-black text-2xl sm:text-3xl text-[#004a80] uppercase tracking-tight text-center">
                    FREQUENTLY ASKED CO-MANUFACTURING QUESTIONS
                  </h2>
                  <div className="h-1.5 w-16 bg-[#004a80] mx-auto mt-3" />
                </div>

                <div className="flex flex-col gap-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div key={idx} className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : idx)}
                          className="w-full p-4 text-left font-extrabold text-[#004a80] hover:text-[#cc0000] text-xs sm:text-sm uppercase flex justify-between items-center transition-colors focus:outline-none"
                        >
                          <span>{faq.q}</span>
                          <span className="text-base shrink-0 ml-4">{isOpen ? "➖" : "➕"}</span>
                        </button>
                        {isOpen && (
                          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-600 leading-relaxed font-semibold animate-in slide-in-from-top-1 duration-250">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* 7. QUICK QUOTE SUBMISSION FORM SECTION */}
            <div id="quote-form-section" className="max-w-3xl mx-auto px-6 py-16 font-sans text-left">
              <div className="bg-white border-2 border-[#cc0000] shadow-xl p-6 sm:p-10 relative overflow-hidden">
                
                <div className="bg-[#cc0000] text-white p-4 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-8 text-center uppercase tracking-widest">
                  <strong className="block text-sm font-black">SUBMIT BATCH SPECIFICATIONS FOR FREE COSTING</strong>
                  <span className="text-[10px] text-white/90 font-semibold block mt-1">Lifevision Healthcare Third Party Department</span>
                </div>

                {facilitySuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 text-center leading-relaxed animate-in zoom-in-95">
                    <span className="text-3xl block mb-2">✔</span>
                    <h3 className="font-bold text-sm uppercase mb-1">Contract Request Logged!</h3>
                    <p className="text-xs">
                      Our commercial estimating department has registered your formulation parameters. We will compile custom active ingredient pricing grids and dispatch quote reports to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFacilitySubmit} className="flex flex-col gap-4 text-xs font-sans">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Full Name *</label>
                        <input 
                          type="text" required
                          value={facilityForm.name}
                          onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Mobile Contact Number *</label>
                        <input 
                          type="tel" required
                          value={facilityForm.phone}
                          onChange={(e) => setFacilityForm({ ...facilityForm, phone: e.target.value })}
                          placeholder="Your active mobile phone"
                          className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Email Address *</label>
                        <input 
                          type="email" required
                          value={facilityForm.email}
                          onChange={(e) => setFacilityForm({ ...facilityForm, email: e.target.value })}
                          placeholder="Your email address"
                          className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Product Segment *</label>
                        <select
                          value={facilityForm.productType}
                          onChange={(e) => setFacilityForm({ ...facilityForm, productType: e.target.value })}
                          className="w-full p-2.5 rounded-none border border-slate-300 bg-white focus:outline-none focus:border-[#cc0000] text-xs"
                        >
                          <option value="Tablets">Tablets (Alu-Alu / Blister)</option>
                          <option value="Capsules">Capsules (Hardgel / Softgel)</option>
                          <option value="Syrups">Oral Liquid Syrups</option>
                          <option value="Nutraceuticals">Nutraceutical Supplements</option>
                          <option value="Ointments">Dermatology Gels & Creams</option>
                          <option value="Sachets">Sachet Powders</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Message / Composition & Packaging specification</label>
                      <textarea 
                        required rows={4}
                        value={facilityForm.message}
                        onChange={(e) => setFacilityForm({ ...facilityForm, message: e.target.value })}
                        placeholder="Mention active drug ratio, package style (blister/amber bottle), and desired quantity parameters..."
                        className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#cc0000] text-xs resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#cc0000] hover:bg-[#aa0000] text-white font-black text-xs uppercase tracking-widest py-3.5 mt-2 rounded-none transition-colors cursor-pointer"
                    >
                      Request Cost Quotation
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>
        );
      })()}

      {/* 13.6. DIVISIONS VIEW */}
      {route === "divisions" && (() => {
        // If a specific division subpage is requested
        if (selectedDivisionId) {
          const div = divisionsList.find((d) => d.id === selectedDivisionId);
          if (div) {
            return (
              <div className="animate-in fade-in duration-250 bg-slate-50 min-h-screen pb-16 font-sans text-left">
                {/* Custom Subpage Hero Banner */}
                <div className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-24 border-b-4 border-[#008c45]">
                  {/* Background Image with Dark Overlay */}
                  <div className="absolute inset-0">
                    <img 
                      src={div.image} 
                      alt={div.name} 
                      className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                  </div>
                  
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Back to All button */}
                    <button
                      onClick={() => onChangePath("divisions")}
                      className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white mb-6 uppercase tracking-wider cursor-pointer bg-slate-900/60 hover:bg-slate-900/90 py-2 px-4 border border-slate-700/60 transition-all rounded-md w-fit"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#008c45]" />
                      Back to All Divisions
                    </button>
                    
                    <span className="text-xs font-black tracking-widest text-[#008c45] uppercase bg-[#008c45]/10 border border-[#008c45]/30 px-3 py-1 block w-fit mb-3">
                      Exclusive Pharma Division
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-white uppercase mb-4">
                      {div.name}
                    </h1>
                    <p className="text-[#008c45] font-extrabold text-sm sm:text-base uppercase tracking-wider max-w-2xl font-sans">
                      {div.tagline}
                    </p>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left Column - Subpage Details */}
                  <div className="lg:col-span-7 flex flex-col gap-10">
                    {/* About Section */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                      <h2 className="text-xl font-sans font-black text-[#004a80] uppercase tracking-tight mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-[#008c45] inline-block"></span>
                        About {div.name}
                      </h2>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                        {div.description}
                      </p>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                        {div.about}
                      </p>
                    </div>

                    {/* Specialties Section */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                      <h2 className="text-xl font-sans font-black text-[#004a80] uppercase tracking-tight mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-[#008c45] inline-block"></span>
                        Therapeutic Specialties
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                        {div.specialties.map((spec, i) => (
                          <div key={i} className="flex gap-2.5 items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#008c45]/20 transition-all">
                            <CheckCircle className="w-4 h-4 text-[#008c45] shrink-0" />
                            <span className="text-xs font-bold text-slate-800 uppercase">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Marketing & Promotional Support Section */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                      <h2 className="text-xl font-sans font-black text-[#004a80] uppercase tracking-tight mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-[#008c45] inline-block"></span>
                        Marketing & Promotional Support
                      </h2>
                      <p className="text-slate-600 text-xs mb-4">
                        We equip our PCD franchise associates with comprehensive promotional resources to dominate their local regions securely:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {div.promoSupport.map((promo, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start">
                            <span className="text-[#008c45] font-black text-sm shrink-0">✔</span>
                            <span className="text-xs text-slate-700 font-semibold">{promo}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Division Features Section */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                      <h2 className="text-xl font-sans font-black text-[#004a80] uppercase tracking-tight mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-[#008c45] inline-block"></span>
                        Franchise Association Benefits
                      </h2>
                      <ul className="flex flex-col gap-3">
                        {div.features.map((feat, i) => (
                          <li key={i} className="flex gap-3 items-start bg-emerald-50/20 p-3.5 border-l-4 border-[#008c45] rounded-r-xl">
                            <span className="text-[#008c45] font-black text-xs">★</span>
                            <span className="text-xs text-slate-800 font-bold uppercase leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Certifications & Custom Inquiry Form */}
                  <div className="lg:col-span-5 flex flex-col gap-8">
                    {/* Quality Badges */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                        Regulatory Credentials
                      </h3>
                      <div className="flex flex-col gap-3">
                        {div.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Award className="w-5 h-5 text-[#008c45]" />
                            <span className="text-xs font-extrabold text-[#004a80] uppercase">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subpage Custom Franchise Request Form */}
                    <div className="bg-white border-2 border-[#008c45] p-6 sm:p-8 shadow-md rounded-none relative overflow-hidden">
                      <div className="bg-[#008c45] text-white p-4 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 text-center uppercase tracking-wider">
                        <strong className="block text-xs font-black">Apply for {div.name} PCD Franchise</strong>
                        <span className="text-[10px] text-white/90 font-bold block mt-1">Guaranteed Monopoly District Rights</span>
                      </div>

                      {divisionInquirySuccess ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 text-center rounded-xl animate-in zoom-in-95">
                          <Check className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                          <h4 className="font-extrabold text-xs uppercase mb-1">Franchise Request Received!</h4>
                          <p className="text-[11px] leading-relaxed">
                            We have logged your territory request for <strong>{div.name}</strong>. Our business manager will compile molecular price lists and district monopoly terms and reach out to you within 24 hours.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleDivisionInquirySubmit(e, div.name)} className="flex flex-col gap-4 text-xs">
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Your Full Name *</label>
                            <input 
                              type="text" required
                              value={divisionInquiryForm.name}
                              onChange={(e) => setDivisionInquiryForm({ ...divisionInquiryForm, name: e.target.value })}
                              placeholder="Enter your name"
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#008c45] text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Mobile Contact Number *</label>
                            <input 
                              type="tel" required
                              value={divisionInquiryForm.phone}
                              onChange={(e) => setDivisionInquiryForm({ ...divisionInquiryForm, phone: e.target.value })}
                              placeholder="Enter 10 digit phone number"
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#008c45] text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Email Address *</label>
                            <input 
                              type="email" required
                              value={divisionInquiryForm.email}
                              onChange={(e) => setDivisionInquiryForm({ ...divisionInquiryForm, email: e.target.value })}
                              placeholder="Enter your corporate email"
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#008c45] text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Target District / Message *</label>
                            <textarea 
                              required rows={3}
                              value={divisionInquiryForm.message}
                              onChange={(e) => setDivisionInquiryForm({ ...divisionInquiryForm, message: e.target.value })}
                              placeholder="Please mention your target district/state for monopoly rights allocation..."
                              className="w-full p-2.5 rounded-none border border-slate-300 focus:outline-none focus:border-[#008c45] text-xs resize-none"
                            ></textarea>
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-[#008c45] hover:bg-[#005c2d] text-white font-sans font-black text-xs uppercase tracking-widest py-3 mt-2 rounded-none transition-colors cursor-pointer"
                          >
                            Send Franchise Inquiry
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }

        // Default Main Divisions Landing Page (Lists all 8 divisions)
        return (
          <div className="animate-in fade-in duration-200 max-w-7xl mx-auto px-6 py-16 text-left">
            <div className="max-w-3xl mx-auto text-center mb-16 font-sans">
              <span className="text-xs tracking-widest font-extrabold text-[#006c35] uppercase bg-[#006c35]/5 border border-[#006c35]/10 px-3.5 py-1.5 inline-block mb-3">
                Corporate Divisions
              </span>
              <h1 className="font-sans font-black text-3xl md:text-5xl text-slate-900 tracking-tight uppercase leading-tight">
                Our Pharma Divisions & PCD Franchises
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-4 leading-relaxed max-w-2xl mx-auto font-medium">
                We operate 8 specialized pharmaceutical divisions, delivering high-purity therapeutic formulations. Each division is backed by complete monopoly rights, visual promotion toolkits, and GMP-certified units.
              </p>
            </div>

            {/* Division Grid of 8 entities */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {divisionsList.map((div) => (
                <div 
                  key={div.id} 
                  className="bg-white rounded-none border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#008c45] transition-all flex flex-col justify-between"
                >
                  {/* Card Header Image */}
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={div.image} 
                      alt={div.name} 
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shadow-md">
                      GMP Certified
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-extrabold text-slate-900 text-sm uppercase tracking-wide mb-1 min-h-[40px] flex items-center">
                        {div.name}
                      </h3>
                      <p className="text-[#006c35] text-[10px] uppercase font-black tracking-wider mb-2.5">
                        {div.tagline}
                      </p>
                      <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mb-4 line-clamp-3 font-semibold">
                        {div.description}
                      </p>
                    </div>

                    {/* Buttons Row with Cursors */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <button 
                        onClick={() => onChangePath(`divisions?id=${div.id}`)}
                        className="w-full py-2 bg-[#008c45] hover:bg-[#005c2d] text-white text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        Explore Division
                      </button>
                      <button 
                        onClick={() => onOpenQuickInquiry(`${div.name} PCD Franchise Request`)}
                        className="w-full py-2 bg-transparent hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider border border-slate-300 transition-all cursor-pointer text-center"
                      >
                        Apply Monopoly Franchise
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 13.7. NEW LAUNCHES VIEW */}
      {route === "new-launches" && (
        <div className="animate-in fade-in duration-200 w-full bg-white font-sans text-left pb-16">
          {/* Centered gray breadcrumb header section exactly like screenshot */}
          <div className="bg-[#f5f5f5] py-8 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-slate-800 font-bold text-2xl md:text-3xl tracking-wider font-sans uppercase mb-2">
                NEW LAUNCHES
              </h1>
              <div className="flex justify-center items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <button 
                  onClick={() => onChangePath("home")} 
                  className="hover:text-emerald-700 transition-colors"
                >
                  Home
                </button>
                <span className="text-slate-400">›</span>
                <span className="text-slate-400">New Launches</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
            
            {/* Interactive Search Tool specifically for New Launches */}
            <div className="mb-12 max-w-lg mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder="Search new launches & specific molecules..."
                value={newLaunchSearch}
                onChange={(e) => setNewLaunchSearch(e.target.value)}
                className="w-full border border-slate-300 pl-10 pr-10 py-3 rounded-none focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs sm:text-sm shadow-inner transition-all"
              />
              {newLaunchSearch && (
                <button 
                  onClick={() => setNewLaunchSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* List with ranges */}
            {(() => {
              const newLaunchesData = newLaunches && newLaunches.length > 0 ? newLaunches : [
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
              ];

              const filteredData = newLaunchesData.map(group => {
                const matchedItems = group.items.filter(item => 
                  item.toLowerCase().includes(newLaunchSearch.toLowerCase()) || 
                  group.range.toLowerCase().includes(newLaunchSearch.toLowerCase())
                );
                return { ...group, items: matchedItems };
              }).filter(group => group.items.length > 0);

              if (filteredData.length === 0) {
                return (
                  <div className="text-center py-12 border border-dashed border-slate-200 text-slate-400">
                    No matching formulations found in the New Launches list.
                  </div>
                );
              }

              return (
                <div className="flex flex-col gap-12">
                  {filteredData.map((group, gIdx) => (
                    <div key={gIdx} className="border-b border-slate-100 pb-8 last:border-0">
                      <h2 className="text-[#1a1a1a] font-bold text-lg sm:text-xl uppercase tracking-wide mb-6 border-l-4 border-emerald-600 pl-3">
                        {group.range}
                      </h2>
                      <ul className="flex flex-col gap-4 pl-2">
                        {group.items.map((item, idx) => (
                          <li 
                            key={idx} 
                            onClick={() => onChangePath(`product-details?id=${encodeURIComponent(item)}`)}
                            className="flex items-start gap-2.5 text-[#0088cc] hover:text-[#cc0000] cursor-pointer group transition-all duration-200"
                          >
                            <span className="text-[#0088cc] group-hover:text-[#cc0000] text-sm shrink-0 mt-[2px] font-sans">
                              •
                            </span>
                            <span className="font-sans font-bold text-[13px] md:text-sm leading-relaxed tracking-normal uppercase underline hover:no-underline">
                              {item}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 self-center bg-slate-50 border border-slate-200 px-2 py-0.5 whitespace-nowrap rounded-sm">
                              Inquire Now
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Bottom Call to Action Section */}
            <div className="mt-16 bg-slate-50 border border-slate-200 p-8 text-center max-w-4xl mx-auto">
              <h3 className="font-sans font-extrabold text-slate-900 text-base uppercase mb-2">
                Looking for exclusive PCD franchise or contract manufacturing rates?
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto mb-6">
                All our newly launched DCGI-approved formulations can be packaged under your own corporate brand labels with custom foils, box artworks, and WHO-GMP certs.
              </p>
              <button 
                onClick={() => onOpenQuickInquiry("Inquiry for Newly Launched Molecules")}
                className="bg-[#cc0000] hover:bg-[#aa0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-8 rounded-none shadow-md cursor-pointer transition-colors"
              >
                Inquire for Bulk Production
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 14. SITEMAP */}
      {route === "sitemap" && (
        <div className="animate-in fade-in duration-200 max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-xl">
            <h1 className="font-display font-bold text-3xl text-slate-900 tracking-tight mb-6">XML Sitemap Directory</h1>
            <p className="text-slate-400 text-xs mb-8">A comprehensive hierarchical directory mapping all public routes of Lifevision Healthcare.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-600">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-[#006c35]" /> Public Portal Routes
                </h3>
                <ul className="flex flex-col gap-2 pl-4 border-l border-slate-100">
                  <li><button onClick={() => onChangePath("home")} className="hover:text-brand-600 cursor-pointer text-left">Home Base (/home)</button></li>
                  <li><button onClick={() => onChangePath("about")} className="hover:text-brand-600 cursor-pointer text-left">Corporate Overview (/about)</button></li>
                  <li><button onClick={() => onChangePath("facility")} className="hover:text-brand-600 cursor-pointer text-left">Manufacturing Facilities (/facility)</button></li>
                  <li><button onClick={() => onChangePath("divisions")} className="hover:text-brand-600 cursor-pointer text-left">Pharma Subdivisions (/divisions)</button></li>
                  <li><button onClick={() => onChangePath("new-launches")} className="hover:text-brand-600 cursor-pointer text-left">New Approvals (/new-launches)</button></li>
                  <li><button onClick={() => onChangePath("products")} className="hover:text-brand-600 cursor-pointer text-left">Products Catalog (/products)</button></li>
                  <li><button onClick={() => onChangePath("blogs")} className="hover:text-brand-600 cursor-pointer text-left">News & Blogs (/blogs)</button></li>
                  <li><button onClick={() => onChangePath("contact")} className="hover:text-brand-600 cursor-pointer text-left">Inquire Contacts (/contact)</button></li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-brand-600" /> Thermodynamic Spheres
                </h3>
                <ul className="flex flex-col gap-2 pl-4 border-l border-slate-100">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button 
                        onClick={() => onChangePath(`products?category=${cat.id}`)} 
                        className="hover:text-brand-600 cursor-pointer text-left text-[11px]"
                      >
                        {cat.name} Segment Map
                      </button>
                    </li>
                  ))}
                  <li className="pt-2 border-t border-slate-50 text-[11px] text-slate-400">
                    WHO-GMP &amp; ISO Quality Control Active
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. DYNAMIC PRODUCT DETAILS VIEW (MATCHES LIFEVISION EXACTLY) */}
      {route === "product-details" && resolvedProduct && (() => {
        const sidebarCategories = [
          { name: "Antibiotics" },
          { name: "Capsule" },
          { name: "CARDIAC AND DIABETIC RANGE" },
          { name: "Cosmetic" },
          { name: "Covid-19" },
          { name: "Dental Range" },
          { name: "Drug" },
          { name: "Food" },
          { name: "Gargle" },
          { name: "Gum Paint" },
          { name: "Gynae Products" },
          { name: "Mouthwash" },
          { name: "Nasal Spray" },
          { name: "Nutraceutical" },
          { name: "OINTMENT" },
          { name: "Oral Paste" },
          { name: "Pediatric Range" },
          { name: "Pharma Tablets" },
          { name: "PPI & Gastro" },
          { name: "Sachet" },
          { name: "SHOT" },
          { name: "Soft Gelatin" },
          { name: "Softgel" },
          { name: "Syrup" },
          { name: "TABLET/CAPSULE SECTION" },
          { name: "Toothpaste" },
          { name: "Uncategorized" },
          { name: "Unique Molecules" }
        ];

        const relatedProducts = [
          { name: "VOGLICARE-MG 1", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop" },
          { name: "ASTROMET-G 0.5", image: "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=400&auto=format&fit=crop" },
          { name: "ASTROMET TRIO 1 FORTE", image: "https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?q=80&w=400&auto=format&fit=crop" }
        ];

        const filteredRelatedProducts = relatedProducts.filter(rp => {
          const lowerRp = rp.name.trim().toLowerCase();
          const lowerName = resolvedProduct.name.trim().toLowerCase();
          const lowerComp = (resolvedProduct.composition || "").trim().toLowerCase();
          return lowerRp !== lowerName && lowerRp !== lowerComp;
        });

        return (
          <div className="animate-in fade-in duration-200">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              {/* LEFT MAIN COLUMN: Product Details */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Top Card: Image + Title + Quick Info */}
                <div className="bg-white p-6 border border-slate-200 flex flex-col md:flex-row gap-8 shadow-sm">
                  
                  {/* Image Frame */}
                  <div className="w-full md:w-[320px] aspect-square bg-white border border-slate-200 flex items-center justify-center p-4 relative shrink-0 group overflow-hidden">
                    <img 
                      src={resolvedProduct.image} 
                      alt={resolvedProduct.name} 
                      className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 select-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm">
                      Premium Quality
                    </div>
                  </div>

                  {/* Short Info Block */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h1 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight mb-2 leading-tight">
                        {resolvedProduct.name}
                      </h1>
                      <p className="text-slate-500 text-[11px] sm:text-xs font-bold mb-4 uppercase tracking-wider leading-relaxed border-b border-slate-100 pb-3">
                        Composition: {resolvedProduct.composition || resolvedProduct.name}
                      </p>
                      
                      <div className="text-xs text-slate-600 mb-6 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          <span>Category: <strong className="text-emerald-700 uppercase tracking-wide">{resolvedProduct.categoryName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0088cc]"></span>
                          <span>Packaging Size: <strong className="text-slate-800">{resolvedProduct.packSize}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0088cc]"></span>
                          <span>Packaging Type: <strong className="text-slate-800">{resolvedProduct.packType}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button 
                        onClick={() => onOpenQuickInquiry(`Quick Inquiry for ${resolvedProduct.name}`)}
                        className="bg-[#0088cc] hover:bg-[#006699] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest py-3 px-6 rounded-none shadow-md transition-colors w-full sm:w-auto text-center"
                      >
                        Quick Inquiry
                      </button>
                      
                      {/* Share widgets */}
                      <div className="mt-6 flex items-center gap-4 text-[11px] text-slate-400 font-bold border-t border-slate-100 pt-4">
                        <span className="uppercase tracking-widest">Share this formulation:</span>
                        <div className="flex items-center gap-3">
                          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Facebook</a>
                          <span>•</span>
                          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">Twitter</a>
                          <span>•</span>
                          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors">LinkedIn</a>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Detail Tabs (Exact style from screenshot with full clinical information) */}
                <div className="bg-white border border-slate-200 shadow-sm">
                  
                  {/* Tab Header bar */}
                  <div className="border-b border-slate-200 bg-slate-50 flex">
                    <span className="border-t-2 border-emerald-600 border-r border-slate-200 bg-white px-6 py-3 font-bold text-xs sm:text-sm text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider font-sans select-none">
                      <span className="text-emerald-600">📄</span> Description
                    </span>
                  </div>

                  {/* Tab Content Body */}
                  <div className="p-6 sm:p-8 font-sans text-xs sm:text-sm leading-relaxed text-slate-700 flex flex-col gap-8">
                    
                    {/* Molecule Description */}
                    <div className="space-y-3">
                      <h2 className="font-sans font-black text-[#1a1a1a] text-lg sm:text-xl uppercase border-b border-slate-100 pb-2">
                        {resolvedProduct.name} Description
                      </h2>
                      <p className="text-slate-600 text-justify leading-relaxed">
                        {resolvedProduct.description}
                      </p>
                    </div>

                    {/* Uses */}
                    <div className="space-y-3">
                      <h3 className="font-sans font-bold text-[#1a1a1a] text-base uppercase flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-600 rounded-sm"></span>
                        USES OF {resolvedProduct.name}
                      </h3>
                      <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600 text-justify">
                        {resolvedProduct.usesList.map((use, i) => (
                          <li key={i} className="pl-1 leading-relaxed">{use}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                      <h3 className="font-sans font-bold text-[#1a1a1a] text-base uppercase flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-600 rounded-sm"></span>
                        BENEFITS OF {resolvedProduct.name}
                      </h3>
                      <p className="text-slate-600 text-justify leading-relaxed">
                        {resolvedProduct.benefitsText}
                      </p>
                    </div>

                    {/* Side Effects */}
                    <div className="space-y-3">
                      <h3 className="font-sans font-bold text-[#1a1a1a] text-base uppercase flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-600 rounded-sm"></span>
                        SIDE EFFECTS OF {resolvedProduct.name}
                      </h3>
                      <p className="text-slate-600 text-justify leading-relaxed mb-3">
                        {resolvedProduct.sideEffectsIntro}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 border border-slate-100 p-4 rounded-sm text-slate-600">
                        {resolvedProduct.sideEffectsList.map((se, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs font-semibold uppercase">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                            <span>{se}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-slate-500 text-justify leading-relaxed italic mt-3 text-xs">
                        {resolvedProduct.sideEffectsOutro}
                      </p>
                    </div>

                    {/* How to take */}
                    <div className="space-y-3">
                      <h3 className="font-sans font-bold text-[#1a1a1a] text-base uppercase flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-600 rounded-sm"></span>
                        HOW TO TAKE THIS MEDICATION
                      </h3>
                      <p className="text-slate-600 text-justify leading-relaxed">
                        {resolvedProduct.howToTake}
                      </p>
                    </div>

                    {/* How it works */}
                    <div className="space-y-3">
                      <h3 className="font-sans font-bold text-[#1a1a1a] text-base uppercase flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-600 rounded-sm"></span>
                        HOW THIS MEDICATION WORKS
                      </h3>
                      <p className="text-slate-600 text-justify leading-relaxed">
                        {resolvedProduct.howItWorks}
                      </p>
                    </div>

                    {/* Precautions */}
                    <div className="space-y-3 border-b border-slate-100 pb-8">
                      <h3 className="font-sans font-bold text-[#1a1a1a] text-base uppercase flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-4 bg-emerald-600 rounded-sm"></span>
                        PRECAUTION FOR TAKING {resolvedProduct.name}
                      </h3>
                      <div className="flex flex-col gap-4">
                        {resolvedProduct.precautions.map((pr, i) => (
                          <div key={i} className="bg-slate-50 p-3.5 border-l-4 border-[#0088cc] text-slate-600 text-justify">
                            <strong className="text-slate-900 uppercase font-bold text-xs block mb-1 tracking-wider">
                              {pr.title}
                            </strong>
                            <span className="text-xs sm:text-sm leading-relaxed">{pr.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explore Other Services Sticky Notes Grid */}
                    <div className="pt-4">
                      <h3 className="font-sans font-black text-slate-800 text-xs sm:text-sm uppercase tracking-wide mb-6">
                        Explore Other 3rd Party Manufacturing Services
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resolvedProduct.relatedServices.map((rs, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              onChangePath(`product-details?id=${encodeURIComponent(rs)}`);
                            }}
                            className="bg-slate-50 border border-slate-200 p-4 hover:border-emerald-600 hover:bg-emerald-50/20 cursor-pointer transition-all duration-200 flex items-start gap-3 shadow-sm hover:shadow"
                          >
                            <span className="text-amber-500 text-lg mt-0.5">📌</span>
                            <span className="font-bold text-[#0088cc] hover:text-[#cc0000] uppercase text-[11px] leading-snug line-clamp-3">
                              {rs}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: SIDEBAR */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                
                {/* Product Categories Sidebar List */}
                <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-emerald-600 text-white px-4 py-3.5 font-sans font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <span>📂</span>
                    <span>Product Categories</span>
                  </div>
                  <div className="flex flex-col divide-y divide-slate-100 text-[11px] text-slate-700 font-bold uppercase tracking-wider">
                    {sidebarCategories.map((scat, i) => {
                      const isCardiac = scat.name === "CARDIAC AND DIABETIC RANGE";
                      const isUnique = scat.name === "Unique Molecules";
                      return (
                        <div key={i} className="flex flex-col">
                          <button 
                            onClick={() => {
                              const foundCat = categories.find(c => c.name.toLowerCase().includes(scat.name.toLowerCase()) || scat.name.toLowerCase().includes(c.name.toLowerCase()));
                              if (foundCat) {
                                setSelectedCategoryId(foundCat.id);
                                setProductSearch("");
                                onChangePath(`products?category=${foundCat.id}`);
                              } else {
                                setSelectedCategoryId(null);
                                setProductSearch(scat.name);
                                onChangePath(`products?search=${encodeURIComponent(scat.name)}`);
                              }
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-full text-left py-3 px-4 transition-all flex items-center justify-between hover:text-emerald-700 hover:bg-slate-50 cursor-pointer ${isCardiac ? 'bg-[#0088cc]/5 border-l-4 border-[#0088cc] text-[#0088cc]' : ''}`}
                          >
                            <span>{scat.name}</span>
                            {(isCardiac || isUnique) && <span className="text-[9px]">▼</span>}
                          </button>
                          
                          {/* Cardiac submenu */}
                          {isCardiac && (
                            <div className="bg-[#0088cc] text-white flex flex-col text-[10px] font-bold uppercase tracking-wider">
                              <span 
                                onClick={() => {
                                  setProductSearch("Hand Sanitizer");
                                  onChangePath("products?search=Hand%20Sanitizer");
                                }}
                                className="py-2.5 px-6 border-b border-blue-400/20 cursor-pointer hover:bg-blue-600"
                              >
                                Hand Sanitizer
                              </span>
                              <span 
                                onClick={() => {
                                  setProductSearch("Immunity Booster");
                                  onChangePath("products?search=Immunity%20Booster");
                                }}
                                className="py-2.5 px-6 border-b border-blue-400/20 cursor-pointer hover:bg-blue-600"
                              >
                                Immunity Booster
                              </span>
                              <span 
                                onClick={() => {
                                  setProductSearch("PPE KITS");
                                  onChangePath("products?search=PPE%20KITS");
                                }}
                                className="py-2.5 px-6 cursor-pointer hover:bg-blue-600"
                              >
                                PPE KITS
                              </span>
                            </div>
                          )}
                          
                          {/* Unique Molecules submenu */}
                          {isUnique && (
                            <div className="bg-[#0088cc] text-white flex flex-col text-[10px] font-bold uppercase tracking-wider">
                              <span 
                                onClick={() => {
                                  setProductSearch("Tablets");
                                  onChangePath("products?search=Tablets");
                                }}
                                className="py-2.5 px-6 cursor-pointer hover:bg-blue-600"
                              >
                                Tablets
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PCD Franchise Inquiry Form Panel */}
                <div className="bg-[#0f4c81] text-white p-6 flex flex-col gap-4 shadow-md font-sans">
                  <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-widest leading-snug flex items-center gap-2">
                    <span>✉</span>
                    <span>Get PCD &amp; Third Party Mfg</span>
                  </h3>
                  <p className="text-[10px] text-blue-200 font-bold tracking-normal leading-relaxed -mt-2">
                    (Kindly Do not Post Raw Material &amp; Personal Use Enquiries)
                  </p>
                  
                  <form 
                    onSubmit={(e) => handleDetailsFormSubmit(e, resolvedProduct.name)} 
                    className="flex flex-col gap-3 text-slate-800 text-xs"
                  >
                    <input 
                      type="text" required placeholder="Your Name"
                      value={detailsForm.name}
                      onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <input 
                      type="email" required placeholder="Your Email"
                      value={detailsForm.email}
                      onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <input 
                      type="text" required placeholder="Your City"
                      value={detailsForm.city}
                      onChange={(e) => setDetailsForm({ ...detailsForm, city: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <input 
                      type="tel" required placeholder="Your Contact"
                      value={detailsForm.contact}
                      onChange={(e) => setDetailsForm({ ...detailsForm, contact: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <textarea 
                      required rows={3} placeholder="Your Message / Inquiry Details"
                      value={detailsForm.message}
                      onChange={(e) => setDetailsForm({ ...detailsForm, message: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
                    />
                    
                    {detailsSuccess && (
                      <div className="bg-emerald-500 text-white text-[10px] font-bold p-2 text-center shadow-inner">
                        ✓ Inquiry sent successfully!
                      </div>
                    )}
                    
                    <button 
                      type="submit"
                      className="bg-[#ff7a22] hover:bg-[#e06513] text-white uppercase font-black tracking-widest py-3 transition-colors cursor-pointer shadow"
                    >
                      Send Enquiry
                    </button>
                  </form>
                </div>

              </div>
            </div>

            {/* Related Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-200 text-left">
              <h3 className="font-sans font-black text-slate-800 text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#ff7a22] rounded-sm"></span>
                Related Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelatedProducts.map((rp, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      onChangePath(`product-details?id=${rp.name}`);
                    }}
                    className="bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between group p-4 hover:border-[#0088cc]"
                  >
                    <div className="aspect-square bg-white border border-slate-100 flex items-center justify-center p-4 relative mb-4 overflow-hidden">
                      <img 
                        src={rp.image} 
                        alt={rp.name} 
                        className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h4 className="font-sans font-black text-[#004a80] group-hover:text-[#cc0000] text-xs sm:text-sm uppercase tracking-wide text-center leading-snug">
                      {rp.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
      })()}

      {/* Full-width Google Map Section (With exact coordinates floating card widget) */}
      <div className="w-full h-[550px] relative border-t border-slate-200 group mt-12">
        <iframe 
          title="Lifevision Google Map"
          src={settings?.googleMapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.133748281144!2d76.7645169!3d30.7146522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed15017df8ef%3A0xe54d24a0d922a84b!2sLifevision%20Healthcare!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
          className="w-full h-full border-0"
          allowFullScreen={false} 
          loading="lazy"
        />
        
        {/* Floating Google Maps Overlay Card */}
        <div className="absolute top-6 left-6 bg-white p-5 rounded-none shadow-2xl border border-slate-200 max-w-sm hidden md:block z-10 animate-in fade-in slide-in-from-top-1 duration-300 text-left">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="font-sans font-black text-slate-950 text-[13px] leading-snug uppercase">
                Lifevision Healthcare®
              </h4>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mt-0.5">
                Pharma Manufacturing Hub
              </span>
              
              {/* Rating details mimicking google map exactly */}
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-amber-500 font-bold">
                <span>4.8</span>
                <span className="flex text-[11px]">★★★★★</span>
                <span className="text-slate-400 font-normal text-[10px] ml-1">(81 reviews)</span>
              </div>

              <p className="text-[10px] text-slate-500 mt-2 font-semibold leading-relaxed">
                Dainik Bhaskar Building, Plot No 11-12, Sector 25, Chandigarh, 160014
              </p>
            </div>

            <div className="shrink-0">
              <a 
                href="https://maps.google.com/?q=Lifevision+Healthcare+Chandigarh+Dainik+Bhaskar" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-[#004a80] border border-blue-100 transition-colors flex flex-col items-center justify-center cursor-pointer shadow-sm"
                title="Get Directions on Google Maps"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.4 11.2L12.8 1.6c-.4-.4-1.2-.4-1.6 0L1.6 11.2c-.4.4-.4 1.2 0 1.6l9.6 9.6c.4.4 1.2.4 1.6 0l9.6-9.6c.4-.4.4-1.2 0-1.6zm-11.2 5.3v-2.1c-2.9 0-4.9 1-6.1 3.2.6-3.2 2.3-6.4 6.1-6.4V7.2l4.8 4.3-4.8 5z" />
                </svg>
                <span className="text-[7px] font-bold text-[#004a80] mt-0.5 uppercase tracking-tighter">Directions</span>
              </a>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-[#004a80]">
            <a href="https://maps.google.com/?q=Lifevision+Healthcare+Chandigarh+Dainik+Bhaskar" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
              <span>View larger map</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
