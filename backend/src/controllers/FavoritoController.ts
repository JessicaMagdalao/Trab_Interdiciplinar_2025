import { Request, Response } from 'express';
import { FavoritoService } from '../services/FavoritoService';

/**
 * Controlador responsável por gerenciar requisições HTTP relacionadas aos favoritos.
 */
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  public adicionarFavorito = async (req: Request, res: Response): Promise<void> => {
    try {
      const { animeId, usuarioId, nota = 0, comentario = '' } = req.body;

      if (!animeId || typeof animeId !== 'number' || animeId <= 0) {
        res.status(400).json({ erro: 'animeId deve ser um número positivo', codigo: 'ANIME_ID_INVALIDO' });
        return;
      }
      if (!usuarioId || typeof usuarioId !== 'string' || usuarioId.trim() === '') {
        res.status(400).json({ erro: 'usuarioId é obrigatório', codigo: 'USUARIO_ID_INVALIDO' });
        return;
      }

      const favorito = await this.favoritoService.adicionarFavorito(animeId, usuarioId, nota, comentario);
      res.status(201).json({ sucesso: true, dados: favorito.toJSON() });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public removerFavorito = async (req: Request, res: Response): Promise<void> => {
    try {
      const animeId = parseInt(req.params.animeId);
      const usuarioId = req.params.usuarioId;

      if (isNaN(animeId) || animeId <= 0 || !usuarioId) {
        res.status(400).json({ erro: 'Parâmetros inválidos', codigo: 'PARAMETROS_INVALIDOS' });
        return;
      }

      const removido = await this.favoritoService.removerFavorito(animeId, usuarioId);
      res.status(200).json({ sucesso: removido });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public listarFavoritos = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = req.params.usuarioId;
      if (!usuarioId) {
        res.status(400).json({ erro: 'usuarioId é obrigatório', codigo: 'USUARIO_ID_OBRIGATORIO' });
        return;
      }
      const favoritos = await this.favoritoService.listarFavoritos(usuarioId);
      res.status(200).json({ sucesso: true, dados: favoritos.map(f => f.toJSON()) });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public atualizarFavorito = async (req: Request, res: Response): Promise<void> => {
    try {
      const animeId = parseInt(req.params.animeId);
      const usuarioId = req.params.usuarioId;
      const { nota, comentario } = req.body;

      if (isNaN(animeId) || animeId <= 0 || !usuarioId) {
        res.status(400).json({ erro: 'Parâmetros inválidos', codigo: 'PARAMETROS_INVALIDOS' });
        return;
      }

      const atualizado = await this.favoritoService.atualizarFavorito(animeId, usuarioId, { nota, comentario });
      res.status(200).json({ sucesso: true, dados: atualizado.toJSON() });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public verificarFavorito = async (req: Request, res: Response): Promise<void> => {
    try {
      const animeId = parseInt(req.params.animeId);
      const usuarioId = req.params.usuarioId;

      if (isNaN(animeId) || animeId <= 0 || !usuarioId) {
        res.status(400).json({ erro: 'Parâmetros inválidos', codigo: 'PARAMETROS_INVALIDOS' });
        return;
      }

      const eFavorito = await this.favoritoService.verificarFavorito(animeId, usuarioId);
      res.status(200).json({ sucesso: true, dados: { eFavorito } });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public obterEstatisticas = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = req.params.usuarioId;
      if (!usuarioId) {
        res.status(400).json({ erro: 'usuarioId é obrigatório', codigo: 'USUARIO_ID_OBRIGATORIO' });
        return;
      }
      const stats = await this.favoritoService.obterEstatisticasUsuario(usuarioId);
      res.status(200).json({ sucesso: true, dados: stats });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public pesquisarFavoritos = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = req.params.usuarioId;
      const criterio = req.query.q as string;

      if (!usuarioId) {
        res.status(400).json({ erro: 'usuarioId é obrigatório', codigo: 'USUARIO_ID_OBRIGATORIO' });
        return;
      }

      const resultados = await this.favoritoService.pesquisarFavoritos(usuarioId, criterio);
      res.status(200).json({ sucesso: true, dados: resultados.map(f => f.toJSON()) });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  public obterFavorito = async (req: Request, res: Response): Promise<void> => {
    try {
      const animeId = parseInt(req.params.animeId);
      const usuarioId = req.params.usuarioId;

      if (isNaN(animeId) || animeId <= 0 || !usuarioId) {
        res.status(400).json({ erro: 'Parâmetros inválidos', codigo: 'PARAMETROS_INVALIDOS' });
        return;
      }

      const favorito = await this.favoritoService.obterFavorito(animeId, usuarioId);
      if (!favorito) {
        res.status(404).json({ erro: 'Favorito não encontrado', codigo: 'FAVORITO_NAO_ENCONTRADO' });
        return;
      }

      res.status(200).json({ sucesso: true, dados: favorito.toJSON() });
    } catch (error) {
      this.tratarErro(res, error as Error);
    }
  };

  private tratarErro(res: Response, erro: Error): void {
    console.error('[FavoritoController]', erro);
    res.status(erro.message.includes('não encontrado') ? 404 : 500).json({
      erro: erro.message || 'Erro interno do servidor',
      codigo: 'ERRO_SERVIDOR',
      timestamp: new Date().toISOString(),
    });
  }
}
