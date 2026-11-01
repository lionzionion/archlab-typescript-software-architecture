/** Porta opcional: o caso de uso não conhece LangChain nem Ollama. */
export interface Assistente {analisar(contexto:string,pergunta:string):Promise<string>}
