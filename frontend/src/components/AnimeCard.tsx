import React from 'react';
import { Heart, Star, Calendar, Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Anime, StatusAnime } from '../types';

interface AnimeCardProps {
  anime: Anime;
  isFavorito?: boolean;
  onToggleFavorito?: (anime: Anime) => void;
  onViewDetails?: (anime: Anime) => void;
  showFavoriteButton?: boolean;
  compact?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  isFavorito = false,
  onToggleFavorito,
  onViewDetails,
  showFavoriteButton = true,
  compact = false
}) => {
  const getStatusColor = (status: StatusAnime): string => {
    switch (status) {
      case StatusAnime.RELEASING: return 'bg-green-500 hover:bg-green-600';
      case StatusAnime.FINISHED: return 'bg-blue-500 hover:bg-blue-600';
      case StatusAnime.NOT_YET_RELEASED: return 'bg-yellow-500 hover:bg-yellow-600';
      case StatusAnime.CANCELLED: return 'bg-red-500 hover:bg-red-600';
      case StatusAnime.HIATUS: return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusText = (status: StatusAnime): string => {
    switch (status) {
      case StatusAnime.RELEASING: return 'Em Lançamento';
      case StatusAnime.FINISHED: return 'Finalizado';
      case StatusAnime.NOT_YET_RELEASED: return 'Não Lançado';
      case StatusAnime.CANCELLED: return 'Cancelado';
      case StatusAnime.HIATUS: return 'Em Hiato';
      default: return 'Desconhecido';
    }
  };

  const truncateText = (text: string, maxLength: number): string =>
    text.length <= maxLength ? text : text.substring(0, maxLength).trim() + '...';

  const formatarNota = (nota: number): string => (nota > 0 ? nota.toFixed(1) : 'N/A');

  const handleToggleFavorito = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorito?.(anime);
  };

  const handleViewDetails = () => {
    onViewDetails?.(anime);
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        compact ? 'h-auto' : 'h-full'
      } bg-white text-black dark:bg-gray-800 dark:text-white`}
    >
      <div className="relative overflow-hidden">
        <div className={`relative overflow-hidden ${compact ? 'h-48' : 'h-64'}`}>
          <img
            src={anime.imagem || '/placeholder-anime.jpg'}
            alt={anime.titulo}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('placeholder-anime.jpg')) {
                target.src = '/placeholder-anime.jpg';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <Badge className={`absolute top-2 left-2 text-white ${getStatusColor(anime.status)}`}>
            {getStatusText(anime.status)}
          </Badge>

          {showFavoriteButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                isFavorito
                  ? 'text-red-500 hover:text-red-600 bg-white/20 hover:bg-white/30'
                  : 'text-white hover:text-red-500 bg-black/20 hover:bg-black/30'
              }`}
              onClick={handleToggleFavorito}
            >
              <Heart className={`h-4 w-4 ${isFavorito ? 'fill-current' : ''}`} />
            </Button>
          )}

          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between text-white text-sm">
              {anime.nota > 0 && (
                <div className="flex items-center gap-1 bg-black/40 rounded px-2 py-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{formatarNota(anime.nota)}</span>
                </div>
              )}
              {anime.ano > 0 && (
                <div className="flex items-center gap-1 bg-black/40 rounded px-2 py-1">
                  <Calendar className="h-3 w-3" />
                  <span>{anime.ano}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className={`p-4 ${compact ? 'pb-2' : ''}`}>
          <h3
            className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary cursor-pointer"
            onClick={handleViewDetails}
            title={anime.titulo}
          >
            {anime.titulo}
          </h3>

          {!compact && anime.sinopse && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {truncateText(anime.sinopse, 120)}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {anime.generos.slice(0, compact ? 2 : 3).map((genero) => (
              <Badge key={genero.nome} variant="secondary" className="text-xs">
                {genero.nome}
              </Badge>
            ))}
            {anime.generos.length > (compact ? 2 : 3) && (
              <Badge variant="outline" className="text-xs">
                +{anime.generos.length - (compact ? 2 : 3)}
              </Badge>
            )}
          </div>

          {!compact && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {anime.episodios > 0 && (
                <div className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  <span>{anime.episodios} eps</span>
                </div>
              )}
              {anime.estudio && (
                <span className="truncate max-w-[120px]" title={anime.estudio}>
                  {anime.estudio}
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className={`p-4 pt-0 ${compact ? 'pt-2' : ''}`}>
          <Button variant="outline" className="w-full" onClick={handleViewDetails}>
            <Info className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
