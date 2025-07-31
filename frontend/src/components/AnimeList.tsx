import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimeCard } from './AnimeCard';
import { Anime } from '../types';
import { useFavoritos } from '../hooks/useFavoritos';

interface AnimeListProps {
  animes: Anime[];
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onViewDetails?: (anime: Anime) => void;
  showFavoriteButtons?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  title?: string;
}

/**
 * Lista de animes em grid responsivo.
 * Gerencia estados de loading, erro, paginação e favoritos.
 */
export const AnimeList: React.FC<AnimeListProps> = ({
  animes,
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  onViewDetails,
  showFavoriteButtons = true,
  compact = false,
  emptyMessage = 'Nenhum anime encontrado.',
  title
}) => {
  const { verificarFavorito, adicionarFavorito, removerFavorito } = useFavoritos();

  /** Alterna estado de favorito de um anime */
  const handleToggleFavorito = async (anime: Anime) => {
    try {
      const isFavorito = verificarFavorito(anime.id);
      if (isFavorito) {
        await removerFavorito(anime.id);
      } else {
        await adicionarFavorito(anime.id);
      }
    } catch (err) {
      console.error(`Erro ao alterar favorito do anime ${anime.id}:`, err);
    }
  };

  /** Renderiza estado de carregando */
  const renderLoading = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Carregando animes...</span>
      </div>
    </div>
  );

  /** Renderiza estado de erro */
  const renderError = () => (
    <Alert variant="destructive" className="my-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  /** Renderiza estado vazio */
  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4"></div>
      <h3 className="text-lg font-semibold mb-2">Nenhum anime encontrado</h3>
      <p className="text-muted-foreground max-w-md">{emptyMessage}</p>
    </div>
  );

  /** Renderiza grid de animes */
  const renderGrid = () => (
    <div
      className={`grid gap-6 ${
        compact
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      }`}
    >
      {animes.map((anime) => (
        <AnimeCard
          key={anime.id}
          anime={anime}
          isFavorito={verificarFavorito(anime.id)}
          onToggleFavorito={showFavoriteButtons ? handleToggleFavorito : undefined}
          onViewDetails={onViewDetails}
          showFavoriteButton={showFavoriteButtons}
          compact={compact}
        />
      ))}
    </div>
  );

  /** Renderiza botão Carregar Mais */
  const renderLoadMoreButton = () => {
    if (!onLoadMore || !hasMore) return null;
    return (
      <div className="flex justify-center mt-8">
        <Button onClick={onLoadMore} disabled={loading} variant="outline" size="lg">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Carregar Mais
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
      )}

      {error && renderError()}

      {loading && animes.length === 0 ? (
        renderLoading()
      ) : animes.length === 0 ? (
        renderEmpty()
      ) : (
        <>
          {renderGrid()}
          {renderLoadMoreButton()}
        </>
      )}

      {loading && animes.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando mais animes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

/** Lista compacta de animes */
export const AnimeListCompact: React.FC<Omit<AnimeListProps, 'compact'>> = (props) => (
  <AnimeList {...props} compact={true} />
);

/** Lista especializada de favoritos */
export const FavoritosList: React.FC<Omit<AnimeListProps, 'showFavoriteButtons'>> = (props) => (
  <AnimeList
    {...props}
    showFavoriteButtons={true}
    emptyMessage="Você ainda não tem animes favoritos. Explore e adicione seus animes preferidos!"
  />
);
