import {randomUUID} from 'node:crypto';
import {Servico,ServicoPrioritario,type TipoServico} from '../../domain/Servico.js';
import type {Repository} from '../../ports/Repository.js';
/** AULA 07: casos de uso sem dependências de HTTP / disco / frameworks. */
export class ServicosUseCases {
  constructor(private readonly repo:Repository<Servico>){} // AULA 03: injeção via construtor
  listar(){return this.repo.listar();}
  async criar(d:{nome:string;tipo:TipoServico;quantidade:number;unidade:string;precoUnitario:number;prioridade:boolean}){
    const dto={...d,id:randomUUID(),progresso:0};
    const s=d.prioridade?new ServicoPrioritario(dto):new Servico(dto);
    await this.repo.salvar(s);return s;
  }
  async medir(id:string,progresso:number){
    const s=await this.repo.obter(id);if(!s)throw new Error('Serviço não encontrado.');
    s.atualizarProgresso(progresso);await this.repo.salvar(s);return s;
  }
  async excluir(id:string){return this.repo.excluir(id);}
  async resumo(){
    const lista=await this.repo.listar();const total=lista.reduce((v,s)=>v+s.valorContratado,0);
    const medido=lista.reduce((v,s)=>v+s.valorMedido,0);
    return {total,medido,saldo:total-medido,progresso:total?medido/total*100:0,servicos:lista.length,concluidos:lista.filter(s=>s.progresso===100).length,prioritarios:lista.filter(s=>s.prioridade).length};
  }
}
