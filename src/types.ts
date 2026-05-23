export interface Contato {
  email: string;
  telefone: string;
  localizacao: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  periodo: string;
  descricao: string;
}

export interface Educacao {
  id: string;
  instituicao: string;
  curso: string;
  periodo: string;
  descricao?: string;
}

export interface Idioma {
  id: string;
  idioma: string;
  nivel: string;
}

export interface CurriculoData {
  nome: string;
  fotoUrl: string;
  contato: Contato;
  tituloProfissional: string;
  resumo: string;
  experiencias: Experiencia[];
  educacoes: Educacao[];
  habilidades: string[];
  idiomas: Idioma[];
  certificacoes: string[];
}

export type AreaCurriculo = 'Gestão' | 'Confeitaria' | 'Atendimento ao Público' | 'Padaria' | 'Tecnologia da Informação';

export interface CurriculoMultidisciplinar {
  activeArea: AreaCurriculo;
  areas: Record<AreaCurriculo, CurriculoData>;
}
