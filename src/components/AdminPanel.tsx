import React, { useState, useEffect } from "react";
import { 
  Settings, LayoutDashboard, Sliders, FolderTree, Package, 
  MessageSquare, Briefcase, Award, Image as ImageIcon, FileText, 
  Trash2, Plus, Edit2, Check, X, Search, LogOut, ChevronDown, 
  TrendingUp, Users, Download, Activity, Database, Key, ShieldCheck, CheckCircle2, RefreshCw
} from "lucide-react";
import { 
  WebsiteSettings, Slide, Category, Product, Service, Blog, FAQ, 
  Inquiry, Job, JobApplication, Testimonial, Certificate, GalleryItem, 
  VideoItem, ActivityLog, User 
} from "../types";
import RichTextEditor from "./RichTextEditor";
import MediaUploader from "./MediaUploader";

interface AdminProps {
  onLogout: () => void;
  settings: WebsiteSettings;
  slides: Slide[];
  categories: Category[];
  products: Product[];
  services: Service[];
  blogs: Blog[];
  faqs: FAQ[];
  jobs: Job[];
  certificates: Certificate[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  onRefreshData: () => void;
}

export default function AdminPanel({
  onLogout,
  settings,
  slides,
  categories,
  products,
  services,
  blogs,
  faqs,
  jobs,
  certificates,
  gallery,
  videos,
  onRefreshData
}: AdminProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "settings" | "slides" | "categories" | "products" | "services" | 
    "blogs" | "faqs" | "jobs" | "applications" | "inquiries" | "certificates" | "logs" | "system" |
    "navigation-section" | "footer-section" | "company-info" | "team-members"
  >("dashboard");

  // Analytics states
  const [analytics, setAnalytics] = useState<any>(null);

  // Search, filter, sorting inside tables
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("");
  const [inquirySearch, setInquirySearch] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Logs
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Editing items
  const [editingSettings, setEditingSettings] = useState<WebsiteSettings>({ ...settings });
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingSlide, setEditingSlide] = useState<Partial<Slide> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQ> | null>(null);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Partial<Certificate> | null>(null);

  // Inquiries & Applications inbox
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Feedback notifications
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [systemMsg, setSystemMsg] = useState("");

  // Company Info state
  const [companyInfo, setCompanyInfo] = useState<any>({});
  const [editingCompanyInfo, setEditingCompanyInfo] = useState<any>({});
  const [companyInfoSaved, setCompanyInfoSaved] = useState(false);

  // Team Members state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  // Fetch initial analytical datasets
  const loadAnalyticsAndInboxes = async () => {
    try {
      const resAnal = await fetch("/api/analytics");
      if (resAnal.ok) setAnalytics(await resAnal.json());
      const resInq = await fetch("/api/inquiries");
      if (resInq.ok) setInquiries(await resInq.json());
      const resApp = await fetch("/api/applications");
      if (resApp.ok) setApplications(await resApp.json());
      const resLogs = await fetch("/api/logs");
      if (resLogs.ok) setLogs(await resLogs.json());
      const resCi = await fetch("/api/company-info");
      if (resCi.ok) { const ci = await resCi.json(); setCompanyInfo(ci); setEditingCompanyInfo(ci); }
      const resTm = await fetch("/api/team-members");
      if (resTm.ok) setTeamMembers(await resTm.json());
    } catch (err) {
      console.error("Error loading administrative datasets", err);
    }
  };

  useEffect(() => {
    loadAnalyticsAndInboxes();
  }, [activeTab]);

  useEffect(() => {
    if (settings) {
      setEditingSettings({ ...settings });
    }
  }, [settings]);

  const triggerRefresh = () => {
    onRefreshData();
    loadAnalyticsAndInboxes();
  };

