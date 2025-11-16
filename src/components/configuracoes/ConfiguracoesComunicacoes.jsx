// src/components/configuracoes/ConfiguracoesComunicacoes.jsx
import { useState, useContext } from 'react';
import { Mail, Link2, Calendar, Star, Copy, Check, ExternalLink, Save, Edit2, Info } from 'lucide-react';
import { SalaoContext } from '../../contexts/SalaoContext';

const ConfiguracoesComunicacoes = () => {
  const { salaoAtual, atualizarSalao } = useContext(SalaoContext);
  const [linkCopied, setLinkCopied] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showVariables, setShowVariables] = useState(false);

  // Configurações de comunicação do salão
  const [settings, setSettings] = useState({
    confirmacao: {
      ativo: salaoAtual.comunicacoes?.confirmacao?.ativo ?? true,
      template: salaoAtual.comunicacoes?.confirmacao?.template || null
    },
    cancelamento: {
      ativo: salaoAtual.comunicacoes?.cancelamento?.ativo ?? true,
      template: salaoAtual.comunicacoes?.cancelamento?.template || null
    },
    alteracao: {
      ativo: salaoAtual.comunicacoes?.alteracao?.ativo ?? true,
      template: salaoAtual.comunicacoes?.alteracao?.template || null
    },
    avaliacao: {
      ativo: salaoAtual.comunicacoes?.avaliacao?.ativo ?? true,
      template: salaoAtual.comunicacoes?.avaliacao?.template || null
    },
    aniversario: {
      ativo: salaoAtual.comunicacoes?.aniversario?.ativo ?? false,
      automatico: salaoAtual.comunicacoes?.aniversario?.automatico ?? true,
      diasAntecedencia: salaoAtual.comunicacoes?.aniversario?.diasAntecedencia ?? 0,
      template: salaoAtual.comunicacoes?.aniversario?.template || null
    }
  });

  // Templates padrão
  const defaultTemplates = {
    confirmacao: {
      assunto: '✅ Agendamento Confirmado - {salao_nome}',
      corpo: `Olá {cliente_nome}!

Seu agendamento foi confirmado com sucesso! 🎉

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}
💇 Profissional: {profissional}
📍 Local: {salao_endereco}

📞 Contato: {salao_telefone}

Aguardamos você!
Equipe {salao_nome}`
    },
    cancelamento: {
      assunto: '❌ Agendamento Cancelado - {salao_nome}',
      corpo: `Olá {cliente_nome},

Informamos que seu agendamento foi cancelado.

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}

Para reagendar, acesse: {link_agenda}

📞 Contato: {salao_telefone}

Equipe {salao_nome}`
    },
    alteracao: {
      assunto: '🔄 Agendamento Alterado - {salao_nome}',
      corpo: `Olá {cliente_nome}!

Seu agendamento foi alterado. 🔄

📅 NOVA DATA: {data}
🕐 NOVO HORÁRIO: {horario}
✂️ Serviço: {servico}
💇 PROFISSIONAL: {profissional}
📍 Local: {salao_endereco}

📞 Contato: {salao_telefone}

Equipe {salao_nome}`
    },
    avaliacao: {
      assunto: '⭐ Como foi sua experiência? - {salao_nome}',
      corpo: `Olá {cliente_nome}!

Esperamos que tenha gostado do atendimento! ✨

📅 Data: {data}
✂️ Serviço: {servico}
💇 Profissional: {profissional}

Sua opinião é muito importante!
Clique aqui para avaliar: {link_avaliacao}

⭐⭐⭐⭐⭐

Agradecemos sua preferência!
Equipe {salao_nome}`
    },
    aniversario: {
      assunto: '🎂 Feliz Aniversário! - {salao_nome}',
      corpo: `Feliz Aniversário, {cliente_nome}! 🎉🎂

A equipe {salao_nome} deseja um dia muito especial para você!

🎁 Para comemorar, temos um presente especial:
[Defina aqui seu presente/desconto]

📞 Contato: {salao_telefone}
🌐 Agende: {link_agenda}

Com carinho,
Equipe {salao_nome} 💜`
    }
  };

  // Variáveis disponíveis
  const variaveis = [
    { nome: '{cliente_nome}', desc: 'Nome do cliente' },
    { nome: '{data}', desc: 'Data do agendamento' },
    { nome: '{horario}', desc: 'Horário do agendamento' },
    { nome: '{servico}', desc: 'Nome do serviço' },
    { nome: '{profissional}', desc: 'Nome do profissional' },
    { nome: '{salao_nome}', desc: 'Nome do salão' },
    { nome: '{salao_endereco}', desc: 'Endereço do salão' },
    { nome: '{salao_telefone}', desc: 'Telefone do salão' },
    { nome: '{link_agenda}', desc: 'Link da agenda online' },
    { nome: '{link_avaliacao}', desc: 'Link de avaliação' }
  ];

  const handleCopyLink = (tipo) => {
    let link = '';
    if (tipo === 'agenda') {
      link = `${window.location.origin}/agenda/${salaoAtual.id}`;
    } else if (tipo === 'avaliacao') {
      link = `${window.location.origin}/avaliacao/${salaoAtual.id}/[token]`;
    }
    navigator.clipboard.writeText(link);
    setLinkCopied(tipo);
    setTimeout(() => setLinkCopied(null), 2000);
  };

  const handleToggleComunicacao = (tipo) => {
    setSettings(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], ativo: !prev[tipo].ativo }
    }));
  };

  const handleSaveSettings = () => {
    try {
      atualizarSalao(salaoAtual.id, { comunicacoes: settings });
      alert('Configurações de comunicação salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar configurações.');
    }
  };

  const handleEditTemplate = (tipo) => {
    const currentTemplate = settings[tipo].template;
    setEditingTemplate({
      tipo,
      assunto: currentTemplate?.assunto || defaultTemplates[tipo].assunto,
      corpo: currentTemplate?.corpo || defaultTemplates[tipo].corpo
    });
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    setSettings(prev => ({
      ...prev,
      [editingTemplate.tipo]: {
        ...prev[editingTemplate.tipo],
        template: {
          assunto: editingTemplate.assunto,
          corpo: editingTemplate.corpo
        }
      }
    }));
    setEditingTemplate(null);
  };

  const handleResetTemplate = (tipo) => {
    if (confirm('Deseja restaurar o template padrão?')) {
      setSettings(prev => ({
        ...prev,
        [tipo]: { ...prev[tipo], template: null }
      }));
    }
  };

  const comunicacoes = [
    {
      id: 'confirmacao',
      icon: Check,
      color: 'green',
      label: 'Confirmação de Agendamento',
      description: 'Enviado automaticamente ao criar um agendamento'
    },
    {
      id: 'cancelamento',
      icon: Mail,
      color: 'red',
      label: 'Cancelamento',
      description: 'Enviado quando um agendamento é cancelado'
    },
    {
      id: 'alteracao',
      icon: Edit2,
      color: 'orange',
      label: 'Alteração',
      description: 'Enviado quando data, horário ou profissional mudam'
    },
    {
      id: 'avaliacao',
      icon: Star,
      color: 'yellow',
      label: 'Solicitação de Avaliação',
      description: 'Enviado após conclusão do atendimento'
    },
    {
      id: 'aniversario',
      icon: Calendar,
      color: 'pink',
      label: 'Mensagem de Aniversário',
      description: 'Enviado no aniversário do cliente'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Links Compartilháveis */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Link2 className="mr-2" size={24} />
          Links Compartilháveis
        </h3>
        
        <div className="space-y-4">
          {/* Agenda Online */}
          <div>
            <p className="text-sm mb-2 text-purple-100">🌐 Agenda Online</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`${window.location.origin}/agenda/${salaoAtual.id}`}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg font-mono text-sm bg-white/90 text-gray-800"
              />
              <button
                onClick={() => handleCopyLink('agenda')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {linkCopied === 'agenda' ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button
                onClick={() => window.open(`${window.location.origin}/agenda/${salaoAtual.id}`, '_blank')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <ExternalLink size={18} />
              </button>
            </div>
          </div>

          {/* Link de Avaliação */}
          <div>
            <p className="text-sm mb-2 text-purple-100">⭐ Link Base de Avaliação</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`${window.location.origin}/avaliacao/${salaoAtual.id}/[token]`}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg font-mono text-sm bg-white/90 text-gray-800"
              />
              <button
                onClick={() => handleCopyLink('avaliacao')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {linkCopied === 'avaliacao' ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-xs text-purple-200 mt-1">
              ℹ️ O token é gerado automaticamente para cada agendamento
            </p>
          </div>
        </div>
      </div>

      {/* Configurações de Comunicação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            ⚙️ Configurações de Comunicação
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure e personalize as mensagens enviadas aos clientes
          </p>
        </div>

        <div className="p-6 space-y-4">
          {comunicacoes.map((comunicacao) => {
            const Icon = comunicacao.icon;
            const isAtivo = settings[comunicacao.id].ativo;
            const hasCustomTemplate = settings[comunicacao.id].template !== null;

            return (
              <div key={comunicacao.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg bg-${comunicacao.color}-100`}>
                      <Icon className={`text-${comunicacao.color}-600`} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-800">{comunicacao.label}</p>
                        {hasCustomTemplate && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            Personalizado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{comunicacao.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAtivo}
                      onChange={() => handleToggleComunicacao(comunicacao.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Opções especiais para aniversário */}
                {comunicacao.id === 'aniversario' && isAtivo && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.aniversario.automatico}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          aniversario: { ...prev.aniversario, automatico: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Enviar automaticamente</span>
                    </label>
                    
                    <div className="flex items-center space-x-3">
                      <label className="text-sm text-gray-700">Enviar com antecedência:</label>
                      <select
                        value={settings.aniversario.diasAntecedencia}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          aniversario: { ...prev.aniversario, diasAntecedencia: parseInt(e.target.value) }
                        }))}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="0">No dia do aniversário</option>
                        <option value="1">1 dia antes</option>
                        <option value="2">2 dias antes</option>
                        <option value="3">3 dias antes</option>
                        <option value="7">1 semana antes</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Botões de ação */}
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleEditTemplate(comunicacao.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-sm transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>Personalizar Mensagem</span>
                  </button>
                  {hasCustomTemplate && (
                    <button
                      onClick={() => handleResetTemplate(comunicacao.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                    >
                      Restaurar Padrão
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Save size={20} />
          <span>Salvar Configurações</span>
        </button>
      </div>

      {/* Modal de Edição de Template */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setEditingTemplate(null)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Personalizar Mensagem</h3>
                <button
                  onClick={() => setShowVariables(!showVariables)}
                  className="mt-2 flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  <Info size={16} />
                  <span>{showVariables ? 'Ocultar' : 'Ver'} variáveis disponíveis</span>
                </button>
              </div>

              {showVariables && (
                <div className="p-4 bg-purple-50 border-b border-purple-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Variáveis disponíveis:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {variaveis.map(v => (
                      <div key={v.nome} className="flex items-center space-x-2 text-sm">
                        <code className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{v.nome}</code>
                        <span className="text-gray-600">→ {v.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                  <input
                    type="text"
                    value={editingTemplate.assunto}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, assunto: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Corpo da Mensagem</label>
                  <textarea
                    value={editingTemplate.corpo}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev, corpo: e.target.value }))}
                    rows="12"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono text-sm"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Salvar Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracoesComunicacoes;