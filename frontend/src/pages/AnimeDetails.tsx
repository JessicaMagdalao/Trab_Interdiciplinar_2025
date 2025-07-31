import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Star,
  Calendar,
  Play,
  Building,
  Clock,
  Users,
  BookOpen,
  Share2,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAnimeDetalhes } from '../hooks/useAnimes';
import { useFavoritoStatus } from '../hooks/useFavoritos';
import { StatusAnime } from '../types';

export function AnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const animeId = id ? parseInt(id) : null;

  const [showEditFavorito, setShowEditFavorito] = useState(false);
  const [notaTemp, setNotaTemp] = useState([0]);
  const [comentarioTemp, setComentarioTemp] = useState('');

  const { anime, loading, error } = useAnimeDetalhes(animeId);
  const {
    isFavorito,
    favorito,
    loading: loadingFavorito,
    toggleFavorito,
    atualizarFavorito
  } = useFavoritoStatus(animeId);

  const getStatusColor = (status: StatusAnime): string => {
    switch (status) {
      case StatusAnime.RELEASING:
        return 'bg-green-500';
      case StatusAnime.FINISHED:
        return 'bg-blue-500';
      case StatusAnime.NOT_YET_RELEASED:
        return 'bg-yellow-500';
      case StatusAnime.CANCELLED:
        return 'bg-red-500';
      case StatusAnime.HIATUS:
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: StatusAnime): string => {
    switch (status) {
      case StatusAnime.RELEASING:
        return 'Em Lançamento';
      case StatusAnime.FINISHED:
        return 'Finalizado';
      case StatusAnime.NOT_YET_RELEASED:
        return 'Não Lançado';
      case StatusAnime.CANCELLED:
        return 'Cancelado';
      case StatusAnime.HIATUS:
        return 'Em Hiato';
      default:
        return 'Desconhecido';
    }
  };

  const handleToggleFavorito = async () => {
    try {
      await toggleFavorito();
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    }
  };

  const handleEditFavorito = () => {
    if (favorito) {
      setNotaTemp([favorito.nota]);
      setComentarioTemp(favorito.comentario);
    } else {
      setNotaTemp([0]);
      setComentarioTemp('');
    }
    setShowEditFavorito(true);
  };

  const handleSaveFavorito = async () => {
    try {
      if (isFavorito) {
        await atualizarFavorito({ nota: notaTemp[0], comentario: comentarioTemp });
      } else {
        await toggleFavorito(notaTemp[0], comentarioTemp);
      }
      setShowEditFavorito(false);
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && anime) {
      try {
        await navigator.share({
          title: anime.titulo,
          text: anime.sinopse,
          url: window.location.href
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="container mx-auto px-4 py-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Anime não encontrado</h1>
        <p className="text-muted-foreground">
          {error || 'O anime solicitado não foi encontrado.'}
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="relative">
            <img
              src={anime.imagem || '/placeholder-anime.jpg'}
              alt={anime.titulo}
              className="w-full rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-anime.jpg';
              }}
            />
            <Badge className={`absolute top-4 left-4 text-white ${getStatusColor(anime.status)}`}>
              {getStatusText(anime.status)}
            </Badge>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleToggleFavorito}
              disabled={loadingFavorito}
              variant={isFavorito ? 'destructive' : 'default'}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorito ? 'fill-current' : ''}`} />
              {isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            </Button>

            {isFavorito && (
              <Button variant="outline" className="w-full" onClick={handleEditFavorito}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Favorito
              </Button>
            )}

            <Button variant="outline" className="w-full" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          {favorito && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meu Favorito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Minha Nota:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{favorito.nota}/10</span>
                  </div>
                </div>

                {favorito.comentario && (
                  <div>
                    <span className="text-sm text-muted-foreground">Comentário:</span>
                    <p className="text-sm mt-1">{favorito.comentario}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Adicionado em {new Date(favorito.dataAdicao).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{anime.titulo}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {anime.nota > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <div>
                    <div className="font-semibold">{anime.nota.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Nota</div>
                  </div>
                </div>
              )}
              {anime.ano > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{anime.ano}</div>
                    <div className="text-xs text-muted-foreground">Ano</div>
                  </div>
                </div>
              )}
              {anime.episodios > 0 && (
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{anime.episodios}</div>
                    <div className="text-xs text-muted-foreground">Episódios</div>
                  </div>
                </div>
              )}
              {anime.estudio && (
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold text-sm">{anime.estudio}</div>
                    <div className="text-xs text-muted-foreground">Estúdio</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Gêneros</h3>
            <div className="flex flex-wrap gap-2">
              {anime.generos.map((genero) => (
                <Badge
                  key={genero.nome}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => navigate(`/genero/${encodeURIComponent(genero.nome)}`)}
                >
                  {genero.nome}
                </Badge>
              ))}
            </div>
          </div>

          {anime.sinopse && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Sinopse</h3>
              <p className="text-muted-foreground leading-relaxed">{anime.sinopse}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Popularidade:</strong> {anime.popularidade.toLocaleString()}
                </span>
              </div>
              {anime.temporada && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Temporada:</strong> {anime.temporada}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Status:</strong> {getStatusText(anime.status)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showEditFavorito} onOpenChange={setShowEditFavorito}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isFavorito ? 'Editar Favorito' : 'Adicionar aos Favoritos'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Minha Nota: {notaTemp[0]}/10</Label>
              <Slider
                value={notaTemp}
                onValueChange={setNotaTemp}
                max={10}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentario">Comentário (opcional)</Label>
              <Textarea
                id="comentario"
                value={comentarioTemp}
                onChange={(e) => setComentarioTemp(e.target.value)}
                placeholder="Escreva suas impressões sobre este anime..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEditFavorito(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFavorito}>
                {isFavorito ? 'Salvar Alterações' : 'Adicionar aos Favoritos'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
