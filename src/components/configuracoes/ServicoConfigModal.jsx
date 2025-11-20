// src/components/configuracoes/ServicoConfigModal.jsx - PROFISSIONAIS READ-ONLY

import { useState, useEffect, useMemo } from 'react';
import { X, AlertCircle, Info, Lock } from 'lucide-react';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';

const ServicoConfigModal = ({ 
  isOpen, 
  onClose, 
  servico, 
  servicosDisponiveis,
  profissionaisSalao,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    subcategoria: '',
    duracao: 30,
    valor: '',
    comissao: 0,
    profissionaisHabilitados: [],
    ativo: true
  });

  useEffect(() => {
    if (servico) {
      setFormData({
        nome: servico.nome,
        categoria: servico.categoria,
        subcategoria: servico.subcategoria,
        duracao: servico.duracao,
        valor: servico.valor.toFixed(2),
        comissao: servico.comissao || 0,
        profissionaisHabilitados: servico.profissionaisHabilitados || [],
        ativo: servico.ativo
      });
    } else {
      setFormData({
        nome: '',
        categoria: '',
        subcategoria: '',
        duracao: 30,
        valor: '',
        comissao: 0,
        profissionaisHabilitados: [],
        ativo: true
      });
    }
  }, [servico]);

  // Agrupar serviços disponíveis
  const servicosAgrupados = useMemo(() => {
    const grupos = {};
    
    servicosDisponiveis.forEach(servico => {
      if (!grupos[servico.categoria]) {
        grupos[servico.categoria] = {};
      }
      if (!grupos[servico.categoria][servico.subcategoria]) {
        grupos[servico.categoria][servico.subcategoria] = [];
      }
      grupos[servico.categoria][servico.subcategoria].push(servico);
    });
    
    return grupos;
  }, [servicosDisponiveis]);

  // Obter profissionais habilitados para este serviço
  const profissionaisHabilitados = useMemo(() => {
    if (!formData.profissionaisHabilitados || formData.profissionaisHabilitados.length === 0) {
      return [];
    }
    
    return profissionaisSalao.filter(prof => 
      formData.profissionaisHabilitados.includes(prof.id)
    );
  }, [formData.profissionaisHabilitados, profissionaisSalao]);

  const handleServicoSelect = (e) => {
    const value = e.target.value;
    
    if (!value) {
      setFormData(prev => ({
        ...prev,
        nome: '',
        categoria: '',
        subcategoria: ''
      }));
      return;
    }

    const [categoria, subcategoria, nome] = value.split('|||');
    
    setFormData(prev => ({
      ...prev,
      categoria,
      subcategoria,
      nome
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome) {
      alert('⚠️ Selecione um serviço!');
      return;
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      alert('⚠️ Informe um valor válido!');
      return;
    }

    const dadosServico = {
      ...formData,
      duracao: parseInt(formData.duracao),
      valor: parseFloat(formData.valor),
      comissao: parseInt(formData.comissao) || 0
    };

    onSave(dadosServico);
  };

  // Opções de duração
  const durationOptions = [];
  for (let i = 15; i <= 480; i += 15) {
    const hours = Math.floor(i / 60);
    const mins = i % 60;
    let label = '';
    if (hours > 0 && mins > 0) label = `${hours}h ${mins}min`;
    else if (hours > 0) label = `${hours}h`;
    else label = `${mins}min`;
    
    durationOptions.push({ value: i, label });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-800">
            {servico ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serviço *
            </label>
            {servico ? (
              <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-300">
                <p className="font-medium text-gray-800">{formData.nome}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.categoria} → {formData.subcategoria}
                </p>
              </div>
            ) : (
              <>
                <select
                  value={formData.nome ? `${formData.categoria}|||${formData.subcategoria}|||${formData.nome}` : ''}
                  onChange={handleServicoSelect}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione um serviço</option>
                  {Object.entries(servicosAgrupados).map(([categoria, subcategorias]) => (
                    <optgroup key={categoria} label={`📁 ${categoria}`}>
                      {Object.entries(subcategorias).map(([subcategoria, servicos]) => 
                        servicos.map(s => (
                          <option 
                            key={`${categoria}-${subcategoria}-${s.nome}`}
                            value={`${categoria}|||${subcategoria}|||${s.nome}`}
                          >
                            {s.nome}
                          </option>
                        ))
                      )}
                    </optgroup>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Você pode configurar os serviços disponíveis nas configurações do salão
                </p>
              </>
            )}
          </div>

          {/* Duração e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração *
              </label>
              <select
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {durationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Comissão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comissão (%)
            </label>
            <input
              type="number"
              name="comissao"
              value={formData.comissao}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Percentual de comissão para os profissionais (opcional)
            </p>
          </div>

          {/* Profissionais Habilitados - READ ONLY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <span>Profissionais Habilitados</span>
              <Lock size={14} className="text-gray-400" />
            </label>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Os profissionais são vinculados através do cadastro deles
                  </p>
                  <p className="text-xs text-blue-700">
                    Para habilitar profissionais neste serviço, vá até a aba "Profissionais" e edite cada profissional, marcando os serviços que ele atende.
                  </p>
                  
                  {profissionaisHabilitados.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-300">
                      <p className="text-xs text-blue-700 font-medium mb-2">
                        Profissionais atualmente habilitados:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profissionaisHabilitados.map(prof => (
                          <span 
                            key={prof.id}
                            className="inline-flex items-center space-x-1 text-xs bg-white text-blue-700 px-2 py-1 rounded-full border border-blue-300"
                          >
                            <span>{prof.nome}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profissionaisHabilitados.length === 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      ⚠️ Nenhum profissional habilitado ainda
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Serviço Ativo */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="text-sm text-gray-700">
              Serviço ativo e disponível para agendamento
            </label>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
            >
              {servico ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicoConfigModal;