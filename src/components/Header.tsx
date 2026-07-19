import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, X, Search, Phone, Mail, Award, ArrowRight, ShieldCheck, 
  Settings, MessageSquare, ChevronDown, Leaf
} from "lucide-react";
import { Category, Product, WebsiteSettings } from "../types";

interface HeaderProps {
  currentPath: string;
  onChangePath: (path: string) => void;
  categories: Category[];
  products: Product[];
  settings: WebsiteSettings;
  onOpenQuickInquiry: (productName?: string) => void;
}

export default function Header({
  currentPath,
  onChangePath,
  categories,
  products,
  settings,
  onOpenQuickInquiry
}: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  
  // Ref for handling hover menus gracefully to avoid flickering
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live product search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.composition.toLowerCase().includes(query) ||
        p.indications.toLowerCase().includes(query)
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onChangePath(`products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    onChangePath(`product-details?id=${product.id}`);
  };

  const parseTextLogo = (text: string) => {
    if (!text) return { part1: "Life", part2: "vision" };
    const trimmed = text.trim();
    if (trimmed.includes(" ")) {
      const parts = trimmed.split(/\s+/);
      return { part1: parts[0], part2: parts.slice(1).join(" ") };
    }
    if (trimmed.toLowerCase().startsWith("life") && trimmed.length > 4) {
      return { part1: trimmed.substring(0, 4), part2: trimmed.substring(4) };
    }
    const mid = Math.ceil(trimmed.length / 2);
    return { part1: trimmed.substring(0, mid), part2: trimmed.substring(mid) };
  };

  const Logo = ({ isMobile = false }: { isMobile?: boolean }) => {
    const useTextLogo = settings.logoType === "text";

    if (useTextLogo) {
      const textVal = settings.logoText || "Nishcura";
      const subVal = settings.logoTextSub || "healthcare";
      const { part1, part2 } = parseTextLogo(textVal);

      return (
        <div className="flex flex-col items-center lg:items-start justify-center cursor-pointer group" onClick={() => onChangePath("home")}>
          <div className="flex items-center">
            <span 
              className="font-bold text-3xl mr-1" 
              style={{ 
                fontFamily: settings.logoFontFamily || "Georgia, serif",
                color: settings.logoColor1 || "#006c35"
              }}
            >
              {part1}
            </span>
            <span 
              className="font-bold text-3xl"
              style={{ 
                fontFamily: settings.logoFontFamily || "Georgia, serif",
                color: settings.logoColor2 || "#004a80"
              }}
            >
              {part2}
            </span>
          </div>
          <div className="flex items-center gap-1 -mt-1 pl-4">
            <span 
              className="text-[9px] uppercase tracking-[0.2em] font-extrabold leading-none"
              style={{ 
                fontFamily: settings.logoFontFamily || "Georgia, serif",
                color: settings.logoSubtextColor || "#64748b"
              }}
            >
              {subVal}
            </span>
            <div style={{ color: settings.logoColor1 || "#006c35" }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C12,19.8 15.83,15.86 17,8M23,2C14.92,2.24 8.05,8.09 5.81,15.17C7.73,11.07 11.39,7.18 16.5,6.11C15.5,8.11 13,10.61 10.62,12.63C13.1,10.84 16.27,8.2 18,6C19,8.5 17.5,12.5 15,15C18.15,12.65 21.12,8.13 23,2Z" />
              </svg>
            </div>
          </div>
        </div>
      );
    } else {
      const imgUrl = isMobile 
        ? (settings.logoImageMobile || settings.logoImageDesktop)
        : (settings.logoImageDesktop || settings.logoImageMobile);

      if (imgUrl) {
        return (
          <div className="flex items-center justify-center cursor-pointer" onClick={() => onChangePath("home")}>
            <img 
              src={imgUrl} 
              alt={settings.companyName || "Nishcura Pharmaceuticals"} 
              className="max-h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }

      // Default hardcoded brand logo as fallback
      return (
        <div className="flex flex-col items-center justify-center cursor-pointer group" onClick={() => onChangePath("home")}>
          <div className="flex items-center">
            <span className="font-serif italic font-extrabold text-3xl text-[#006c35] tracking-tight mr-1" style={{ fontFamily: "Georgia, serif" }}>
              Life
            </span>
            <span className="font-sans font-black text-3xl text-[#004a80] tracking-tighter">
              vision
            </span>
          </div>
          <div className="flex items-center gap-1 -mt-1 pl-4">
            <span className="text-[9px] font-sans uppercase tracking-[0.2em] font-extrabold text-slate-500 leading-none">
              healthcare
            </span>
            <div className="text-emerald-600">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C12,19.8 15.83,15.86 17,8M23,2C14.92,2.24 8.05,8.09 5.81,15.17C7.73,11.07 11.39,7.18 16.5,6.11C15.5,8.11 13,10.61 10.62,12.63C13.1,10.84 16.27,8.2 18,6C19,8.5 17.5,12.5 15,15C18.15,12.65 21.12,8.13 23,2Z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }
  };

  const isActive = (path: string) => {
    const cleanPath = currentPath.split("?")[0];
    if (cleanPath === path) return "text-[#006c35] font-bold";
    if (currentPath.startsWith(path + "?") || currentPath.startsWith(path + "/")) return "text-[#006c35] font-bold";
    return "text-slate-700 hover:text-[#006c35] transition-colors";
  };

  return (
    <header className="w-full z-50 bg-white">
      {/* Top Banner Bar */}
      <div className="bg-brand-950 text-slate-200 text-xs py-2 px-4 border-b border-brand-900 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-brand-100" />
              <a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a>
            </span>
            {settings.email2 && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-100" />
                <a href={`mailto:${settings.email2}`} className="hover:underline">{settings.email2}</a>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-brand-100" />
              <a href={`tel:${settings.phone}`} className="hover:underline">{settings.phone}</a>
            </span>
            {settings.phone2 && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-100" />
                <a href={`tel:${settings.phone2}`} className="hover:underline">{settings.phone2}</a>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-brand-100 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              WHO-GMP & ISO 9001:2015 Certified
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-brand-300" />
              Corporate Unit
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`w-full transition-all duration-300 ${
        isSticky 
          ? "fixed top-0 bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-2.5" 
          : "relative bg-white py-3.5 border-b border-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
          {/* Mobile Logo & Menu Controls */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <Logo isMobile={true} />
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-700 hover:text-[#006c35]"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Exact Same Split Navigation Menu with Hover Megamenus */}
          <nav className="hidden lg:flex items-center justify-between w-full">
            
            {/* Left Side Links: Home | About us | Facility | Divisions */}
            <div className="flex items-center gap-5">
              <button 
                onClick={() => { onChangePath("home"); setActiveDropdown(null); }} 
                onMouseEnter={() => setActiveDropdown(null)}
                className={`${isActive("home")} cursor-pointer font-sans text-sm font-bold tracking-tight py-2`}
              >
                Home
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              
              <button 
                onClick={() => { onChangePath("about"); setActiveDropdown(null); }} 
                onMouseEnter={() => setActiveDropdown(null)}
                className={`${isActive("about")} cursor-pointer font-sans text-sm font-bold tracking-tight py-2`}
              >
                About us
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              
              {/* Facility hover/click megamenu anchor */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter("facility")}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  onClick={() => { setActiveDropdown(activeDropdown === "facility" ? null : "facility"); }} 
                  onMouseEnter={() => handleMouseEnter("facility")}
                  className={`${isActive("facility")} cursor-pointer font-sans text-sm font-bold tracking-tight py-2 flex items-center gap-1`}
                >
                  <span>Facility</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "facility" ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === "facility" && (
                  <div 
                    onMouseEnter={() => handleMouseEnter("facility")}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl z-50 p-2.5 rounded-lg min-w-[240px] animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <button 
                      onClick={() => { onChangePath("facility"); setActiveDropdown(null); }}
                      className="w-full text-center bg-[#006c35] text-white hover:bg-[#00552a] font-sans font-bold text-sm tracking-tight py-3 px-5 rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Third Party Manufacturing
                    </button>
                  </div>
                )}
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              
              {/* Divisions hover/click megamenu anchor */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter("divisions")}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  onClick={() => { onChangePath("divisions"); setActiveDropdown(null); }} 
                  onMouseEnter={() => handleMouseEnter("divisions")}
                  className={`${isActive("divisions")} cursor-pointer font-sans text-sm font-bold tracking-tight py-2 flex items-center gap-1`}
                >
                  <span>Divisions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "divisions" ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Center: Brand Logo */}
            <div className="shrink-0 px-6" onMouseEnter={() => setActiveDropdown(null)}>
              <Logo isMobile={false} />
            </div>

            {/* Right Side Links: New Launches | Product Range | Contact us */}
            <div className="flex items-center gap-5">
              <button 
                onClick={() => { onChangePath("new-launches"); setActiveDropdown(null); }} 
                onMouseEnter={() => setActiveDropdown(null)}
                className={`${isActive("new-launches")} cursor-pointer font-sans text-sm font-bold tracking-tight py-2`}
              >
                New Launches
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              
              {/* Product Range hover megamenu anchor */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter("products")}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  onClick={() => { onChangePath("products"); setActiveDropdown(null); }} 
                  onMouseEnter={() => handleMouseEnter("products")}
                  className={`${isActive("products")} cursor-pointer font-sans text-sm font-bold tracking-tight py-2 flex items-center gap-1`}
                >
                  <span>Product Range</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "products" ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              
              <button 
                onClick={() => { onChangePath("contact"); setActiveDropdown(null); }} 
                onMouseEnter={() => setActiveDropdown(null)}
                className={`${isActive("contact")} cursor-pointer font-sans text-sm font-bold tracking-tight py-2`}
              >
                Contact us
              </button>
              
              <div className="h-4 w-[1px] bg-slate-200 ml-2" onMouseEnter={() => setActiveDropdown(null)} />
              <button 
                onClick={() => setIsSearchOpen(true)}
                onMouseEnter={() => setActiveDropdown(null)}
                className="p-2 text-slate-700 hover:text-[#006c35] transition-colors cursor-pointer"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>



            {/* 2. DIVISIONS MEGAMENU CONTAINER */}
            {activeDropdown === "divisions" && (
              <div 
                onMouseEnter={() => handleMouseEnter("divisions")}
                onMouseLeave={handleMouseLeave}
                className="absolute top-full left-0 right-0 w-full bg-white border-y border-slate-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 py-6 text-left"
              >
                <div className="max-w-4xl mx-auto px-6">
                  {/* 2x4 Solid Green Grid representing divisions with pointer cursors */}
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg shadow-inner">
                    {[
                      { id: "bluewater", name: "BLUEWATER RESEARCH" },
                      { id: "syntonix", name: "SYNTONIX BIOFARM" },
                      { id: "greenleaf", name: "GREENLEAF" },
                      { id: "mission", name: "MISSION LAB" },
                      { id: "daniel", name: "DANIEL PASTEUR" },
                      { id: "carebotanicals", name: "CARE BOTANICALS" },
                      { id: "advancerevive", name: "ADVANCE REVIVE" },
                      { id: "heninlukinz", name: "HENIN LUKINZ PHARMA" },
                    ].map((div) => (
                      <button
                        key={div.id}
                        onClick={() => {
                          onChangePath(`divisions?id=${div.id}`);
                          setActiveDropdown(null);
                        }}
                        className="bg-[#008c45] hover:bg-[#006c35] text-white font-sans font-black text-xs sm:text-sm tracking-widest py-5 px-6 text-center rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[64px] select-none hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] hover:z-10"
                      >
                        {div.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. PRODUCT RANGE MEGAMENU CONTAINER */}
            {activeDropdown === "products" && (
              <div 
                onMouseEnter={() => handleMouseEnter("products")}
                onMouseLeave={handleMouseLeave}
                className="absolute top-full left-0 right-0 w-full bg-white border-y border-slate-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 py-6 text-left"
              >
                <div className="max-w-7xl mx-auto px-6">
                  {/* Grid of exactly 24 rectangular cells matching the screenshot */}
                  <div className="grid grid-cols-2 md:grid-cols-6 border border-white bg-white overflow-hidden shadow-md">
                    {[
                      { name: "ANTIBIOTICS", search: "Antibiotics" },
                      { name: "CAPSULE", search: "Capsule" },
                      { name: "CARDIAC AND DIABETIC RANGE", search: "Cardiac" },
                      { name: "DENTAL RANGE", search: "Dental" },
                      { name: "GARGLE", search: "Gargle" },
                      { name: "GUM PAINT", search: "Gum Paint" },
                      { name: "GYNAE PRODUCTS", search: "Gynae" },
                      { name: "MOUTHWASH", search: "Mouthwash" },
                      { name: "NASAL SPRAY", search: "Nasal" },
                      { name: "NUTRACEUTICAL", search: "Nutraceutical" },
                      { name: "ORAL PASTE", search: "Oral" },
                      { name: "PEDIATRIC RANGE", search: "Pediatric" },
                      { name: "PPI & GASTRO", search: "Gastro" },
                      { name: "SACHET", search: "Sachet" },
                      { name: "SHOT", search: "Shot" },
                      { name: "SOFTGEL", search: "Softgel" },
                      { name: "SOFT GELATIN", search: "Soft Gelatin" },
                      { name: "SYRUP", search: "Syrup" },
                      { name: "PHARMA TABLETS", search: "Tablets" },
                      { name: "TOOTHPASTE", search: "Toothpaste" },
                      { name: "COVID-19", search: "Covid" },
                      { name: "UNIQUE MOLECULES", search: "Unique" },
                      { name: "COSMETIC RANGE", search: "Cosmetic" },
                      { name: "DERMATOLOGY RANGE", search: "Dermatology" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onChangePath(`products?search=${encodeURIComponent(item.search)}`);
                          setActiveDropdown(null);
                        }}
                        className="bg-[#008c45] hover:bg-[#005c2d] text-white font-sans font-black text-[10px] sm:text-xs tracking-wider py-4 px-3 text-center border border-white transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[58px] select-none uppercase hover:shadow-inner hover:scale-[1.01] active:scale-[0.99] hover:z-10"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </nav>
        </div>
      </div>

      {/* Interactive Floating Search Overlay Panel */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-display font-semibold text-slate-800 text-sm">Search Pharma Database</span>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="p-4 bg-slate-50 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Enter generic composition, product name, or therapeutic segment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-slate-800 pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                  autoFocus
                />
              </div>
            </form>
            <div className="p-4 max-h-72 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-slate-400 font-medium px-2 mb-1 block">Matching Formulations</span>
                  {searchResults.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className="w-full text-left p-3 rounded-xl hover:bg-brand-50/40 flex justify-between items-center group transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 text-sm block group-hover:text-brand-600">{prod.name}</span>
                        <span className="text-xs text-slate-500 font-mono line-clamp-1 mt-0.5">{prod.composition}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90 group-hover:text-brand-500" />
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim().length > 1 ? (
                <div className="py-6 text-center text-slate-400 text-sm">
                  No formulations found matching "{searchQuery}"
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-xs">
                  Type at least 2 characters to trigger high-speed search index...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col justify-between p-6 animate-in slide-in-from-right duration-200">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="font-display font-bold text-slate-800 text-lg">{(settings.logoText || "Nishcura").split(' ')[0]} Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-3.5">
              <button onClick={() => { onChangePath("home"); setIsMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${currentPath === "home" ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"}`}>Home</button>
              <button onClick={() => { onChangePath("about"); setIsMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${currentPath === "about" ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"}`}>About Us</button>
              <button onClick={() => { onChangePath("facility"); setIsMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${currentPath === "facility" ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"}`}>Facility</button>
              <button onClick={() => { onChangePath("divisions"); setIsMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${currentPath === "divisions" ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"}`}>Divisions</button>
              <button onClick={() => { onChangePath("new-launches"); setIsMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${currentPath === "new-launches" ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"}`}>New Launches</button>
              <button onClick={() => { onChangePath("products"); setIsMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${currentPath.startsWith("products") ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"}`}>Product Range</button>
              <button onClick={() => { onChangePath("contact"); setIsMobileMenuOpen(false); }} className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${currentPath === "contact" ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"}`}>Contact Us</button>
            </nav>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-xs text-slate-500">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-[#006c35]">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-semibold">{settings.phone}</span>
              </a>
              {settings.phone2 && (
                <a href={`tel:${settings.phone2}`} className="flex items-center gap-2 hover:text-[#006c35]">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-semibold">{settings.phone2}</span>
                </a>
              )}
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-[#006c35]">
                <Mail className="w-3.5 h-3.5" />
                <span className="font-semibold">{settings.email}</span>
              </a>
              {settings.email2 && (
                <a href={`mailto:${settings.email2}`} className="flex items-center gap-2 hover:text-[#006c35]">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="font-semibold">{settings.email2}</span>
                </a>
              )}
            </div>
            <button 
              onClick={() => { onOpenQuickInquiry(); setIsMobileMenuOpen(false); }}
              className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md hover:bg-brand-700 text-center cursor-pointer"
            >
              Submit Inquiry Form
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
