import { Router } from 'express';
import { livroController } from '../controllers/livroController.js';

const router = Router();

router.get('/', livroController.listar);
router.get('/:id', livroController.buscarPorId);
router.post('/', livroController.criar);
router.put('/:id', livroController.atualizar);
router.delete('/:id', livroController.remover);

export default router;
