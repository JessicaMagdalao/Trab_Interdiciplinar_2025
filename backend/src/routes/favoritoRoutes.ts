import { Router } from 'express';
import { FavoritoController } from '../controllers/FavoritoController';

/**
 * Configura as rotas relacionadas aos favoritos.
 * Segue o princípio SRP: define apenas as rotas e delega a lógica ao controller.
 *
 * @param favoritoController Instância do controlador de favoritos
 * @returns Router configurado
 */
export function criarRotasFavorito(favoritoController: FavoritoController): Router {
  const router = Router();

  //  Adicionar um favorito
  router.post('/', (req, res) => favoritoController.adicionarFavorito(req, res));

  //  Estatísticas de um usuário
  router.get('/:usuarioId/estatisticas', (req, res) => favoritoController.obterEstatisticas(req, res));

  //  Pesquisar favoritos de um usuário por critério
  router.get('/:usuarioId/search', (req, res) => favoritoController.pesquisarFavoritos(req, res));

  //  Verificar se um anime é favorito (precisa vir antes das rotas genéricas que usam apenas usuarioId)
  router.get('/:animeId/:usuarioId/verificar', (req, res) => favoritoController.verificarFavorito(req, res));

  //  Obter um favorito específico
  router.get('/:animeId/:usuarioId', (req, res) => favoritoController.obterFavorito(req, res));

  //  Atualizar um favorito existente
  router.put('/:animeId/:usuarioId', (req, res) => favoritoController.atualizarFavorito(req, res));

  //  Remover um favorito
  router.delete('/:animeId/:usuarioId', (req, res) => favoritoController.removerFavorito(req, res));

  //  Listar todos os favoritos de um usuário
  // Esta rota deve vir por último entre as com parâmetros, pois apenas tem :usuarioId
  router.get('/:usuarioId', (req, res) => favoritoController.listarFavoritos(req, res));

  return router;
}
