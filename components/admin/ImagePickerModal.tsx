import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';

interface ImageItem { 
  name: string; 
  url: string; 
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const ImagePickerModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/admin/blog-images')
      .then((r) => r.json())
      .then((data) => setImages(data.images || []))
      .catch((error) => {
        console.error('Error fetching images:', error);
        setImages([]);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-100 mb-4">Choose an Image</h3>
        {loading ? (
          <div className="text-neutral-400">Loading images…</div>
        ) : images.length === 0 ? (
          <div className="text-neutral-400">No images found in /public/assets/blogImages</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map(img => (
              <button
                key={img.url}
                type="button"
                onClick={() => { onSelect(img.url); onClose(); }}
                className="group rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-500 transition-colors"
                title={img.name}
              >
                <img 
                  src={img.url} 
                  alt={img.name} 
                  className="w-full h-28 object-cover group-hover:opacity-90" 
                />
                <div className="text-xs text-neutral-300 truncate p-2 bg-neutral-800">
                  {img.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImagePickerModal;
