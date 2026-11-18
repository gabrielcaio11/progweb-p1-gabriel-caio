import { livroService } from '../services/livroService.js';

export const livroController = {
  listar(req, res) {
    res.json(livroService.listar());
  },

  buscarPorId(req, res) {
    res.json(livroService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = livroService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(livroService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    livroService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
