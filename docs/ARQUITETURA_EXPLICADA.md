# Arquitetura do ArchLab — Entenda pelas decisões

## 1. O domínio é independente
`src/domain/Servico.ts` contém validação do avanço físico (0–100%), cálculo de valores e definição do estado do serviço. O domínio não sabe se os dados vêm de um navegador, arquivo JSON ou banco de dados.

## 2. As interfaces são contratos
`src/ports/Repository.ts` define operações comuns para qualquer armazenamento. `src/ports/Assistente.ts` descreve o que esperamos de um assistente, sem exigir que seja Ollama.

## 3. Casos de uso orquestram
`src/application/use-cases/Servicos.ts` executa cadastro, medição, exclusão e resumo. Recebe a dependência por construtor: `constructor(repo: Repository<Servico>)`.

## 4. Infraestrutura é substituível
`MemoryRepository.ts` mantém um Map em memória. `JsonServicoRepository.ts` grava um arquivo local. Ambos implementam o mesmo contrato. `OllamaLangChain.ts` é um adaptador opcional de IA.

## 5. Composition Root decide a implementação
`src/composition/container.ts` conecta os casos de uso às implementações concretas. É onde a dependência é injetada. Alterar a persistência não exige reescrever o cálculo de avanço da entidade.

## 6. Adaptador HTTP serve a interface
`src/server.ts` traduz requisições em chamadas dos casos de uso. Exemplo: `POST /api/servicos` recebe dados, invoca `criar` e retorna o resultado. O servidor foi preparado para caminhos Windows e Linux.

## Fluxo simplificado

```text
Navegador → HTTP → Casos de uso → Servico (domínio)
                       │
                       ▼
                Repository<Servico>
                   │        │
              Memória      JSON

IA local: HTTP → Assistente (porta) → OllamaLangChain → Ollama
```

## Comparando as arquiteturas

- **Hexagonal:** foca nas portas e adaptadores que isolam o centro do mundo externo.
- **Onion:** enfatiza camadas concêntricas e dependências voltadas ao núcleo.
- **Clean:** organiza entidades, casos de uso, adaptadores e detalhes externos com a regra de dependência.

São enfoques relacionados; o ArchLab não finge ter três implementações arquiteturais separadas. Também não é um aplicativo corporativo com autenticação, autorização ou banco transacional. É um laboratório para experimentar o desacoplamento.

## Experimento que comprova o design

Abra o painel, altere uma medição e observe o novo valor. Depois troque de Memória para Arquivo JSON, faça nova medição e reinicie o servidor. O armazenamento JSON guarda dados entre execuções, enquanto o de memória é reinicializado. **A entidade que valida e calcula continua a mesma.**

Uma ressalva: a demonstração alterna entre conjuntos de dados **distintos**. Trocar o adaptador não transfere automaticamente alterações feitas no outro armazenamento.
