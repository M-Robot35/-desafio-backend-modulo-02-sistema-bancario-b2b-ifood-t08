const helpes = require('../ultils/helpers')
const files = require('../ultils/criar_files')

const connect = async () => {
    return await JSON.parse( await files.loadFile())
}

const modelHelps = {

    get_user_Id :async ( user_id ) => {
        const usuarios = await connect()
        
        const usuario = usuarios.contas.find( ( user ) => {
            return Number(user['numero']) == Number(user_id)
        })
        
        return ( usuario ) ? { status : true, data : usuario} : { status : false}
    },

    get_user_Cpf :async ( user_cpf ) => {
        if(typeof user_cpf !== "string") return "o CPF deve-se passar o parametro como string"
        
        const usuarios = await connect()
        
        const usuario = usuarios.contas.find( ( user ) => {
            return user['usuario']['cpf'].toString() == user_cpf.toString()
        })
        return ( usuario ) ? { status : true, data : usuario} : { status : false} 
    },

    get_user_cpf_id :async ( user_cpf, user_id ) => {
        if(typeof user_cpf !== "string") return "o CPF deve-se passar o parametro como string"
        
        const usuarios = await connect()
        
        const usuario = usuarios.contas.find( ( user ) => {
            return user['usuario']['cpf'].toString() == user_cpf.toString() && Number(user['numero']) == Number(user_id)
        })
        return ( usuario ) ? { status : true, data : usuario} : { status : false} 
    },

    get_tranferencia_enviadas_id : async ( id ) => {
        const usuarios = await connect()
        
        const usuario = usuarios.transferenciasEnviadas.filter( ( user ) => {
            return Number(user.numero_conta_origem ) == Number(id)
        })

        return ( usuario.length != 0 ) ? { status : true, data : usuario} : { status : false} 
    },

    get_tranferencia_recebidas_id : async ( user_id ) => {
        const usuarios = await connect()
        
        const usuario = usuarios.transferenciasRecebidas.filter( ( user ) => {
            return Number(user.numero_conta_destino ) == Number(id)
        })
        return ( usuario.length != 0 ) ? { status : true, data : usuario} : { status : false}  
    },

    get_saque : async ( user_id ) => {
        const usuarios = await connect()
        
        const usuario = usuarios.saques.filter( ( user ) => {
            return Number(user['numero_conta'] ) == Number(user_id)
        })
        return ( usuario.length != 0 ) ? { status : true, data : usuario} : { status : false}  
    },

    get_deposito : async ( user_id ) => {
        const usuarios = await connect()
        
        const usuario = usuarios.depositos.filter( ( user ) => {
            return Number(user['numero_conta'] ) == Number(user_id)
        })
        return ( usuario.length != 0 ) ? { status : true, data : usuario} : { status : false}  
    },

    is_duplication : async ( key, value_comparation ) => {
        if(typeof value_comparation == "boolean") throw new Error("Não pode comparar um Boolean")
        
        if(value_comparation == "true" || value_comparation == "false") throw new Error("Não pode comparar um Boolean")

        try {            
            const usuarios = await connect()

            const usuario = usuarios['contas'].filter( ( user ) => {
            return user[key].toString() == value_comparation.toString()
            })            
            
            return ( usuario.length > 1 ) ?  true : false
        
        }catch( err ){
            throw new Error("Error na função ( is_duplication )"+ err)
        }
    }
}

module.exports = modelHelps