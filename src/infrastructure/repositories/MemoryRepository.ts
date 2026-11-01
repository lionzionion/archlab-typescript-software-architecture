import type {Entity,Repository} from '../../ports/Repository.js';
/** Repositório genérico em memória: AULA 02. */
export class MemoryRepository<T extends Entity> implements Repository<T>{
  private readonly dados=new Map<string,T>();
  async listar(){return [...this.dados.values()];}
  async obter(id:string){return this.dados.get(id);}
  async salvar(e:T){this.dados.set(e.id,e);}
  async excluir(id:string){return this.dados.delete(id);}
  async substituirTodos(v:T[]){this.dados.clear();for(const e of v)this.dados.set(e.id,e);}
}
