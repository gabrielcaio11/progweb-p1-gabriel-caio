# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Livros | carregando | Abra DevTools > Network, escolha 3G lento e recarregue | Spinner "Carregando livros…" |
| Livros | vazio | Inicie o backend sem livros cadastrados | "Nenhum livro ainda…" |
| Livros | erro | Pare o backend, recarregue o front e tente novamente | "Não consegui falar com a API…" |
| Livros | sucesso | Cadastre um livro válido | Linha na tabela com título, autor e ISBN |
| Avaliações | vazio | Inicie o backend sem avaliações cadastradas | "Nenhuma avaliação ainda…" |
| Avaliações | sucesso | Escolha um livro, informe usuário e uma nota entre 1 e 5 | Linha com título, nota, nome do livro e usuário |
| Avaliações | erro de regra | Tente criar uma avaliação com nota 9 ou usuário duplicado | Aviso vermelho com a mensagem do backend |

## Camadas

- api: `js/api.js`
- services: `js/services/`
- state: `js/state/store.js`
- ui: `js/ui/`
