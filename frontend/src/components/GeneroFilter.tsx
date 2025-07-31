import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Genero } from '../types';

interface GeneroFilterProps {
  generos: Genero[];
  generoSelecionado?: string;
  onGeneroChange: (genero: string) => void;
  loading?: boolean;
  className?: string;
  showAllOption?: boolean;
  maxVisible?: number;
  compact?: boolean;
}

/**
 - Filtro de gêneros com suporte a modo compacto ou expandido.
 - Permite selecionar e limpar gênero.
 */
export const GeneroFilter: React.FC<GeneroFilterProps> = ({
  generos,
  generoSelecionado = '',
  onGeneroChange,
  loading = false,
  className = '',
  showAllOption = true,
  maxVisible = 8,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGeneroClick = (nomeGenero: string) => {
    onGeneroChange(generoSelecionado === nomeGenero ? '' : nomeGenero);
  };

  const handleClearSelection = () => onGeneroChange('');

  const renderGeneroBadge = (genero: Genero, isSelected: boolean) => (
    <Badge
      key={genero.nome}
      variant={isSelected ? 'default' : 'outline'}
      className={`cursor-pointer transition-all hover:scale-105 ${
        isSelected
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'hover:bg-muted'
      }`}
      onClick={() => handleGeneroClick(genero.nome)}
    >
      {genero.nome}
      {isSelected && <X className="h-3 w-3 ml-1" />}
    </Badge>
  );

  const renderCompact = () => {
    const generosVisiveis = generos.slice(0, maxVisible);
    const generosOcultos = generos.slice(maxVisible);

    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Gêneros</span>
            {generoSelecionado && (
              <Badge variant="secondary" className="text-xs">
                1 selecionado
              </Badge>
            )}
          </div>
          {generoSelecionado && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="h-6 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {showAllOption && (
            <Badge
              variant={!generoSelecionado ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => onGeneroChange('')}
            >
              Todos
            </Badge>
          )}

          {generosVisiveis.map((g) =>
            renderGeneroBadge(g, g.nome === generoSelecionado)
          )}

          {generosOcultos.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer transition-all hover:scale-105"
                >
                  {isExpanded ? (
                    <>
                      Menos <ChevronUp className="h-3 w-3 ml-1" />
                    </>
                  ) : (
                    <>
                      +{generosOcultos.length} <ChevronDown className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {generosOcultos.map((g) =>
                    renderGeneroBadge(g, g.nome === generoSelecionado)
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground">Carregando gêneros...</div>
        )}
      </div>
    );
  };

  const renderExpanded = () => (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtrar por Gênero
        </h3>
        {generoSelecionado && (
          <Button variant="outline" size="sm" onClick={handleClearSelection}>
            <X className="h-4 w-4 mr-2" />
            Limpar Filtro
          </Button>
        )}
      </div>

      {generoSelecionado && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Gênero selecionado:
          </div>
          <Badge variant="default" className="text-sm">
            {generoSelecionado}
            <X
              className="h-3 w-3 ml-2 cursor-pointer"
              onClick={handleClearSelection}
            />
          </Badge>
        </div>
      )}

      <ScrollArea className="h-64">
        <div className="space-y-2">
          {showAllOption && (
            <Button
              variant={!generoSelecionado ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onGeneroChange('')}
            >
              Todos os Gêneros
            </Button>
          )}

          {generos.map((g) => (
            <Button
              key={g.nome}
              variant={g.nome === generoSelecionado ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleGeneroClick(g.nome)}
            >
              <span>{g.nome}</span>
              {g.descricao && (
                <span className="ml-auto text-xs text-muted-foreground truncate max-w-[100px]">
                  {g.descricao}
                </span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {loading && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Carregando gêneros...
        </div>
      )}
      {generos.length === 0 && !loading && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Nenhum gênero disponível
        </div>
      )}
    </div>
  );

  return compact ? renderCompact() : renderExpanded();
};

/** Sidebar */
export const GeneroFilterSidebar: React.FC<Omit<GeneroFilterProps, 'compact'>> = (props) => (
  <GeneroFilter {...props} compact={false} />
);

/** Inline */
export const GeneroFilterInline: React.FC<Omit<GeneroFilterProps, 'compact'>> = (props) => (
  <GeneroFilter {...props} compact={true} />
);

/** Hook para controlar estado de filtro */
export function useGeneroFilter(generoInicial: string = '') {
  const [generoSelecionado, setGeneroSelecionado] = useState(generoInicial);

  const selecionarGenero = (g: string) => setGeneroSelecionado(g);
  const limparSelecao = () => setGeneroSelecionado('');
  const isGeneroSelecionado = (g: string) => generoSelecionado === g;

  return { generoSelecionado, selecionarGenero, limparSelecao, isGeneroSelecionado };
}
