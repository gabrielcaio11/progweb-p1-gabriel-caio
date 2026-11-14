import express from 'express';
import livrosRouter from './routes/livros.js';
import avaliacoesRouter from './routes/avaliacoes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ api: 'Sistema de Avaliação de Livros', versao: '1.0.0', rotas: ['/livros', '/avaliacoes'] });
});

app.use('/livros', livrosRouter);
app.use('/avaliacoes', avaliacoesRouter);

app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

app.use(errorHandler);

export default app;
