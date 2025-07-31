//
// === ENUMS ===
//

export enum StatusAnime {
  FINISHED = "FINISHED",
  RELEASING = "RELEASING",
  NOT_YET_RELEASED = "NOT_YET_RELEASED",
  CANCELLED = "CANCELLED",
  HIATUS = "HIATUS"
}

//
// === ENTIDADES ===
//

export interface Genero {
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
}

export interface Anime {
  id: number;
  titulo: string;
  imagem: string;
  sinopse: string;
  generos: Genero[];
  popularidade: number;
  status: StatusAnime;
  episodios: number;
  temporada: string;
  ano: number;
  estudio: string;
  nota: number;
  dataCriacao: string;
}

export interface AnimeFavorito {
  animeId: number;
  usuarioId: string;
  dataAdicao: string;
  nota: number;
  comentario: string;
  anime: Anime;
}

//
// === RESPOSTAS DA API ===
//

export interface ApiResponse<T> {
  sucesso: boolean;
  dados: T;
  erro?: string;
  codigo?: string;
  timestamp?: string;
}

export interface PaginacaoResponse<T> extends ApiResponse<T> {
  paginacao?: {
    pagina: number;
    limite: number;
    total: number;
  };
}

export interface FiltroResponse<T> extends ApiResponse<T> {
  filtro?: {
    genero: string;
    pagina: number;
    limite: number;
    total: number;
  };
}

export interface PesquisaResponse<T> extends ApiResponse<T> {
  pesquisa?: {
    termo: string;
    pagina: number;
    limite: number;
    total: number;
  };
}

export interface EstatisticasFavoritos {
  total: number;
  notaMedia: number;
  generosFavoritos: string[];
  ultimosAdicionados: AnimeFavorito[];
}

//
// === TIPOS PARA COMPONENTES ===
//

export interface AnimeCardProps {
  anime: Anime;
  isFavorito?: boolean;
  onToggleFavorito?: (anime: Anime) => void;
  onViewDetails?: (anime: Anime) => void;
}

export interface AnimeListProps {
  animes: Anime[];
  loading?: boolean;
  error?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface FiltroProps {
  generos: Genero[];
  generoSelecionado?: string;
  onGeneroChange: (genero: string) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (term: string) => void;
  placeholder?: string;
  loading?: boolean;
}

//
// === TIPOS PARA HOOKS ===
//

export interface UseAnimesResult {
  animes: Anime[];
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  hasMore: boolean;
  refresh: () => void;
}

export interface UseFavoritosResult {
  favoritos: AnimeFavorito[];
  loading: boolean;
  error: string | null;
  adicionarFavorito: (animeId: number, nota?: number, comentario?: string) => Promise<void>;
  removerFavorito: (animeId: number) => Promise<void>;
  atualizarFavorito: (animeId: number, dados: { nota?: number; comentario?: string }) => Promise<void>;
  verificarFavorito: (animeId: number) => boolean;
  refresh: () => void;
}

//
// === CONTEXTO GLOBAL ===
//

export interface AppContextType {
  usuario: {
    id: string;
    nome: string;
  };
  tema: 'light' | 'dark';
  toggleTema: () => void;
}

//
// === ROTEAMENTO E FORMULÁRIOS ===
//

export interface RouteParams {
  id?: string;
  nome?: string;
}

export interface FavoritoFormData {
  nota: number;
  comentario: string;
}

export interface SearchFormData {
  termo: string;
  genero?: string;
}

//
// === FILTROS E CONFIGURAÇÕES ===
//

export interface FiltroAvancado {
  genero?: string;
  status?: StatusAnime;
  anoInicio?: number;
  anoFim?: number;
  notaMinima?: number;
  ordenacao?: 'popularidade' | 'nota' | 'titulo' | 'ano';
  ordem?: 'asc' | 'desc';
}

export interface ConfiguracaoApp {
  apiBaseUrl: string;
  itemsPorPagina: number;
  tempoCache: number;
  usuarioId: string;
}

//
// === UTILITÁRIOS ===
//

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface Notificacao {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo: string;
  mensagem: string;
  duracao?: number;
}

export interface MetricasUso {
  animesVisualizados: number;
  favoritosAdicionados: number;
  pesquisasRealizadas: number;
  tempoNavegacao: number;
}
