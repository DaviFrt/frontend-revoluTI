## Teste Técnico RevoluTI

# Front-End
Para rodar o front-end em localhost você deve seguir os seguintes comandos:

```bash
  pnpm i
  pnpm run dev
```

# Back-End
Para rodar o back-end em localhost você deve criar um banco de dados e adicionar o link de acesso ao BD a um arquivo .env como exemplificado no .env.example
Logo em seguida deve rodar os comandos do prisma para criar as tabelas no banco de dados

```bash
  npx prisma migrate depoy
```
Após isso, rode seu projeto:

```bash
  pnpm run start:dev
```

# Documentação da API
Toda a documentação da API está no http://localhost:3333/docs

# Requisito extra
Decidi fazer como requisitos extra, toda a parte de testes unitários e doumentação da API.
Sabendo que um ambiente testado da forma correta é menos suscetível a erros e um código bem documentado é a chave para o desenvolvimento de um front-end com maior facilidade, além de tornar mais fácil a leitura e testes também da API.
Na parte de front-end decidi utilizar o react-toastify para apresentar de forma mais dinâmica os erros e acertos do usuário final!
