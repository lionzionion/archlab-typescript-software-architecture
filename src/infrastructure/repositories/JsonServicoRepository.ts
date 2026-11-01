import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {Servico,type ServicoDTO} from '../../domain/Servico.js';
import type {Repository} from '../../ports/Repository.js';
/** Adaptador de infraestrutura: substitui memória sem mudar nenhum caso de uso. */
export class JsonServicoRepository implements Repository<Servico>{
  constructor(private readonly caminho:string){}
  private async ler():Promise<Servico[]>{
    try {const str=await readFile(this.caminho,'utf8');return (JSON.parse(str) as ServicoDTO[]).map(d=>Servico.fromJSON(d));}
    catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}
  }
  async listar(){return this.ler();}
  async obter(id:string){return(await this.ler()).find(s=>s.id===id);}
  async salvar(s:Servico){const lista=await this.ler();const idx=lista.findIndex(x=>x.id===s.id);if(idx<0)lista.push(s);else lista[idx]=s;await this.substituirTodos(lista);}
  async excluir(id:string){const lista=await this.ler();const filtrada=lista.filter(s=>s.id!==id);if(filtrada.length===lista.length)return false;await this.substituirTodos(filtrada);return true;}
  async substituirTodos(lista:Servico[]){await mkdir(dirname(this.caminho),{recursive:true});await writeFile(this.caminho,JSON.stringify(lista.map(x=>x.toJSON()),null,2),'utf8');}
}