  // 1. Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSettings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Company Info
  const handleSaveCompanyInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/company-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCompanyInfo)
      });
      if (res.ok) {
        setCompanyInfo(editingCompanyInfo);
        setCompanyInfoSaved(true);
        setTimeout(() => setCompanyInfoSaved(false), 3000);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Team Member CRUD
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.designation) return;
    const isNew = !editingMember.id;
    const url = isNew ? "/api/team-members" : `/api/team-members/${editingMember.id}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember)
      });
      if (res.ok) {
        setEditingMember(null);
        const resTm = await fetch("/api/team-members");
        if (resTm.ok) setTeamMembers(await resTm.json());
        triggerRefresh();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    try {
      const res = await fetch(`/api/team-members/${id}`, { method: "DELETE" });
      if (res.ok) {
        const resTm = await fetch("/api/team-members");
        if (resTm.ok) setTeamMembers(await resTm.json());
      }
    } catch (err) { console.error(err); }
  };

  // Image upload helper
  const handleImageUpload = async (file: File, onSuccess: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData: base64, fileName: file.name })
        });
        if (res.ok) {
          const data = await res.json();
          onSuccess(data.url);
        }
      } catch (err) { console.error("Upload failed", err); }
    };
    reader.readAsDataURL(file);
  };

  // 2. Product operations
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.categoryId) return;
    
    const isNew = !editingProduct.id;
    const url = isNew ? "/api/products" : `/api/products/${editingProduct.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          composition: editingProduct.composition || "General",
          packSize: editingProduct.packSize || "10x10",
          packType: editingProduct.packType || "Alu-Alu",
          description: editingProduct.description || "Pharma compound",
          indications: editingProduct.indications || "N/A",
          dosage: editingProduct.dosage || "N/A",
          imageUrl: editingProduct.imageUrl || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400",
          isFeatured: !!editingProduct.isFeatured,
          status: editingProduct.status || "active",
          ...editingProduct
        })
      });

      if (res.ok) {
        setEditingProduct(null);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this formulation?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk products operations
  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedProductIds.length} selected products?`)) return;
    try {
      const res = await fetch("/api/products/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedProductIds })
      });
      if (res.ok) {
        setSelectedProductIds([]);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // CSV export product list
  const exportProductsCSV = () => {
    const headers = ["ID", "Name", "Composition", "Pack Size", "Pack Type", "Featured", "Status"];
    const rows = products.map(p => [
      p.id,
      p.name,
      p.composition.replace(/,/g, ";"),
      p.packSize,
      p.packType,
      p.isFeatured ? "TRUE" : "FALSE",
      p.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "lifevision_formulations_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Category operations
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    const isNew = !editingCategory.id;
    const url = isNew ? "/api/categories" : `/api/categories/${editingCategory.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editingCategory.description || "",
          imageUrl: editingCategory.imageUrl || "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=400",
          ...editingCategory
        })
      });
      if (res.ok) {
        setEditingCategory(null);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete the therapeutic segmentation folder.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Slide operations
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide?.title) return;
    const isNew = !editingSlide.id;
    const url = isNew ? "/api/slides" : `/api/slides/${editingSlide.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtitle: editingSlide.subtitle || "",
          imageUrl: editingSlide.imageUrl || "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?q=80&w=600",
          link: editingSlide.link || "#products",
          ...editingSlide
        })
      });
      if (res.ok) {
        setEditingSlide(null);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    try {
      const res = await fetch(`/api/slides/${id}`, { method: "DELETE" });
      if (res.ok) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Inquiries operations
  const handleUpdateInquiryStatus = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message record?")) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Export Inquiries to CSV
  const exportInquiriesCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Subject", "Product", "Message", "Status", "Date"];
    const rows = inquiries.map(i => [
      i.id,
      i.name,
      i.email,
      i.phone,
      i.subject.replace(/,/g, ";"),
      i.productName || "N/A",
      i.message.replace(/,/g, ";").replace(/\n/g, " "),
      i.status,
      i.createdAt
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "lifevision_inbox_messages.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6. Application operations
  const handleUpdateApplicationStatus = async (id: string, status: "pending" | "reviewed" | "shortlisted" | "rejected") => {
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application log?")) return;
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (res.ok) triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 7. System operations
  const handleClearCache = async () => {
    try {
      const res = await fetch("/api/system/clear-cache", { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        setSystemMsg(body.message);
        setTimeout(() => setSystemMsg(""), 5000);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackupDb = async () => {
    try {
      const res = await fetch("/api/system/backup", { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        setSystemMsg(body.message);
        setTimeout(() => setSystemMsg(""), 5000);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to wipe historic log activities?")) return;
    try {
      const res = await fetch("/api/logs/clear", { method: "POST" });
      if (res.ok) {
        setSystemMsg("Logs wiped successfully.");
        setTimeout(() => setSystemMsg(""), 4000);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filters for product table list
  const tableProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.composition.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter ? p.categoryId === productCategoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row font-sans">
      
      {/* Dynamic Navigation Drawer Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-5">
            <div className="bg-brand-600 text-white p-2 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm block">Lifevision Admin</span>
              <span className="text-[10px] text-brand-400 uppercase tracking-widest font-semibold block mt-0.5">Control Panel</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "settings" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Settings className="w-4 h-4" /> Website Settings & SEO
            </button>
            <button 
              onClick={() => setActiveTab("navigation-section")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "navigation-section" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <ImageIcon className="w-4 h-4" /> Header & Logos (Navigation)
            </button>
            <button 
              onClick={() => setActiveTab("footer-section")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "footer-section" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Database className="w-4 h-4" /> Footer Management
            </button>
            <button 
              onClick={() => setActiveTab("company-info")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "company-info" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <ShieldCheck className="w-4 h-4" /> GST & Certifications
            </button>
            <button 
              onClick={() => setActiveTab("team-members")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "team-members" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Users className="w-4 h-4" /> Team Members
            </button>
            <button 
              onClick={() => setActiveTab("slides")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "slides" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Sliders className="w-4 h-4" /> Hero Slider Manager
            </button>
            <button 
              onClick={() => setActiveTab("categories")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "categories" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <FolderTree className="w-4 h-4" /> Therapeutic Segments
            </button>
            <button 
              onClick={() => setActiveTab("products")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "products" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Package className="w-4 h-4" /> Formulations (CRUD)
            </button>
            <button 
              onClick={() => setActiveTab("inquiries")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "inquiries" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <MessageSquare className="w-4 h-4" /> Visitor Inquiries
              {analytics?.summary?.unreadInquiries > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  {analytics.summary.unreadInquiries}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("jobs")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "jobs" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Briefcase className="w-4 h-4" /> Job Openings (Careers)
            </button>
            <button 
              onClick={() => setActiveTab("applications")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "applications" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <FileText className="w-4 h-4" /> Job Applications
            </button>
            <button 
              onClick={() => setActiveTab("logs")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "logs" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Activity className="w-4 h-4" /> System Audit Logs
            </button>
            <button 
              onClick={() => setActiveTab("system")}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${activeTab === "system" ? "bg-brand-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
            >
              <Database className="w-4 h-4" /> Backups & Operations
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-[11px] text-slate-400 border border-slate-800">
            Signed in as: <strong className="text-white block mt-0.5">Admin Manager</strong>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors flex justify-center items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Exit Dashboard
          </button>
        </div>
      </aside>

      {/* Primary Dashboard Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-h-screen overflow-y-auto">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="font-display font-bold text-xl md:text-3xl text-white tracking-tight capitalize">
              {activeTab} Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">Configure and audits formulation listings and client feedback logs.</p>
          </div>
          <button 
            onClick={triggerRefresh}
            className="flex items-center gap-1 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-semibold py-2 px-3.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Cache
          </button>
        </div>

        {/* 1. TAB: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && analytics && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-150">
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
                <span className="font-display font-bold text-2xl text-white mt-1.5 block">{analytics.summary.totalInquiries}</span>
              </div>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Unread Inquiries</span>
                <span className="font-display font-bold text-2xl text-rose-400 mt-1.5 block">{analytics.summary.unreadInquiries}</span>
              </div>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Formulations</span>
                <span className="font-display font-bold text-2xl text-white mt-1.5 block">{analytics.summary.totalProducts}</span>
              </div>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Job Applications</span>
                <span className="font-display font-bold text-2xl text-white mt-1.5 block">{analytics.summary.totalApplications}</span>
              </div>
            </div>

            {/* Simulated interactive charts using styled pure elements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Month timeline */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-display font-bold text-sm text-slate-200 mb-6 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                  Monthly Inquiry Velocity (2026)
                </h3>
                <div className="flex justify-between items-end h-40 gap-3 pt-4">
                  {analytics.messageTimeline.map((item: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] text-brand-400 font-bold font-mono">{item.count}</span>
                      <div 
                        className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-md transition-all duration-500 hover:from-brand-500"
                        style={{ height: `${Math.max(12, (item.count / 35) * 100)}px` }}
                      />
                      <span className="text-[10px] text-slate-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Therapeutic category distribution */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-display font-bold text-sm text-slate-200 mb-6 flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4 text-brand-500" />
                  Product Distribution By Division
                </h3>
                <div className="flex flex-col gap-4">
                  {analytics.categoryDistribution.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{item.name}</span>
                        <span className="text-brand-400 font-mono">{item.count} products</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-brand-600 h-full rounded-full" 
                          style={{ width: `${(item.count / Math.max(1, products.length)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: WEBSITE SETTINGS & SEO */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-8 animate-in fade-in duration-150">
            
            {/* Section 1: Company Identity */}
            <div>
              <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-500 rounded-full"></span> Company Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Company Name *</label>
                  <input type="text" value={editingSettings.companyName}
                    onChange={(e) => setEditingSettings({ ...editingSettings, companyName: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Tagline / Slogan</label>
                  <input type="text" value={editingSettings.tagline || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, tagline: e.target.value })}
                    placeholder="WHO-GMP Certified Pharma Manufacturing"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Logo Header Text</label>
                  <input type="text" value={editingSettings.logoText}
                    onChange={(e) => setEditingSettings({ ...editingSettings, logoText: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Website URL</label>
                  <input type="url" value={editingSettings.websiteUrl || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, websiteUrl: e.target.value })}
                    placeholder="https://nishcurapharmaceuticals.com"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 block mb-1.5 font-semibold">Company Address *</label>
                  <input type="text" value={editingSettings.address}
                    onChange={(e) => setEditingSettings({ ...editingSettings, address: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Business Hours</label>
                  <input type="text" value={editingSettings.businessHours || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, businessHours: e.target.value })}
                    placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Footer Copyright Text</label>
                  <input type="text" value={editingSettings.footerCopyrightText || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerCopyrightText: e.target.value })}
                    placeholder="© 2024 Nishcura Pharmaceuticals. All Rights Reserved."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div>
              <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Primary Phone *</label>
                  <input type="text" value={editingSettings.phone}
                    onChange={(e) => setEditingSettings({ ...editingSettings, phone: e.target.value })}
                    placeholder="+91 97790 02650"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Alternate Phone (Optional)</label>
                  <input type="text" value={editingSettings.phone2 || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, phone2: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Primary Email *</label>
                  <input type="email" value={editingSettings.email}
                    onChange={(e) => setEditingSettings({ ...editingSettings, email: e.target.value })}
                    placeholder="nishcurapharma@gmail.com"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Secondary Email (Optional)</label>
                  <input type="email" value={editingSettings.email2 || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, email2: e.target.value })}
                    placeholder="nishcurapharmaceuticals@gmail.com"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">WhatsApp Number (with country code)</label>
                  <input type="text" value={editingSettings.whatsappNumber}
                    onChange={(e) => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })}
                    placeholder="919779002650"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">WhatsApp Pre-filled Message</label>
                  <input type="text" value={editingSettings.whatsappMessage || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, whatsappMessage: e.target.value })}
                    placeholder="Hello, I am interested in your pharma services..."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Footer Phone Override</label>
                  <input type="text" value={editingSettings.footerPhone || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerPhone: e.target.value })}
                    placeholder="Same as primary phone if empty"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Footer Email Override</label>
                  <input type="email" value={editingSettings.footerEmail || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerEmail: e.target.value })}
                    placeholder="Same as primary email if empty"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 block mb-1.5 font-semibold">Corporate / Registered Office Address <span className="text-emerald-400">(Contact Page Card 1 + Footer)</span></label>
                  <textarea rows={2} value={editingSettings.footerAddress1 || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress1: e.target.value })}
                    placeholder="PLOT NO 11-12, DANIK BHASKAR BUILDING, SECTOR 25-D, CHANDIGARH - 160014, INDIA"
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 block mb-1.5 font-semibold">Manufacturing Facility Address <span className="text-emerald-400">(Contact Page Card 2 + Footer)</span></label>
                  <textarea rows={3} value={editingSettings.footerAddress2 || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress2: e.target.value })}
                    placeholder="Unit-I: Plot No. 140, Panchkula... | Unit-II: Plot No. 140-141, Baddi..."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                </div>
              </div>
            </div>

            {/* Section 3: Google Maps */}
            <div>
              <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Google Maps
              </h3>
              <div className="grid grid-cols-1 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Google Maps Embed URL (for iframe)</label>
                  <input type="text" value={editingSettings.googleMapUrl}
                    onChange={(e) => setEditingSettings({ ...editingSettings, googleMapUrl: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Google Maps Direct Link (for Directions button)</label>
                  <input type="url" value={editingSettings.googleMapsLink || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, googleMapsLink: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>
            </div>

            {/* Section 4: Social Media URLs */}
            <div>
              <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span> Social Media URLs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  { label: "Facebook URL", key: "facebookUrl", placeholder: "https://facebook.com/yourpage" },
                  { label: "Instagram URL", key: "instagramUrl", placeholder: "https://instagram.com/yourhandle" },
                  { label: "LinkedIn URL", key: "linkedinUrl", placeholder: "https://linkedin.com/company/yourcompany" },
                  { label: "YouTube URL", key: "youtubeUrl", placeholder: "https://youtube.com/c/yourchannel" },
                  { label: "Twitter / X URL", key: "twitterUrl", placeholder: "https://twitter.com/yourhandle" },
                  { label: "Telegram URL", key: "telegramUrl", placeholder: "https://t.me/yourusername" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="text-slate-400 block mb-1.5 font-semibold">{label}</label>
                    <input type="url" value={(editingSettings as any)[key] || ""}
                      onChange={(e) => setEditingSettings({ ...editingSettings, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: SEO */}
            <div>
              <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> SEO Meta Configurations
              </h3>
              <div className="grid grid-cols-1 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">SEO Meta Title</label>
                  <input type="text" value={editingSettings.metaTitle}
                    onChange={(e) => setEditingSettings({ ...editingSettings, metaTitle: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">SEO Meta Description</label>
                  <textarea rows={3} value={editingSettings.metaDescription}
                    onChange={(e) => setEditingSettings({ ...editingSettings, metaDescription: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">SEO Keywords (comma separated)</label>
                  <input type="text" value={editingSettings.metaKeywords}
                    onChange={(e) => setEditingSettings({ ...editingSettings, metaKeywords: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-950 text-emerald-300 text-xs p-3 rounded-xl border border-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Settings saved successfully! Changes are live across the website.
              </div>
            )}

            <button type="submit" className="w-fit bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-3 px-6 rounded-xl cursor-pointer self-start">
              Save All Settings
            </button>
          </form>
        )}

        {/* TAB: HEADER & LOGOS (NAVIGATION) */}
        {activeTab === "navigation-section" && (
          <form onSubmit={handleSaveSettings} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-6 animate-in fade-in duration-150">
            <div>
              <h3 className="font-display font-bold text-base text-white">Navigation, Header & Logos Manager</h3>
              <p className="text-slate-400 text-[11px] mt-1">Configure responsive logos (text vs. graphics image), favicon icons, and text-logo styling details.</p>
            </div>

            <div className="border-t border-slate-800/80 my-2" />

            {/* 1. Logo Type Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-slate-400 text-xs font-semibold">Active Logo Presentation Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer select-none transition-all ${editingSettings.logoType === 'text' ? 'border-[#006c35] bg-emerald-950/20 text-white' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'}`}>
                  <input 
                    type="radio" 
                    name="logoType" 
                    value="text" 
                    checked={editingSettings.logoType === 'text'} 
                    onChange={() => setEditingSettings({ ...editingSettings, logoType: 'text' })}
                    className="accent-emerald-500"
                  />
                  <div>
                    <strong className="block text-white text-xs">Dynamic Typography (Text-Based Logo)</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Styled with brand font (Georgia) and emerald green highlighting.</span>
                  </div>
                </label>

                <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer select-none transition-all ${editingSettings.logoType === 'image' ? 'border-[#006c35] bg-emerald-950/20 text-white' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'}`}>
                  <input 
                    type="radio" 
                    name="logoType" 
                    value="image" 
                    checked={editingSettings.logoType === 'image'} 
                    onChange={() => setEditingSettings({ ...editingSettings, logoType: 'image' })}
                    className="accent-emerald-500"
                  />
                  <div>
                    <strong className="block text-white text-xs">Graphic Assets (Image-Based Logo)</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Upload or specify custom logo URLs for desktop and mobile devices.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Render Typography Fields if Text Logo */}
            {editingSettings.logoType === 'text' && (
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5 text-xs">
                <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Typography Design Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Brand Primary Name (Logo Text)</label>
                    <input 
                      type="text" 
                      value={editingSettings.logoText || "Lifevision"}
                      onChange={(e) => setEditingSettings({ ...editingSettings, logoText: e.target.value })}
                      placeholder="e.g. Lifevision"
                      className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Subheading Label (Logo Subtext)</label>
                    <input 
                      type="text" 
                      value={editingSettings.logoTextSub || "healthcare"}
                      onChange={(e) => setEditingSettings({ ...editingSettings, logoTextSub: e.target.value })}
                      placeholder="e.g. healthcare"
                      className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80 pt-4 mt-2">
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Logo Font Style / Family</label>
                    <select
                      value={editingSettings.logoFontFamily || "Georgia, serif"}
                      onChange={(e) => setEditingSettings({ ...editingSettings, logoFontFamily: e.target.value })}
                      className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Georgia, serif">Serif Style (Georgia)</option>
                      <option value="'Inter', sans-serif">Swiss Modern Style (Inter)</option>
                      <option value="'Space Grotesk', sans-serif">Tech Display Style (Space Grotesk)</option>
                      <option value="'JetBrains Mono', monospace">Monospace Code Style (JetBrains Mono)</option>
                      <option value="'Outfit', sans-serif">Geometric Modern (Outfit)</option>
                      <option value="'Playfair Display', serif">Editorial Serif (Playfair)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Part 1 Brand Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={editingSettings.logoColor1 || "#006c35"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoColor1: e.target.value })}
                        className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1 shrink-0"
                      />
                      <input 
                        type="text" 
                        value={editingSettings.logoColor1 || "#006c35"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoColor1: e.target.value })}
                        placeholder="#006c35"
                        className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl text-xs uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Part 2 Brand Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={editingSettings.logoColor2 || "#004a80"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoColor2: e.target.value })}
                        className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1 shrink-0"
                      />
                      <input 
                        type="text" 
                        value={editingSettings.logoColor2 || "#004a80"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoColor2: e.target.value })}
                        placeholder="#004a80"
                        className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl text-xs uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Subtext Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={editingSettings.logoSubtextColor || "#64748b"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoSubtextColor: e.target.value })}
                        className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1 shrink-0"
                      />
                      <input 
                        type="text" 
                        value={editingSettings.logoSubtextColor || "#64748b"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoSubtextColor: e.target.value })}
                        placeholder="#64748b"
                        className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Previews */}
                <div className="border-t border-slate-800 pt-4 mt-1 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-400">Live Typography Preview:</span>
                  <div className="bg-white py-4 px-6 rounded-lg flex items-center justify-center border border-slate-200">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <span 
                          className="font-bold text-3xl mr-1" 
                          style={{ 
                            fontFamily: editingSettings.logoFontFamily || "Georgia, serif",
                            color: editingSettings.logoColor1 || "#006c35"
                          }}
                        >
                          {(editingSettings.logoText || "Lifevision").substring(0, 4)}
                        </span>
                        <span 
                          className="font-bold text-3xl"
                          style={{ 
                            fontFamily: editingSettings.logoFontFamily || "Georgia, serif",
                            color: editingSettings.logoColor2 || "#004a80"
                          }}
                        >
                          {(editingSettings.logoText || "Lifevision").substring(4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 -mt-1 pl-4">
                        <span 
                          className="text-[9px] uppercase tracking-[0.2em] font-extrabold leading-none"
                          style={{ 
                            fontFamily: editingSettings.logoFontFamily || "Georgia, serif",
                            color: editingSettings.logoSubtextColor || "#64748b"
                          }}
                        >
                          {editingSettings.logoTextSub || "healthcare"}
                        </span>
                        <div style={{ color: editingSettings.logoColor1 || "#006c35" }}>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C12,19.8 15.83,15.86 17,8M23,2C14.92,2.24 8.05,8.09 5.81,15.17C7.73,11.07 11.39,7.18 16.5,6.11C15.5,8.11 13,10.61 10.62,12.63C13.1,10.84 16.27,8.2 18,6C19,8.5 17.5,12.5 15,15C18.15,12.65 21.12,8.13 23,2Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Graphics Image Upload fields */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-6 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#004a80] rounded-full" /> Responsive Graphic Logo Files
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploader
                  id="logoImageDesktop"
                  label="Desktop Branding Image Logo"
                  value={editingSettings.logoImageDesktop || ""}
                  onChange={(val) => setEditingSettings({ ...editingSettings, logoImageDesktop: val })}
                  type="image"
                  placeholder="Enter desktop logo image URL..."
                />
                <MediaUploader
                  id="logoImageMobile"
                  label="Mobile Device Image Logo"
                  value={editingSettings.logoImageMobile || ""}
                  onChange={(val) => setEditingSettings({ ...editingSettings, logoImageMobile: val })}
                  type="image"
                  placeholder="Enter mobile logo image URL..."
                />
              </div>
            </div>

            {/* Favicons */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-6 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" /> Favicon & Device Bookmark Icons
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploader
                  id="faviconDesktop"
                  label="Desktop Web Browser Favicon"
                  value={editingSettings.faviconDesktop || ""}
                  onChange={(val) => setEditingSettings({ ...editingSettings, faviconDesktop: val })}
                  type="image"
                  placeholder="Enter favicon.ico URL..."
                />
                <MediaUploader
                  id="faviconMobile"
                  label="Mobile Webclip Touch Favicon"
                  value={editingSettings.faviconMobile || ""}
                  onChange={(val) => setEditingSettings({ ...editingSettings, faviconMobile: val })}
                  type="image"
                  placeholder="Enter mobile touch icon URL..."
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-950 text-emerald-300 text-xs p-3 rounded-xl border border-emerald-900 font-semibold">
                ✓ Navigation, Logos & Favicon Settings successfully written to server db.json.
              </div>
            )}

            <button type="submit" className="w-fit bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-3 px-6 rounded-xl cursor-pointer self-start transition-colors">
              Save Navigation Configuration
            </button>
          </form>
        )}

        {/* TAB: FOOTER MANAGEMENT */}
        {activeTab === "footer-section" && (
          <form onSubmit={handleSaveSettings} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-6 animate-in fade-in duration-150">
            <div>
              <h3 className="font-display font-bold text-base text-white">Dynamic Footer & Brand Identity Manager</h3>
              <p className="text-slate-400 text-[11px] mt-1">Manage all aspects of your footer including Column Titles, Quick Links, Interactive Contacts, Custom Icons, Social Media channels, Floating Widgets, and the mobile bottom action bar.</p>
            </div>

            <div className="border-t border-slate-800/80 my-2" />

            {/* SECTION 1: BRAND IDENTITY & LOGO CUSTOMIZER */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 1. Brand Identity & Logo Customizer
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Logo Style Type</label>
                  <select
                    value={editingSettings.logoType || "text"}
                    onChange={(e) => setEditingSettings({ ...editingSettings, logoType: e.target.value as "image" | "text" })}
                    className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="text">Styled Text Form (Preserves Font Design & Theme Colors)</option>
                    <option value="image">Device Image Upload (Uses Desktop/Mobile Image URLs)</option>
                  </select>
                </div>

                {editingSettings.logoType === "text" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1.5 font-semibold">Primary Text (Georgia Italic)</label>
                      <input
                        type="text"
                        value={editingSettings.logoText || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoText: e.target.value })}
                        placeholder="e.g. Lifevision"
                        className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1.5 font-semibold">Subtext (Uppercase Monospace)</label>
                      <input
                        type="text"
                        value={editingSettings.logoTextSub || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoTextSub: e.target.value })}
                        placeholder="e.g. healthcare"
                        className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1.5 font-semibold">Desktop Logo URL</label>
                      <input
                        type="text"
                        value={editingSettings.logoImageDesktop || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoImageDesktop: e.target.value })}
                        placeholder="Desktop image logo URL..."
                        className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1.5 font-semibold">Mobile Logo URL</label>
                      <input
                        type="text"
                        value={editingSettings.logoImageMobile || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoImageMobile: e.target.value })}
                        placeholder="Mobile image logo URL..."
                        className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: COLUMN TITLES & CORPORATE ABOUT TEXT */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> 2. Section Titles & About Statement
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Quick Links Title (Column 2)</label>
                  <input
                    type="text"
                    value={editingSettings.footerCol2Title || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerCol2Title: e.target.value })}
                    placeholder="QUICK LINKS"
                    className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Addresses Title (Column 3)</label>
                  <input
                    type="text"
                    value={editingSettings.footerCol3Title || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerCol3Title: e.target.value })}
                    placeholder="OUR ADDRESS"
                    className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-semibold">Follow Us Title (Social block)</label>
                  <input
                    type="text"
                    value={editingSettings.footerFollowUsTitle || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerFollowUsTitle: e.target.value })}
                    placeholder="FOLLOW US"
                    className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5 font-semibold">Corporate Brief Statement (About Text)</label>
                <textarea
                  value={editingSettings.footerAboutText || ""}
                  onChange={(e) => setEditingSettings({ ...editingSettings, footerAboutText: e.target.value })}
                  placeholder="We have been widely appreciated by our clients as dependable business partner..."
                  rows={3}
                  className="w-full bg-slate-950 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* SECTION 3: ADDRESSES & DYNAMIC ICONS */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#a855f7] rounded-full" /> 3. Contact Address Lines & Customizable Icons
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Address 1 info */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850/60 flex flex-col gap-3.5">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Office Location 1</span>
                  
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Location 1 Address Text</label>
                    <textarea
                      value={editingSettings.footerAddress1 || ""}
                      onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress1: e.target.value })}
                      placeholder="Enter Primary Address..."
                      rows={2}
                      className="w-full bg-slate-900 text-white border border-slate-800 p-2.5 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Location 1 Lucide Icon Name</label>
                    <div className="flex gap-2">
                      <select
                        value={editingSettings.footerAddress1Icon || "MapPin"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress1Icon: e.target.value })}
                        className="bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs"
                      >
                        <option value="MapPin">MapPin (Default Pin)</option>
                        <option value="Building">Building (Office Complex)</option>
                        <option value="Home">Home (Base)</option>
                        <option value="Map">Map (Route)</option>
                        <option value="Globe">Globe (World Wide)</option>
                        <option value="HelpCircle">HelpCircle (Info)</option>
                      </select>
                      <input
                        type="text"
                        value={editingSettings.footerAddress1Icon || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress1Icon: e.target.value })}
                        placeholder="Or type custom Lucide name..."
                        className="flex-1 bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Address 2 info */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850/60 flex flex-col gap-3.5">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Manufacturing Plant Location 2</span>
                  
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Location 2 Address Text</label>
                    <textarea
                      value={editingSettings.footerAddress2 || ""}
                      onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress2: e.target.value })}
                      placeholder="Enter Plant Address..."
                      rows={2}
                      className="w-full bg-slate-900 text-white border border-slate-800 p-2.5 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Location 2 Lucide Icon Name</label>
                    <div className="flex gap-2">
                      <select
                        value={editingSettings.footerAddress2Icon || "MapPin"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress2Icon: e.target.value })}
                        className="bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs"
                      >
                        <option value="MapPin">MapPin (Default Pin)</option>
                        <option value="Building">Building (Industrial Complex)</option>
                        <option value="Home">Home (Base)</option>
                        <option value="Map">Map (Route)</option>
                        <option value="Globe">Globe (World Wide)</option>
                        <option value="HelpCircle">HelpCircle (Info)</option>
                      </select>
                      <input
                        type="text"
                        value={editingSettings.footerAddress2Icon || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerAddress2Icon: e.target.value })}
                        placeholder="Or type custom Lucide name..."
                        className="flex-1 bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Direct Telephone and Email lines with customized icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850/60 flex flex-col gap-3.5">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Telephone Calling Direct</span>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Telephone Number Value</label>
                    <input
                      type="text"
                      value={editingSettings.footerPhone || ""}
                      onChange={(e) => setEditingSettings({ ...editingSettings, footerPhone: e.target.value })}
                      placeholder="+91-8062750200"
                      className="w-full bg-slate-900 text-white border border-slate-800 p-2.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Telephone Icon Name</label>
                    <div className="flex gap-2">
                      <select
                        value={editingSettings.footerPhoneIcon || "Phone"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerPhoneIcon: e.target.value })}
                        className="bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs"
                      >
                        <option value="Phone">Phone (Default Handset)</option>
                        <option value="PhoneCall">PhoneCall (Calling)</option>
                        <option value="MessageSquare">MessageSquare (Chat)</option>
                        <option value="Smartphone">Smartphone (Mobile)</option>
                      </select>
                      <input
                        type="text"
                        value={editingSettings.footerPhoneIcon || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerPhoneIcon: e.target.value })}
                        placeholder="Custom name..."
                        className="flex-1 bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850/60 flex flex-col gap-3.5">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Email Messaging Direct</span>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Email Address Value</label>
                    <input
                      type="text"
                      value={editingSettings.footerEmail || ""}
                      onChange={(e) => setEditingSettings({ ...editingSettings, footerEmail: e.target.value })}
                      placeholder="enquiry@lifevisionhealthcarehd.com"
                      className="w-full bg-slate-900 text-white border border-slate-800 p-2.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Email Icon Name</label>
                    <div className="flex gap-2">
                      <select
                        value={editingSettings.footerEmailIcon || "Mail"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerEmailIcon: e.target.value })}
                        className="bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs"
                      >
                        <option value="Mail">Mail (Default Envelope)</option>
                        <option value="Send">Send (Paper Plane)</option>
                        <option value="Inbox">Inbox (Tray)</option>
                        <option value="MessageCircle">MessageCircle (Chat bubble)</option>
                      </select>
                      <input
                        type="text"
                        value={editingSettings.footerEmailIcon || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, footerEmailIcon: e.target.value })}
                        placeholder="Custom name..."
                        className="flex-1 bg-slate-900 text-white border border-slate-800 p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: INTERACTIVE FOOTER LINKS BUILDERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-slate-900/40 p-5 rounded-xl border border-slate-800">
              
              {/* Interactive Column 1 Links */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold text-white text-xs">Specialized Content Links (Column 1)</h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Custom items showing on Column 1 below Corporate logo.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentLinks = editingSettings.footerLinksCol1Json ? JSON.parse(editingSettings.footerLinksCol1Json) : [];
                      const updated = [...currentLinks, { title: "New Resource Link", path: "home" }];
                      setEditingSettings({ ...editingSettings, footerLinksCol1Json: JSON.stringify(updated) });
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold py-1 px-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Link
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {(() => {
                    let col1Arr = [];
                    try {
                      col1Arr = editingSettings.footerLinksCol1Json ? JSON.parse(editingSettings.footerLinksCol1Json) : [];
                    } catch (e) {
                      col1Arr = [
                        { title: "Blog", path: "blogs" },
                        { title: "Third Party Blogs", path: "blogs?type=third-party" },
                        { title: "Top Blogs", path: "blogs?type=top" },
                        { title: "Third Party Manufacturing Pharma Companies", path: "divisions" },
                        { title: "Pharma Contract Manufacturing", path: "facility" }
                      ];
                    }

                    if (col1Arr.length === 0) {
                      return <p className="text-[10px] text-slate-500 italic">No links added. Click 'Add Link' above.</p>;
                    }

                    return col1Arr.map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <input 
                          type="text" 
                          value={link.title} 
                          onChange={(e) => {
                            const updated = [...col1Arr];
                            updated[idx].title = e.target.value;
                            setEditingSettings({ ...editingSettings, footerLinksCol1Json: JSON.stringify(updated) });
                          }} 
                          placeholder="Link Label" 
                          className="flex-1 bg-slate-900 text-white border border-slate-800 px-2 py-1.5 rounded text-xs"
                        />
                        <input 
                          type="text" 
                          value={link.path} 
                          onChange={(e) => {
                            const updated = [...col1Arr];
                            updated[idx].path = e.target.value;
                            setEditingSettings({ ...editingSettings, footerLinksCol1Json: JSON.stringify(updated) });
                          }} 
                          placeholder="Path (e.g. blogs)" 
                          className="w-1/3 bg-slate-900 text-white border border-slate-800 px-2 py-1.5 rounded text-xs font-mono"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const updated = col1Arr.filter((_: any, i: number) => i !== idx);
                            setEditingSettings({ ...editingSettings, footerLinksCol1Json: JSON.stringify(updated) });
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-950/20 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Interactive Column 2 Links */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold text-white text-xs">Quick Links Directory (Column 2)</h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Navigation links for pages listed in the central column.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentLinks = editingSettings.footerLinksCol2Json ? JSON.parse(editingSettings.footerLinksCol2Json) : [];
                      const updated = [...currentLinks, { title: "New Quick Link", path: "home" }];
                      setEditingSettings({ ...editingSettings, footerLinksCol2Json: JSON.stringify(updated) });
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold py-1 px-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Link
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {(() => {
                    let col2Arr = [];
                    try {
                      col2Arr = editingSettings.footerLinksCol2Json ? JSON.parse(editingSettings.footerLinksCol2Json) : [];
                    } catch (e) {
                      col2Arr = [
                        { title: "Home", path: "home" },
                        { title: "About us", path: "about" },
                        { title: "Third Party Manufacturing", path: "facility" },
                        { title: "Track your Order", path: "contact" },
                        { title: "Privacy Policy", path: "privacy-policy" },
                        { title: "Contact us", path: "contact" }
                      ];
                    }

                    if (col2Arr.length === 0) {
                      return <p className="text-[10px] text-slate-500 italic">No links added. Click 'Add Link' above.</p>;
                    }

                    return col2Arr.map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <input 
                          type="text" 
                          value={link.title} 
                          onChange={(e) => {
                            const updated = [...col2Arr];
                            updated[idx].title = e.target.value;
                            setEditingSettings({ ...editingSettings, footerLinksCol2Json: JSON.stringify(updated) });
                          }} 
                          placeholder="Link Label" 
                          className="flex-1 bg-slate-900 text-white border border-slate-800 px-2 py-1.5 rounded text-xs"
                        />
                        <input 
                          type="text" 
                          value={link.path} 
                          onChange={(e) => {
                            const updated = [...col2Arr];
                            updated[idx].path = e.target.value;
                            setEditingSettings({ ...editingSettings, footerLinksCol2Json: JSON.stringify(updated) });
                          }} 
                          placeholder="Path (e.g. contact)" 
                          className="w-1/3 bg-slate-900 text-white border border-slate-800 px-2 py-1.5 rounded text-xs font-mono"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const updated = col2Arr.filter((_: any, i: number) => i !== idx);
                            setEditingSettings({ ...editingSettings, footerLinksCol2Json: JSON.stringify(updated) });
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-950/20 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 my-2" />

            {/* SECTION 5: SOCIAL NETWORKS & VISIBILITY SWITCHES */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#e11d48] rounded-full" /> 5. Social Follow Visibility & Background Colors
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {/* Facebook */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Facebook</span>
                    <input
                      type="checkbox"
                      checked={editingSettings.showFacebook !== false}
                      onChange={(e) => setEditingSettings({ ...editingSettings, showFacebook: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-4 h-4"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingSettings.facebookUrl || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, facebookUrl: e.target.value })}
                    placeholder="Facebook Profile/Page URL..."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded-md text-xs"
                  />
                </div>

                {/* Instagram */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Instagram</span>
                    <input
                      type="checkbox"
                      checked={editingSettings.showInstagram !== false}
                      onChange={(e) => setEditingSettings({ ...editingSettings, showInstagram: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-4 h-4"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingSettings.instagramUrl || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, instagramUrl: e.target.value })}
                    placeholder="Instagram URL..."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded-md text-xs"
                  />
                </div>

                {/* LinkedIn */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">LinkedIn</span>
                    <input
                      type="checkbox"
                      checked={editingSettings.showLinkedin !== false}
                      onChange={(e) => setEditingSettings({ ...editingSettings, showLinkedin: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-4 h-4"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingSettings.linkedinUrl || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, linkedinUrl: e.target.value })}
                    placeholder="LinkedIn Corporate URL..."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded-md text-xs"
                  />
                </div>

                {/* Pinterest */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Pinterest</span>
                    <input
                      type="checkbox"
                      checked={editingSettings.showPinterest !== false}
                      onChange={(e) => setEditingSettings({ ...editingSettings, showPinterest: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-4 h-4"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingSettings.footerPinterestUrl || ""}
                    onChange={(e) => setEditingSettings({ ...editingSettings, footerPinterestUrl: e.target.value })}
                    placeholder="Pinterest URL..."
                    className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded-md text-xs"
                  />
                </div>
              </div>

              {/* Social background brand coloring */}
              <div className="flex items-center gap-4 mt-1 bg-slate-950 p-3 rounded-lg border border-slate-850 max-w-sm">
                <span className="font-semibold text-white">Social Icon Button BG:</span>
                <input
                  type="color"
                  value={editingSettings.socialBgColor || "#004a80"}
                  onChange={(e) => setEditingSettings({ ...editingSettings, socialBgColor: e.target.value })}
                  className="w-10 h-6 bg-transparent border-0 cursor-pointer"
                />
                <span className="font-mono text-[11px] text-slate-400 uppercase">{editingSettings.socialBgColor || "#004a80"}</span>
              </div>
            </div>

            <div className="border-t border-slate-800/80 my-2" />

            {/* SECTION 6: FLOATING INTERACTIVE WIDGETS */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full" /> 6. Floating Engagement Widgets (WhatsApp & Scroll Top)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Floating WhatsApp Widget */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-[11px] uppercase tracking-wider">WhatsApp Float Action Widget</span>
                    <input
                      type="checkbox"
                      checked={editingSettings.showWhatsAppWidget !== false}
                      onChange={(e) => setEditingSettings({ ...editingSettings, showWhatsAppWidget: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-4 h-4"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">WhatsApp Call Number (With country prefix, no spaces)</label>
                    <input
                      type="text"
                      value={editingSettings.whatsappNumber || ""}
                      onChange={(e) => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })}
                      placeholder="e.g. 918062750200"
                      className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Default Prefilled WhatsApp Message</label>
                    <textarea
                      value={editingSettings.whatsappMessage || ""}
                      onChange={(e) => setEditingSettings({ ...editingSettings, whatsappMessage: e.target.value })}
                      placeholder="Hello Nishcura Pharmaceuticals, I am interested..."
                      rows={2}
                      className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingSettings.whatsappPulseEffect !== false}
                      onChange={(e) => setEditingSettings({ ...editingSettings, whatsappPulseEffect: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <label className="text-slate-400 font-medium">Activate Radar Highlight Glow Pulse</label>
                  </div>
                </div>

                {/* Floating Scroll To Top */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 flex flex-col gap-3 justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider">Scroll To Top Elevating Button</span>
                      <input
                        type="checkbox"
                        checked={editingSettings.showScrollToTopWidget !== false}
                        onChange={(e) => setEditingSettings({ ...editingSettings, showScrollToTopWidget: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-4 h-4"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-relaxed">
                      Automatically scrolls back to page top with modern smooth animations when user navigates deep down.
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-semibold text-slate-400">Button Background Color:</span>
                    <input
                      type="color"
                      value={editingSettings.scrollTopWidgetBg || "#004a80"}
                      onChange={(e) => setEditingSettings({ ...editingSettings, scrollTopWidgetBg: e.target.value })}
                      className="w-10 h-6 bg-transparent border-0 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-400 uppercase">{editingSettings.scrollTopWidgetBg || "#004a80"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 my-2" />

            {/* SECTION 7: STICKY MOBILE BOTTOM BAR */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-5 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#e11d48] rounded-full" /> 7. Mobile Sticky Bottom Navigation Action Bar
              </h4>

              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                <div>
                  <span className="font-bold text-white text-xs block">Activate Bottom Action Strip on Handheld Mobiles</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Loads persistent call direct & dynamic inquiry buttons exclusively in mobile responsive mode.</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingSettings.showMobileBottomBar !== false}
                  onChange={(e) => setEditingSettings({ ...editingSettings, showMobileBottomBar: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-900 text-brand-600 focus:ring-0 w-4 h-4"
                />
              </div>

              {editingSettings.showMobileBottomBar !== false && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1 animate-in slide-in-from-top-1 duration-150">
                  {/* Left Side: Call Us button */}
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
                    <span className="font-bold text-[#25D366] text-[10px] uppercase tracking-wider">Left Button: Call Action</span>
                    
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">Button Label Text</label>
                      <input
                        type="text"
                        value={editingSettings.mobileLeftLabel || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, mobileLeftLabel: e.target.value })}
                        placeholder="e.g. Call Us"
                        className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">Direct Dial Call Number</label>
                      <input
                        type="text"
                        value={editingSettings.mobileLeftPhone || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, mobileLeftPhone: e.target.value })}
                        placeholder="e.g. 8062750200"
                        className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-slate-400 font-medium">Button Background:</span>
                      <input
                        type="color"
                        value={editingSettings.mobileLeftBg || "#006c35"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, mobileLeftBg: e.target.value })}
                        className="w-10 h-6 bg-transparent border-0 cursor-pointer"
                      />
                      <span className="font-mono text-[11px] text-slate-400 uppercase">{editingSettings.mobileLeftBg || "#006c35"}</span>
                    </div>
                  </div>

                  {/* Right Side: Quick Action Button */}
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
                    <span className="font-bold text-[#38bdf8] text-[10px] uppercase tracking-wider">Right Button: Navigation / Request Action</span>
                    
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">Button Label Text</label>
                      <input
                        type="text"
                        value={editingSettings.mobileRightLabel || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, mobileRightLabel: e.target.value })}
                        placeholder="e.g. Get Third Party & PCD"
                        className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">Target Path / Route Name</label>
                      <input
                        type="text"
                        value={editingSettings.mobileRightPath || ""}
                        onChange={(e) => setEditingSettings({ ...editingSettings, mobileRightPath: e.target.value })}
                        placeholder="e.g. contact"
                        className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded text-xs font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-slate-400 font-medium">Button Background:</span>
                      <input
                        type="color"
                        value={editingSettings.mobileRightBg || "#004a80"}
                        onChange={(e) => setEditingSettings({ ...editingSettings, mobileRightBg: e.target.value })}
                        className="w-10 h-6 bg-transparent border-0 cursor-pointer"
                      />
                      <span className="font-mono text-[11px] text-slate-400 uppercase">{editingSettings.mobileRightBg || "#004a80"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800/80 my-2" />

            {/* SECTION 8: COPYRIGHTS & BOTTOM BAR LINKS */}
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-4 text-xs">
              <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> 8. Copyrights, Credits & Bottom Links Bar
              </h4>

              <div>
                <label className="text-slate-400 block mb-1.5 font-semibold">Copyright Statement Line</label>
                <input 
                  type="text" 
                  value={editingSettings.footerCopyrightText || ""}
                  onChange={(e) => setEditingSettings({ ...editingSettings, footerCopyrightText: e.target.value })}
                  placeholder="2019, All Right Reserved @ Nishcura Pharmaceuticals | Web Design & Development By WebHopers"
                  className="w-full bg-slate-950 text-white border border-slate-800 p-2.5 rounded-xl focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Bottom Copyright extra links */}
              <div>
                <div className="flex justify-between items-center mb-3 mt-2">
                  <div>
                    <span className="font-semibold text-white block">Bottom Segment Links</span>
                    <span className="text-[10px] text-slate-500 block">Shown at the bottom right corner of the copyright bar.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentLinks = editingSettings.copyrightLinksJson ? JSON.parse(editingSettings.copyrightLinksJson) : [];
                      const updated = [...currentLinks, { title: "New policy", path: "privacy-policy" }];
                      setEditingSettings({ ...editingSettings, copyrightLinksJson: JSON.stringify(updated) });
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold py-1 px-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Segment Link
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {(() => {
                    let crArr = [];
                    try {
                      crArr = editingSettings.copyrightLinksJson ? JSON.parse(editingSettings.copyrightLinksJson) : [];
                    } catch (e) {
                      crArr = [
                        { title: "Privacy Policy", path: "privacy-policy" },
                        { title: "Terms & Conditions", path: "terms-conditions" }
                      ];
                    }

                    if (crArr.length === 0) {
                      return <p className="text-[10px] text-slate-500 italic">No bottom segment links added.</p>;
                    }

                    return crArr.map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <input 
                          type="text" 
                          value={link.title} 
                          onChange={(e) => {
                            const updated = [...crArr];
                            updated[idx].title = e.target.value;
                            setEditingSettings({ ...editingSettings, copyrightLinksJson: JSON.stringify(updated) });
                          }} 
                          placeholder="Link Label" 
                          className="flex-1 bg-slate-900 text-white border border-slate-800 px-2 py-1.5 rounded text-xs"
                        />
                        <input 
                          type="text" 
                          value={link.path} 
                          onChange={(e) => {
                            const updated = [...crArr];
                            updated[idx].path = e.target.value;
                            setEditingSettings({ ...editingSettings, copyrightLinksJson: JSON.stringify(updated) });
                          }} 
                          placeholder="Path (e.g. privacy-policy)" 
                          className="w-1/3 bg-slate-900 text-white border border-slate-800 px-2 py-1.5 rounded text-xs font-mono"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const updated = crArr.filter((_: any, i: number) => i !== idx);
                            setEditingSettings({ ...editingSettings, copyrightLinksJson: JSON.stringify(updated) });
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-950/20 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-950 text-emerald-300 text-xs p-3 rounded-xl border border-emerald-900 font-semibold">
                ✓ All Footer sections, interactive dynamic icons, widgets, and mobile bottoms successfully saved.
              </div>
            )}

            <button type="submit" className="w-fit bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-3 px-6 rounded-xl cursor-pointer self-start transition-colors">
              Save Footer Content Configuration
            </button>
          </form>
        )}

        {/* 3. TAB: HERO SLIDER MANAGER */}
        {activeTab === "slides" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <button 
              onClick={() => setEditingSlide({})} 
              className="bg-brand-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl w-fit flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Hero Slide
            </button>

            {editingSlide && (
              <form onSubmit={handleSaveSlide} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 text-xs max-w-xl">
                <h3 className="font-display font-semibold text-white mb-2">{editingSlide.id ? "Edit Slide" : "Create Slide"}</h3>
                <div>
                  <label className="text-slate-400 block mb-1">Slide Title Heading</label>
                  <input 
                    type="text" required
                    value={editingSlide.title || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Slide Subtitle / Subtext</label>
                  <input 
                    type="text"
                    value={editingSlide.subtitle || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                  />
                </div>
                <MediaUploader
                  id="slideImageUrl"
                  label="Slide Background Image"
                  value={editingSlide.imageUrl || ""}
                  onChange={(val) => setEditingSlide({ ...editingSlide, imageUrl: val })}
                  type="image"
                  placeholder="Enter slide background image URL..."
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-brand-600 text-white py-2 px-4 rounded-xl cursor-pointer">Save Slide</button>
                  <button type="button" onClick={() => setEditingSlide(null)} className="bg-slate-900 text-slate-400 py-2 px-4 rounded-xl">Cancel</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slides.map((s) => (
                <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                  <div className="h-40 bg-slate-800 relative">
                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-white text-sm line-clamp-1">{s.title}</h4>
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2">{s.subtitle}</p>
                    </div>
                    <div className="flex gap-2 mt-4 border-t border-slate-900 pt-3">
                      <button onClick={() => setEditingSlide(s)} className="text-brand-400 text-xs font-semibold flex items-center gap-1"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                      <button onClick={() => handleDeleteSlide(s.id)} className="text-rose-400 text-xs font-semibold flex items-center gap-1 ml-auto"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB: THERAPEUTIC SEGMENTS CATEGORIES */}
        {activeTab === "categories" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <button 
              onClick={() => setEditingCategory({})}
              className="bg-brand-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl w-fit flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Therapeutic Division
            </button>

            {editingCategory && (
              <form onSubmit={handleSaveCategory} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 text-xs max-w-xl">
                <h3 className="font-display font-semibold text-white mb-2">{editingCategory.id ? "Edit Segment" : "Create Segment"}</h3>
                <div>
                  <label className="text-slate-400 block mb-1">Division Name</label>
                  <input 
                    type="text" required
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Description</label>
                  <RichTextEditor
                    id="categoryDescription"
                    value={editingCategory.description || ""}
                    onChange={(val) => setEditingCategory({ ...editingCategory, description: val })}
                    height={160}
                    placeholder="Enter division category descriptive details..."
                  />
                </div>
                <MediaUploader
                  id="categoryImageUrl"
                  label="Category Cover Image"
                  value={editingCategory.imageUrl || ""}
                  onChange={(val) => setEditingCategory({ ...editingCategory, imageUrl: val })}
                  type="image"
                  placeholder="Enter therapeutic division image URL..."
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-brand-600 text-white py-2 px-4 rounded-xl cursor-pointer">Save Segment</button>
                  <button type="button" onClick={() => setEditingCategory(null)} className="bg-slate-900 text-slate-400 py-2 px-4 rounded-xl">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                    <th className="p-4">Division Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Slug (Automatic)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id} className="border-b border-slate-800 hover:bg-slate-900/40">
                      <td className="p-4 font-semibold text-white">{c.name}</td>
                      <td className="p-4 text-slate-400 line-clamp-1 max-w-sm mt-3">{c.description}</td>
                      <td className="p-4 font-mono text-brand-400">{c.slug}</td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button onClick={() => setEditingCategory(c)} className="text-brand-400 font-semibold flex items-center gap-0.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-rose-400 font-semibold flex items-center gap-0.5"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. TAB: FORMULATIONS PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <button 
                onClick={() => setEditingProduct({})}
                className="bg-brand-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Formulation Formula
              </button>

              <button 
                onClick={exportProductsCSV}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export CSV Spreadsheet
              </button>
            </div>

            {/* Editing Product form */}
            {editingProduct && (
              <form onSubmit={handleSaveProduct} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 text-xs max-w-2xl">
                <h3 className="font-display font-semibold text-white border-b border-slate-800 pb-2">
                  {editingProduct.id ? `Edit Formulation Detail: "${editingProduct.name}"` : "Register New Formulation Formula"}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Formulation Product Name *</label>
                    <input 
                      type="text" required
                      value={editingProduct.name || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Therapeutic Division Category *</label>
                    <select 
                      required
                      value={editingProduct.categoryId || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1 text-slate-300"
                    >
                      <option value="">Select Division</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Generic Chemical Composition *</label>
                  <input 
                    type="text" required
                    value={editingProduct.composition || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, composition: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                    placeholder="e.g. Paracetamol IP 500mg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Pack Size *</label>
                    <input 
                      type="text" required
                      value={editingProduct.packSize || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, packSize: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                      placeholder="e.g. 10 x 10 Tablets"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Pack Type *</label>
                    <input 
                      type="text" required
                      value={editingProduct.packType || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, packType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                      placeholder="e.g. Alu-Alu Blister"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Indications</label>
                    <input 
                      type="text"
                      value={editingProduct.indications || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, indications: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Dosage Guidelines</label>
                    <input 
                      type="text"
                      value={editingProduct.dosage || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, dosage: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl focus:ring-1"
                    />
                  </div>
                </div>

                <MediaUploader
                  id="productImageUrl"
                  label="Product Formulation Image"
                  value={editingProduct.imageUrl || ""}
                  onChange={(val) => setEditingProduct({ ...editingProduct, imageUrl: val })}
                  type="image"
                  placeholder="Enter product illustration image URL..."
                />

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Description Content</label>
                  <RichTextEditor
                    id="productDescription"
                    value={editingProduct.description || ""}
                    onChange={(val) => setEditingProduct({ ...editingProduct, description: val })}
                    height={200}
                    placeholder="Enter exhaustive formulation specifications, usage benefits..."
                  />
                </div>

                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={!!editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-brand-600 rounded"
                    />
                    Display in Featured Home Section
                  </label>
                </div>

                <div className="flex gap-2.5 mt-4">
                  <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer">
                    Save Formulation Formula
                  </button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="bg-slate-900 text-slate-400 py-2.5 px-5 rounded-xl">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Filter toolbars */}
            <div className="flex flex-col sm:flex-row gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter by name or composition..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 pl-9 rounded-xl text-xs focus:ring-1"
                />
              </div>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300 focus:ring-1"
              >
                <option value="">All Divisions</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {selectedProductIds.length > 0 && (
                <button 
                  onClick={handleBulkDeleteProducts}
                  className="bg-rose-950/40 text-rose-400 border border-rose-900 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Bulk Delete ({selectedProductIds.length})
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedProductIds.length === tableProducts.length && tableProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedProductIds(tableProducts.map(p => p.id));
                          else setSelectedProductIds([]);
                        }}
                        className="w-4 h-4 accent-brand-600 rounded"
                      />
                    </th>
                    <th className="p-4">Formulation Name</th>
                    <th className="p-4">Composition</th>
                    <th className="p-4">Segment</th>
                    <th className="p-4">Packing</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableProducts.map((p) => (
                    <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-900/40">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedProductIds.includes(p.id)}
                          onChange={() => handleToggleSelectProduct(p.id)}
                          className="w-4 h-4 accent-brand-600 rounded"
                        />
                      </td>
                      <td className="p-4 font-semibold text-white">{p.name}</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">{p.composition}</td>
                      <td className="p-4 font-semibold text-brand-400">
                        {categories.find(c => c.id === p.categoryId)?.name || "Division"}
                      </td>
                      <td className="p-4 text-slate-400 font-medium">{p.packSize} ({p.packType})</td>
                      <td className="p-4 text-center">
                        {p.isFeatured ? (
                          <span className="bg-brand-500/10 text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded-full">YES</span>
                        ) : (
                          <span className="text-slate-600 font-mono">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-3 mt-1.5">
                        <button onClick={() => setEditingProduct(p)} className="text-brand-400 font-bold flex items-center gap-0.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-rose-400 font-bold flex items-center gap-0.5"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. TAB: VISITOR INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Showing <strong>{inquiries.length}</strong> recorded inquiries</span>
              <button 
                onClick={exportInquiriesCSV}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export CSV Log Sheet
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {inquiries.map((i) => (
                <div key={i.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-900 pb-3">
                    <div>
                      <h4 className="font-display font-bold text-white text-base">{i.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">Email: <strong>{i.email}</strong> | Tel: <strong>{i.phone}</strong></p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        i.status === "unread" ? "bg-rose-500/10 text-rose-400" :
                        i.status === "read" ? "bg-amber-500/10 text-amber-400" :
                        "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {i.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">{i.createdAt.split('T')[0]}</span>
                    </div>
                  </div>

                  <div className="text-slate-300 text-xs leading-relaxed">
                    <p className="font-semibold text-brand-400 mb-1">Subject: {i.subject}</p>
                    {i.productName && <p className="text-[11px] text-slate-400 mb-2">Formulation Focus: <strong>{i.productName}</strong></p>}
                    <p className="bg-slate-900 p-3.5 rounded-xl border border-slate-900 italic">"{i.message}"</p>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleUpdateInquiryStatus(i.id, "read")} className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs py-1.5 px-3 rounded-lg border border-slate-800">Mark Read</button>
                    <button onClick={() => handleUpdateInquiryStatus(i.id, "replied")} className="bg-slate-900 hover:bg-slate-800 text-emerald-400 font-semibold text-xs py-1.5 px-3 rounded-lg border border-slate-800">Mark Replied</button>
                    <button onClick={() => handleDeleteInquiry(i.id)} className="text-rose-400 font-bold text-xs py-1.5 px-3 ml-4">Delete Message</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TAB: SYSTEM AUDIT LOGS */}
        {activeTab === "logs" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Top 200 system security checkpoints</span>
              <button onClick={handleClearLogs} className="text-rose-400 hover:text-rose-300 text-xs font-semibold">Wipe Audit Trails</button>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full border-collapse text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">User Email</th>
                    <th className="p-4">Security Activity Description</th>
                    <th className="p-4">IP Coordinates</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-900/40 text-[11px]">
                      <td className="p-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="p-4 font-semibold text-brand-400">{log.user}</td>
                      <td className="p-4 text-slate-200">{log.action}</td>
                      <td className="p-4 text-slate-500 font-bold">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. TAB: SYSTEM & BACKUPS */}
        {activeTab === "system" && (
          <div className="max-w-2xl bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col gap-8 animate-in fade-in duration-150 text-xs">
            <div>
              <h3 className="font-display font-bold text-base text-white mb-2">Backups & Database Checkpoints</h3>
              <p className="text-slate-400 mb-4">Export static snapshots of the server/db.json database to the server backups folder.</p>
              <button onClick={handleBackupDb} className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl cursor-pointer">
                Generate Secure Database Checkpoint Backup
              </button>
            </div>

            <div>
              <h3 className="font-display font-bold text-base text-white mb-2">Metadata Cache Clearance</h3>
              <p className="text-slate-400 mb-4">Recompile templates, refresh static formulations database, and clean container memories.</p>
              <button onClick={handleClearCache} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-xl cursor-pointer">
                Flush System Cache
              </button>
            </div>

            {systemMsg && (
              <div className="bg-emerald-950 text-emerald-300 p-4 rounded-xl border border-emerald-900 font-semibold">
                {systemMsg}
              </div>
            )}
          </div>
        )}

        {/* 9. TAB: JOB OPENINGS (CAREERS) */}
        {activeTab === "jobs" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <button 
              onClick={() => setEditingJob({ requirements: [] })}
              className="bg-brand-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl w-fit flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Job Opening
            </button>

            {editingJob && (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editingJob.title) return;
                  const isNew = !editingJob.id;
                  const url = isNew ? "/api/jobs" : `/api/jobs/${editingJob.id}`;
                  const method = isNew ? "POST" : "PUT";
                  const requirementsList = Array.isArray(editingJob.requirements) 
                    ? editingJob.requirements 
                    : String(editingJob.requirements).split("\n").filter(Boolean);

                  try {
                    const res = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        department: editingJob.department || "Production",
                        location: editingJob.location || "Panchkula Plant",
                        experience: editingJob.experience || "1-3 Years",
                        qualification: editingJob.qualification || "B.Pharma",
                        description: editingJob.description || "",
                        requirements: requirementsList,
                        status: "active",
                        ...editingJob
                      })
                    });
                    if (res.ok) {
                      setEditingJob(null);
                      triggerRefresh();
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 text-xs max-w-xl"
              >
                <h3 className="font-display font-semibold text-white">{editingJob.id ? "Edit Job" : "Publish Job Opening"}</h3>
                <div>
                  <label className="text-slate-400 block mb-1">Job Title</label>
                  <input type="text" required value={editingJob.title || ""} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input type="text" required value={editingJob.department || ""} onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Experience</label>
                    <input type="text" required value={editingJob.experience || ""} onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Location</label>
                    <input type="text" required value={editingJob.location || ""} onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Requirements (one per line)</label>
                  <textarea rows={3} value={Array.isArray(editingJob.requirements) ? editingJob.requirements.join("\n") : ""} onChange={(e) => setEditingJob({ ...editingJob, requirements: e.target.value.split("\n") })} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-brand-600 text-white py-2 px-4 rounded-xl cursor-pointer">Publish Opening</button>
                  <button type="button" onClick={() => setEditingJob(null)} className="bg-slate-900 text-slate-400 py-2 px-4 rounded-xl">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                    <th className="p-4">Job Title</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} className="border-b border-slate-800 hover:bg-slate-900/40">
                      <td className="p-4 font-semibold text-white">{j.title}</td>
                      <td className="p-4 text-slate-400">{j.department}</td>
                      <td className="p-4 text-brand-400">{j.experience}</td>
                      <td className="p-4 text-slate-400">{j.location}</td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button onClick={() => setEditingJob(j)} className="text-brand-400 font-semibold flex items-center gap-0.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                        <button 
                          onClick={async () => {
                            if (!confirm("Are you sure?")) return;
                            const res = await fetch(`/api/jobs/${j.id}`, { method: "DELETE" });
                            if (res.ok) triggerRefresh();
                          }} 
                          className="text-rose-400 font-semibold flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10. TAB: JOB APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <span className="text-xs text-slate-400">Showing <strong>{applications.length}</strong> recorded candidate logs</span>

            <div className="flex flex-col gap-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                  <div className="flex flex-wrap justify-between items-start border-b border-slate-900 pb-3">
                    <div>
                      <h4 className="font-display font-bold text-white text-base">{app.name}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">Applying for: <strong className="text-brand-400">{app.jobTitle}</strong></p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Email: {app.email} | Phone: {app.phone} | Experience: {app.experience}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        app.status === "pending" ? "bg-rose-500/10 text-rose-400" :
                        app.status === "reviewed" ? "bg-amber-500/10 text-amber-400" :
                        app.status === "shortlisted" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-slate-800 text-slate-400"
                      }`}>{app.status}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs italic bg-slate-900 p-3 rounded-xl border border-slate-900">"{app.message}"</p>
                  
                  {app.resumeUrl && (
                    <div className="text-xs">
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">
                        <FileText className="w-4 h-4" /> View Candidate Resume PDF File
                      </a>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleUpdateApplicationStatus(app.id, "reviewed")} className="bg-slate-900 text-amber-400 text-xs font-semibold py-1 px-2.5 rounded-md border border-slate-800">Mark Reviewed</button>
                    <button onClick={() => handleUpdateApplicationStatus(app.id, "shortlisted")} className="bg-slate-900 text-emerald-400 text-xs font-semibold py-1 px-2.5 rounded-md border border-slate-800">Shortlist Candidate</button>
                    <button onClick={() => handleUpdateApplicationStatus(app.id, "rejected")} className="bg-slate-900 text-rose-400 text-xs font-semibold py-1 px-2.5 rounded-md border border-slate-800">Reject Application</button>
                    <button onClick={() => handleDeleteApplication(app.id)} className="text-slate-500 hover:text-rose-400 font-bold text-xs py-1 px-2.5 ml-4">Delete Application Log</button>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center text-slate-400 text-sm">
                  No applications received yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== GST & CERTIFICATIONS TAB ===== */}
        {activeTab === "company-info" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <form onSubmit={handleSaveCompanyInfo} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-6">
              
              {/* GST & Legal Numbers */}
              <div>
                <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> GST & Legal Registration Numbers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {[
                    { label: "GST Number *", key: "gstNumber", placeholder: "03AABCN1234F1Z5" },
                    { label: "PAN Number", key: "panNumber", placeholder: "AABCN1234F" },
                    { label: "CIN Number", key: "cinNumber", placeholder: "U24230HR2019PTC..." },
                    { label: "Drug License Number", key: "drugLicenseNumber", placeholder: "PB-PNK-2019-1234" },
                    { label: "Drug License Expiry Date", key: "drugLicenseExpiry", placeholder: "2026-12-31" },
                    { label: "ISO Certificate Number", key: "isoNumber", placeholder: "ISO 9001:2015" },
                    { label: "WHO-GMP Certificate Number", key: "whoGmpNumber", placeholder: "WHO-GMP/2024/001" },
                    { label: "Year Established", key: "yearEstablished", placeholder: "2019" },
                    { label: "Total Employees", key: "totalEmployees", placeholder: "100+" },
                    { label: "Annual Turnover", key: "annualTurnover", placeholder: "5-10 Cr" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-slate-400 block mb-1.5 font-semibold">{label}</label>
                      <input type="text"
                        value={editingCompanyInfo[key] || ""}
                        onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 text-xs" />
                    </div>
                  ))}
                </div>
              </div>

              {/* About / Mission / Vision */}
              <div>
                <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> About Company & Mission/Vision
                </h3>
                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Short About Text (shown on About page header)</label>
                    <textarea rows={2} value={editingCompanyInfo.aboutShortText || ""}
                      onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, aboutShortText: e.target.value })}
                      placeholder="Brief company description..."
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Detailed About Text</label>
                    <textarea rows={4} value={editingCompanyInfo.aboutLongText || ""}
                      onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, aboutLongText: e.target.value })}
                      placeholder="Full company story and background..."
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Mission Statement</label>
                    <textarea rows={2} value={editingCompanyInfo.missionStatement || ""}
                      onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, missionStatement: e.target.value })}
                      placeholder="Our mission is to..."
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1.5 font-semibold">Vision Statement</label>
                    <textarea rows={2} value={editingCompanyInfo.visionStatement || ""}
                      onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, visionStatement: e.target.value })}
                      placeholder="Our vision is to..."
                      className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                  </div>
                </div>
              </div>

              {companyInfoSaved && (
                <div className="bg-emerald-950 text-emerald-300 text-xs p-3 rounded-xl border border-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Company info saved! Changes reflect on About page immediately.
                </div>
              )}
              <button type="submit" className="w-fit bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-6 rounded-xl cursor-pointer">
                Save GST & Company Info
              </button>
            </form>
          </div>
        )}

        {/* ===== TEAM MEMBERS TAB ===== */}
        {activeTab === "team-members" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-base">Team Members ({teamMembers.length})</h3>
              <button
                onClick={() => setEditingMember({ name: "", designation: "", department: "", phone: "", email: "", bio: "", imageUrl: "", isActive: true, order: teamMembers.length + 1 })}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Team Member
              </button>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {member.imageUrl ? (
                          <img src={member.imageUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span>{member.name?.charAt(0) || "?"}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{member.name}</p>
                        <p className="text-emerald-400 text-xs font-semibold">{member.designation}</p>
                        {member.department && <p className="text-slate-500 text-[10px]">{member.department}</p>}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${member.isActive ? "bg-emerald-900 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                      {member.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="text-slate-400 text-xs flex items-center gap-1.5 hover:text-white">
                      <span>📞</span> {member.phone}
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-slate-400 text-xs flex items-center gap-1.5 hover:text-white break-all">
                      <span>✉</span> {member.email}
                    </a>
                  )}
                  {member.bio && <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{member.bio}</p>}
                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <button onClick={() => setEditingMember({ ...member })}
                      className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDeleteTeamMember(member.id)}
                      className="flex-1 bg-red-900 hover:bg-red-800 text-red-300 text-xs font-bold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit/Add Member Modal */}
            {editingMember && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-base">{editingMember.id ? "Edit Team Member" : "Add Team Member"}</h3>
                    <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleSaveTeamMember} className="flex flex-col gap-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-slate-400 block mb-1 font-semibold">Full Name *</label>
                        <input type="text" required value={editingMember.name || ""}
                          onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                          placeholder="Mr. Kulbhushan Sharma"
                          className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Designation *</label>
                        <input type="text" required value={editingMember.designation || ""}
                          onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                          placeholder="Managing Director"
                          className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Department</label>
                        <input type="text" value={editingMember.department || ""}
                          onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                          placeholder="Management"
                          className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Phone</label>
                        <input type="text" value={editingMember.phone || ""}
                          onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                          placeholder="+91 9779003355"
                          className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Email</label>
                        <input type="email" value={editingMember.email || ""}
                          onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-slate-400 block mb-1 font-semibold">Profile Photo</label>
                        <div className="flex flex-col gap-2">
                          {editingMember.imageUrl && (
                            <div className="flex items-center gap-3">
                              <img src={editingMember.imageUrl} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-slate-700" />
                              <button type="button" onClick={() => setEditingMember({ ...editingMember, imageUrl: "" })} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Remove</button>
                            </div>
                          )}
                          <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer w-fit">
                            <ImageIcon className="w-4 h-4" />
                            Upload Photo
                            <input type="file" accept="image/*" className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, (url) => setEditingMember({ ...editingMember, imageUrl: url }));
                              }} />
                          </label>
                          <p className="text-slate-500 text-[10px]">Or paste image URL below:</p>
                          <input type="url" value={editingMember.imageUrl || ""}
                            onChange={(e) => setEditingMember({ ...editingMember, imageUrl: e.target.value })}
                            placeholder="https://... (optional)"
                            className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 text-xs" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-slate-400 block mb-1 font-semibold">Bio / Short Description</label>
                        <textarea rows={3} value={editingMember.bio || ""}
                          onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                          placeholder="Brief professional background..."
                          className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500 resize-none" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-semibold">Display Order</label>
                        <input type="number" value={editingMember.order || 1}
                          onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) })}
                          className="w-full bg-slate-900 text-white border border-slate-800 p-3 rounded-xl focus:ring-1 focus:ring-brand-500" />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <label className="text-slate-400 font-semibold">Show on Website</label>
                        <button type="button" onClick={() => setEditingMember({ ...editingMember, isActive: !editingMember.isActive })}
                          className={`w-12 h-6 rounded-full transition-colors ${editingMember.isActive ? "bg-emerald-600" : "bg-slate-700"} relative cursor-pointer`}>
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingMember.isActive ? "left-7" : "left-1"}`} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl cursor-pointer">
                        {editingMember.id ? "Update Member" : "Add Member"}
                      </button>
                      <button type="button" onClick={() => setEditingMember(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

