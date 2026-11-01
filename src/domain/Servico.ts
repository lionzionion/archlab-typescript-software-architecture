/** AULA 01: entidade rica e encapsulada. O domínio não conhece HTTP, arquivos ou banco de dados. */
export type TipoServico = 'Terraplenagem' | 'Drenagem' | 'Pavimentação' | 'Estruturas';
export type Situacao = 'Pendente' | 'Em execução' | 'Concluído';
export type ServicoDTO = {id:string; nome:string; tipo:TipoServico; quantidade:number; unidade:string; precoUnitario:number; progresso:number; prioridade:boolean};
const TIPOS: TipoServico[] = ['Terraplenagem', 'Drenagem', 'Pavimentação', 'Estruturas'];
const checkNumero = (v:number,rotulo:string) => { if (!Number.isFinite(v) || v<0) throw new Error(`${rotulo} deve ser um número não negativo.`); };
export class Servico {
  readonly id:string; readonly nome:string; readonly tipo:TipoServico;
  readonly quantidade:number; readonly unidade:string; readonly precoUnitario:number;
  #progresso:number;
  constructor(data:ServicoDTO) {
    if (!data.id || !data.nome?.trim() || !data.unidade?.trim()) throw new Error('ID, nome e unidade são obrigatórios.');
    if (!TIPOS.includes(data.tipo)) throw new Error('Tipo de serviço inválido.');
    checkNumero(data.quantidade,'Quantidade'); checkNumero(data.precoUnitario,'Preço unitário');
    if (!Number.isFinite(data.progresso) || data.progresso<0 || data.progresso>100) throw new Error('Progresso deve ficar entre 0 e 100%.');
    this.id=data.id;this.nome=data.nome.trim();this.tipo=data.tipo;this.quantidade=data.quantidade;
    this.unidade=data.unidade;this.precoUnitario=data.precoUnitario;this.#progresso=data.progresso;
  }
  get progresso(){return this.#progresso;}
  get valorContratado(){return this.quantidade*this.precoUnitario;}
  get valorMedido(){return this.valorContratado*this.#progresso/100;}
  get situacao():Situacao{return this.#progresso===100?'Concluído':this.#progresso===0?'Pendente':'Em execução';}
  get prioridade(){return false;}
  get badge(){return 'Regular';}
  atualizarProgresso(n:number){if(!Number.isFinite(n)||n<0||n>100)throw new Error('Progresso deve ficar entre 0 e 100%.'); this.#progresso=n;}
  toJSON():ServicoDTO{return{id:this.id,nome:this.nome,tipo:this.tipo,quantidade:this.quantidade,unidade:this.unidade,precoUnitario:this.precoUnitario,progresso:this.progresso,prioridade:this.prioridade};}
  static fromJSON(data:ServicoDTO):Servico {return data.prioridade?new ServicoPrioritario(data):new Servico(data);}
}
/** Herança e polimorfismo, sem duplicar as regras centrais de cálculo. */
export class ServicoPrioritario extends Servico {override get prioridade(){return true;} override get badge(){return 'Prioritário';}}
