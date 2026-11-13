"use client";

import { useState, useEffect } from "react";
import {
  X,
  Search,
  Users,
  Boxes,
  Home,
  Camera,
  Sun,
  Volume2,
  Check,
  Plus,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  CharacterAsset,
  ProductAsset,
  EnvironmentAsset,
  CameraPreset,
  LightingPreset,
  INITIAL_DEFAULT_VAULT,
  getGlobalVaultData,
} from "@/lib/assetVault";

export type VaultPickerCategory = "characters" | "products" | "environments" | "cameras" | "lightings";

interface AssetVaultPickerModalProps {
  isOpen: boolean;
  initialCategory?: VaultPickerCategory;
  onClose: () => void;
  onSelectCharacter?: (char: CharacterAsset) => void;
  onSelectProduct?: (prod: ProductAsset) => void;
  onSelectEnvironment?: (env: EnvironmentAsset) => void;
  onSelectCamera?: (cam: CameraPreset) => void;
  onSelectLighting?: (light: LightingPreset) => void;
}

export default function AssetVaultPickerModal({
  isOpen,
  initialCategory = "characters",
  onClose,
  onSelectCharacter,
  onSelectProduct,
  onSelectEnvironment,
  onSelectCamera,
  onSelectLighting,
}: AssetVaultPickerModalProps) {
  const [activeTab, setActiveTab] = useState<VaultPickerCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("Semua Proyek");
  const [vaultData, setVaultData] = useState(INITIAL_DEFAULT_VAULT);

  useEffect(() => {
    setActiveTab(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (isOpen) {
      setVaultData(getGlobalVaultData());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  const availableFolders = [
    "Semua Proyek",
    ...Array.from(new Set((vaultData.folders || ["Universal / Umum", "Skincare & Beauty", "Properti & Arsitektur", "Tech & Gadget", "Kuliner & F&B", "Podcast Studio"]).filter((f) => f !== "Semua Proyek")))
  ];

  const matchFolder = (brandFolder?: string) => {
    if (selectedFolder === "Semua Proyek") return true;
    if (!brandFolder) return selectedFolder === "Universal / Umum";
    return brandFolder.toLowerCase() === selectedFolder.toLowerCase();
  };

  const filteredCharacters = vaultData.characters.filter(
    (c) =>
      matchFolder(c.brandFolder) &&
      (c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.visualPrompt.toLowerCase().includes(q))
  );

  const filteredProducts = vaultData.products.filter(
    (p) =>
      matchFolder(p.brandFolder) &&
      (p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.visualPrompt.toLowerCase().includes(q))
  );

  const filteredEnvironments = vaultData.environments.filter(
    (e) =>
      matchFolder(e.brandFolder) &&
      (e.name.toLowerCase().includes(q) ||
        e.visualPrompt.toLowerCase().includes(q))
  );

  const filteredCameras = vaultData.cameras.filter(
    (cam) =>
      matchFolder(cam.brandFolder) &&
      (cam.name.toLowerCase().includes(q) ||
        cam.description.toLowerCase().includes(q) ||
        cam.bestFor.toLowerCase().includes(q))
  );

  const filteredLightings = vaultData.lightings.filter(
    (l) =>
      matchFolder(l.brandFolder) &&
      (l.name.toLowerCase().includes(q) ||
        l.mood.toLowerCase().includes(q) ||
        l.promptSnippet.toLowerCase().includes(q))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-[#332f2b] bg-[#121316] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#252321] px-5 py-4 bg-[#16171b]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c29b74]/15 border border-[#c29b74]/30 text-[#c29b74]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f5f1eb]">
                Brankas Aset Bersama (Global Asset Vault)
              </h3>
              <p className="text-[11px] text-[#8c857c]">
                Pilih referensi yang tersimpan untuk menjaga konsistensi 100% lintas fitur.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8c857c] hover:bg-[#252321] hover:text-[#f5f1eb] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252321] px-5 py-3 bg-[#141518]">
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: "characters" as const, label: `Tokoh (${vaultData.characters.length})`, icon: Users },
              { id: "products" as const, label: `Produk (${vaultData.products.length})`, icon: Boxes },
              { id: "environments" as const, label: `Latar (${vaultData.environments.length})`, icon: Home },
              { id: "cameras" as const, label: `Kamera (${vaultData.cameras.length})`, icon: Camera },
              { id: "lightings" as const, label: `Cahaya (${vaultData.lightings.length})`, icon: Sun },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#c29b74] text-[#121315] font-semibold"
                      : "text-[#8c857c] hover:text-[#c4bcb2] hover:bg-[#1a1b1f]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="h-3.5 w-3.5 text-[#736d65] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari aset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#2d2a27] bg-[#111214] text-xs text-[#f5f1eb] placeholder:text-[#5c5751] focus:border-[#c29b74] focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Project / Brand Folder Filter Chips */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-[#101113] border-b border-[#201e1c] overflow-x-auto text-[11px] font-mono">
          <span className="text-[#7d776f] shrink-0 mr-1 flex items-center gap-1">
            📁 Proyek:
          </span>
          {availableFolders.map((folder) => {
            const isSelected = selectedFolder === folder;
            return (
              <button
                key={folder}
                type="button"
                onClick={() => setSelectedFolder(folder)}
                className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-[#c29b74]/20 border border-[#c29b74]/50 text-[#c29b74] font-medium"
                    : "bg-[#18191c] border border-[#262422] text-[#8c857c] hover:text-[#c4bcb2] hover:bg-[#202126]"
                }`}
              >
                {folder}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {/* CHARACTERS TAB */}
          {activeTab === "characters" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => {
                    onSelectCharacter?.(char);
                    onClose();
                  }}
                  className="group flex flex-col justify-between rounded-xl border border-[#282624] bg-[#16171b] p-4 hover:border-[#c29b74]/60 hover:bg-[#1a1b20] transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {char.imageBase64 ? (
                      <img
                        src={char.imageBase64}
                        alt={char.name}
                        className="h-12 w-12 rounded-lg object-cover border border-[#c29b74]/40 shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#242220] border border-[#383531] text-[#c29b74] shrink-0">
                        <Users className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs text-[#f5f1eb] truncate group-hover:text-[#c29b74] transition-colors">
                          {char.name}
                        </h4>
                        {char.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#c29b74]/20 text-[#c29b74] font-mono">
                            Custom
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] font-mono text-[#8c857c] mt-0.5">
                        {char.role}
                      </span>
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

                  <p className="text-[11px] text-[#9c958c] line-clamp-2 leading-relaxed">
                    {char.visualPrompt}
                  </p>

                  <div className="pt-2 border-t border-[#23211f] flex items-center justify-between text-[11px] font-mono text-[#7d776f]">
                    <span>Pakaian: {char.wardrobe}</span>
                    <span className="text-[#c29b74] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Pilih <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct?.(prod);
                    onClose();
                  }}
                  className="group flex flex-col justify-between rounded-xl border border-[#282624] bg-[#16171b] p-4 hover:border-[#c29b74]/60 hover:bg-[#1a1b20] transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {prod.imageBase64 ? (
                      <img
                        src={prod.imageBase64}
                        alt={prod.name}
                        className="h-12 w-12 rounded-lg object-cover border border-[#c29b74]/40 shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#242220] border border-[#383531] text-[#c29b74] shrink-0">
                        <Boxes className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs text-[#f5f1eb] truncate group-hover:text-[#c29b74] transition-colors">
                          {prod.name}
                        </h4>
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

                  <p className="text-[11px] text-[#9c958c] line-clamp-2 leading-relaxed">
                    {prod.visualPrompt}
                  </p>

                  <div className="pt-2 border-t border-[#23211f] flex items-center justify-between text-[11px] font-mono text-[#7d776f]">
                    <span>Interaksi: {prod.physicalInteraction}</span>
                    <span className="text-[#c29b74] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Pilih <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ENVIRONMENTS TAB */}
          {activeTab === "environments" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredEnvironments.map((env) => (
                <div
                  key={env.id}
                  onClick={() => {
                    onSelectEnvironment?.(env);
                    onClose();
                  }}
                  className="group flex flex-col justify-between rounded-xl border border-[#282624] bg-[#16171b] p-4 hover:border-[#c29b74]/60 hover:bg-[#1a1b20] transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {env.imageBase64 ? (
                      <img
                        src={env.imageBase64}
                        alt={env.name}
                        className="h-12 w-12 rounded-lg object-cover border border-[#c29b74]/40 shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#242220] border border-[#383531] text-[#c29b74] shrink-0">
                        <Home className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs text-[#f5f1eb] truncate group-hover:text-[#c29b74] transition-colors">
                          {env.name}
                        </h4>
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

                  <p className="text-[11px] text-[#9c958c] line-clamp-2 leading-relaxed">
                    {env.visualPrompt}
                  </p>

                  <div className="pt-2 border-t border-[#23211f] flex items-center justify-between text-[11px] font-mono text-[#7d776f]">
                    <span className="truncate max-w-[200px]">Cahaya: {env.lightingCondition}</span>
                    <span className="text-[#c29b74] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Pilih <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CAMERAS TAB */}
          {activeTab === "cameras" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCameras.map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => {
                    onSelectCamera?.(cam);
                    onClose();
                  }}
                  className="group flex flex-col justify-between rounded-xl border border-[#282624] bg-[#16171b] p-4 hover:border-[#c29b74]/60 hover:bg-[#1a1b20] transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-[#f5f1eb] group-hover:text-[#c29b74] transition-colors flex items-center gap-2">
                      <Camera className="h-3.5 w-3.5 text-[#c29b74]" />
                      {cam.name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242220] text-[#a8a197]">
                      {cam.focalLength}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#9c958c] leading-relaxed">
                    {cam.description}
                  </p>

                  <div className="rounded-lg bg-[#111214] p-2 font-mono text-[10px] text-[#c29b74] truncate">
                    {cam.commandSlash}
                  </div>

                  <div className="pt-2 border-t border-[#23211f] flex items-center justify-between text-[11px] font-mono text-[#7d776f]">
                    <span>Cocok untuk: {cam.bestFor}</span>
                    <span className="text-[#c29b74] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Pilih <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIGHTINGS TAB */}
          {activeTab === "lightings" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLightings.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    onSelectLighting?.(l);
                    onClose();
                  }}
                  className="group flex flex-col justify-between rounded-xl border border-[#282624] bg-[#16171b] p-4 hover:border-[#c29b74]/60 hover:bg-[#1a1b20] transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-[#f5f1eb] group-hover:text-[#c29b74] transition-colors flex items-center gap-2">
                      <Sun className="h-3.5 w-3.5 text-[#c29b74]" />
                      {l.name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242220] text-[#a8a197]">
                      {l.kelvin}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#9c958c] leading-relaxed">
                    Mood: {l.mood}
                  </p>

                  <div className="rounded-lg bg-[#111214] p-2 font-mono text-[10px] text-[#c29b74] truncate">
                    {l.promptSnippet}
                  </div>

                  <div className="pt-2 border-t border-[#23211f] flex items-center justify-between text-[11px] font-mono text-[#7d776f]">
                    <span>Arah: {l.direction}</span>
                    <span className="text-[#c29b74] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Pilih <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#252321] px-5 py-3 bg-[#16171b] flex items-center justify-between text-xs font-mono text-[#8c857c]">
          <span>Semua aset tersimpan otomatis di browser lokal Anda.</span>
          <a
            href="/asset-vault"
            target="_blank"
            className="text-[#c29b74] hover:underline flex items-center gap-1"
          >
            Kelola / Tambah Aset di Halaman Vault <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

