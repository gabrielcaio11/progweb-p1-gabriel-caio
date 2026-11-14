import { avaliacaoService } from '../services/avaliacaoService.js';

export const avaliacaoController = {
  listar(req, res) {
    res.json(avaliacaoService.listar(req.query.livroId));
  },

  buscarPorId(req, res) {
    res.json(avaliacaoService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const nova = avaliacaoService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req, res) {
    res.json(avaliacaoService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    avaliacaoService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
