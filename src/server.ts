import {createServer,type IncomingMessage,type ServerResponse} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Container,type Armazenamento} from './composition/container.js';
import type {TipoServico} from './domain/Servico.js';
const raiz=resolve(fileURLToPath(new URL('../public/',import.meta.url)));
const container=new Container();
const porta=Number(process.env.PORT||5500);
const contentTypes:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.ico':'image/x-icon'};
const send=(res:ServerResponse,status:number,body:unknown)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
async function json(req:IncomingMessage):Promise<Record<string,unknown>>{let body='';for await(const chunk of req){body+=chunk.toString();if(body.length>15000)throw new Error('Requisição muito grande.');}try{return body?JSON.parse(body):{};}catch{throw new Error('JSON inválido.');}}
function trace(...etapas:string[]){return ['HTTP → Adaptador de entrada',...etapas,'Repositório → Porta de saída','Infraestrutura → Adaptador concreto'];}
async function api(req:IncomingMessage,res:ServerResponse,path:string){
  const method=req.method||'GET';const casos=container.casosDeUso;
  if(path==='/api/health'&&method==='GET')return send(res,200,{status:'ok',armazenamento:container.armazenamento,stack:'Node.js + TypeScript'});
  if(path==='/api/dashboard'&&method==='GET'){
    const [dados,resumo]=await Promise.all([casos.listar(),casos.resumo()]);
    return send(res,200,{dados:dados.map(x=>({...x.toJSON(),valorContratado:x.valorContratado,valorMedido:x.valorMedido,situacao:x.situacao,badge:x.badge})),resumo,armazenamento:container.armazenamento,fluxo:trace('Controller → ServiçoController','Use Case → ListarServicos','Domain → Servico')});
  }
  if(path==='/api/servicos'&&method==='POST'){
    const body=await json(req);
    const salvo=await casos.criar({nome:String(body.nome||''),tipo:String(body.tipo||'') as TipoServico,quantidade:Number(body.quantidade),unidade:String(body.unidade||''),precoUnitario:Number(body.precoUnitario),prioridade:body.prioridade===true});
    return send(res,201,{ok:true,id:salvo.id,fluxo:trace('Controller → CriarServico','Use Case → Validar e salvar','Domain → Servico')});
  }
  const match=path.match(/^\/api\/servicos\/([^/]+)$/);
  if(match&&match[1]&&method==='PATCH'){
    const body=await json(req);const s=await casos.medir(match[1],Number(body.progresso));
    return send(res,200,{ok:true,id:s.id,progresso:s.progresso,fluxo:trace('Controller → MedirServico','Use Case → AtualizarProgresso','Domain → Encapsulamento e validação')});
  }
  if(match&&match[1]&&method==='DELETE'){
    if(!(await casos.excluir(match[1])))return send(res,404,{erro:'Serviço não encontrado.'});
    return send(res,200,{ok:true,fluxo:trace('Controller → ExcluirServico','Use Case → Excluir','Domain → Entidade identificada')});
  }
  if(path==='/api/config'&&method==='POST'){
    const b=await json(req);if(b.armazenamento!=='memoria'&&b.armazenamento!=='arquivo')throw new Error('Armazenamento inválido.');
    container.alterarBackend(b.armazenamento as Armazenamento);
    return send(res,200,{ok:true,armazenamento:container.armazenamento,fluxo:['Composition Root → Container','Dependency Injection → Repositório selecionado','Use Cases → Sem alteração de código']});
  }
  if(path==='/api/reset'&&method==='POST'){await container.restaurar();return send(res,200,{ok:true,fluxo:['Use Case → Restaurar demonstração','Repository → Substituir todos']});}
  if(path==='/api/ia'&&method==='POST'){
    const b=await json(req);const pergunta=String(b.pergunta||'').trim().slice(0,350);
    if(!pergunta)throw new Error('Escreva uma pergunta para o assistente.');
    const lista=await casos.listar();const resumo=await casos.resumo();
    const contexto=JSON.stringify({resumo,servicos:lista.map(s=>({nome:s.nome,tipo:s.tipo,progresso:s.progresso,valorContratado:s.valorContratado}))});
    try{const resposta=await container.ia.analisar(contexto,pergunta);return send(res,200,{resposta,modelo:process.env.OLLAMA_MODEL||'llama3.2',provedor:'Ollama local via LangChain'});}
    catch(e){return send(res,503,{erro:(e as Error).message});}
  }
  return send(res,404,{erro:'Rota não encontrada.'});
}
async function serve(res:ServerResponse,p:string){
  const pathname=p==='/'?'/index.html':p;
  const arquivo=resolve(raiz,'.'+pathname);
  const caminhoRelativo=relative(raiz,arquivo);
  if(caminhoRelativo==='..'||caminhoRelativo.startsWith('..'+sep)||isAbsolute(caminhoRelativo))return send(res,403,{erro:'Caminho inválido.'});
  try{const dados=await readFile(arquivo);res.writeHead(200,{'Content-Type':contentTypes[extname(arquivo)]||'application/octet-stream'});res.end(dados);}catch{return send(res,404,{erro:'Arquivo não encontrado.'});}
}
await container.iniciar();
const server=createServer(async(req,res)=>{
  try{const url=new URL(req.url||'/',`http://localhost:${porta}`);if(url.pathname.startsWith('/api/'))await api(req,res,url.pathname);else if(req.method==='GET')await serve(res,url.pathname);else send(res,405,{erro:'Método não permitido.'});}
  catch(e){send(res,400,{erro:(e as Error).message});}
});
if(process.env.ARCHLAB_TEST!=='1')server.listen(porta,'127.0.0.1',()=>console.log(`\nARCHLAB online: http://localhost:${porta}\nArmazenamento padrão: memória | IA: Ollama opcional\n`));
export {server,container};
