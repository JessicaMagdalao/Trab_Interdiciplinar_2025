import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimeList } from '../components/AnimeList';
import { GeneroFilterSidebar } from '../components/GeneroFilter';
import { useAnimesPorGenero } from '../hooks/useAnimes';
import { useGeneros } from '../hooks/useGeneros';
import { Anime } from '../types';

/**
 * Página para exibir animes filtrados por um gênero específico.
 */
export function GeneroPage() {
  const { nome } = useParams<{ nome: string }>();
  const navigate = useNavigate();

  // Nome do gênero vindo da URL (decodificado)
  const nomeGenero = nome ? decodeURIComponent(nome) : '';

  // Hooks de dados
  const { animes, loading, error, loadMore, hasMore } = useAnimesPorGenero(nomeGenero);
  const { generos, loading: loadingGeneros } = useGeneros();

  /**
   * Quando o usuário escolhe um novo gênero
   */
  const handleGeneroChange = (novoGenero: string) => {
    if (novoGenero) {
      navigate(`/genero/${encodeURIComponent(novoGenero)}`);
    } else {
      navigate('/');
    }
  };

  /**
   * Navegar para detalhes do anime
   */
  const handleViewDetails = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  // Encontrar gênero atual (para descrição e dados adicionais)
  const generoAtual = generos.find((g) => g.nome === nomeGenero);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Filter className="h-8 w-8" />
            {nomeGenero ? `Animes de ${nomeGenero}` : 'Selecione um Gênero'}
          </h1>

          {generoAtual?.descricao && (
            <p className="text-muted-foreground mt-2">{generoAtual.descricao}</p>
          )}
        </div>
      </div>

      {/* Conteúdo principal com filtros e lista */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar com filtros */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <GeneroFilterSidebar
              generos={generos}
              generoSelecionado={nomeGenero}
              onGeneroChange={handleGeneroChange}
              loading={loadingGeneros}
            />
          </div>
        </div>

        {/* Lista de animes */}
        <div className="lg:col-span-3">
          {nomeGenero ? (
            <AnimeList
              animes={animes}
              loading={loading}
              error={error || undefined}
              onLoadMore={loadMore}
              hasMore={hasMore}
              onViewDetails={handleViewDetails}
              emptyMessage={`Nenhum anime encontrado para o gênero "${nomeGenero}".`}
            />
          ) : (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Selecione um Gênero</h3>
              <p className="text-muted-foreground">
                Escolha um gênero na barra lateral para ver os animes correspondentes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informações adicionais sobre o gênero */}
      {generoAtual && animes.length > 0 && (
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sobre o Gênero {nomeGenero}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{animes.length}+</div>
              <div className="text-sm text-muted-foreground">Animes Encontrados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{generos.length}</div>
              <div className="text-sm text-muted-foreground">Gêneros Disponíveis</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Possibilidades</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
