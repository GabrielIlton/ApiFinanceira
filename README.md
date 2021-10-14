# Node.js

*API Financeira

-



-GET: Leitura
-POST: Criação
-PULL: Atualização
-DELETE: Deleção
-PATCH: Atualização parcial

-1XX: Informação 
-2XX: Confirmação
    °200 - Requisição bem sucedidda
    °201 - Created - Geralmente usado para POST após uma inserção

-3XX: Redirecionamento
    °301 - Moved Permanently
    °302 - Moved

-4XX: Error do client
    °400 - Bad request
    °401 - Unauthorized
    °403 - Forbidden
    °404 - Not Found
    °422 - Unprocessable Entity

-5XX: Error no Server
    °500 - Internal Server Error
    °502 - Bad Gateway


app.get("/", (req, res) => {// EH O REQUERIMENTO E A RESPOSTA
    return res.json({ message: "Hello World!  " }); //? RETORNA QUALQUER COISA COM O JSON NO localhost:3333
});

//todo: splice altera o conteudo, add conteudo novo e remove o velho