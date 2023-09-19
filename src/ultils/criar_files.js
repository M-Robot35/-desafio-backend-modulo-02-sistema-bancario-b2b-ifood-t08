const fsPromisses = require('fs/promises');   
const fs = require('fs')
const path = require('path');
const bankAccout = require('../model/bancodedados');


const files = {
    folder : "dataBase",
    file : "dados.json",
    caminhoArquivo : path.join(__dirname, '../', "dataBase", "dados.json"), 
     
    pathRequired : async function(){

        const pathFolderFile = path.join(__dirname, '../', this.folder )
        const pathFileJson = path.join(__dirname, '../', this.folder, this.file )
        
        const folder = fs.existsSync( pathFolderFile)    
        const file = fs.existsSync( pathFileJson)
         
        if( !folder ){
            await fs.mkdir(pathFolderFile,
                { recursive: true }, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('Directory created successfully!');
                });
        }   
            
        if( !file ){   
            const jsonData =  JSON.stringify( bankAccout, null, 4 )                
            
            await fsPromisses.writeFile( pathFileJson , jsonData ), (err) => {
                if (err) throw new Error("O Banco de Dados não foi Criado");                    
                
                console.log('O arquivo foi criado!');
            };                               
        } 
    },        

    loadFile : async function(){
        try{
            const arquivo = await fsPromisses.readFile( this.caminhoArquivo)            
            const arquivoString = await arquivo.toString()        

            return arquivoString  

        }catch( err ){
            throw new Error("O Arquivo não pode ser lido")
        } 
    },
    
    saveFile : async function( data ){
        
        const dadosStringfy = JSON.stringify( data, null, 4 )
        
        await fsPromisses.writeFile(this.caminhoArquivo, dadosStringfy )        
    }, 
        
    contaNova : async function( conta ){
        
        if(!conta) return  {error : true, msg : "contaNova() : Error na entrada de dados"}
        
        const dadosContas = JSON.parse( await this.loadFile() )
        
        const todasContas = dadosContas["contas"] 
        
        const novoUsuario = [ conta ]
        
        dadosContas['contas'] = [...todasContas, ...novoUsuario]
        
        this.saveFile( dadosContas )
        
        return { error : false, msg : "success"}
    }
}      

files.pathRequired() 

module.exports = files