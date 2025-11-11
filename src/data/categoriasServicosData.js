// src/data/categoriasServicosData.js

export const CATEGORIAS_SERVICOS = [
  {
    id: 'capilares',
    nome: 'Serviços Capilares',
    subcategorias: [
      {
        id: 'cortes',
        nome: 'Cortes',
        servicos: ['Corte Masculino', 'Corte Feminino', 'Corte Infantil']
      },
      {
        id: 'coloracao',
        nome: 'Coloração',
        servicos: ['Coloração', 'Mechas', 'Luzes', 'Balayage', 'Tintura', 'Ombré Hair', 'Reflexo']
      },
      {
        id: 'finalizacao',
        nome: 'Finalização',
        servicos: ['Escova', 'Prancha', 'Modelagem', 'Babyliss', 'Chapinha']
      },
      {
        id: 'tratamentos',
        nome: 'Tratamentos Capilares',
        servicos: [
          'Hidratação',
          'Nutrição',
          'Reconstrução',
          'Cauterização',
          'Cronograma Capilar',
          'Botox Capilar',
          'Tratamento Antifrizz'
        ]
      },
      {
        id: 'quimica',
        nome: 'Química',
        servicos: [
          'Alisamento',
          'Relaxamento',
          'Progressiva',
          'Permanente',
          'Selagem'
        ]
      },
      {
        id: 'penteados',
        nome: 'Penteados e Tranças',
        servicos: [
          'Penteado para Festa',
          'Penteado para Noiva',
          'Tranças',
          'Coque',
          'Semi Preso'
        ]
      },
      {
        id: 'alongamento',
        nome: 'Alongamento',
        servicos: ['Mega Hair', 'Aplique', 'Tic Tac']
      }
    ]
  },
  {
    id: 'unhas',
    nome: 'Serviços para Unhas',
    subcategorias: [
      {
        id: 'manicure_pedicure',
        nome: 'Manicure e Pedicure',
        servicos: [
          'Manicure Tradicional',
          'Pedicure Tradicional',
          'Manicure e Pedicure',
          'Spa dos Pés',
          'Spa das Mãos'
        ]
      },
      {
        id: 'esmaltacao',
        nome: 'Esmaltação',
        servicos: [
          'Esmaltação Comum',
          'Esmaltação em Gel',
          'Nail Art',
          'Francesinha',
          'Degradê',
          'Unha Decorada'
        ]
      },
      {
        id: 'alongamento_unhas',
        nome: 'Alongamento',
        servicos: [
          'Alongamento em Gel',
          'Alongamento em Acrílico',
          'Alongamento em Fibra',
          'Manutenção de Alongamento'
        ]
      },
      {
        id: 'tratamento_unhas',
        nome: 'Tratamentos',
        servicos: [
          'Tratamento para Unhas Fracas',
          'Fortalecimento',
          'Cuticulagem',
          'Podologia',
          'Remoção de Calos'
        ]
      }
    ]
  },
  {
    id: 'pele_estetica',
    nome: 'Cuidados com a Pele e Estética Facial',
    subcategorias: [
      {
        id: 'limpeza_facial',
        nome: 'Limpeza de Pele',
        servicos: [
          'Limpeza de Pele Profunda',
          'Limpeza de Pele Simples',
          'Limpeza de Pele com Extração'
        ]
      },
      {
        id: 'tratamentos_faciais',
        nome: 'Tratamentos Faciais',
        servicos: [
          'Hidratação Facial',
          'Peeling',
          'Tratamento Anti-Idade',
          'Tratamento para Acne',
          'Máscara Facial',
          'Revitalização'
        ]
      },
      {
        id: 'estetica_avancada',
        nome: 'Estética Avançada',
        servicos: [
          'Microagulhamento',
          'Radiofrequência',
          'Luz Pulsada',
          'Revitalização Ocular',
          'Drenagem Linfática Facial'
        ]
      },
      {
        id: 'sobrancelhas',
        nome: 'Design de Sobrancelhas',
        servicos: [
          'Design de Sobrancelha',
          'Henna',
          'Micropigmentação',
          'Microblading',
          'Pigmentação Fio a Fio'
        ]
      },
      {
        id: 'cilios',
        nome: 'Cílios',
        servicos: [
          'Alongamento de Cílios',
          'Volume Russo',
          'Lifting de Cílios',
          'Tintura de Cílios',
          'Manutenção de Cílios'
        ]
      }
    ]
  },
  {
    id: 'maquiagem',
    nome: 'Maquiagem',
    subcategorias: [
      {
        id: 'maquiagem_social',
        nome: 'Maquiagem Social',
        servicos: [
          'Maquiagem para Festa',
          'Maquiagem para Formatura',
          'Maquiagem Social',
          'Maquiagem Executiva'
        ]
      },
      {
        id: 'maquiagem_noiva',
        nome: 'Maquiagem para Noivas',
        servicos: [
          'Maquiagem de Noiva',
          'Teste de Maquiagem',
          'Maquiagem de Madrinhas'
        ]
      },
      {
        id: 'maquiagem_especial',
        nome: 'Maquiagem Especial',
        servicos: [
          'Maquiagem Artística',
          'Maquiagem para Ensaio Fotográfico',
          'Automaquiagem (Aula)'
        ]
      }
    ]
  },
  {
    id: 'depilacao_corporal',
    nome: 'Depilação e Serviços Corporais',
    subcategorias: [
      {
        id: 'depilacao',
        nome: 'Depilação',
        servicos: [
          'Depilação com Cera',
          'Depilação com Linha',
          'Depilação Facial',
          'Depilação de Corpo Inteiro',
          'Depilação de Buço',
          'Depilação de Pernas',
          'Depilação de Virilha'
        ]
      },
      {
        id: 'massagens',
        nome: 'Massagens',
        servicos: [
          'Massagem Relaxante',
          'Massagem Modeladora',
          'Drenagem Linfática',
          'Massagem com Pedras Quentes',
          'Reflexologia'
        ]
      },
      {
        id: 'estetica_corporal',
        nome: 'Estética Corporal',
        servicos: [
          'Criolipólise',
          'Carboxiterapia',
          'Harmonização Corporal',
          'Tratamento para Estrias',
          'Tratamento para Celulite'
        ]
      }
    ]
  },
  {
    id: 'bem_estar',
    nome: 'Serviços de Bem-Estar Complementar',
    subcategorias: [
      {
        id: 'terapias',
        nome: 'Terapias',
        servicos: [
          'Aromaterapia',
          'Acupuntura Estética',
          'Auriculoterapia',
          'Shiatsu'
        ]
      },
      {
        id: 'day_spa',
        nome: 'Day Spa',
        servicos: [
          'Day Spa Completo',
          'Spa para Pés',
          'Spa para Mãos',
          'Banho de Ofurô'
        ]
      }
    ]
  }
];