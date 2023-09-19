// Libs internas
const helpers = require('../ultils/helpers')
const dataBase = require('../ultils/criar_files')
const modelHelps = require('../model/ultils-model')

// Libs Externas
const { v4 } = require('uuid')


const padrao = async (req, res ) => {
                    
    res.send('Desafio Módulo 2 - Back-end ')
}

const todasContas = async (req, res ) => {    

    const contas = JSON.parse(await dataBase.loadFile()).contas    
    
    if(contas.length === 0 ) return helpers.requestError( res, 401, "Ainda não existe nem uma conta cadastrada" )
    
    return helpers.requestSuccess(res, 200, "success", contas)
}

const modifyData = async ( req, res ) => {    

    const { numeroConta, usuario } = req.params

    if( !numeroConta || !usuario ) return helpers.requestError( res, 401, "Necessário passar Parametros" )
    
    const {nome, cpf, data_nascimento, telefone, email, senha } = req.body
    
    const DbContas = JSON.parse(await dataBase.loadFile())
    
    const userBase = usuario.toLocaleLowerCase().trim()
    
    const verificaConta = DbContas.contas.find( ( conta ) => {
        const userDataBase = conta.usuario.nome.toLocaleLowerCase().trim()     
        const idBase = conta.numero  

        if(idBase === numeroConta && userDataBase === userBase) return conta        
    })

    if(!verificaConta) return helpers.requestError( res, 401, "Os Dados não conferem" )
    
    const setUsuario = verificaConta
    
    verificaConta['usuario'] = setUsuario['usuario'] = {
        nome : helpers.captalize( nome ),
        cpf,
        data_nascimento,
        telefone,
        email
    }       
    dataBase.saveFile( DbContas)

    return helpers.requestSuccess(res, 201)    
}


const adicionarConta = async (req, res ) =>{
    
    const { nome, cpf, data_nascimento, telefone, email, senha} = req.body 
         
    const usuarios = JSON.parse(await dataBase.loadFile()).contas 
    
    const verificaDuplicidadeCpf = usuarios.find( ( contaExist ) => {
        return contaExist['usuario']['cpf'] == cpf
    })   
    
    if(verificaDuplicidadeCpf) return helpers.requestError( res, 401, "O CPF informado já existe cadastrado!" )
      
    let criarUsuario = {
        "numero": (usuarios.length + 1).toString() ,
        "saldo": 0,
        "usuario": {
            nome : helpers.captalize( nome ),
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }        
    }
    dataBase.contaNova( criarUsuario )

    return helpers.requestSuccess(res, 204 )        
}

const deletarConta = async (req, res ) => {
    const { numeroConta } = req.params  

    if( !numeroConta ) return helpers.requestError( res, 401, "Necessario passar o número da conta" )
    
    const DbContas = JSON.parse( await dataBase.loadFile() )

    const indexConta = DbContas.contas.findIndex( ( conta ) => conta.numero == numeroConta )

    if(indexConta == -1 ) return helpers.requestError( res, 401, "Usuario Inválido" )
    
    const contaZerada = DbContas.contas[ indexConta ].saldo

    if(contaZerada !== 0) return helpers.requestError( res, 401, `A conta só pode ser removida se o saldo for zero!`, `Saldo : ${ helpers.real(contaZerada) }` )
    
    DbContas.contas.splice( indexConta, 1)
    
    dataBase.saveFile( DbContas )        

    return helpers.requestSuccess( res, 204)   
}

const saberSaldo = async (req, res) => {
    const { numero_conta, senha } = req.query

    if( !numero_conta ) return helpers.requestError( res, 401, "Conta para consulta não suportada" )
    
    if( !senha ) return helpers.requestError( res, 401, "Informe a Senha de usuario" )

    const verConta = await modelHelps.get_user_Id( numero_conta)
    
    if( !verConta['status'] ) return helpers.requestError( res, 401, "Conta bancária não encontada!" )

    if( (verConta['data']['usuario']['senha'].toString() !== senha.toString())) return helpers.requestError( res, 401, "A Senha não confere" )

    const saldoAtual = helpers.real(verConta['data']['saldo'])

    return helpers.requestSuccess( res, 201, `Saldo da conta : ${ saldoAtual }`)  

}


const extrato = async(req, res ) => {
    const { numero_conta, senha } = req.query

    if( !numero_conta ) return helpers.requestError( res, 401, "Conta para consulta não suportada" )
    
    if( !senha ) return helpers.requestError( res, 401, "Informe a Senha de usuario" )

    const verConta = await modelHelps.get_user_Id( numero_conta)
    
    if( !verConta['status'] ) return helpers.requestError( res, 401, "Conta bancária não encontada!" )
    
    if( (verConta['data']['usuario']['senha'].toString() !== senha.toString())) return helpers.requestError( res, 401, "A Senha não confere" )
    
    const saques = await modelHelps.get_saque( numero_conta )
    const depositos = await modelHelps.get_deposito( numero_conta )
    
    return helpers.requestSuccess( res, 201, "success", {deposito : await depositos['data'],  saques : await saques['data'] })  
}
module.exports = { 
    padrao,
    todasContas,
    modifyData,
    adicionarConta,
    deletarConta,
    saberSaldo,
    extrato
}