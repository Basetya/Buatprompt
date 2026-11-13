"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Boxes,
  Home,
  Camera,
  Sun,
  Volume2,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  RotateCcw,
  Check,
  Copy,
  ArrowLeft,
  X,
  Search,
} from "lucide-react";
import {
  CharacterAsset,
  ProductAsset,
  EnvironmentAsset,
  CameraPreset,
  LightingPreset,
  AudioPreset,
  INITIAL_DEFAULT_VAULT,
  DEFAULT_FOLDERS,
  getGlobalVaultData,
  saveGlobalVaultData,
  addCustomFolder,
  addOrUpdateCharacter,
  deleteCharacter,
  addOrUpdateProduct,
  deleteProduct,
  addOrUpdateEnvironment,
  deleteEnvironment,
  resetVaultToDefaults,
} from "@/lib/assetVault";

export default function AssetVaultPage() {
  const [activeTab, setActiveTab] = useState<
    "characters" | "products" | "environments" | "cameras" | "lightings" | "audios"
  >("characters");
  const [vault, setVault] = useState(INITIAL_DEFAULT_VAULT);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("Semua Proyek");
  const [newAssetFolder, setNewAssetFolder] = useState<string>("Universal / Umum");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Asset Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCharName, setNewCharName] = useState("");
  const [newCharRole, setNewCharRole] = useState("");
  const [newCharPrompt, setNewCharPrompt] = useState("");
  const [newCharWardrobe, setNewCharWardrobe] = useState("");
  const [newCharGender, setNewCharGender] = useState<"female" | "male" | "duo" | "stylized-3d" | "faceless">("female");
  const [newCharImage, setNewCharImage] = useState<string | null>(null);

  // New Product Modal State
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<"food" | "skincare" | "tech" | "fashion" | "beverage" | "other">("food");
  const [newProdPrompt, setNewProdPrompt] = useState("");
  const [newProdMaterial, setNewProdMaterial] = useState("");
  const [newProdInteraction, setNewProdInteraction] = useState("");
  const [newProdImage, setNewProdImage] = useState<string | null>(null);

  // New Environment Modal State
  const [newEnvName, setNewEnvName] = useState("");
  const [newEnvPrompt, setNewEnvPrompt] = useState("");
  const [newEnvSpatial, setNewEnvSpatial] = useState("");
  const [newEnvLighting, setNewEnvLighting] = useState("");
  const [newEnvImage, setNewEnvImage] = useState<string | null>(null);
  const [newEnvGallery, setNewEnvGallery] = useState<Array<{ label: string; imageBase64: string }>>([]);
  const [tempRoomLabel, setTempRoomLabel] = useState("Ruang Tamu");

  const refreshVault = () => {
    setVault(getGlobalVaultData());
  };

  useEffect(() => {
    refreshVault();
    const handleUpdate = () => refreshVault();
    window.addEventListener("buatprompt_vault_updated", handleUpdate);
    return () => window.removeEventListener("buatprompt_vault_updated", handleUpdate);
  }, []);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Image Compressor
  const handleImageUpload = (file: File, callback: (b64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        ctx?.drawImage(img, 0, 0, w, h);
        const b64 = canvas.toDataURL("image/jpeg", 0.85);
        callback(b64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(vault, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buatprompt-asset-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.characters && parsed.products) {
          saveGlobalVaultData(parsed);
          refreshVault();
          alert("Brankas aset berhasil diimpor!");
        } else {
          alert("Format file JSON tidak sesuai struktur Asset Vault.");
        }
      } catch (err) {
        alert("Gagal membaca file JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Handle Save New Character
  const handleSaveCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim() || !newCharPrompt.trim()) return;

    addOrUpdateCharacter({
      id: `char-custom-${Date.now()}`,
      name: newCharName,
      tag: "@host_anchor",
      role: newCharRole || "Custom Creator",
      visualPrompt: newCharPrompt,
      wardrobe: newCharWardrobe || "Casual modern",
      gender: newCharGender,
      brandFolder: newAssetFolder || "Universal / Umum",
      imageBase64: newCharImage,
      isCustom: true,
    });

    setNewCharName("");
    setNewCharRole("");
    setNewCharPrompt("");
    setNewCharWardrobe("");
    setNewCharImage(null);
    setIsAddModalOpen(false);
    refreshVault();
  };

  // Handle Save New Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrompt.trim()) return;

    addOrUpdateProduct({
      id: `prod-custom-${Date.now()}`,
      name: newProdName,
      tag: "@hero_object",
      category: newProdCategory,
      visualPrompt: newProdPrompt,
      material: newProdMaterial || "Commercial item",
      physicalInteraction: newProdInteraction || "Held naturally in hand",
      brandFolder: newAssetFolder || "Universal / Umum",
      imageBase64: newProdImage,
      isCustom: true,
    });

    setNewProdName("");
    setNewProdPrompt("");
    setNewProdMaterial("");
    setNewProdInteraction("");
    setNewProdImage(null);
    setIsAddModalOpen(false);
    refreshVault();
  };

  // Handle Save New Environment
  const handleSaveEnvironment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvName.trim() || !newEnvPrompt.trim()) return;

    addOrUpdateEnvironment({
      id: `env-custom-${Date.now()}`,
      name: newEnvName,
      tag: "@setting_anchor",
      visualPrompt: newEnvPrompt,
      spatialMap: newEnvSpatial || "Balanced aesthetic interior",
      lightingCondition: newEnvLighting || "Natural soft daylight",
      brandFolder: newAssetFolder || "Universal / Umum",
      imageBase64: newEnvImage,
      galleryImages: newEnvGallery.length > 0 ? newEnvGallery : (newEnvImage ? [{ label: "Foto Utama", imageBase64: newEnvImage }] : []),
      isCustom: true,
    });

    setNewEnvName("");
    setNewEnvPrompt("");
    setNewEnvSpatial("");
    setNewEnvLighting("");
    setNewEnvImage(null);
    setNewEnvGallery([]);
    setIsAddModalOpen(false);
    refreshVault();
  };

  const q = searchQuery.toLowerCase().trim();

  const availableFolders = [
    "Semua Proyek",
    ...Array.from(new Set((vault.folders || DEFAULT_FOLDERS).filter((f) => f !== "Semua Proyek"))),
  ];

  const matchFolder = (brandFolder?: string) => {
    if (selectedFolder === "Semua Proyek") return true;
    if (!brandFolder) return selectedFolder === "Universal / Umum";
    return brandFolder.toLowerCase() === selectedFolder.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#e3ded8] font-sans antialiased pb-24">
      {/* Japandi Header Navbar */}
      <header className="border-b border-[#252321] bg-[#121315]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#a39e97] hover:text-[#e8dfd5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c29b74]/30 bg-[#c29b74]/10 px-3 py-0.5 text-[11px] font-mono text-[#d4af88]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af88]" />
            <span>GLOBAL ASSET & STYLE VAULT</span>
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Hero Section */}
        <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f5f1eb]">
                Brankas Aset Bersama (Global Vault)
              </h1>
              <p className="text-xs sm:text-sm text-[#9e978f] mt-1.5 leading-relaxed max-w-2xl">
                Simpan karakter (@host_anchor), produk (@hero_object), latar (@setting_anchor), dan preset kamera satu kali di sini, lalu gunakan secara konsisten di seluruh 28 fitur BuatPrompt.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1a1b1f] px-3 py-1.5 text-xs font-mono text-[#cfc8bf] hover:text-[#f5f1eb] cursor-pointer">
                <Upload className="h-3.5 w-3.5 text-[#c29b74]" />
                <span>Impor Backup</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImportBackup} />
              </label>

              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1a1b1f] px-3 py-1.5 text-xs font-mono text-[#cfc8bf] hover:text-[#f5f1eb]"
              >
                <Download className="h-3.5 w-3.5 text-[#c29b74]" />
                <span>Ekspor Backup</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset seluruh brankas aset ke template bawaan?")) {
                    resetVaultToDefaults();
                    refreshVault();
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1a1b1f] px-3 py-1.5 text-xs font-mono text-[#8c857c] hover:text-[#e06c75]"
                title="Reset ke pengaturan awal"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252321] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "characters" as const, label: `Tokoh (${vault.characters.length})`, icon: Users },
              { id: "products" as const, label: `Produk (${vault.products.length})`, icon: Boxes },
              { id: "environments" as const, label: `Latar (${vault.environments.length})`, icon: Home },
              { id: "cameras" as const, label: `Kamera (${vault.cameras.length})`, icon: Camera },
              { id: "lightings" as const, label: `Cahaya (${vault.lightings.length})`, icon: Sun },
              { id: "audios" as const, label: `Foley (${vault.audios.length})`, icon: Volume2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${isActive
                      ? "bg-[#c29b74] text-[#121315] font-semibold shadow-sm"
                      : "text-[#8c857c] hover:text-[#c4bcb2] hover:bg-[#151619]"
                    }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[220px]">
              <Search className="h-3.5 w-3.5 text-[#736d65] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari aset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#2d2a27] bg-[#141518] text-xs text-[#f5f1eb] placeholder:text-[#5c5751] focus:border-[#c29b74] focus:outline-none font-mono"
              />
            </div>

            {["characters", "products", "environments"].includes(activeTab) && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82] shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Aset</span>
              </button>
            )}
          </div>
        </div>

        {/* Project & Brand Folder Collections Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131417] border border-[#23211f] rounded-xl px-4 py-2.5 overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[#8c857c] shrink-0 mr-1 flex items-center gap-1.5 font-medium">
              📁 Folder Proyek:
            </span>
            {availableFolders.map((folder, idx) => {
              const isSelected = selectedFolder === folder;
              return (
                <button
                  key={`folder-tab-${idx}-${folder}`}
                  type="button"
                  onClick={() => setSelectedFolder(folder)}
                  className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap shrink-0 text-xs cursor-pointer ${isSelected
                      ? "bg-[#c29b74] text-[#121315] font-semibold shadow-sm"
                      : "bg-[#1a1b1f] border border-[#2c2926] text-[#a39e97] hover:text-[#f5f1eb] hover:bg-[#22242a]"
                    }`}
                >
                  {folder}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              const name = prompt("Nama Proyek / Folder Brand Baru (misal: 'GlowLab Skincare' atau 'Villa Seminyak'):");
              if (name && name.trim()) {
                addCustomFolder(name.trim());
                setSelectedFolder(name.trim());
                refreshVault();
              }
            }}
            className="flex items-center gap-1 text-[11px] font-mono text-[#c29b74] hover:underline bg-[#c29b74]/10 border border-[#c29b74]/30 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Buat Folder Proyek
          </button>
        </div>

        {/* TAB 1: CHARACTERS */}
        {activeTab === "characters" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vault.characters
              .filter(
                (c) =>
                  matchFolder(c.brandFolder) &&
                  (c.name.toLowerCase().includes(q) ||
                    c.role.toLowerCase().includes(q) ||
                    c.visualPrompt.toLowerCase().includes(q))
              )
              .map((char) => (
                <div
                  key={char.id}
                  className="rounded-2xl border border-[#282624] bg-[#151619] p-5 space-y-4 flex flex-col justify-between hover:border-[#c29b74]/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {char.imageBase64 ? (
                          <img
                            src={char.imageBase64}
                            alt={char.name}
                            className="h-14 w-14 rounded-xl object-cover border border-[#c29b74]/40 shrink-0"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#242220] border border-[#383531] text-[#c29b74] shrink-0">
                            <Users className="h-7 w-7" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-sans font-semibold text-sm text-[#f5f1eb]">{char.name}</h3>
                            {char.isCustom && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#c29b74]/20 text-[#c29b74] font-mono">
                                Custom
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-[#8c857c] block mt-0.5">{char.role}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="inline-block text-[10px] font-mono text-[#c29b74] bg-[#242220] px-2 py-0.5 rounded">
                              {char.tag}
                            </span>
                            <span className="inline-block text-[10px] font-mono text-[#a39e97] bg-[#1a1b1f] border border-white/5 px-2 py-0.5 rounded">
                              📁 {char.brandFolder || "Universal"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {char.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus karakter ${char.name}?`)) {
                              deleteCharacter(char.id);
                              refreshVault();
                            }
                          }}
                          className="text-[#8c857c] hover:text-[#e06c75] p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl border border-[#242220] bg-[#111214] p-3 font-mono text-xs text-[#cfc8bf] leading-relaxed max-h-36 overflow-y-auto select-all">
                      {char.visualPrompt}
                    </div>

                    <div className="text-[11px] font-mono text-[#7d776f] space-y-1">
                      <div>
                        <span className="text-[#a8a197]">Wardrobe:</span> {char.wardrobe}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#23211f] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => copyText(char.visualPrompt, `char-${char.id}`)}
                      className="flex items-center gap-1.5 text-xs font-mono text-[#c29b74] hover:underline"
                    >
                      {copiedKey === `char-${char.id}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `char-${char.id}` ? "Tersalin!" : "Salin Prompt Tokoh"}</span>
                    </button>
                    <Link
                      href="/ugc-flow-studio"
                      className="text-xs font-mono text-[#8c857c] hover:text-[#f5f1eb]"
                    >
                      Pakai di UGC Studio &rarr;
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vault.products
              .filter(
                (p) =>
                  matchFolder(p.brandFolder) &&
                  (p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.visualPrompt.toLowerCase().includes(q))
              )
              .map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl border border-[#282624] bg-[#151619] p-5 space-y-4 flex flex-col justify-between hover:border-[#c29b74]/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {prod.imageBase64 ? (
                          <img
                            src={prod.imageBase64}
                            alt={prod.name}
                            className="h-14 w-14 rounded-xl object-cover border border-[#c29b74]/40 shrink-0"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#242220] border border-[#383531] text-[#c29b74] shrink-0">
                            <Boxes className="h-7 w-7" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-sans font-semibold text-sm text-[#f5f1eb]">{prod.name}</h3>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#242220] text-[#a8a197] font-mono uppercase">
                              {prod.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="inline-block text-[10px] font-mono text-[#c29b74] bg-[#242220] px-2 py-0.5 rounded">
                              {prod.tag}
                            </span>
                            <span className="inline-block text-[10px] font-mono text-[#a39e97] bg-[#1a1b1f] border border-white/5 px-2 py-0.5 rounded">
                              📁 {prod.brandFolder || "Universal"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {prod.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus produk ${prod.name}?`)) {
                              deleteProduct(prod.id);
                              refreshVault();
                            }
                          }}
                          className="text-[#8c857c] hover:text-[#e06c75] p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl border border-[#242220] bg-[#111214] p-3 font-mono text-xs text-[#cfc8bf] leading-relaxed max-h-36 overflow-y-auto select-all">
                      {prod.visualPrompt}
                    </div>

                    <div className="text-[11px] font-mono text-[#7d776f] space-y-1">
                      <div>
                        <span className="text-[#a8a197]">Material:</span> {prod.material}
                      </div>
                      <div>
                        <span className="text-[#a8a197]">Aksi Fisik:</span> {prod.physicalInteraction}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#23211f] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => copyText(prod.visualPrompt, `prod-${prod.id}`)}
                      className="flex items-center gap-1.5 text-xs font-mono text-[#c29b74] hover:underline"
                    >
                      {copiedKey === `prod-${prod.id}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `prod-${prod.id}` ? "Tersalin!" : "Salin Prompt Produk"}</span>
                    </button>
                    <Link
                      href="/ugc-flow-studio"
                      className="text-xs font-mono text-[#8c857c] hover:text-[#f5f1eb]"
                    >
                      Pakai di UGC Studio &rarr;
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 3: ENVIRONMENTS */}
        {activeTab === "environments" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vault.environments
              .filter(
                (e) =>
                  matchFolder(e.brandFolder) &&
                  (e.name.toLowerCase().includes(q) ||
                    e.visualPrompt.toLowerCase().includes(q))
              )
              .map((env) => (
                <div
                  key={env.id}
                  className="rounded-2xl border border-[#282624] bg-[#151619] p-5 space-y-4 flex flex-col justify-between hover:border-[#c29b74]/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {env.imageBase64 ? (
                          <img
                            src={env.imageBase64}
                            alt={env.name}
                            className="h-14 w-14 rounded-xl object-cover border border-[#c29b74]/40 shrink-0"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#242220] border border-[#383531] text-[#c29b74] shrink-0">
                            <Home className="h-7 w-7" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-sans font-semibold text-sm text-[#f5f1eb]">{env.name}</h3>
                            {env.imageBase64 && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#c29b74]/20 text-[#c29b74] font-mono">
                                Foto Asli
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="inline-block text-[10px] font-mono text-[#c29b74] bg-[#242220] px-2 py-0.5 rounded">
                              {env.tag}
                            </span>
                            <span className="inline-block text-[10px] font-mono text-[#a39e97] bg-[#1a1b1f] border border-white/5 px-2 py-0.5 rounded">
                              📁 {env.brandFolder || "Universal"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {env.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus latar ${env.name}?`)) {
                              deleteEnvironment(env.id);
                              refreshVault();
                            }
                          }}
                          className="text-[#8c857c] hover:text-[#e06c75] p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl border border-[#242220] bg-[#111214] p-3 font-mono text-xs text-[#cfc8bf] leading-relaxed max-h-36 overflow-y-auto select-all">
                      {env.visualPrompt}
                    </div>

                    <div className="text-[11px] font-mono text-[#7d776f] space-y-1">
                      <div>
                        <span className="text-[#a8a197]">Denah Spasial:</span> {env.spatialMap}
                      </div>
                      <div>
                        <span className="text-[#a8a197]">Pencahayaan:</span> {env.lightingCondition}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#23211f] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => copyText(env.visualPrompt, `env-${env.id}`)}
                      className="flex items-center gap-1.5 text-xs font-mono text-[#c29b74] hover:underline"
                    >
                      {copiedKey === `env-${env.id}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `env-${env.id}` ? "Tersalin!" : "Salin Prompt Latar"}</span>
                    </button>
                    <Link
                      href="/ugc-flow-studio"
                      className="text-xs font-mono text-[#8c857c] hover:text-[#f5f1eb]"
                    >
                      Pakai di UGC Studio &rarr;
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 4: CAMERAS */}
        {activeTab === "cameras" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vault.cameras
              .filter(
                (c) =>
                  c.name.toLowerCase().includes(q) ||
                  c.description.toLowerCase().includes(q)
              )
              .map((cam) => (
                <div
                  key={cam.id}
                  className="rounded-2xl border border-[#282624] bg-[#151619] p-5 space-y-3 flex flex-col justify-between hover:border-[#c29b74]/40 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-[#f5f1eb] flex items-center gap-2">
                        <Camera className="h-4 w-4 text-[#c29b74]" />
                        {cam.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242220] text-[#c29b74]">
                        {cam.focalLength}
                      </span>
                    </div>

                    <p className="text-xs text-[#a8a197] leading-relaxed">{cam.description}</p>

                    <div className="rounded-xl border border-[#242220] bg-[#111214] p-3 font-mono text-xs text-[#d4af88] select-all">
                      {cam.commandSlash}
                    </div>

                    <div className="text-[11px] font-mono text-[#7d776f]">
                      <span className="text-[#a8a197]">Rekomendasi Pemakaian:</span> {cam.bestFor}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#23211f]">
                    <button
                      type="button"
                      onClick={() => copyText(cam.commandSlash, `cam-${cam.id}`)}
                      className="flex items-center gap-1.5 text-xs font-mono text-[#c29b74] hover:underline"
                    >
                      {copiedKey === `cam-${cam.id}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `cam-${cam.id}` ? "Tersalin!" : "Salin Perintah /camera"}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 5: LIGHTINGS */}
        {activeTab === "lightings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vault.lightings
              .filter(
                (l) =>
                  l.name.toLowerCase().includes(q) ||
                  l.mood.toLowerCase().includes(q)
              )
              .map((l) => (
                <div
                  key={l.id}
                  className="rounded-2xl border border-[#282624] bg-[#151619] p-5 space-y-3 flex flex-col justify-between hover:border-[#c29b74]/40 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-[#f5f1eb] flex items-center gap-2">
                        <Sun className="h-4 w-4 text-[#c29b74]" />
                        {l.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242220] text-[#c29b74]">
                        {l.kelvin}
                      </span>
                    </div>

                    <p className="text-xs text-[#a8a197] leading-relaxed">
                      <strong>Mood:</strong> {l.mood}
                    </p>

                    <div className="rounded-xl border border-[#242220] bg-[#111214] p-3 font-mono text-xs text-[#cfc8bf] select-all">
                      {l.promptSnippet}
                    </div>

                    <div className="text-[11px] font-mono text-[#7d776f]">
                      <span className="text-[#a8a197]">Arah Sumber:</span> {l.direction}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#23211f]">
                    <button
                      type="button"
                      onClick={() => copyText(l.promptSnippet, `light-${l.id}`)}
                      className="flex items-center gap-1.5 text-xs font-mono text-[#c29b74] hover:underline"
                    >
                      {copiedKey === `light-${l.id}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `light-${l.id}` ? "Tersalin!" : "Salin Prompt Cahaya"}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 6: AUDIOS */}
        {activeTab === "audios" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vault.audios.map((aud) => (
              <div
                key={aud.id}
                className="rounded-2xl border border-[#282624] bg-[#151619] p-5 space-y-3 flex flex-col justify-between hover:border-[#c29b74]/40 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[#f5f1eb] flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-[#c29b74]" />
                      {aud.name}
                    </h3>
                  </div>

                  <div className="rounded-xl border border-[#242220] bg-[#111214] p-3 font-mono text-xs text-[#cfc8bf] select-all">
                    {aud.foleySoundscape}
                  </div>

                  <div className="text-[11px] font-mono text-[#7d776f] space-y-1">
                    <div>
                      <span className="text-[#c29b74]">Hukum Kausalitas Fisik:</span> {aud.causalityRule}
                    </div>
                    <div>
                      <span className="text-[#a8a197]">Music Bed:</span> {aud.musicBedGenre}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#23211f]">
                  <button
                    type="button"
                    onClick={() => copyText(aud.foleySoundscape, `audio-${aud.id}`)}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#c29b74] hover:underline"
                  >
                    {copiedKey === `audio-${aud.id}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === `audio-${aud.id}` ? "Tersalin!" : "Salin Foley SFX"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL: TAMBAH ASET BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-[#332f2b] bg-[#121316] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#252321] pb-3">
              <h3 className="font-semibold text-sm text-[#f5f1eb] flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#c29b74]" />
                Tambah Aset {activeTab === "characters" ? "Tokoh Baru" : activeTab === "products" ? "Produk Baru" : "Latar Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8c857c] hover:text-[#f5f1eb]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FORM CHARACTER */}
            {activeTab === "characters" && (
              <form onSubmit={handleSaveCharacter} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Nama Tokoh *</label>
                  <input
                    type="text"
                    required
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    placeholder="Misal: Nadia — Food Vlogger Santai"
                    className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Peran / Role</label>
                    <input
                      type="text"
                      value={newCharRole}
                      onChange={(e) => setNewCharRole(e.target.value)}
                      placeholder="Misal: Lifestyle Creator"
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Kategori Tampilan</label>
                    <select
                      value={newCharGender}
                      onChange={(e) => setNewCharGender(e.target.value as any)}
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none font-mono"
                    >
                      <option value="female">Wanita</option>
                      <option value="male">Pria</option>
                      <option value="duo">Duo Co-Hosts (Podcast)</option>
                      <option value="stylized-3d">Kartun / 3D Stylized</option>
                      <option value="faceless">Faceless / POV Tangan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Pakaian Kunci (Wardrobe Anchor)</label>
                    <input
                      type="text"
                      value={newCharWardrobe}
                      onChange={(e) => setNewCharWardrobe(e.target.value)}
                      placeholder="Misal: Kaos putih oversized, apron cokelat"
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Folder Proyek / Brand</label>
                    <select
                      value={newAssetFolder}
                      onChange={(e) => setNewAssetFolder(e.target.value)}
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none font-mono"
                    >
                      {availableFolders.filter((f) => f !== "Semua Proyek").map((folder, idx) => (
                        <option key={`char-folder-${idx}-${folder}`} value={folder}>
                          📁 {folder}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Visual Prompt Karakter (Deskripsi Detail) *</label>
                  <textarea
                    rows={3}
                    required
                    value={newCharPrompt}
                    onChange={(e) => setNewCharPrompt(e.target.value)}
                    placeholder="Deskripsi fisik, wajah, ekspresi, rambut, pencahayaan..."
                    className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Upload Foto Referensi (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, setNewCharImage);
                    }}
                    className="text-xs font-mono text-[#8c857c]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#252321]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[#2d2a27] text-xs font-mono text-[#8c857c]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#c29b74] text-xs font-mono font-semibold text-[#121315]"
                  >
                    Simpan Tokoh ke Brankas
                  </button>
                </div>
              </form>
            )}

            {/* FORM PRODUCT */}
            {activeTab === "products" && (
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Nama Produk / Objek *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Misal: Keripik Singkong Balado Premium"
                    className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Kategori</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none font-mono"
                    >
                      <option value="food">Makanan / Kuliner</option>
                      <option value="beverage">Minuman</option>
                      <option value="skincare">Skincare / Kosmetik</option>
                      <option value="tech">Gadget / Elektronik</option>
                      <option value="fashion">Pakaian / Fashion</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Folder Proyek / Brand</label>
                    <select
                      value={newAssetFolder}
                      onChange={(e) => setNewAssetFolder(e.target.value)}
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none font-mono"
                    >
                      {availableFolders.filter((f) => f !== "Semua Proyek").map((folder, idx) => (
                        <option key={`char-folder-${idx}-${folder}`} value={folder}>
                          📁 {folder}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Visual Prompt Objek (Bentuk, Kemasan, Warna) *</label>
                  <textarea
                    rows={3}
                    required
                    value={newProdPrompt}
                    onChange={(e) => setNewProdPrompt(e.target.value)}
                    placeholder="Bentuk fisik kemasan, tekstur, kilap, label..."
                    className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Material</label>
                    <input
                      type="text"
                      value={newProdMaterial}
                      onChange={(e) => setNewProdMaterial(e.target.value)}
                      placeholder="Misal: Kemasan matte foil emas"
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Aksi Fisik / Interaksi</label>
                    <input
                      type="text"
                      value={newProdInteraction}
                      onChange={(e) => setNewProdInteraction(e.target.value)}
                      placeholder="Misal: Diambil 2 jari dan digigit renyah"
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Upload Foto Produk (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, setNewProdImage);
                    }}
                    className="text-xs font-mono text-[#8c857c]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#252321]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[#2d2a27] text-xs font-mono text-[#8c857c]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#c29b74] text-xs font-mono font-semibold text-[#121315]"
                  >
                    Simpan Produk ke Brankas
                  </button>
                </div>
              </form>
            )}

            {/* FORM ENVIRONMENT */}
            {activeTab === "environments" && (
              <form onSubmit={handleSaveEnvironment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Nama Latar / Studio *</label>
                    <input
                      type="text"
                      required
                      value={newEnvName}
                      onChange={(e) => setNewEnvName(e.target.value)}
                      placeholder="Misal: Dapur Minimalis Marmer Hitam"
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Folder Proyek / Brand</label>
                    <select
                      value={newAssetFolder}
                      onChange={(e) => setNewAssetFolder(e.target.value)}
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none font-mono"
                    >
                      {availableFolders.filter((f) => f !== "Semua Proyek").map((folder, idx) => (
                        <option key={`char-folder-${idx}-${folder}`} value={folder}>
                          📁 {folder}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Visual Prompt Latar *</label>
                  <textarea
                    rows={3}
                    required
                    value={newEnvPrompt}
                    onChange={(e) => setNewEnvPrompt(e.target.value)}
                    placeholder="Kondisi ruangan, tekstur dinding, perabot di latar..."
                    className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Denah Spasial</label>
                    <input
                      type="text"
                      value={newEnvSpatial}
                      onChange={(e) => setNewEnvSpatial(e.target.value)}
                      placeholder="Misal: Meja di tengah, rak di kiri"
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#c4bcb2] mb-1">Pencahayaan</label>
                    <input
                      type="text"
                      value={newEnvLighting}
                      onChange={(e) => setNewEnvLighting(e.target.value)}
                      placeholder="Misal: Cahaya jendela hangat 4500K"
                      className="w-full rounded-lg border border-[#2d2a27] bg-[#151619] p-2.5 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4bcb2] mb-1">
                    Upload Foto Ruangan Real / Rumah Asli (@setting_anchor)
                  </label>
                  <p className="text-[11px] text-[#7d776f] mb-1.5">
                    Lampirkan foto ruangan nyata untuk mengunci arsitektur, jendela, dan perabotan tanpa halusinasi AI.
                  </p>
                  <div className="flex items-center gap-3">
                    {newEnvImage && (
                      <img
                        src={newEnvImage}
                        alt="Ruangan Preview"
                        className="h-14 w-14 rounded-lg object-cover border border-[#c29b74]/50"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, setNewEnvImage);
                      }}
                      className="text-xs font-mono text-[#8c857c]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#252321]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[#2d2a27] text-xs font-mono text-[#8c857c]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#c29b74] text-xs font-mono font-semibold text-[#121315]"
                  >
                    Simpan Latar ke Brankas
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

