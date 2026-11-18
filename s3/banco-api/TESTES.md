# Testes da API — Banco API (S3)

API: Banco API · servidor: `npm run dev` em `http://localhost:3000`

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | GET | / | — | 200 | health check |
| 2 | POST | /clientes | {"nome":"Ana Silva","cpf":"123.456.789-00","email":"ana@email.com"} | 201 | cria cliente |
| 3 | POST | /clientes | {"nome":"Ana Dup","cpf":"123.456.789-00"} | 409 | CPF duplicado |
| 4 | GET | /clientes | — | 200 | lista clientes |
| 5 | GET | /clientes/99 | — | 404 | cliente inexistente |
| 6 | PUT | /clientes/1 | {"email":"ana.nova@email.com"} | 200 | atualiza cliente |
| 7 | POST | /contas | {"tipo":"corrente","saldo":1500,"clienteId":1} | 201 | cria conta |
| 8 | GET | /contas?clienteId=1 | — | 200 | filtro por cliente |
| 9 | POST | /contas | {"tipo":"corrente","saldo":1500,"clienteId":999} | 422 | cliente não existe |
| 10 | DELETE | /clientes/1 | — | 204 | remove cliente |
