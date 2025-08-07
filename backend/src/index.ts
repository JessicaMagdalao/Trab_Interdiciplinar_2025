import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AniListService } from './services/AniListService';
import { AnimeService } from './services/AnimeService';
import { FavoritoService } from './services/FavoritoService';
import { MemoryFavoritoRepository } from './repositories/MemoryFavoritoRepository';
import { AnimeController } from './controllers/AnimeController';
import { FavoritoController } from './controllers/FavoritoController';
import { criarRotasAnime } from './routes/animeRoutes';
import { criarRotasFavorito } from './routes/favoritoRoutes';

// Carrega variáveis de ambiente do .env
dotenv.config();

class AnimeApp {
  private app: express.Application;
  private porta: number;

  private favoritoRepository!: MemoryFavoritoRepository;
  private anilistService!: AniListService;
  private animeService!: AnimeService;
  private favoritoService!: FavoritoService;
  private animeController!: AnimeController;
  private favoritoController!: FavoritoController;

  constructor() {
    this.app = express();
    this.porta = parseInt(process.env.PORT || '3001', 10);

    this.inicializarDependencias();
    this.configurarMiddlewares();
    this.configurarRotas();
    this.configurarTratamentoErros();
  }

  private inicializarDependencias(): void {
    this.favoritoRepository = new MemoryFavoritoRepository();
    this.anilistService = new AniListService();
    this.animeService = new AnimeService(this.anilistService);
    this.favoritoService = new FavoritoService(this.favoritoRepository, this.animeService);

    this.animeController = new AnimeController(this.animeService);
    this.favoritoController = new FavoritoController(this.favoritoService);
  }

  private configurarMiddlewares(): void {
    this.app.use(cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    this.app.use((req, _res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
      next();
    });
    this.app.use((_req, res, next) => {
      res.header('X-Content-Type-Options', 'nosniff');
      res.header('X-Frame-Options', 'DENY');
      res.header('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  private configurarRotas(): void {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
      });
    });

    this.app.get('/', (_req, res) => {
      res.status(200).json({
        nome: 'Anime API',
        versao: '1.0.0',
        descricao: 'API para gerenciamento de animes e favoritos',
        endpoints: {
          animes: '/api/animes',
          favoritos: '/api/favoritos',
          health: '/health'
        }
      });
    });

    this.app.use('/api/animes', criarRotasAnime(this.animeController));
    this.app.use('/api/favoritos', criarRotasFavorito(this.favoritoController));
    this.app.use('*', (req, res) => {
      res.status(404).json({
        erro: 'Endpoint não encontrado',
        codigo: 'ENDPOINT_NAO_ENCONTRADO',
        path: req.originalUrl,
        metodo: req.method,
        timestamp: new Date().toISOString()
      });
    });
  }

  private configurarTratamentoErros(): void {
    this.app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Erro não tratado:', error);

      res.status(500).json({
        erro: 'Erro interno do servidor',
        codigo: 'ERRO_INTERNO',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    });

    process.on('unhandledRejection', (reason) => {
      console.error('Promessa rejeitada não tratada:', reason);
    });
    process.on('uncaughtException', (error) => {
      console.error('Exceção não capturada:', error);
      process.exit(1);
    });
  }
  public iniciar(): void {
    this.app.listen(this.porta, '0.0.0.0', () => {
      console.log(' Servidor Anime API iniciado com sucesso!');
      console.log(` Porta: ${this.porta}`);
      console.log(` URL: http://localhost:${this.porta}`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

const app = new AnimeApp();
app.iniciar();

export default app;
