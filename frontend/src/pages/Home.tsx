import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimeList } from '../components/AnimeList';
import { SearchBar } from '../components/SearchBar';
import { GeneroFilterInline } from '../components/GeneroFilter';
import { useAnimes, usePesquisaAnimes } from '../hooks/useAnimes';
import { useGeneros } from '../hooks/useGeneros';
import { Anime } from '../types';

/**
 * Página inicial da aplicação.
 * Exibe animes populares, lançamentos e funcionalidades de pesquisa.
 */
export function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'populares' | 'lancamento' | 'pesquisa'>('populares');
  const [searchTerm, setSearchTerm] = useState('');
  const [generoSelecionado, setGeneroSelecionado] = useState('');

  // Hooks de dados
  const animesPopulares = useAnimes('populares');
  const animesLancamento = useAnimes('lancamento');
  const { generos } = useGeneros();
  const { animes: resultadosPesquisa, loading: loadingPesquisa, pesquisar, limpar } = usePesquisaAnimes();

  /** Navega para detalhes */
  const handleViewDetails = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  /** Pesquisa animes */
  const handleSearch = (term: string) => {
    if (term.trim()) {
      pesquisar(term);
      setActiveTab('pesquisa');
    } else {
      limpar();
    }
  };

  /** Filtrar por gênero */
  const handleGeneroChange = (genero: string) => {
    setGeneroSelecionado(genero);
    if (genero) {
      navigate(`/genero/${encodeURIComponent(genero)}`);
    }
  };

  /** Limpar pesquisa */
  const handleClearSearch = () => {
    setSearchTerm('');
    limpar();
    setActiveTab('populares');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Descubra Seus Animes Favoritos
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore milhares de animes, descubra novos títulos e mantenha sua lista de favoritos sempre atualizada.
        </p>
      </div>

      {/* Barra de pesquisa */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Pesquisar animes por título..."
          loading={loadingPesquisa}
          autoSearch={false}
          className="w-full"
        />
      </div>

      {/* Filtro de gêneros */}
      <GeneroFilterInline
        generos={generos}
        generoSelecionado={generoSelecionado}
        onGeneroChange={handleGeneroChange}
        maxVisible={6}
        className="max-w-4xl mx-auto"
      />

      {/* Abas */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="populares" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Populares
          </TabsTrigger>
          <TabsTrigger value="lancamento" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Lançamentos
          </TabsTrigger>
          <TabsTrigger value="pesquisa" className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            Pesquisa
          </TabsTrigger>
        </TabsList>

        {/* Populares */}
        <TabsContent value="populares" className="mt-8">
          <AnimeList
            title="Animes Mais Populares"
            animes={animesPopulares.animes}
            loading={animesPopulares.loading}
            error={animesPopulares.error || undefined}
            onLoadMore={animesPopulares.loadMore}
            hasMore={animesPopulares.hasMore}
            onViewDetails={handleViewDetails}
            emptyMessage="Não foi possível carregar os animes populares no momento."
          />
        </TabsContent>

        {/* Lançamentos */}
        <TabsContent value="lancamento" className="mt-8">
          <AnimeList
            title="Animes em Lançamento"
            animes={animesLancamento.animes}
            loading={animesLancamento.loading}
            error={animesLancamento.error || undefined}
            onLoadMore={animesLancamento.loadMore}
            hasMore={animesLancamento.hasMore}
            onViewDetails={handleViewDetails}
            emptyMessage="Não há animes em lançamento no momento."
          />
        </TabsContent>

        {/* Pesquisa */}
        <TabsContent value="pesquisa" className="mt-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Resultados da Pesquisa</h2>
                {searchTerm && (
                  <p className="text-muted-foreground">
                    Pesquisando por: <span className="font-medium">"{searchTerm}"</span>
                  </p>
                )}
              </div>
              {searchTerm && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Limpar Pesquisa
                </Button>
              )}
            </div>

            {searchTerm ? (
              <AnimeList
                animes={resultadosPesquisa}
                loading={loadingPesquisa}
                onViewDetails={handleViewDetails}
                emptyMessage={`Nenhum anime encontrado para "${searchTerm}". Tente usar termos diferentes.`}
              />
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Faça uma pesquisa</h3>
                <p className="text-muted-foreground">
                  Use a barra de pesquisa acima para encontrar animes específicos.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Estatísticas rápidas */}
      <div className="bg-muted/50 rounded-lg p-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{animesPopulares.animes.length}+</div>
            <div className="text-sm text-muted-foreground">Animes Populares</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{animesLancamento.animes.length}+</div>
            <div className="text-sm text-muted-foreground">Em Lançamento</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{generos.length}+</div>
            <div className="text-sm text-muted-foreground">Gêneros Disponíveis</div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-semibold">Pronto para começar?</h2>
        <p className="text-muted-foreground">
          Explore nossa coleção e crie sua lista personalizada de animes favoritos.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/favoritos')}>Ver Meus Favoritos</Button>
          <Button variant="outline" onClick={() => setActiveTab('populares')}>
            Explorar Animes
          </Button>
        </div>
      </div>
    </div>
  );

}
