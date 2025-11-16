// src/components/servicos/ServicoModal.jsx - SIMPLIFICADO: Select funcional + filtro de profissionais

import { useContext, useMemo, useState } from 'react';
import Modal from '../Modal';
import { SalaoContext } from '../../contexts/SalaoContext';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';

const ServicoModal = ({ 
  showModal, 
  handleCloseModal, 
  editingId, 
  formData, 
  handleChange,
  handleProfissionalToggle,
  handleSubmit,
  servicosDisponiveis,
  profissionaisSalao,
  durationOptions,
  servicosSalao
}) => {
  const { salaoAtual } = useContext(SalaoContext);

  // ✅ NOVO: Filtrar profissionais que podem atender o serviço selecionado
  const profissionaisHabilitados = useMemo(() => {
    if (!formData.nome) return [];
    
    return profissionaisSalao.filter(prof => 
      prof.especialidades && prof.especialidades.includes(formData.nome)
    );
  }, [formData.nome, profissionaisSalao]);

  // ✅ SIMPLIFICADO: Agrupar serviços para dropdown
  const servicosAgrupados = useMemo(() => {
    const grupos = {};
    
    servicosDisponiveis.forEach(servico => {
      const categoria = CATEGORIAS_SERVICOS.find(c => c.id === servico.categoriaId);
      const subcategoria = categoria?.subcategorias.find(s => s.id === servico.subcategoriaId);
      
      if (!categoria || !subcategoria) return;
      
      const categoriaKey = categoria.nome;
      const subcategoriaKey = subcategoria.nome;
      
      if (!grupos[categoriaKey]) {
        grupos[categoriaKey] = {};
      }
      
      if (!grupos[categoriaKey][subcategoriaKey]) {
        grupos[categoriaKey][subcategoriaKey] = [];
      }
      
      grupos[categoriaKey][subcategoriaKey].push({
        nome: servico.nome,
        categoriaId: servico.categoriaId,
        subcategoriaId: servico.subcategoriaId
      });
    });
    
    return grupos;
  }, [servicosDisponiveis]);

  // ✅ SIMPLIFICADO: Handler de mudança de serviço
  const handleServicoSelect = (e) => {
    const value = e.target.value;
    
    if (!value) {
      handleChange({ target: { name: 'nome', value: '' } });
      handleChange({ target: { name: 'categoria', value: '' } });
      handleChange({ target: { name: 'subcategoria', value: '' } });
      handleChange({ target: { name: 'profissionaisHabilitados', value: [] } });
      return;
    }

    // Parse do valor selecionado
    const [categoria, subcategoria, nome] = value.split('|||');
    
    // Atualizar form data
    handleChange({ target: { name: 'categoria', value: categoria } });
    handleChange({ target: { name: 'subcategoria', value: subcategoria } });
    handleChange({ target: { name: 'nome', value: nome } });
    handleChange({ target: { name: 'profissionaisHabilitados', value: [] } });
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={handleCloseModal}
      title={editingId ? 'Editar Serviço' : 'Novo Serviço'}
      size="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto px-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Seleção de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Serviço *
            </label>
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
                    servicos.map(servico => (
                      <option 
                        key={`${categoria}-${subcategoria}-${servico.nome}`}
                        value={`${categoria}|||${subcategoria}|||${servico.nome}`}
                      >
                        {servico.nome}
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Os serviços disponíveis são baseados nas categorias configuradas em Configurações.
            </p>
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

          {/* Comissão (Opcional) */}
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
              Deixe em branco ou 0 se não houver comissão
            </p>
          </div>

          {/* Descrição (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Descreva o serviço... (opcional)"
            ></textarea>
          </div>

          {/* Profissionais Habilitados (Filtrados) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profissionais Habilitados *
            </label>
            
            {!formData.nome ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Selecione um serviço primeiro para ver os profissionais habilitados.
                </p>
              </div>
            ) : profissionaisHabilitados.length > 0 ? (
              <>
                <div className="space-y-2 p-4 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                  {profissionaisHabilitados.map(prof => (
                    <label key={prof.id} className="flex items-center space-x-3 cursor-pointer hover:bg-purple-50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.profissionaisHabilitados.includes(prof.id)}
                        onChange={() => handleProfissionalToggle(prof.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{prof.nome}</span>
                        <p className="text-xs text-gray-500">
                          {prof.especialidades?.join(', ') || 'Sem especialidades'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ✅ {profissionaisHabilitados.length} profissional(is) pode(m) realizar este serviço
                </p>
              </>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  ⚠️ Nenhum profissional habilitado para "{formData.nome}"
                </p>
                <p className="text-xs text-yellow-700">
                  Configure os profissionais em <strong>Configurações → Profissionais</strong> e certifique-se de que eles tenham este serviço em suas especialidades.
                </p>
              </div>
            )}
            
            {profissionaisHabilitados.length > 0 && formData.profissionaisHabilitados.length === 0 && (
              <p className="text-xs text-red-500 mt-1">⚠️ Selecione pelo menos um profissional</p>
            )}
          </div>

          {/* Serviço Ativo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Serviço ativo
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white -mx-1 px-1">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={profissionaisHabilitados.length === 0 || formData.profissionaisHabilitados.length === 0}
              className={`px-6 py-2 rounded-lg transition-all ${
                (profissionaisHabilitados.length === 0 || formData.profissionaisHabilitados.length === 0)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ServicoModal;