import { Request, Response } from 'express';
import { AnimeService } from '../services/AnimeService';

export class AnimeController {
  private animeService: AnimeService;

  constructor(animeService: AnimeService) {
    this.animeService = animeService;
  }

  public obterAnimesPopulares = async (req: Request, res: Response): Promise<void> => {
    try {
      const pagina = parseInt(req.query.page as string) || 1;
      const limite = parseInt(req.query.limit as string) || 20;

      if (pagina < 1) {
        res.status(400).json({ erro: 'Número da página deve ser maior que 0', codigo: 'PAGINA_INVALIDA' });
        return;
      }
      if (limite < 1 || limite > 100) {
        res.status(400).json({ erro: 'Limite deve estar entre 1 e 100', codigo: 'LIMITE_INVALIDO' });
        return;
      }

      let animes = await this.animeService.buscarAnimesPopulares(pagina, limite);
      if (!Array.isArray(animes)) {
        if (animes && (animes as any).media) {
          animes = (animes as any).media;
        } else {
          animes = [];
        }
      }

      res.status(200).json({
        sucesso: true,
        dados: animes,
        paginacao: { pagina, limite, total: animes.length }
      });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public obterAnimesPorGenero = async (req: Request, res: Response): Promise<void> => {
    try {
      const genero = req.params.nome;
      const pagina = parseInt(req.query.page as string) || 1;
      const limite = parseInt(req.query.limit as string) || 20;

      if (!genero || genero.trim() === '') {
        res.status(400).json({ erro: 'Nome do gênero é obrigatório', codigo: 'GENERO_OBRIGATORIO' });
        return;
      }
      if (pagina < 1) {
        res.status(400).json({ erro: 'Número da página deve ser maior que 0', codigo: 'PAGINA_INVALIDA' });
        return;
      }
      if (limite < 1 || limite > 100) {
        res.status(400).json({ erro: 'Limite deve estar entre 1 e 100', codigo: 'LIMITE_INVALIDO' });
        return;
      }

      let animes = await this.animeService.buscarAnimesPorGenero(genero, pagina, limite);
      if (!Array.isArray(animes)) {
        if (animes && (animes as any).media) {
          animes = (animes as any).media;
        } else {
          animes = [];
        }
      }

      res.status(200).json({
        sucesso: true,
        dados: animes,
        filtro: { genero, pagina, limite, total: animes.length }
      });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public pesquisarAnimes = async (req: Request, res: Response): Promise<void> => {
    try {
      const termo = (req.query.q as string || '').trim();
      const pagina = parseInt(req.query.page as string) || 1;
      const limite = parseInt(req.query.limit as string) || 20;

      if (!termo) {
        res.status(400).json({ erro: 'Termo de pesquisa é obrigatório', codigo: 'TERMO_OBRIGATORIO' });
        return;
      }
      if (termo.length < 2) {
        res.status(400).json({ erro: 'Termo de pesquisa deve ter pelo menos 2 caracteres', codigo: 'TERMO_MUITO_CURTO' });
        return;
      }
      if (pagina < 1) {
        res.status(400).json({ erro: 'Número da página deve ser maior que 0', codigo: 'PAGINA_INVALIDA' });
        return;
      }
      if (limite < 1 || limite > 100) {
        res.status(400).json({ erro: 'Limite deve estar entre 1 e 100', codigo: 'LIMITE_INVALIDO' });
        return;
      }

      let animes = await this.animeService.pesquisarAnimes(termo, pagina, limite);
      if (!Array.isArray(animes)) {
        if (animes && (animes as any).media) {
          animes = (animes as any).media;
        } else {
          animes = [];
        }
      }

      res.status(200).json({
        sucesso: true,
        dados: animes,
        pesquisa: { termo, pagina, limite, total: animes.length }
      });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public obterDetalhesAnime = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({ erro: 'ID do anime deve ser um número positivo', codigo: 'ID_INVALIDO' });
        return;
      }

      const anime = await this.animeService.obterDetalhesAnime(id);
      res.status(200).json({ sucesso: true, dados: anime });
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(404).json({ erro: `Anime com ID ${req.params.id} não encontrado`, codigo: 'ANIME_NAO_ENCONTRADO' });
      } else {
        this.tratarErro(res, error as Error);
      }
    }
  };


  public obterGeneros = async (_req: Request, res: Response): Promise<void> => {
    try {
      const generos = await this.animeService.obterGeneros();
      res.status(200).json({ sucesso: true, dados: generos });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public obterAnimesEmLancamento = async (req: Request, res: Response): Promise<void> => {
    try {
      const pagina = parseInt(req.query.page as string) || 1;
      const limite = parseInt(req.query.limit as string) || 20;

      if (pagina < 1) {
        res.status(400).json({ erro: 'Número da página deve ser maior que 0', codigo: 'PAGINA_INVALIDA' });
        return;
      }
      if (limite < 1 || limite > 100) {
        res.status(400).json({ erro: 'Limite deve estar entre 1 e 100', codigo: 'LIMITE_INVALIDO' });
        return;
      }

      let animes = await this.animeService.buscarAnimesEmLancamento(pagina, limite);
      if (!Array.isArray(animes)) {
        if (animes && (animes as any).media) {
          animes = (animes as any).media;
        } else {
          animes = [];
        }
      }

      res.status(200).json({
        sucesso: true,
        dados: animes,
        paginacao: { pagina, limite, total: animes.length }
      });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };


  private tratarErro(res: Response, erro: Error): void {
    console.error('Erro no AnimeController:', erro);
    let statusCode = 500;
    let codigo = 'ERRO_INTERNO';

    if (erro.message.includes('Falha na comunicação')) {
      statusCode = 503;
      codigo = 'SERVICO_INDISPONIVEL';
    } else if (erro.message.includes('não pode estar vazio')) {
      statusCode = 400;
      codigo = 'PARAMETRO_INVALIDO';
    }

    res.status(statusCode).json({
      erro: erro.message || 'Erro interno do servidor',
      codigo,
      timestamp: new Date().toISOString()
    });
  }
}
