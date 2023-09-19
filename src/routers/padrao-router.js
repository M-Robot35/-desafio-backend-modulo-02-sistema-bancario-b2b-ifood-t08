
const { padrao, 
    todasContas,    
    modifyData,
    adicionarConta,
    saberSaldo,
    deletarConta,
    extrato
} = require('../controllers/index-controller')
const validaTransacao = require('../midlleweares/validacoes-midware')

const contaVerifica =  require('../midlleweares/verification')

const { Router } = require('express')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
const cadastrar = [ contaVerifica.requiredVerify, contaVerifica.somentNumbers ]

const routers = Router()

routers.use(contaVerifica.senhaverify)

routers.get('/', padrao)

routers.get("/contas", todasContas ) // OK

routers.get("/contas/saldo", saberSaldo ) // OK

routers.get("/contas/extrato", extrato ) // OK

routers.post("/contas", cadastrar, adicionarConta ) // OK

routers.put("/contas/:numeroConta/:usuario", cadastrar, modifyData) // OK

routers.delete('/contas/:numeroConta', deletarConta)  // OK

module.exports = routers