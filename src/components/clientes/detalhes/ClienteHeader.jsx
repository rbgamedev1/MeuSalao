// src/components/clientes/detalhes/ClienteHeader.jsx
import { useRef } from 'react';
import { Camera, XCircle } from 'lucide-react';

const ClienteHeader = ({ cliente, onUpdateCliente }) => {
  const fileInputRef = useRef(null);

  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande! Máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateCliente(cliente.id, { foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverFoto = () => {
    if (confirm('Deseja remover a foto do cliente?')) {
      onUpdateCliente(cliente.id, { foto: null });
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          {/* Foto do Cliente */}
          <div className="relative group">
            {cliente.foto ? (
              <img
                src={cliente.foto}
                alt={cliente.nome}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold text-4xl border-4 border-white shadow-lg">
                {cliente.nome.charAt(0)}
              </div>
            )}
            
            {/* Botões de edição da foto */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Alterar foto"
                >
                  <Camera size={18} className="text-gray-700" />
                </button>
                {cliente.foto && (
                  <button
                    onClick={handleRemoverFoto}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    title="Remover foto"
                  >
                    <XCircle size={18} className="text-white" />
                  </button>
                )}
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFotoUpload}
              className="hidden"
            />
          </div>
          
          {/* Informações do Cliente */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{cliente.nome}</h1>
            <div className="flex items-center space-x-4 text-purple-100">
              <span>📧 {cliente.email}</span>
              <span>•</span>
              <span>📱 {cliente.telefone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteHeader;