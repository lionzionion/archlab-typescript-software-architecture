# Guia prático — 8 aulas de Arquitetura de Software com TypeScript

Este guia transforma os conceitos das oito apostilas em desafios usando **o mesmo projeto**. Não são transcrições dos PDFs; são exercícios próprios. Use sempre arquivos da pasta `src/`, edite-os no VS Code, execute `npm test` após cada alteração e procure explicar o que mudou.

## Aula 01 — POO
**Arquivos:** `src/domain/Servico.ts`.
- Observe classe, construtor, atributos e propriedade privada `#progresso`.
- Abra os getters `valorContratado` e `valorMedido`.
- Compare `Servico` com `ServicoPrioritario`: herança e polimorfismo.
- **Desafio:** tente registrar uma medição de 110%. Por que a entidade rejeita?
- **Você aprendeu quando:** consegue explicar por que a regra está na entidade e não no botão da interface.

## Aula 02 — Interfaces e Generics
**Arquivos:** `src/ports/Repository.ts`, `src/infrastructure/repositories/MemoryRepository.ts`.
- Estude `Repository<T extends Entity>`.
- Identifique o contrato `listar`, `obter`, `salvar`, `excluir`.
- **Desafio:** explique por que `MemoryRepository<Servico>` recebe `Servico` como tipo.
- **Você aprendeu quando:** consegue explicar o que um repositório deve fazer sem citar como ele armazena.

## Aula 03 — IoC e Injeção de Dependência
**Arquivos:** `src/composition/container.ts`, `src/application/use-cases/Servicos.ts`.
- Encontre o construtor do caso de uso que recebe `Repository<Servico>`.
- Troque na interface **Memória ↔ Arquivo JSON**.
- **Desafio:** encontre o único lugar que decide qual implementação concreta é usada.
- **Você aprendeu quando:** consegue trocar o armazenamento sem editar o cálculo de avanço físico.

## Aula 04 — SOLID
**Arquivos:** `src/domain/`, `src/application/`, `src/infrastructure/`.
- **S:** cada módulo tem responsabilidade principal.
- **O:** comportamentos podem ser estendidos por novas implementações.
- **L:** `ServicoPrioritario` é utilizável como `Servico`.
- **I:** contratos são separados por finalidade.
- **D:** casos de uso dependem de uma interface, não de um armazenamento concreto.
- **Desafio:** adicione uma nova forma de persistir os dados sem alterar `ServicosUseCases`.

## Aula 05 — Hexagonal
**Arquivos:** `src/ports/` e `src/infrastructure/`.
- Identifique a entrada (HTTP), as portas (interfaces) e as saídas (memória, JSON, Ollama).
- **Desafio:** simule uma falha na gravação em disco. Qual camada deve tratar a falha sem alterar o domínio?
- **Você aprendeu quando:** distingue claramente porta de adaptador.

## Aula 06 — Onion
**Arquivos:** `src/domain/`, `src/application/` e `src/infrastructure/`.
- Observe o domínio no centro: nenhuma referência ao Express, navegador ou arquivos.
- **Desafio:** desenhe as camadas no papel e marque as dependências que apontam para dentro.
- **Você aprendeu quando:** compreende por que infraestrutura não deve entrar no núcleo.

## Aula 07 — Clean Architecture
**Arquivos:** `src/domain/Servico.ts`, `src/application/use-cases/Servicos.ts`, `src/server.ts`.
- Distinga entidade, caso de uso, adaptador de entrada e infraestrutura.
- **Desafio:** siga o cadastro de um serviço desde `POST /api/servicos` até `repo.salvar`.
- **Você aprendeu quando:** descreve o fluxo de uma requisição sem misturar regras de negócio com detalhes HTTP.

## Aula 08 — TypeScript com IA local
**Arquivos:** `src/ports/Assistente.ts`, `src/infrastructure/ai/OllamaLangChain.ts`, `scripts/check-ollama.mjs`.
- Instale o Ollama e execute `ollama pull llama3.2`.
- Teste o modelo: `ollama run llama3.2`; saia com `/bye`.
- Execute `npm run check:ai`, `npm start` e abra a aba **IA local**.
- Pergunte: **"Qual serviço fictício apresenta menor avanço físico? Mostre os dados que justificam a resposta."**
- Confira a resposta contra o painel: **IA pode errar, mesmo funcionando localmente**.
- **Você aprendeu quando:** identifica a porta do assistente e a implementação externa e explica o papel do LangChain.

## Testes

```bash
npm install
npm run typecheck
npm test
npm start
```

**Critério de conclusão:** todos os testes passam, o painel funciona, você entende o fluxo de uma operação e consegue explicar como a IA é integrada sem acoplar suas regras de negócio ao Ollama.

**Próximo desafio para o portfólio:** crie um novo adaptador (por exemplo, SQLite), mantendo a mesma interface de repositório. Explique no README quais arquivos precisaram mudar e quais permaneceram intactos.
