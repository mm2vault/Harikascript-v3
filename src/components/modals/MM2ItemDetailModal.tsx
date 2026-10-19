import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  X,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon,
  Shield,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRightLeft,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Upload,
  Maximize2,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';

export const MM2ItemDetailModal: React.FC = () => {
  const {
    mm2Items,
    selectedMM2Item,
    setSelectedMM2Item,
    updateMM2Item,
    isAuthorizedAdmin,
    showToast,
    setActiveTab
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Wiki Edit States
  const [isEditingWiki, setIsEditingWiki] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editTrivia, setEditTrivia] = useState<string[]>([]);
  const [newTriviaInput, setNewTriviaInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when item changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsEditingImages(false);
    setIsEditingWiki(false);
    setNewImageUrl('');
    setIsFullscreenImage(false);

    if (selectedMM2Item) {
      setEditDescription(
        selectedMM2Item.description ||
          `${selectedMM2Item.name}, Roblox Murder Mystery 2 evreninin en çok aranan ${selectedMM2Item.rarity} sınıfı ${
            selectedMM2Item.category === 'Knife'
              ? 'bıçaklarından'
              : selectedMM2Item.category === 'Gun'
              ? 'silahlarından'
              : 'yoldaşlarından'
          } biridir. ${selectedMM2Item.origin} kökenli bu efsanevi eşya, yüksek takas değeri ve ikonik görünümüyle oyuncuların koleksiyonlarında baş köşeyi alır.`
      );
      setEditTrivia(
        selectedMM2Item.trivia && selectedMM2Item.trivia.length > 0
          ? [...selectedMM2Item.trivia]
          : [
              `${selectedMM2Item.origin} etkinliği kapsamında oyuna eklenmiştir.`,
              `Piyasa talebi "${selectedMM2Item.demand}" seviyesindedir ve popülerliğini korumaktadır.`,
              selectedMM2Item.type === 'Chroma'
                ? 'Gökkuşağı RGB renk döngüsü animasyonuna sahiptir.'
                : `${selectedMM2Item.type} kategorisinin en prestijli modellerindendir.`,
              `Güncel takas değeri yaklaşık ${selectedMM2Item.value.toLocaleString()} puandır.`
            ]
      );
    }
  }, [selectedMM2Item?.id]);

  // Index navigation
  const currentIndex = selectedMM2Item ? mm2Items.findIndex((i) => i.id === selectedMM2Item.id) : -1;
  const hasPrevItem = currentIndex > 0;
  const hasNextItem = currentIndex >= 0 && currentIndex < mm2Items.length - 1;

  const goToPrevItem = () => {
    if (hasPrevItem) {
      setSelectedMM2Item(mm2Items[currentIndex - 1]);
    }
  };

  const goToNextItem = () => {
    if (hasNextItem) {
      setSelectedMM2Item(mm2Items[currentIndex + 1]);
    }
  };

  // Build the list of images (max 7)
  const existingImages: string[] =
    selectedMM2Item && Array.isArray(selectedMM2Item.galleryImages) && selectedMM2Item.galleryImages.length > 0
      ? selectedMM2Item.galleryImages
      : selectedMM2Item
      ? [selectedMM2Item.imageUrl]
      : [];

  // Guarantee maximum 7 images
  const images = existingImages.slice(0, 7);
  const currentImage = images[activeImageIndex] || selectedMM2Item?.imageUrl || '';

  // Keyboard navigation - must be called unconditionally before any early return (Rules of Hooks)
  useEffect(() => {
    if (!selectedMM2Item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreenImage) {
          setIsFullscreenImage(false);
        } else {
          setSelectedMM2Item(null);
        }
      } else if (e.key === 'ArrowLeft') {
        if (e.shiftKey) {
          goToPrevItem();
        } else if (images.length > 1) {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        }
      } else if (e.key === 'ArrowRight') {
        if (e.shiftKey) {
          goToNextItem();
        } else if (images.length > 1) {
          setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMM2Item, isFullscreenImage, images.length, currentIndex, mm2Items]);

  if (!selectedMM2Item) return null;

  const handleAddImageUrl = async () => {
    if (!newImageUrl.trim() || !newImageUrl.startsWith('http')) {
      showToast('Lütfen geçerli bir https:// görsel bağlantısı girin!');
      return;
    }

    if (images.length >= 7) {
      showToast('Maksimum 7 görsel sınırına ulaşıldı! Önce bir görsel silin.');
      return;
    }

    const updatedImages = [...images, newImageUrl.trim()];
    await updateMM2Item(selectedMM2Item.id, {
      galleryImages: updatedImages
    });

    setSelectedMM2Item({
      ...selectedMM2Item,
      galleryImages: updatedImages
    });

    setNewImageUrl('');
    setActiveImageIndex(updatedImages.length - 1);
    showToast(`Görsel başarıyla eklendi! (${updatedImages.length}/7) 📸`);
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 7) {
      showToast('Maksimum 7 görsel sınırına ulaşıldı! Önce bir görsel silin.');
      return;
    }

    try {
      setIsUploading(true);
      showToast('Görsel optimize ediliyor...');
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.8);
      const updatedImages = [...images, compressedDataUrl];

      await updateMM2Item(selectedMM2Item.id, {
        galleryImages: updatedImages
      });

      setSelectedMM2Item({
        ...selectedMM2Item,
        galleryImages: updatedImages
      });

      setActiveImageIndex(updatedImages.length - 1);
      showToast(`Cihazdan fotoğraf eklendi! (${updatedImages.length}/7) 📸`);
    } catch (err: any) {
      showToast('Görsel yüklenirken bir sorun oluştu.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    if (images.length <= 1) {
      showToast('En az 1 ana görsel bulunmalıdır!');
      return;
    }

    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    await updateMM2Item(selectedMM2Item.id, {
      galleryImages: updatedImages,
      imageUrl: updatedImages[0]
    });

    setSelectedMM2Item({
      ...selectedMM2Item,
      galleryImages: updatedImages,
      imageUrl: updatedImages[0]
    });

    if (activeImageIndex >= updatedImages.length) {
      setActiveImageIndex(Math.max(0, updatedImages.length - 1));
    }
    showToast('Görsel silindi.');
  };

  const handleSetCover = async (index: number) => {
    if (index === 0) return;
    const itemToPromote = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    const reordered = [itemToPromote, ...rest];

    await updateMM2Item(selectedMM2Item.id, {
      galleryImages: reordered,
      imageUrl: reordered[0]
    });

    setSelectedMM2Item({
      ...selectedMM2Item,
      galleryImages: reordered,
      imageUrl: reordered[0]
    });

    setActiveImageIndex(0);
    showToast('Kapak görseli olarak ayarlandı! ⭐');
  };

  const handleSaveWiki = async () => {
    const trimmedDesc = editDescription.trim();
    const cleanTrivia = editTrivia.map((t) => t.trim()).filter((t) => t.length > 0);

    await updateMM2Item(selectedMM2Item.id, {
      description: trimmedDesc,
      trivia: cleanTrivia
    });

    setSelectedMM2Item({
      ...selectedMM2Item,
      description: trimmedDesc,
      trivia: cleanTrivia
    });

    setIsEditingWiki(false);
    showToast('Fandom Wiki bilgileri başarıyla kaydedildi! 📖✨');
  };

  const handleAddTriviaPoint = () => {
    if (!newTriviaInput.trim()) return;
    setEditTrivia((prev) => [...prev, newTriviaInput.trim()]);
    setNewTriviaInput('');
  };

  const handleRemoveTriviaPoint = (idx: number) => {
    setEditTrivia((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Eşya Fandom Wiki bağlantısı kopyalandı! 📋');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCreateTrade = () => {
    setSelectedMM2Item(null);
    setActiveTab('mm2_values');
    showToast(`"${selectedMM2Item.name}" için takas bölümüne yönlendirildiniz.`);
  };

  const getRarityColor = (type: string) => {
    switch (type) {
      case 'Ancient':
        return 'from-amber-500 to-orange-600 border-amber-500 text-amber-300';
      case 'Godly':
        return 'from-purple-600 to-pink-600 border-purple-500 text-purple-300';
      case 'Chroma':
        return 'from-pink-500 via-yellow-400 to-cyan-400 border-pink-400 text-pink-300 animate-pulse';
      case 'Vintage':
        return 'from-yellow-600 to-amber-700 border-yellow-500 text-yellow-300';
      case 'Unique':
        return 'from-red-600 to-rose-700 border-red-500 text-red-300';
      default:
        return 'from-slate-700 to-slate-900 border-slate-600 text-slate-300';
    }
  };

  return (
    <>
      {/* Fullscreen Lightbox Modal */}
      {isFullscreenImage && (
        <div
          onClick={() => setIsFullscreenImage(false)}
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage}
            alt={selectedMM2Item.name}
            className="max-w-[90vw] max-h-[85vh] object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]"
          />
          <div className="mt-4 px-4 py-1.5 rounded-full bg-black/70 border border-purple-600/40 text-purple-200 text-xs font-mono">
            {selectedMM2Item.name} • Görsel {activeImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Main Fandom Wiki Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-4xl bg-[#0b0819] border border-purple-600/40 rounded-3xl shadow-2xl shadow-purple-950/70 overflow-hidden my-auto flex flex-col max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Breadcrumb & Navigation Bar */}
          <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-950/80 via-[#130d2a] to-[#0c081c] border-b border-purple-900/50 flex items-center justify-between gap-2 shrink-0">
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-mono text-purple-300/80 overflow-hidden">
              <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                Fandom Wiki
              </span>
              <span>/</span>
              <span className="text-slate-400 hidden xs:inline">{selectedMM2Item.type}</span>
              <span className="hidden xs:inline">/</span>
              <span className="text-slate-400">{selectedMM2Item.category}</span>
              <span>/</span>
              <span className="text-amber-300 font-bold truncate">{selectedMM2Item.name}</span>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Prev / Next Item Switchers */}
              <div className="flex items-center bg-purple-950/50 rounded-xl border border-purple-800/40 p-0.5 mr-1">
                <button
                  onClick={goToPrevItem}
                  disabled={!hasPrevItem}
                  className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Önceki Eşya (Shift + Sol Ok)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-slate-400 px-1.5">
                  {currentIndex + 1}/{mm2Items.length}
                </span>
                <button
                  onClick={goToNextItem}
                  disabled={!hasNextItem}
                  className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Sonraki Eşya (Shift + Sağ Ok)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-300 hover:text-white transition-colors"
                title="Paylaş / Kopyala"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setSelectedMM2Item(null)}
                className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 transition-colors"
                title="Kapat (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Gallery & Lore (7 columns on desktop) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Title & Category Banner */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                      <span>{selectedMM2Item.name}</span>
                      <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg bg-purple-950 border border-purple-700/60 text-purple-300">
                        {selectedMM2Item.category === 'Knife'
                          ? '🗡️ Bıçak'
                          : selectedMM2Item.category === 'Gun'
                          ? '🔫 Silah'
                          : '🐾 Pet'}
                      </span>
                    </h2>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      Roblox Murder Mystery 2 Topluluk & Değer Ansiklopedisi
                    </span>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r border ${getRarityColor(
                      selectedMM2Item.type
                    )} shadow-lg`}
                  >
                    {selectedMM2Item.rarity}
                  </div>
                </div>

                {/* Fandom Gallery Box (Max 7 Images) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#120d26] border border-purple-900/50 space-y-3 shadow-inner">
                  
                  {/* Gallery Header Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-pink-400" />
                      Görsel Galerisi ({images.length} / 7 Resim)
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsFullscreenImage(true)}
                        className="px-2 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Büyüt / Tam Ekran"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span className="hidden xs:inline">Büyüt</span>
                      </button>

                      <button
                        onClick={() => setIsEditingImages((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                          isEditingImages
                            ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40'
                            : 'bg-purple-900/50 hover:bg-purple-800 text-pink-300 hover:text-white border border-purple-700/40'
                        }`}
                        title="Görsel Ekle veya Düzenle (Maksimum 7)"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Resim Ekle / Yönet</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Hero Image */}
                  <div className="relative aspect-video sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/70 border border-purple-800/40 flex items-center justify-center group shadow-xl">
                    <img
                      src={currentImage}
                      alt={`${selectedMM2Item.name} Görsel ${activeImageIndex + 1}`}
                      className="w-full h-full object-contain p-2 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setIsFullscreenImage(true)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Previous / Next Arrow buttons on main image */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-purple-900/90 text-white border border-purple-600/40 backdrop-blur-sm opacity-80 hover:opacity-100 transition-all shadow-lg"
                          aria-label="Önceki Görsel"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-purple-900/90 text-white border border-purple-600/40 backdrop-blur-sm opacity-80 hover:opacity-100 transition-all shadow-lg"
                          aria-label="Sonraki Görsel"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/85 border border-purple-600/50 text-[10px] font-mono text-purple-200 backdrop-blur-sm shadow-md">
                      #{activeImageIndex + 1} / {images.length} (Maks. 7)
                    </div>
                  </div>

                  {/* 7 Progress / Slot Dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {Array.from({ length: 7 }).map((_, idx) => {
                      const isFilled = idx < images.length;
                      const isCurrent = idx === activeImageIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => isFilled && setActiveImageIndex(idx)}
                          disabled={!isFilled}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-sm shadow-pink-500/50'
                              : isFilled
                              ? 'bg-purple-700/60 hover:bg-purple-500'
                              : 'bg-purple-950/40 border border-purple-900/30'
                          }`}
                          title={isFilled ? `Görsel #${idx + 1}` : `Boş slot #${idx + 1}`}
                        />
                      );
                    })}
                  </div>

                  {/* Thumbnails Row (Up to 7 images) */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group/thumb shrink-0">
                        <button
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden block border-2 transition-all ${
                            activeImageIndex === idx
                              ? 'border-pink-500 ring-2 ring-pink-500/40 scale-105'
                              : 'border-purple-900/50 opacity-70 hover:opacity-100 hover:border-purple-600'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Küçük görsel ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 px-1 text-[8px] font-bold bg-black/80 text-white rounded-tl">
                            #{idx + 1}
                          </span>
                        </button>
                      </div>
                    ))}

                    {/* Quick Add Slot if less than 7 */}
                    {images.length < 7 && (
                      <button
                        onClick={() => setIsEditingImages(true)}
                        className="w-14 h-14 rounded-xl border-2 border-dashed border-purple-600/60 hover:border-pink-500 bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 hover:text-white flex flex-col items-center justify-center gap-0.5 shrink-0 transition-colors"
                        title="Yeni Fotoğraf Ekle (Maks. 7)"
                      >
                        <Plus className="w-4 h-4 text-pink-400" />
                        <span className="text-[9px] font-bold">{images.length}/7</span>
                      </button>
                    )}
                  </div>

                  {/* Image Manager Panel (Upload from device or URL) */}
                  {isEditingImages && (
                    <div className="p-4 rounded-2xl bg-[#0c0919] border border-purple-700/60 space-y-3.5 animate-in fade-in shadow-xl">
                      <div className="flex items-center justify-between border-b border-purple-900/50 pb-2">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Görsel Ekle & Yönet ({images.length}/7 Dolu)
                        </span>
                        <button
                          onClick={() => setIsEditingImages(false)}
                          className="text-[11px] text-slate-400 hover:text-white"
                        >
                          ✕ Kapat
                        </button>
                      </div>

                      {/* Add Image Inputs (Device Upload or URL) */}
                      {images.length < 7 ? (
                        <div className="space-y-2">
                          <span className="text-[11px] text-purple-300 font-semibold block">
                            Yeni Fotoğraf Yükle (Kalan Slot: {7 - images.length})
                          </span>

                          <div className="flex flex-col sm:flex-row gap-2">
                            {/* Device Upload Button */}
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleDeviceUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 disabled:opacity-50"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploading ? 'Yükleniyor...' : 'Cihazdan Fotoğraf Seç'}</span>
                            </button>

                            {/* URL Input */}
                            <div className="flex-1 flex items-center gap-1.5">
                              <input
                                type="url"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="veya https://... görsel bağlantısı yapıştırın"
                                className="flex-1 bg-[#150f2e] text-xs text-white p-2 rounded-xl border border-purple-800/60 focus:border-pink-500 focus:outline-none"
                              />
                              <button
                                onClick={handleAddImageUrl}
                                className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                              >
                                Linki Ekle
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-300 text-xs text-center font-bold">
                          ⚠️ Maksimum 7 görsel sınırına ulaşıldı. Yeni görsel eklemek için aşağıdan birini silin.
                        </div>
                      )}

                      {/* Remove or Set Cover for Images */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Yüklü Görselleri Düzenle:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {images.map((img, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-purple-900/50 text-xs text-slate-300 gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={img}
                                  alt=""
                                  className="w-8 h-8 rounded-lg object-cover border border-purple-800/50 shrink-0"
                                />
                                <span className="font-bold truncate text-[11px]">
                                  {i === 0 ? '⭐ Kapak (#1)' : `Görsel #${i + 1}`}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {i !== 0 && (
                                  <button
                                    onClick={() => handleSetCover(i)}
                                    className="px-2 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-[10px] text-purple-200 font-semibold"
                                    title="Kapak Yap"
                                  >
                                    Kapak Yap
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveImage(i)}
                                  className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/60 hover:text-rose-200 transition-colors"
                                  title="Görseli Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hakkında & Hikaye Bölümü (Lore) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0f0b21] border border-purple-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-white flex items-center gap-2">
                      <Info className="w-4 h-4 text-purple-400" />
                      <span>Hakkında & Genel Bakış</span>
                    </h4>

                    <button
                      onClick={() => setIsEditingWiki((prev) => !prev)}
                      className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3 h-3 text-pink-400" />
                      <span>{isEditingWiki ? 'İptal' : 'Düzenle'}</span>
                    </button>
                  </div>

                  {isEditingWiki ? (
                    <div className="space-y-3">
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        placeholder="Bu eşya hakkında detaylı bilgi, hikaye ve özellikler yazın..."
                        className="w-full bg-[#150f2e] text-xs text-white p-3 rounded-xl border border-purple-800/60 focus:border-pink-500 focus:outline-none leading-relaxed"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedMM2Item.description ||
                        `${selectedMM2Item.name}, Roblox Murder Mystery 2 evreninin en çok aranan ${
                          selectedMM2Item.rarity
                        } sınıfı ${
                          selectedMM2Item.category === 'Knife'
                            ? 'bıçaklarından'
                            : selectedMM2Item.category === 'Gun'
                            ? 'silahlarından'
                            : 'yoldaşlarından'
                        } biridir. ${selectedMM2Item.origin} kökenli bu efsanevi eşya, yüksek takas değeri ve ikonik görünümüyle oyuncuların koleksiyonlarında baş köşeyi alır.`}
                    </p>
                  )}
                </div>

                {/* İlginç Bilgiler & Trivia (Fandom Bullet Points) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0f0b21] border border-purple-900/40 space-y-3">
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-pink-400" />
                    <span>İlginç Bilgiler & Topluluk İpuçları</span>
                  </h4>

                  {isEditingWiki ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {editTrivia.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={t}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditTrivia((prev) =>
                                  prev.map((item, i) => (i === idx ? val : item))
                                );
                              }}
                              className="flex-1 bg-[#150f2e] text-xs text-white p-2 rounded-xl border border-purple-800/60 focus:outline-none"
                            />
                            <button
                              onClick={() => handleRemoveTriviaPoint(idx)}
                              className="text-rose-400 hover:text-rose-200 p-1"
                              title="Maddeyi Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new bullet */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTriviaInput}
                          onChange={(e) => setNewTriviaInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTriviaPoint()}
                          placeholder="Yeni ilginç bilgi maddesi ekle..."
                          className="flex-1 bg-[#150f2e] text-xs text-white p-2 rounded-xl border border-purple-800/60 focus:outline-none"
                        />
                        <button
                          onClick={handleAddTriviaPoint}
                          className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl"
                        >
                          Madde Ekle
                        </button>
                      </div>

                      {/* Save Wiki Button */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleSaveWiki}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Wiki Değişikliklerini Kaydet</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-2 text-xs text-slate-300">
                      {(selectedMM2Item.trivia && selectedMM2Item.trivia.length > 0
                        ? selectedMM2Item.trivia
                        : [
                            `${selectedMM2Item.origin} etkinliği kapsamında oyuna eklenmiştir.`,
                            `Piyasa talebi "${selectedMM2Item.demand}" seviyesindedir ve popülerliğini korumaktadır.`,
                            selectedMM2Item.type === 'Chroma'
                              ? 'Gökkuşağı RGB renk döngüsü animasyonuna sahiptir.'
                              : `${selectedMM2Item.type} kategorisinin en prestijli modellerindendir.`,
                            `Güncel takas değeri yaklaşık ${selectedMM2Item.value.toLocaleString()} puandır.`
                          ]
                      ).map((trivia, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{trivia}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Fandom Wikia Infobox (5 columns on desktop) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl bg-[#120d26] border-2 border-purple-700/50 overflow-hidden shadow-2xl">
                  {/* Infobox Header */}
                  <div
                    className={`p-3.5 bg-gradient-to-r text-center font-black text-sm text-white border-b ${getRarityColor(
                      selectedMM2Item.type
                    )} shadow-md`}
                  >
                    {selectedMM2Item.name} Bilgi Kartı
                  </div>

                  {/* Infobox Thumbnail with subtle glow */}
                  <div className="p-5 bg-black/40 flex justify-center border-b border-purple-900/40 relative group">
                    <img
                      src={currentImage}
                      alt={selectedMM2Item.name}
                      className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-purple-300 border border-purple-800/40">
                      {selectedMM2Item.category}
                    </div>
                  </div>

                  {/* Infobox Data Table Rows */}
                  <div className="divide-y divide-purple-900/40 text-xs">
                    <div className="flex items-center justify-between p-3 bg-purple-950/20">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        Silah Türü
                      </span>
                      <strong className="text-white font-bold">{selectedMM2Item.category}</strong>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-pink-400" />
                        Sınıf / Tier
                      </span>
                      <strong className="text-purple-300 font-extrabold">{selectedMM2Item.type}</strong>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-950/20">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Güncel Değer (Value)
                      </span>
                      <strong className="text-amber-400 font-black text-sm">
                        {selectedMM2Item.value.toLocaleString()} Puan
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-400" />
                        Piyasa Talebi
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-black text-[11px] ${
                          selectedMM2Item.demand === 'Çok Yüksek'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : selectedMM2Item.demand === 'Yüksek'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`}
                      >
                        {selectedMM2Item.demand}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-950/20">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        {selectedMM2Item.stability === 'Yükseliyor' ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        ) : selectedMM2Item.stability === 'Düşüyor' ? (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        Stabilite Durumu
                      </span>
                      <strong
                        className={`font-bold ${
                          selectedMM2Item.stability === 'Yükseliyor'
                            ? 'text-emerald-400'
                            : selectedMM2Item.stability === 'Düşüyor'
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {selectedMM2Item.stability}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        Köken / Çıkış
                      </span>
                      <span
                        className="text-slate-200 font-medium text-right max-w-[170px] truncate"
                        title={selectedMM2Item.origin}
                      >
                        {selectedMM2Item.origin}
                      </span>
                    </div>
                  </div>

                  {/* Infobox Actions */}
                  <div className="p-4 bg-black/40 border-t border-purple-900/40 space-y-2.5">
                    <button
                      onClick={handleCreateTrade}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 hover:shadow-red-950/50"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Bu Eşya İçin Takas Yap</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 bg-[#0d091e] border-t border-purple-900/50 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>HarikaScript MM2 Topluluk Ansiklopedisi & Fandom Wiki</span>
            </span>
            <button
              onClick={() => setSelectedMM2Item(null)}
              className="px-4 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 font-bold transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
