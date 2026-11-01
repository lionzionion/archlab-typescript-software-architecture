import type {Assistente} from '../../ports/Assistente.js';
/** AULA 08: integração real, opcional, com LangChain + Ollama local. */
export class OllamaLangChain implements Assistente {
  constructor(private readonly modelo=process.env.OLLAMA_MODEL||'llama3.2'){}
  async analisar(contexto:string,pergunta:string){
    let ChatOllama:any,ChatPromptTemplate:any;
    try {
      const pacoteOllama='@langchain/ollama';
      const pacotePrompts='@langchain/core/prompts';
      ({ChatOllama}=await import(pacoteOllama));
      ({ChatPromptTemplate}=await import(pacotePrompts));
    } catch {throw new Error('LangChain não instalado. Execute npm install e instale o Ollama local.');}
    const model=new ChatOllama({model:this.modelo,baseUrl:'http://127.0.0.1:11434',temperature:0});
    const prompt=ChatPromptTemplate.fromMessages([
      ['system','Você é um assistente didático de engenharia. Responda em português, de modo breve. Os dados são fictícios, não representam uma obra real. Não invente informação.'],
      ['human','Contexto do sistema:\n{contexto}\n\nPergunta:\n{pergunta}']
    ]);
    try{const mensagens=await prompt.formatMessages({contexto,pergunta});const resposta=await model.invoke(mensagens);return typeof resposta.content==='string'?resposta.content:JSON.stringify(resposta.content);}
    catch {throw new Error(`O Ollama não respondeu. Confira se está aberto e se o modelo ${this.modelo} foi instalado (ollama pull ${this.modelo}).`);}
  }
}
