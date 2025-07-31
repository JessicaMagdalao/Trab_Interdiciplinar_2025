import { Router } from 'express';
import { AnimeController } from '../controllers/AnimeController';

/**
 * Função responsável por configurar as rotas relacionadas a animes.
 * Segue o princípio de responsabilidade única (SRP): apenas define as rotas e delega ao controller.
 * 
 * @param animeController Instância do controlador de animes
 * @returns Router configurado
 */
export function criarRotasAnime(animeController: AnimeController): Router {
  const router = Router();

  /**
   *  Ordem das rotas é importante:
   * - Rotas mais específicas (ex: /generos) devem vir antes de rotas genéricas (ex: /:id)
   * - Isso evita conflitos e capturas indevidas de parâmetros.
   */

  // 🔹 Lista de gêneros disponíveis
  router.get('/generos', (req, res) => animeController.obterGeneros(req, res));

  // 🔹 Lista de animes populares
  router.get('/populares', (req, res) => animeController.obterAnimesPopulares(req, res));

  // 🔹 Lista de animes em lançamento
  router.get('/lancamento', (req, res) => animeController.obterAnimesEmLancamento(req, res));

  // 🔹 Pesquisa animes por termo
  router.get('/search', (req, res) => animeController.pesquisarAnimes(req, res));

  // 🔹 Animes por gênero
  router.get('/genero/:nome', (req, res) => animeController.obterAnimesPorGenero(req, res));

  // 🔹 Detalhes de um anime específico (rota genérica deve vir por último)
  router.get('/:id', (req, res) => animeController.obterDetalhesAnime(req, res));

  return router;
}
