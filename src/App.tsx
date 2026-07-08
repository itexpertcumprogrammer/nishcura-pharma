import React, { useState, useEffect } from "react";
import { 
  HeartPulse, Shield, Mail, Phone, Lock, EyeOff, ArrowLeft, 
  MessageSquare, X, Info, ShieldCheck, CheckCircle2, RefreshCw 
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FrontendWebsite from "./components/FrontendWebsite";
import AdminPanel from "./components/AdminPanel";
import { 
  WebsiteSettings, Slide, Category, Product, Service, Blog, FAQ, 
  Inquiry, Job, Testimonial, Certificate, GalleryItem, VideoItem 
} from "./types";

export default function App() {
  // Navigation & Pathing
  const [currentPath, setCurrentPath] = useState("home");

  // Database Models State
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newLaunches, setNewLaunches] = useState<any[]>([]);

  // Authentication State
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  // Global Quick Inquiry Modal State
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState("");
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Load database items from REST API
  const loadDatabaseData = async () => {
    try {
      // Settings
      const settingsRes = await fetch("/api/settings");
      if (settingsRes.ok) setSettings(await settingsRes.json());

      // Slides
      const slidesRes = await fetch("/api/slides");
      if (slidesRes.ok) setSlides(await slidesRes.json());

      // Categories
      const categoriesRes = await fetch("/api/categories");
      if (categoriesRes.ok) setCategories(await categoriesRes.json());

      // Products
      const productsRes = await fetch("/api/products");
      if (productsRes.ok) setProducts(await productsRes.json());

      // Services
      const servicesRes = await fetch("/api/services");
      if (servicesRes.ok) setServices(await servicesRes.json());

      // Blogs
      const blogsRes = await fetch("/api/blogs");
      if (blogsRes.ok) setBlogs(await blogsRes.json());

      // FAQs
      const faqsRes = await fetch("/api/faqs");
      if (faqsRes.ok) setFaqs(await faqsRes.json());

      // Jobs
      const jobsRes = await fetch("/api/jobs");
      if (jobsRes.ok) setJobs(await jobsRes.json());

      // Testimonials
      const testRes = await fetch("/api/testimonials");
      if (testRes.ok) setTestimonials(await testRes.json());

      // Certificates
      const certRes = await fetch("/api/certificates");
      if (certRes.ok) setCertificates(await certRes.json());

      // Gallery
      const galRes = await fetch("/api/gallery");
      if (galRes.ok) setGallery(await galRes.json());

      // Videos
      const vidRes = await fetch("/api/videos");
      if (vidRes.ok) setVideos(await vidRes.json());

      // New Launches
      const launchesRes = await fetch("/api/new-launches");
      if (launchesRes.ok) setNewLaunches(await launchesRes.json());
    } catch (err) {
      console.error("Error connecting to full-stack API", err);
    }
  };

  // Sync state navigation with window.location.hash and pathname
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const path = window.location.pathname;
      if (hash === "admin" || path === "/admin" || path.endsWith("/admin")) {
        setCurrentPath("admin");
        if (window.location.hash !== "#admin") {
          window.location.hash = "admin";
        }
      } else if (hash) {
        setCurrentPath(hash);
      } else {
        setCurrentPath("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial check
    handleHashChange();

    // Check if token exists in session
    const storedUser = localStorage.getItem("lifevision_admin");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }

    loadDatabaseData();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (settings) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = settings.metaTitle || "Lifevision Healthcare";
      document.title = tempDiv.textContent || tempDiv.innerText || "Lifevision Healthcare";
    }
  }, [settings]);

  const changePath = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });

      const body = await response.json();
      if (response.ok && body.success) {
        setAdminUser(body.user);
        localStorage.setItem("lifevision_admin", JSON.stringify(body.user));
        setLoginForm({ email: "", password: "" });
      } else {
        setLoginError(body.message || "Invalid authentication credentials.");
      }
    } catch (err) {
      setLoginError("Failed to connect to authentication gateway server.");
    }
  };

  // Simulated forgot password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const body = await res.json();
      if (res.ok) {
        setForgotMsg(body.message);
        setForgotEmail("");
      } else {
        setForgotMsg(body.message);
      }
    } catch (err) {
      setForgotMsg("Error sending password reset simulation request.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lifevision_admin");
    setAdminUser(null);
    changePath("home");
  };

  // Quick inquiry modal handler
  const handleOpenInquiryModal = (productName?: string) => {
    if (productName) {
      setInquiryProduct(productName);
    } else {
      setInquiryProduct("");
    }
    setInquirySuccess(false);
    setInquiryForm({ name: "", email: "", phone: "", message: "" });
    setIsInquiryOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone) return;

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          subject: inquiryProduct ? `Inquiry for formulation: ${inquiryProduct}` : "General Quick Inquiry",
          productName: inquiryProduct || undefined,
          message: inquiryForm.message || "Please share catalog pricelists."
        })
      });

      if (response.ok) {
        setInquirySuccess(true);
        setInquiryForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => {
          setIsInquiryOpen(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error submitting quick inquiry", err);
    }
  };

  // Safe fallback if settings are loading
  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans p-6 text-center">
        <div className="animate-spin text-brand-500 mb-4">
          <RefreshCw className="w-10 h-10" />
        </div>
        <p className="text-slate-400 text-sm">Please wait while Lifevision Healthcare system boots...</p>
      </div>
    );
  }

  // Render Admin Dashboard directly if route matches 'admin' and token verified
  if (currentPath.startsWith("admin") && adminUser) {
    return (
      <AdminPanel 
        onLogout={handleLogout}
        settings={settings}
        slides={slides}
        categories={categories}
        products={products}
        services={services}
        blogs={blogs}
        faqs={faqs}
        jobs={jobs}
        certificates={certificates}
        gallery={gallery}
        videos={videos}
        onRefreshData={loadDatabaseData}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* HEADER SECTION (Served unless active login panel) */}
      {!currentPath.startsWith("admin") && (
        <Header 
          currentPath={currentPath}
          onChangePath={changePath}
          categories={categories}
          products={products}
          settings={settings}
          onOpenQuickInquiry={handleOpenInquiryModal}
        />
      )}

      {/* PRIMARY CONTROLLER ROUTER COMPONENT */}
      <div className="flex-grow">
        {currentPath.startsWith("admin") && !adminUser ? (
          /* ADMIN LOGIN PANEL (Unauthenticated State) */
          <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-900 animate-in fade-in duration-150">
            <div className="bg-slate-950 p-8 md:p-10 rounded-2xl border border-slate-800 shadow-2xl max-w-md w-full relative">
              
              {/* Back to Home Button */}
              <button 
                onClick={() => changePath("home")}
                className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1 text-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back Home
              </button>

              <div className="text-center mt-6 mb-8">
                <div className="inline-flex bg-brand-600 text-white p-3 rounded-full mb-3 shadow-md">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <h2 className="font-display font-bold text-2xl text-white">Lifevision Admin Panel</h2>
                <p className="text-xs text-slate-400 mt-1">Provide administrator credentials to gain database access.</p>
              </div>

              {!showForgotPassword ? (
                /* Login form fields */
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Registered Email Address</label>
                    <input 
                      type="email" required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500"
                      placeholder="admin@lifevision.com"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">System Password</label>
                    <input 
                      type="password" required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500"
                      placeholder="••••••••"
                    />
                  </div>

                  {loginError && (
                    <div className="bg-rose-950/40 text-rose-400 text-xs p-3 rounded-xl border border-rose-900">
                      {loginError}
                    </div>
                  )}

                  {/* Dynamic Help Sandbox Banner */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex gap-2.5 items-start">
                    <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-300 block">Demonstration Credentials</span>
                      <span className="text-slate-400 block mt-1 leading-normal">
                        Email: <strong className="text-white">admin@lifevision.com</strong> <br />
                        Password: <strong className="text-white">admin123</strong>
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl cursor-pointer shadow-md mt-2"
                  >
                    Authenticate Securely
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setShowForgotPassword(true); setForgotMsg(""); }}
                    className="text-slate-500 hover:text-slate-300 font-semibold text-center mt-3"
                  >
                    Forgot System Password?
                  </button>
                </form>
              ) : (
                /* Forgot password mockup form */
                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Your Registered Email</label>
                    <input 
                      type="email" required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1"
                      placeholder="admin@lifevision.com"
                    />
                  </div>

                  {forgotMsg && (
                    <div className="bg-slate-900 text-slate-300 p-3 rounded-xl border border-slate-800 leading-normal">
                      {forgotMsg}
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl font-bold cursor-pointer">Simulate Reset</button>
                    <button type="button" onClick={() => setShowForgotPassword(false)} className="flex-1 bg-slate-900 text-slate-400 py-2.5 rounded-xl font-semibold">Back Login</button>
                  </div>
                </form>
              )}

            </div>
          </div>
        ) : (
          /* STANDARD WEBSITE AND SUBPAGES VIEW */
          <FrontendWebsite 
            currentPath={currentPath}
            onChangePath={changePath}
            settings={settings}
            slides={slides}
            categories={categories}
            products={products}
            services={services}
            blogs={blogs}
            faqs={faqs}
            jobs={jobs}
            testimonials={testimonials}
            certificates={certificates}
            gallery={gallery}
            videos={videos}
            newLaunches={newLaunches}
            onOpenQuickInquiry={handleOpenInquiryModal}
          />
        )}
      </div>

      {/* FOOTER SECTION */}
      {!currentPath.startsWith("admin") && (
        <Footer 
          settings={settings}
          categories={categories}
          onChangePath={changePath}
        />
      )}

      {/* GLOBAL MODAL POPUP: QUICK INQUIRY FORM */}
      {isInquiryOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 max-w-md w-full relative">
            <button 
              onClick={() => setIsInquiryOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="inline-flex bg-brand-50 text-brand-700 p-2.5 rounded-xl mb-3">
                <MessageSquare className="w-6 h-6" />
              </span>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                {inquiryProduct ? `Inquire for: ${inquiryProduct}` : "Direct Commercial Inquiry"}
              </h3>
              <p className="text-slate-400 text-xs mt-1">Get precise WHO-GMP contract manufacturing and distribution calculations.</p>
            </div>

            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Your Full Name *</label>
                <input 
                  type="text" required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Email Address *</label>
                  <input 
                    type="email" required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500"
                    placeholder="johndoe@example.com"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">Phone Number *</label>
                  <input 
                    type="tel" required
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500"
                    placeholder="+91-XXXXX-XXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Custom Requirements / Notes</label>
                <textarea 
                  rows={3}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500"
                  placeholder={inquiryProduct ? `Specify MOQ tablets, target packaging for ${inquiryProduct}...` : "Specify your composition requirements..."}
                />
              </div>

              {inquirySuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-xs p-3.5 rounded-xl border border-emerald-100 font-semibold">
                  ✓ Inquiry saved successfully into the database records.
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Submit Form
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
