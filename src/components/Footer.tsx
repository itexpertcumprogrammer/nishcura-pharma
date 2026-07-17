import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { Category, WebsiteSettings } from "../types";

// Helper to render icon dynamically
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

interface FooterProps {
  settings: WebsiteSettings;
  categories: Category[];
  onChangePath: (path: string) => void;
}

export default function Footer({ settings, categories, onChangePath }: FooterProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFooterLogoClick = () => {
    onChangePath("home");
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => {
      window.location.hash = "home";
      window.location.reload();
    }, 50);
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

  const Logo = () => {
    const useTextLogo = settings.logoType === "text";

    if (useTextLogo) {
      const textVal = settings.logoText || "Lifevision";
      const subVal = settings.logoTextSub || "healthcare";
      const { part1, part2 } = parseTextLogo(textVal);

      return (
        <div className="flex flex-col items-start justify-center cursor-pointer group" onClick={handleFooterLogoClick}>
          <div className="flex items-center">
            <span 
              className="font-bold text-2xl mr-1" 
              style={{ 
                fontFamily: settings.logoFontFamily || "Georgia, serif",
                color: settings.logoColor1 || "#22c55e"
              }}
            >
              {part1}
            </span>
            <span 
              className="font-bold text-2xl"
              style={{ 
                fontFamily: settings.logoFontFamily || "Georgia, serif",
                color: settings.logoColor2 || "#ffffff"
              }}
            >
              {part2}
            </span>
          </div>
          <div className="flex items-center gap-1 -mt-1 pl-4">
            <span 
              className="text-[8px] uppercase tracking-[0.2em] font-extrabold leading-none"
              style={{ 
                fontFamily: settings.logoFontFamily || "Georgia, serif",
                color: settings.logoSubtextColor || "#94a3b8"
              }}
            >
              {subVal}
            </span>
            <div style={{ color: settings.logoColor1 || "#22c55e" }}>
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C12,19.8 15.83,15.86 17,8M23,2C14.92,2.24 8.05,8.09 5.81,15.17C7.73,11.07 11.39,7.18 16.5,6.11C15.5,8.11 13,10.61 10.62,12.63C13.1,10.84 16.27,8.2 18,6C19,8.5 17.5,12.5 15,15C18.15,12.65 21.12,8.13 23,2Z" />
              </svg>
            </div>
          </div>
        </div>
      );
    } else {
      const imgUrl = settings.logoImageDesktop || settings.logoImageMobile;
      if (imgUrl) {
        return (
          <div className="flex items-center justify-start cursor-pointer" onClick={handleFooterLogoClick}>
            <img 
              src={imgUrl} 
              alt={settings.companyName || "Lifevision"} 
              className="max-h-12 w-auto object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }

      // Default hardcoded brand logo fallback
      return (
        <div className="flex flex-col items-start justify-center cursor-pointer group" onClick={handleFooterLogoClick}>
          <div className="flex items-center">
            <span className="font-serif italic font-extrabold text-2xl text-[#22c55e] tracking-tight mr-1" style={{ fontFamily: "Georgia, serif" }}>
              Life
            </span>
            <span className="font-sans font-black text-2xl text-white tracking-tighter">
              vision
            </span>
          </div>
          <div className="flex items-center gap-1 -mt-1 pl-4">
            <span className="text-[8px] font-sans uppercase tracking-[0.2em] font-extrabold text-slate-400 leading-none">
              healthcare
            </span>
            <div className="text-emerald-400">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C12,19.8 15.83,15.86 17,8M23,2C14.92,2.24 8.05,8.09 5.81,15.17C7.73,11.07 11.39,7.18 16.5,6.11C15.5,8.11 13,10.61 10.62,12.63C13.1,10.84 16.27,8.2 18,6C19,8.5 17.5,12.5 15,15C18.15,12.65 21.12,8.13 23,2Z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }
  };

  // Parse custom links
  const defaultCol1Links = [
    { title: "Blog", path: "blogs" },
    { title: "Third Party Blogs", path: "blogs?type=third-party" },
    { title: "Top Blogs", path: "blogs?type=top" },
    { title: "Third Party Manufacturing Pharma Companies", path: "divisions" },
    { title: "Pharma Contract Manufacturing", path: "facility" }
  ];

  const defaultCol2Links = [
    { title: "Home", path: "home" },
    { title: "About us", path: "about" },
    { title: "Third Party Manufacturing", path: "facility" },
    { title: "Track your Order", path: "contact" },
    { title: "Privacy Policy", path: "privacy-policy" },
    { title: "Contact us", path: "contact" }
  ];

  const defaultCopyrightLinks = [
    { title: "Privacy Policy", path: "privacy-policy" },
    { title: "Terms & Conditions", path: "terms-conditions" }
  ];

  let col1Links = defaultCol1Links;
  try {
    if (settings.footerLinksCol1Json) {
      col1Links = JSON.parse(settings.footerLinksCol1Json);
    }
  } catch (e) {
    console.error("Error parsing footer links column 1", e);
  }

  let col2Links = defaultCol2Links;
  try {
    if (settings.footerLinksCol2Json) {
      col2Links = JSON.parse(settings.footerLinksCol2Json);
    }
  } catch (e) {
    console.error("Error parsing footer links column 2", e);
  }

  let copyrightLinks = defaultCopyrightLinks;
  try {
    if (settings.copyrightLinksJson) {
      copyrightLinks = JSON.parse(settings.copyrightLinksJson);
    }
  } catch (e) {
    console.error("Error parsing copyright links", e);
  }

  const socialBg = settings.socialBgColor || "#004a80";

  return (
    <footer 
      className="relative text-slate-300 font-sans border-t border-slate-800 pb-16 lg:pb-16"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(10, 15, 30, 0.94) 0%, rgba(5, 7, 15, 0.99) 100%), url('https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&q=80&w=1000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      {/* Main Footer Layout Container */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Column 1: Brand Logo, Description & Special Links (5/12 span) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Logo />
          
          <p className="text-slate-300 text-sm leading-relaxed max-w-md">
            {settings.footerAboutText || "We have been widely appreciated by our clients as dependable business partner, which can guide them in the consumer markets with expertise and tenacity."}
          </p>

          <div className="flex flex-col gap-2.5 mt-2">
            {col1Links.map((link, idx) => (
              <button 
                key={idx}
                onClick={() => onChangePath(link.path)} 
                className="text-[#38bdf8] hover:text-[#0ea5e9] transition-colors text-sm font-semibold text-left flex items-center gap-1 cursor-pointer"
              >
                • {link.title}
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links (3/12 span) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <h3 className="font-display font-extrabold text-white text-base tracking-wider uppercase border-b border-slate-800 pb-2.5">
            {settings.footerCol2Title || "QUICK LINKS"}
          </h3>
          <ul className="flex flex-col gap-3.5 text-sm">
            {col2Links.map((link, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => onChangePath(link.path)} 
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  {link.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Address & Contacts & Social Follow (4/12 span) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <h3 className="font-display font-extrabold text-white text-base tracking-wider uppercase border-b border-slate-800 pb-2.5">
            {settings.footerCol3Title || "OUR ADDRESS"}
          </h3>

          <div className="flex flex-col gap-5 text-sm">
            {/* Address 1 */}
            <div className="flex gap-3 items-start">
              <DynamicIcon name={settings.footerAddress1Icon || "MapPin"} className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <span className="text-slate-300 leading-relaxed font-medium">
                {settings.footerAddress1 || "PLOT NO 11-12, DANIK BHASKAR BUILDING, SECTOR 25-D, CHANDIGARH – 160014, INDIA"}
              </span>
            </div>

            {/* Address 2 */}
            <div className="flex gap-3 items-start">
              <DynamicIcon name={settings.footerAddress2Icon || "MapPin"} className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <span className="text-slate-300 leading-relaxed font-medium">
                {settings.footerAddress2 || "Plot No. 140, EPIP, Phase 1, Jharmajri Baddi, District Solan, Himachal Pradesh – 173205, India"}
              </span>
            </div>

            {/* Phone Call */}
            <div className="flex gap-3 items-center">
              <DynamicIcon name={settings.footerPhoneIcon || "Phone"} className="w-5 h-5 text-white shrink-0" />
              <div className="flex flex-col">
                <a href={`tel:${settings.footerPhone || settings.phone || "+91 97790 02650"}`} className="text-slate-300 hover:text-white font-bold transition-colors">
                  {settings.footerPhone || settings.phone || "+91 97790 02650"}
                </a>
                {settings.phone2 && (
                  <a href={`tel:${settings.phone2}`} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {settings.phone2}
                  </a>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="flex gap-3 items-start">
              <DynamicIcon name={settings.footerEmailIcon || "Mail"} className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a href={`mailto:${settings.footerEmail || settings.email || "nishcurapharma@gmail.com"}`} className="text-[#38bdf8] hover:underline break-all">
                  {settings.footerEmail || settings.email || "nishcurapharma@gmail.com"}
                </a>
                {settings.email2 && (
                  <a href={`mailto:${settings.email2}`} className="text-[#38bdf8] hover:underline break-all text-sm">
                    {settings.email2}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Social icons block */}
          <div className="mt-4 flex flex-col gap-3">
            <span className="font-display font-extrabold text-white text-xs uppercase tracking-wider block">
              {settings.footerFollowUsTitle || "FOLLOW US"}
            </span>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              {settings.showFacebook !== false && (
                <a 
                  href={settings.facebookUrl || "#"} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ backgroundColor: socialBg }}
                  className="w-10 h-10 hover:brightness-110 text-white flex items-center justify-center rounded-xl shadow transition-all cursor-pointer"
                  title="Facebook"
                >
                  <DynamicIcon name="Facebook" className="w-5 h-5" />
                </a>
              )}

              {/* Instagram */}
              {settings.showInstagram !== false && (
                <a 
                  href={settings.instagramUrl || "#"} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ backgroundColor: socialBg }}
                  className="w-10 h-10 hover:brightness-110 text-white flex items-center justify-center rounded-xl shadow transition-all cursor-pointer"
                  title="Instagram"
                >
                  <DynamicIcon name="Instagram" className="w-5 h-5" />
                </a>
              )}

              {/* LinkedIn */}
              {settings.showLinkedin !== false && (
                <a 
                  href={settings.linkedinUrl || "#"} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ backgroundColor: socialBg }}
                  className="w-10 h-10 hover:brightness-110 text-white flex items-center justify-center rounded-xl shadow transition-all cursor-pointer"
                  title="LinkedIn"
                >
                  <DynamicIcon name="Linkedin" className="w-5 h-5" />
                </a>
              )}

              {/* Pinterest */}
              {settings.showPinterest !== false && (
                <a 
                  href={settings.footerPinterestUrl || "#"} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ backgroundColor: socialBg }}
                  className="w-10 h-10 hover:brightness-110 text-white flex items-center justify-center rounded-xl shadow transition-all cursor-pointer"
                  title="Pinterest"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.14 9.43 7.62 11.17-.1-.95-.2-2.41.04-3.44.22-.94 1.4-5.95 1.4-5.95s-.36-.72-.36-1.77c0-1.66.96-2.89 2.15-2.89 1.02 0 1.51.76 1.51 1.67 0 1.02-.65 2.55-.98 3.97-.28 1.18.59 2.14 1.75 2.14 2.1 0 3.72-2.22 3.72-5.42 0-2.83-2.04-4.81-4.94-4.81-3.37 0-5.34 2.53-5.34 5.14 0 1.02.39 2.11.88 2.71.1.12.11.23.08.35-.09.37-.29 1.18-.33 1.34-.05.2-.17.25-.39.15-1.46-.68-2.38-2.82-2.38-4.54 0-3.7 2.69-7.11 7.76-7.11 4.07 0 7.24 2.9 7.24 6.78 0 4.05-2.55 7.3-6.09 7.3-1.19 0-2.31-.62-2.69-1.35l-.73 2.79c-.26 1.01-.98 2.28-1.46 3.06C9.17 23.63 10.54 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom copyright segment bar */}
      <div className="bg-slate-950/80 text-slate-500 text-xs py-5 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[12px] text-slate-400 font-medium">
            {settings.footerCopyrightText || "2019, All Right Reserved @ Nishcura Pharmaceuticals | Web Design & Development By WebHopers"}
          </p>
          <div className="flex gap-4 text-[11px] text-slate-400">
            {copyrightLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                <button onClick={() => onChangePath(link.path)} className="hover:text-white transition-colors">
                  {link.title}
                </button>
                {idx < copyrightLinks.length - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Elevated Persistent Floating WhatsApp Widget Button */}
      {settings.showWhatsAppWidget !== false && (
        <a 
          href={`https://wa.me/${settings.whatsappNumber || "919779002650"}?text=${encodeURIComponent(settings.whatsappMessage || "Hello Nishcura Pharmaceuticals, I am interested in your manufacturing / franchise services. Please guide.")}`}
          target="_blank" 
          rel="noreferrer"
          className={`fixed bottom-20 right-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 flex items-center justify-center ${settings.whatsappPulseEffect !== false ? "pulse-highlight" : ""}`}
          title="Chat on WhatsApp"
          id="whatsapp-widget"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.832 0c3.152.001 6.116 1.23 8.347 3.463 2.229 2.23 3.456 5.192 3.455 8.344-.004 6.507-5.33 11.828-11.83 11.828-2.007-.001-3.98-.51-5.725-1.486L0 24zm6.59-4.846c1.6.95 3.182 1.449 4.825 1.451 5.436 0 9.86-4.417 9.864-9.848.002-2.63-1.023-5.102-2.89-6.969-1.866-1.868-4.339-2.893-6.974-2.895-5.437 0-9.857 4.418-9.86 9.85-.001 1.778.475 3.514 1.378 5.035L1.932 21.68l4.715-1.526zM17.51 15.01c-.303-.152-1.794-.885-2.047-.978-.254-.093-.44-.139-.626.139-.186.279-.722.907-.885 1.093-.163.186-.326.209-.628.058-.302-.15-1.275-.47-2.429-1.493-.898-.802-1.505-1.792-1.681-2.093-.177-.302-.019-.465.132-.614.136-.134.302-.35.453-.524.152-.174.202-.29.303-.483.101-.193.05-.362-.025-.512-.074-.15-.626-1.507-.857-2.064-.224-.54-.471-.466-.647-.475-.167-.008-.36-.01-.555-.01-.195 0-.511.073-.779.362-.268.289-1.023 1.002-1.023 2.441 0 1.439 1.047 2.83 1.193 3.023.146.193 2.06 3.146 4.992 4.414.697.302 1.241.482 1.666.617.702.223 1.341.192 1.846.116.564-.085 1.794-.733 2.047-1.442.254-.709.254-1.317.178-1.442-.076-.126-.279-.203-.582-.355z" />
          </svg>
        </a>
      )}

      {/* Elevated Floating Scroll To Top Widget */}
      {settings.showScrollToTopWidget !== false && showScrollTop && (
        <button 
          onClick={scrollToTop}
          style={{ backgroundColor: settings.scrollTopWidgetBg || "#004a80" }}
          className="fixed bottom-[144px] right-6 text-white p-3.5 rounded-full shadow-2xl border border-slate-700 hover:brightness-110 active:scale-95 transition-all z-40 cursor-pointer"
          title="Scroll to Top"
          id="scroll-to-top"
        >
          <DynamicIcon name="ArrowUp" className="w-5 h-5" />
        </button>
      )}

      {/* Sticky Bottom Action Call & Message Bar */}
      {settings.showMobileBottomBar !== false && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 text-white font-sans shadow-[0_-4px_16px_rgba(0,0,0,0.15)] select-none">
          {/* Left half: Call Us */}
          <a 
            href={`tel:${settings.mobileLeftPhone || settings.footerPhone || settings.phone || "+91 97790 02650"}`} 
            style={{ backgroundColor: settings.mobileLeftBg || "#006c35" }}
            className="flex-1 hover:brightness-110 flex items-center justify-center gap-2 font-bold tracking-wide transition-colors cursor-pointer text-sm sm:text-base"
          >
            <svg className="w-5 h-5 fill-current animate-pulse" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.27 1.11l-2.2 2.2z" />
            </svg>
            <span>{settings.mobileLeftLabel || `Call: ${settings.mobileLeftPhone || settings.footerPhone || settings.phone || "+91 97790 02650"}`}</span>
          </a>
          
          {/* Right half: Get Third Party & PCD */}
          <button 
            onClick={() => onChangePath(settings.mobileRightPath || "contact")} 
            style={{ backgroundColor: settings.mobileRightBg || "#004a80" }}
            className="flex-1 hover:brightness-110 flex items-center justify-center gap-2 font-bold tracking-wide transition-colors cursor-pointer text-sm sm:text-base border-l border-white/10"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>{settings.mobileRightLabel || "Get Third Party & PCD"}</span>
          </button>
        </div>
      )}

    </footer>
  );
}
