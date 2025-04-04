import {fastify} from 'fastify'
const server = fastify()
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

server.get('/', function(req, res){
    return(__dirname + '/index.html');
})
server.get('/login', () =>{
    
})
server.get('/perfil', () =>{
    
})
server.get('/sobre-nos', () =>{
    
})
server.get('/contato', () =>{
    
})
/*server.get('/chat', () =>{
    
})*/
server.listen({port: 7282})