require('dotenv').config()
const express = require('express');
const routers = require('./routers/padrao-router');
const routers_transacoes = require('./routers/transacoes-routers');

const port  = process.env.PORT || process.env.PORT_LOCAL

const cors = require('cors')({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    'Access-Control-Allow-Origin': "",
    "Access-Control-Allow-Credentials": true,
    "preflightContinue": false,
    "optionsSuccessStatus": 204
});

const app = express();
app.use( express.json() );
app.use(express.urlencoded({extended:true}));
app.use(cors)

app.use( routers );
app.use( routers_transacoes );

app.get('*', (req, res) => {
    res.status(404).json({error : true, messagem : "Rota não encontrada"});
});

app.listen(port, console.log(`Server Thiago Teles [ Online ] => http://localhost:${port}`))