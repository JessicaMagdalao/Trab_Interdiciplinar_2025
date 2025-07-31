import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Search, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimeList } from '../components/AnimeList';
import { SearchBar } from '../components/SearchBar';
import { useFavoritos, useEstatisticasFavoritos, usePesquisaFavoritos } from '../hooks/useFavoritos';
import { Anime, AnimeFavorito } from '../types';

export function Favoritos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks para dados
  const { favoritos, loading, error } = useFavoritos();
  const { estatisticas, loading: loadingStats } = useEstatisticasFavoritos();
  const { 
    favoritos: resultadosPesquisa, 
    loading: loadingPesquisa, 
    pesquisar, 
    limpar 
  } = usePesquisaFavoritos();

  const animesFromFavoritos = (favs: AnimeFavorito[]): Anime[] =>
    favs.map(fav => fav.anime);

  const handleViewDetails = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      pesquisar(term);
      setActiveTab('pesquisa');
    } else {
      limpar();
    }
  };

  const renderStatCard = (title: string, value: string | number, icon: React.ReactNode, description?: string) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
          <h1 className="h-10 w-10 fill-current" />
          Meus Favoritos
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gerencie sua coleção pessoal de animes favoritos e acompanhe suas estatísticas.
        </p>
      </div>

      {/* Barra de pesquisa */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Pesquisar nos seus favoritos..."
          loading={loadingPesquisa}
          className="w-full"
        />
      </div>

      {/* Conteúdo principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="estatisticas" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="pesquisa" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Pesquisa
          </TabsTrigger>
        </TabsList>

        {/* Lista de Favoritos */}
        <TabsContent value="lista" className="mt-8">
          <div className="space-y-6">
            {!loading && favoritos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderStatCard('Total de Favoritos', favoritos.length, <Heart className="h-6 w-6" />)}
                {renderStatCard('Nota Média', estatisticas ? estatisticas.notaMedia.toFixed(1) : '0.0', <Star className="h-6 w-6" />)}
                {renderStatCard(
                  'Último Adicionado',
                  favoritos.length > 0 ? new Date(favoritos[0].dataAdicao).toLocaleDateString('pt-BR') : 'Nenhum',
                  <Calendar className="h-6 w-6" />
                )}
                {renderStatCard('Gêneros Únicos', estatisticas ? estatisticas.generosFavoritos.length : 0, <BarChart3 className="h-6 w-6" />)}
              </div>
            )}

            <AnimeList
              title={`Meus Animes Favoritos (${favoritos.length})`}
              animes={animesFromFavoritos(favoritos)}
              loading={loading}
              error={error || undefined}
              onViewDetails={handleViewDetails}
              showFavoriteButtons={true}
              emptyMessage="Você ainda não tem animes favoritos. Explore nossa coleção e adicione seus animes preferidos!"
            />
          </div>
        </TabsContent>

        {/* Estatísticas */}
        <TabsContent value="estatisticas" className="mt-8">
          {loadingStats ? (
            <div className="text-center py-12">Carregando estatísticas...</div>
          ) : estatisticas ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderStatCard('Total de Favoritos', estatisticas.total, <Heart className="h-8 w-8" />, 'Animes na coleção')}
                {renderStatCard('Nota Média', `${estatisticas.notaMedia.toFixed(1)}/10`, <Star className="h-8 w-8" />, 'Sua avaliação média')}
                {renderStatCard('Gêneros Favoritos', estatisticas.generosFavoritos.length, <BarChart3 className="h-8 w-8" />, 'Variedade de gêneros')}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">Sem estatísticas ainda</div>
          )}
        </TabsContent>

        {/* Resultados da Pesquisa */}
        <TabsContent value="pesquisa" className="mt-8">
          {searchTerm ? (
            <AnimeList
              animes={animesFromFavoritos(resultadosPesquisa)}
              loading={loadingPesquisa}
              onViewDetails={handleViewDetails}
              showFavoriteButtons={true}
              emptyMessage={`Nenhum favorito encontrado para "${searchTerm}".`}
            />
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pesquise seus favoritos</h3>
              <p className="text-muted-foreground">
                Use a barra de pesquisa acima para encontrar animes específicos em sua lista de favoritos.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
