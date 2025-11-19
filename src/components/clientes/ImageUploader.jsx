// src/components/clientes/ImageUploader.jsx
import { useState } from 'react';
import { Upload, X, ZoomIn, Camera } from 'lucide-react';

const ImageUploader = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 4,
  label = "Adicionar Imagens",
  categoria = "geral"
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande! Máximo 5MB por imagem.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImagesChange([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} ({images.length}/{maxImages})
      </label>

      {/* Grid de Imagens */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
          >
            <img 
              src={img} 
              alt={`${categoria} ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setPreviewImage(img)}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Ver ampliado"
              >
                <ZoomIn size={16} className="text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                title="Remover"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>
        ))}

        {/* Botão de Upload */}
        {images.length < maxImages && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 text-center px-2">
              Adicionar
            </span>
          </label>
        )}
      </div>

      {/* Dica */}
      <p className="text-xs text-gray-500 flex items-center space-x-1">
        <Camera size={12} />
        <span>JPG, PNG ou WEBP • Máximo 5MB por imagem</span>
      </p>

      {/* Modal de Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-700" />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;