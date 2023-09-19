
const { depositar,
    sacar,
    transferir
} = require('../controllers/transacoes-controller')


const contaVerifica =  require('../midlleweares/verification')
const verificarTransasoes =  require('../midlleweares/validacoes-midware')

const { Router } = require('express')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
const cadastrar = [ contaVerifica.requiredVerify, contaVerifica.somentNumbers ]

const routers = Router()

routers.use( contaVerifica.senhaverify )

routers.post("/transacoes/depositar", verificarTransasoes.verificaNumeroConta, depositar ) 

routers.post("/transacoes/sacar", verificarTransasoes.verificaNumeroConta, sacar )

routers.post("/transacoes/transferir", verificarTransasoes.requireTransferencia, transferir) 

module.exports = routers 