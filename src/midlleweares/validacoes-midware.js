const databasecontas = require('../ultils/criar_files')
const model = require('../model/ultils-model')
const helps = require('../ultils/helpers')
const lastVerification = require('../midlleweares/verification')

const validaTransacao = {    
    
    clearString : ( palavra )=> {
        if(typeof palavra === 'string'){
            const clear = palavra.trim()  

            if(!clear) return false                
            return true

        }else if(typeof palavra === 'number'){
            const clear = palavra
    
            if(!clear) return false    
            return true
        }
        return typeof palavra
    },

    cpfExiste : async ( cpf ) => {
        const dados = JSON.parse( await databasecontas.loadFile()).contas

        const verificarCpf = dados.find( ( Bdemail )=>{
            return Bdemail === cpf
        })
        return verificarCpf ? true : false 
    },

    emailExiste : async ( email ) => {
        const dados = JSON.parse( await databasecontas.loadFile()).contas
    
        const verificarEmail = dados.find( ( Bdemail )=>{
            return Bdemail === email
        })
        return verificarEmail ? true : false  
    },

    contaExiste : async ( id )=>{
        const dados = JSON.parse( await databasecontas.loadFile()).contas
        
        const verificarConta = dados.find( ( Bdemail )=>{
            return Number( Bdemail.numero ) === Number( id )
        })
        return verificarConta ? true : false
    },

    verificaNumeroConta : async function( req, res, next ){
        if( !lastVerification.verificaCampoVazio( req.body)) return helps.requestError(res, 404, "O número da conta e o valor são obrigatórios!")
        
        const { numero_conta, valor } = req.body        
                
        if( Number( valor ) < 0 ) return helps.requestError(res, 404, "Valor não pode ser 0 ou negativo")
        
        const check = await model.get_user_Id( numero_conta )
        
        if ( !check.status ) return helps.requestError(res, 404, "Número da conta inexistente")
        
        next()
    },

    requireTransferencia : (req, res, next ) => {
        const requireTransf = [ "numero_conta_origem", "numero_conta_destino", "valor", "senha"]
        
        const bodyContent = Object.keys( req.body )

        const filtro = requireTransf.filter( ( require ) => {
            return !bodyContent.includes( require)
        })

        if( filtro.length !== 0 ) return helps.requestError(res, 404, `Campos necessarios : ${ filtro.join(' - ') }`)

        next()
    }
}
module.exports = validaTransacao