import { Router } from 'express';
import { avaliacaoController } from '../controllers/avaliacaoController.js';

const router = Router();

router.get('/', avaliacaoController.listar);
router.get('/:id', avaliacaoController.buscarPorId);
router.post('/', avaliacaoController.criar);
router.put('/:id', avaliacaoController.atualizar);
router.delete('/:id', avaliacaoController.remover);

export default router;
