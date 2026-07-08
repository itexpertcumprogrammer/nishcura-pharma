import React, { useRef, useState } from "react";
import { Link, Upload, X, File, Video, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: "image" | "video" | "any";
  label: string;
  placeholder?: string;
}

export default function MediaUploader({ id, value, onChange, type = "image", label, placeholder = "" }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearMedia = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isBase64 = value?.startsWith("data:");
  const hasValue = !!value;

  return (
    <div className="flex flex-col gap-2 font-sans text-xs" id={id}>
      <label className="text-slate-400 font-semibold block">{label}</label>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        
        {/* Left col: Preview container */}
        <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-3 min-h-[140px] relative overflow-hidden group">
          {hasValue ? (
            <>
              {type === "image" && (
                <img 
                  src={value} 
                  alt="Preview" 
                  className="max-h-24 w-auto object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              )}
              {type === "video" && (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Video className="w-8 h-8 text-emerald-500 mb-1" />
                  <span className="text-[10px] break-all text-center max-w-[120px] line-clamp-1">
                    {isBase64 ? "Local Device Video" : value}
                  </span>
                </div>
              )}
              {type === "any" && (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <File className="w-8 h-8 text-sky-400 mb-1" />
                  <span className="text-[10px] break-all text-center max-w-[120px] line-clamp-1">
                    {isBase64 ? "Local Device File" : value}
                  </span>
                </div>
              )}
              <button 
                type="button" 
                onClick={clearMedia}
                className="absolute top-2 right-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 p-1.5 rounded-lg transition-all"
                title="Clear Media"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="text-slate-500 flex flex-col items-center justify-center text-center p-3">
              {type === "image" && <ImageIcon className="w-8 h-8 mb-1.5 text-slate-700" />}
              {type === "video" && <Video className="w-8 h-8 mb-1.5 text-slate-700" />}
              {type === "any" && <File className="w-8 h-8 mb-1.5 text-slate-700" />}
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">No Media</span>
            </div>
          )}
        </div>

        {/* Right col: Method selection inputs */}
        <div className="md:col-span-8 flex flex-col gap-3 justify-center">
          
          {/* Method A: Web URL input field */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
              <Link className="w-3 h-3 text-sky-400" /> Option A: Dynamic Web URL Link
            </span>
            <input 
              type="text" 
              value={isBase64 ? "" : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={isBase64 ? "Using local file (Clear preview first to input URL)" : (placeholder || "e.g. https://domain.com/image.png")}
              disabled={isBase64}
              className="w-full bg-slate-900 text-white border border-slate-800 p-2 rounded-lg focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          {/* Mini elegant divider line */}
          <div className="flex items-center text-center text-slate-600 font-bold uppercase tracking-widest text-[9px] my-1">
            <span className="flex-grow border-t border-slate-800/80 mr-2" /> OR <span className="flex-grow border-t border-slate-800/80 ml-2" />
          </div>

          {/* Method B: Native local file browser & drag drop trigger */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
              <Upload className="w-3 h-3 text-emerald-400" /> Option B: Upload from Device
            </span>
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-emerald-500 bg-emerald-950/20" 
                  : "border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-900/60"
              }`}
            >
              <Upload className="w-5 h-5 text-slate-500 mb-1" />
              <span className="text-[10px] font-medium text-slate-300">
                Click to browse files or drag & drop here
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5">
                Supports JPG, PNG, GIF, SVG, WEBP, MP4
              </span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "*"}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
