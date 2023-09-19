
const helpers = require('../ultils/helpers');
const dataBase = require('../ultils/criar_files');
const modelHelp = require('../model/ultils-model');
const lastVerification = require('../midlleweares/verification')


async function log_saque_deposito( dados ){
    log = {
        data : helpers.dateTimeCurrenci(),
        numero_conta : dados.numero_conta,
        valor : dados.valor
    }    
    return [log]    
}

async function log_transferencia_enviada_recebidas( dados ){
    log = {
        data : helpers.dateTimeCurrenci(),
        numero_conta_origem : dados.numero_conta_origem,
        numero_conta_destino : dados.numero_conta_destino,
        valor : dados.valor
    }        
    return [log]    
}

const depositar = async (req, res ) => {
    await dataBase.pathRequired()

    const { numero_conta, valor } = req.body

    const dados = JSON.parse( await dataBase.loadFile())
        
    const usuario = (await modelHelp.get_user_Id( numero_conta))['data']
    
    usuario['saldo'] =  Number( usuario['saldo'] ) + Number( valor )
    dados['depositos'] = [...dados['depositos'], ...await log_saque_deposito( req.body)]
    
    await dataBase.saveFile( dados )   

    return helpers.requestSuccess(res, 204 )
}

const sacar = async ( req, res ) => {

    await dataBase.pathRequired()
    
    const { numero_conta, valor, senha } = req.body
        
    const dados = JSON.parse( await dataBase.loadFile())
         
    const usuario = (await modelHelp.get_user_Id( numero_conta))['data']
       
    if( Number( usuario['saldo'] ) < Number( valor ) ) return helpers.requestError( res, 401, "Saldo insuficiente" )
    
    if(!( Number( usuario['numero'] ) == Number( numero_conta ) && Number( usuario['usuario']['senha'] ) == Number( senha ) )) return helpers.requestError( res, 401, "Login ou Senha incorretos" )
    
    usuario['saldo'] =  Number( usuario['saldo'] ) - Number( valor )    
    dados['saques'] = [...dados['depositos'], ...await log_saque_deposito( req.body)]  
    
    await dataBase.saveFile( dados )   

    return helpers.requestSuccess(res, 201)     
}

const transferir = async ( req, res ) => {
    if( !(lastVerification.verificaCampoVazio( req.body)) ) return helpers.requestError(res, 404, "Todos o Campos são obrigatórios! serem preenchidos")

    await dataBase.pathRequired()
    
    const { numero_conta_origem, 
            numero_conta_destino, 
            valor, 
            senha 
    } = req.body

    const origem = await  modelHelp.get_user_Id(numero_conta_origem) 
    if( !(origem['data']['usuario']['senha'].toString() == senha.toString()) ) return helpers.requestError( res, 401, "Senha incorreta" )    
    
    const destino = await modelHelp.get_user_Id( numero_conta_destino )
    
    if( !origem.status ) return helpers.requestError(res, 404, "Origem inexistente")    
    if( !destino.status ) return helpers.requestError(res, 404, "Destino inexistente")
    
    const usuario = origem['data']      
    if( Number( usuario['saldo'] ) < Number( valor ) ) return helpers.requestError( res, 401, "Saldo insuficiente" )
    
    const dados = JSON.parse( await dataBase.loadFile() )
                
    // enviar
    origem['data']['saldo'] =  Number( usuario['saldo'] ) - Number( valor )  
    dados['saques'] = [...dados['depositos'], ...await log_transferencia_enviada_recebidas( req.body)]  
    dados['transferenciasEnviadas'] = [...dados['transferenciasEnviadas'], ...await log_transferencia_enviada_recebidas( req.body)]
        
    // receber
    destino['data']['saldo'] =  Number( destino['data']['saldo'] ) + Number( valor )
    dados['transferenciasRecebidas'] = [...dados['transferenciasRecebidas'], ...await log_transferencia_enviada_recebidas( req.body)]
        
    dados['contas'].filter( ( conta )=>{
        if( Number(conta.numero) == Number(numero_conta_origem) ){
            conta.saldo = origem.data.saldo
        }

        if( Number(conta.numero) == Number(numero_conta_destino) ){
            conta.saldo = destino.data.saldo
        }
    })   

    await dataBase.saveFile( dados ) 

    return helpers.requestSuccess(res, 204)    
}

module.exports = { 
    depositar,
    sacar,
    transferir
}