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
        id: 'colometria',
        nome: 'Colometria',
        servicos: ['Coloração', 'Mechas', 'Luzes', 'Balayage']
      },
      {
        id: 'tratamentos',
        nome: 'Tratamentos Capilares',
        servicos: [
          'Hidratação',
          'Nutrição',
          'Reconstrução',
          'Cauterização',
          'Botox capilar',
          'Cronograma Capilar',
          'Alisamento',
          'Relaxamento',
          'Permanente',
          'Terapia Capilar'
        ]
      },
      {
        id: 'penteados',
        nome: 'Penteados e Tranças',
        servicos: [
          'Penteado para Eventos',
          'Penteado para Noiva',
          'Tranças'
        ]
      },
      {
        id: 'alongamento',
        nome: 'Alongamento',
        servicos: [
          'Confecção de Maga Hair Nanoslim',
          'Confecção de Mega Hair Impercept',
          'Confecção de Mega Hair Ponto Americano',
          'Confecção de Mega Hair Queratina',
          'Confecção de Mega Hair Nó Italiano',
          'Confecção de Protese Capilar',
          'Confecção de Topos',
          'Aplicação Mega Hair NanoSlim', 
          'Aplicação Mega Hair Impercept', 
          'Aplicação Mega Hair Ponto Americano', 
          'Aplicação Mega Hair Queratina',
          'Aplicação Mega Hair Nó Italiano',
          'Aplicação de Protese Capilar',
          'Aplicação de topos',
          'Manutenção de Mega Hair - NanoSlim',
          'Manutenção de Mega Hair - Impercept',
          'Manutenção de Mega Hair - Ponto Americano',
          'Manutenção de Mega Hair - Queratina',
          'Manutenção de Mega Hair - Nó Italiano',
          'Manutenção de Protese Capilar',
          'Manutenção de Topos',
          'Remoção de Mega Hair NanoSlim', 
          'Remoção de Mega Hair Impercept', 
          'Remoção de Mega Hair Ponto Americano',
          'Remoção de Mega Hair Queratina',
          'Remoção de Mega Hair Nó Italiano',
          'Remoção de Protese Capilar',
          'Remoção de Topos',
        ]
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
          'Nail art',
          'Alongamento de unhas em gel',
          'Alongamento de unhas em acrílico',
          'Alongamento de unhas em fibra',
          'Manutenção de alongamento de unhas',
          'Spa dos Pés',
          'Spa das Mãos',
          'Esmaltação Comum',
          'Esmaltação em Gel',
          'Francesinha',
          'Degradê',
          'Unha Decorada',
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
          'Maquiagem para Carnaval',
          'Maquiagem para Halloween'
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
    ]
  }
];