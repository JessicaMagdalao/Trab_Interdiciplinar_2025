import { Router } from 'express';
import { AnimeController } from '../controllers/AnimeController';

export function criarRotasAnime(animeController: AnimeController): Router {
  const router = Router();
  router.get('/generos', (req, res) => animeController.obterGeneros(req, res));
  router.get('/populares', (req, res) => animeController.obterAnimesPopulares(req, res));
  router.get('/lancamento', (req, res) => animeController.obterAnimesEmLancamento(req, res));
  router.get('/search', (req, res) => animeController.pesquisarAnimes(req, res));
  router.get('/genero/:nome', (req, res) => animeController.obterAnimesPorGenero(req, res));
  router.get('/:id', (req, res) => animeController.obterDetalhesAnime(req, res));

  return router;
}
