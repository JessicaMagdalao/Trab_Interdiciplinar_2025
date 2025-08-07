import { Router } from 'express';
import { FavoritoController } from '../controllers/FavoritoController';

export function criarRotasFavorito(favoritoController: FavoritoController): Router {
  const router = Router();
  router.post('/', (req, res) => favoritoController.adicionarFavorito(req, res));
  router.get('/:animeId/:usuarioId/verificar', (req, res) => favoritoController.verificarFavorito(req, res));
  router.get('/:animeId/:usuarioId', (req, res) => favoritoController.obterFavorito(req, res));
  router.put('/:animeId/:usuarioId', (req, res) => favoritoController.atualizarFavorito(req, res));
  router.delete('/:animeId/:usuarioId', (req, res) => favoritoController.removerFavorito(req, res));
  router.get('/:usuarioId', (req, res) => favoritoController.listarFavoritos(req, res));

  return router;
}
