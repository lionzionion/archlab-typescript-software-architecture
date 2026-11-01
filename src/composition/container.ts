import {resolve} from 'node:path';
import {Servico,type ServicoDTO} from '../domain/Servico.js';
import type {Repository} from '../ports/Repository.js';
import {MemoryRepository} from '../infrastructure/repositories/MemoryRepository.js';
import {JsonServicoRepository} from '../infrastructure/repositories/JsonServicoRepository.js';
import {OllamaLangChain} from '../infrastructure/ai/OllamaLangChain.js';
import {ServicosUseCases} from '../application/use-cases/Servicos.js';
export type Armazenamento='memoria'|'arquivo';
export const SEED:ServicoDTO[]=[
 {id:'OB-101',nome:'Escavação e regularização',tipo:'Terraplenagem',quantidade:420,unidade:'m³',precoUnitario:48,progresso:72,prioridade:true},
 {id:'OB-102',nome:'Instalação de drenagem DN600',tipo:'Drenagem',quantidade:180,unidade:'m',precoUnitario:290,progresso:46,prioridade:true},
 {id:'OB-103',nome:'Base granular compactada',tipo:'Pavimentação',quantidade:1050,unidade:'m²',precoUnitario:67,progresso:100,prioridade:false},
 {id:'OB-104',nome:'Execução de muro de contenção',tipo:'Estruturas',quantidade:36,unidade:'m³',precoUnitario:1550,progresso:24,prioridade:false},
 {id:'OB-105',nome:'Revestimento asfáltico',tipo:'Pavimentação',quantidade:1350,unidade:'m²',precoUnitario:82,progresso:0,prioridade:false}
];
/** Composition root: ÚNICO local que conhece implementações concretas. */
export class Container {
  private memoria=new MemoryRepository<Servico>();
  private arquivo=new JsonServicoRepository(resolve(process.cwd(),'data','servicos.json'));
  private backend:Armazenamento='memoria';
  readonly ia=new OllamaLangChain();
  constructor(private readonly customArquivo?:Repository<Servico>){}
  async iniciar(){await this.memoria.substituirTodos(SEED.map(x=>Servico.fromJSON(x)));const arq=this.customArquivo||this.arquivo;if((await arq.listar()).length===0)await arq.substituirTodos(SEED.map(x=>Servico.fromJSON(x)));}
  alterarBackend(n:Armazenamento){this.backend=n;}
  get armazenamento(){return this.backend;}
  get casosDeUso(){return new ServicosUseCases(this.backend==='memoria'?this.memoria:(this.customArquivo||this.arquivo));}
  async restaurar(){const repo=this.backend==='memoria'?this.memoria:(this.customArquivo||this.arquivo);await repo.substituirTodos(SEED.map(x=>Servico.fromJSON(x)));}
}
