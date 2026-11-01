/** AULAS 02/05: interface genérica e porta de saída (contrato, não implementação). */
export interface Entity {id:string}
export interface Repository<T extends Entity> {
  listar():Promise<T[]>;
  obter(id:string):Promise<T|undefined>;
  salvar(entidade:T):Promise<void>;
  excluir(id:string):Promise<boolean>;
  substituirTodos(entidades:T[]):Promise<void>;
}
