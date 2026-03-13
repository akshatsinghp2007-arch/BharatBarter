import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Loader2 } from 'lucide-react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  images: string[];
  setImages: (images: string[]) => void;
  darkMode: boolean;
}

export default function ImageUpload({ images, setImages, darkMode }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 3) {
      alert('Maximum 3 photos allowed');
      return;
    }

    setUploading(true);
    const newImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `barter_items/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        newImages.push(url);
      }
      setImages(newImages);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {images.map((url, index) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-black/5 group"
            >
              <img src={url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
          
          {images.length < 3 && (
            <label className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              darkMode 
                ? 'border-white/10 hover:border-[#FF9933] hover:bg-white/5' 
                : 'border-black/5 hover:border-[#FF9933] hover:bg-black/5'
            }`}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="animate-spin text-[#FF9933]" size={24} />
              ) : (
                <>
                  <Camera size={24} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Add Photo</span>
                </>
              )}
            </label>
          )}
        </AnimatePresence>
      </div>
      <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest">
        {images.length}/3 Photos Uploaded
      </p>
    </div>
  );
}
