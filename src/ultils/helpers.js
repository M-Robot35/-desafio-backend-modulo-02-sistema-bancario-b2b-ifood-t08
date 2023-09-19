const  { format } = require('date-fns')

const help = {
    
    captalize : ( nome )=>{
        let nomeCaptalizado = ''
        
        nome.split(' ').forEach(myNome  => {
            
            if( myNome.length < 3) return nomeCaptalizado+=` ${myNome}`                
            
            const modify = myNome[0].toUpperCase() + myNome.slice(1).toLocaleLowerCase()
            nomeCaptalizado+=` ${modify}`
            
        });
        return nomeCaptalizado.trim()        
    },

    real :( valor ) => {
        return ( Number( valor ) / 100 ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    centavos : ( valor ) => {
        return Number( valor ) * 100
    },
    
    dateTimeCurrenci : function(){
        return format(new Date(), "yyyy-MM-dd HH:mm:ss");
    },
    
    requestSuccess : (res, status, mensagem = '', dados) => {
        if( !mensagem && !dados ){            
            return res.status(status).end()
        }
        const result = {
            mensagem,
            dados
        }
        return res.status(status).json(result)
    },

    requestError : (res, status, mensagem, dados = []) => {
        
        if( !mensagem && !dados ){
            return res.status(status).end()
        }
        
        if( dados.length !== 0){
            const result = {
                mensagem,
                dados        
            }
            return res.status(status).json(result)
        }
    
        const result = {
            mensagem        
        }
        return res.status(status).json(result)
    }
}

module.exports = help 