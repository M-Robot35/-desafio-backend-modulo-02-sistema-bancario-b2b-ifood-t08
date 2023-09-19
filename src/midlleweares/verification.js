const helpModel = require('../model/ultils-model')
const requir  = require("../ultils/criar_files")


function requestError(res, status, mensagem, dados = []){
    
    if(dados.length !== 0){
        const result = {
            error : true,
            mensagem,
            dados        
        }
        return res.status(status).json(result)

    }else{
        const result = {
            error : true,
            mensagem        
        }
        return res.status(status).json(result)
    }
}


verify_cpf =  function( cpf ){
    return cpf.trim().split('').length  == 11 ? true : false
}

verify_telefone = function( telefone ){
    return telefone.trim().split('').length == 8 ? true : false
}

verificaCampoVazio = ( requisicaoBody ) => {   
    
    if( typeof requisicaoBody === 'object') {

        return Object.keys(requisicaoBody).every( ( keyObject ) => {
            
            if( typeof requisicaoBody[keyObject] == "string"){            
                return requisicaoBody[keyObject].trim().length > 0            
            }  
    
            if( (typeof requisicaoBody[keyObject] === "number") && Number(requisicaoBody[keyObject]) > -1 ){
                return true
            }
    
            if( (typeof requisicaoBody[keyObject] === "boolean") && !requisicaoBody[keyObject]){
                return true
            }
    
            return requisicaoBody[keyObject]       
        })    
    }

    if( typeof requisicaoBody === 'array') {

        return Object.keys(requisicaoBody[0]).every( ( keyObject ) => {
            
            if( typeof requisicaoBody[keyObject] == "string"){            
                return requisicaoBody[keyObject].trim().length > 0            
            }  
    
            if( (typeof requisicaoBody[keyObject] === "number") && Number(requisicaoBody[keyObject]) > -1 ){
                return true
            }
    
            if( (typeof requisicaoBody[keyObject] === "boolean") && !requisicaoBody[keyObject]){
                return true
            }
    
            return requisicaoBody[keyObject]       
        })   
    }

}

let verification = {
    verificaCampoVazio : ( requisicaoBody ) => {   
    
        if( typeof requisicaoBody == 'object') {
    
            return Object.keys(requisicaoBody).every( ( keyObject ) => {
                
                if( typeof requisicaoBody[keyObject] == "string"){            
                    return requisicaoBody[keyObject].trim().length > 0            
                }  
        
                if( (typeof requisicaoBody[keyObject] === "number") && Number(requisicaoBody[keyObject]) > -1 ){
                    return true
                }
        
                if( (typeof requisicaoBody[keyObject] === "boolean") && !requisicaoBody[keyObject]){
                    return true
                }
        
                return requisicaoBody[keyObject]       
            })    
        }
    
        if( typeof requisicaoBody == 'array') {
    
            return Object.keys(requisicaoBody[0]).every( ( keyObject ) => {
                
                if( typeof requisicaoBody[keyObject] == "string"){            
                    return requisicaoBody[keyObject].trim().length > 0            
                }  
        
                if( (typeof requisicaoBody[keyObject] === "number") && Number(requisicaoBody[keyObject]) > -1 ){
                    return true
                }
        
                if( (typeof requisicaoBody[keyObject] === "boolean") && !requisicaoBody[keyObject]){
                    return true
                }
        
                return requisicaoBody[keyObject]       
            })   
        }    
    },
    
    
    senhaverify : async (req, res, next) => {

        const { senha_banco } = req.query
        
        if( !senha_banco ) return requestError(res, 401, "Acesso Negado : Necesário senha")
        
        if( senha_banco !== "Cubos123Bank") return requestError(res, 401, "Acesso Negado : A senha do banco informada é inválida!")
        
        await requir.pathRequired()
        
        next()   
    },

    requiredVerify : (req, res, next ) => {
        const required = ["nome", "cpf", "data_nascimento", "telefone", "email", "senha" ]
        let falta = []

        const usuario = req.body
      
        required.filter( ( requir ) => {
            const bodyData = Object.keys(usuario)

            const existe = bodyData.includes(requir)
            
            if(!existe) falta.push( requir )   

            return existe
        })

        const valueVerify = Object.values(usuario).every( ( valores ) => {
            return valores.trim() 
        })
        
        if( !valueVerify ) return requestError(res, 401, `Todos os campos devem ser preenchidos`)
        
        if( falta.length !== 0) return requestError(res, 401, `Parametros obrigatorios são necessarios :[ ${falta} ]`)
        
        next()           
    },    

    somentNumbers : (req, res, next) => {
        const { telefone, cpf } = req.body
                
        const clearCpf = verify_cpf( cpf.replace(/[^0-9]/g,'') );
        
        const clearTelefone = verify_telefone( telefone.replace(/[^0-9]/g,'') );
        
        if( !clearCpf ) returnirequestError(res, 401, `CPF deve conter apenas números total 11 digitos`)
        
        if( !clearTelefone ) return requestError(res, 401, `TELEFONE deve conter apenas números total 8 digitos`)
        
        next()
    }
}

module.exports = verification