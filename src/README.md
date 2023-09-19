# IMPLEMENTAÇÕES =====================================

- Deve-se passar sempre a senha do banco como parametro,  senha padrão  senha_banco=Cubos123Bank

- Os dados são persistidos por um arquivo .json, localizado na pasta dataBase

- Caso não haja o arquivo ele será criado automaticamente em tempo de execução

- Os nomes dos usuarios serão salvos no formato Captalize ex : [ Thiago Teles ] automaticamente

# ROTAS  ==============================================

POST : `/contas`
- Deve-se passar todos os  dados 
- Não pode haver nem um dado em Branco/Vazio    

Exemplo :
    {
        "nome": "Foo Bar 3",
        "cpf": "99911122234",
        "data_nascimento": "2021-03-15",
        "telefone": "71999998888",
        "email": "foo@bar3.com",
        "senha": "12345"
    {

PUT : `/contas/:numeroConta/usuario`
- Deve-se passar como parametro o número/ID do usuario e o nome Exatamente igual ao Bd pela URL

Exemplo :
    http://localhost:3000/contas/2/Foo Bar 2?senha_banco=Cubos123Bank


DELETE : `/contas/:numeroConta`
- A conta somente será removida se o Saldo for igual a Zero

Exemplo :
    http://localhost:3000/contas/2/Thiago Back-End?senha_banco=Cubos123Bank


POST : `/transacoes/depositar`
    - deve-se colocar todos os parametros


POST : `/transacoes/sacar`
    