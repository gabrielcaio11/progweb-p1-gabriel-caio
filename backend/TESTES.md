# Testes da API — Projeto 1 (S3)

API: Sistema de Avaliação de Livros · servidor: `npm run dev` em `http://localhost:3000`

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | POST | /livros | {"titulo":"Dom Casmurro","autor":"Machado de Assis","isbn":"978-85-359-0278-1"} | 201 | cria livro |
| 2 | POST | /livros | {"titulo":"O Pequeno Príncipe","autor":"Antoine de Saint-Exupéry","isbn":"978-85-359-0278-1"} | 409 | ISBN duplicado |
| 3 | GET | /livros | — | 200 | lista livros |
| 4 | GET | /livros/99 | — | 404 | livro inexistente |
| 5 | POST | /avaliacoes | {"titulo":"Excelente leitura","nota":5,"texto":"Muito envolvente.","livroId":1,"usuarioId":7} | 201 | cria avaliação |
| 6 | POST | /avaliacoes | {"titulo":"Nota inválida","nota":9,"livroId":1,"usuarioId":8} | 400 | nota fora do intervalo |
| 7 | POST | /avaliacoes | {"titulo":"Livro fora","nota":4,"livroId":99,"usuarioId":8} | 422 | livro não existe |
| 8 | GET | /avaliacoes?livroId=1 | — | 200 | filtro 1:N |
| 9 | POST | /avaliacoes | {"titulo":"Repetida","nota":4,"livroId":1,"usuarioId":7} | 409 | usuário já avaliou o livro |
| 10 | DELETE | /avaliacoes/1 | — | 204 | remove avaliação |
