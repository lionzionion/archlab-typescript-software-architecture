# Solução de problemas — Windows, Node.js e Ollama

## `ENOENT: package.json` ou `Missing script: start`
Você está no diretório errado. No PowerShell, execute `dir package.json`. Se o arquivo não aparecer, entre na subpasta que o contém com `cd .\\nome-da-pasta`.

## `TS2688 Cannot find type definition file for 'node'`
Execute `npm install` **dentro da pasta do package.json** e em seguida `npm run build`. O projeto declara `@types/node` como dependência de desenvolvimento.

## `{"erro":"Caminho inválido."}` na página inicial
Uma versão anterior do projeto tinha comparação de caminhos incompatível com Windows. O código deste repositório usa `relative()` e `sep` para validar o caminho de forma multiplataforma. Atualize o repositório e compile novamente.

## O BAT mostra `Aplicativo não encontrado`
A versão atual não tenta abrir o navegador. Execute `npm start` e abra manualmente `http://localhost:5500` no Chrome ou outro navegador.

## Porta `5500` em uso
Já há outro processo na mesma porta. Feche a janela do servidor anterior com `Ctrl+C`. Alternativamente, defina outra porta:
```powershell
$env:PORT=5501
npm start
```

## `ollama` não é reconhecido
Instale o Ollama pelo site oficial, feche e reabra o terminal: https://ollama.com/download.

## `LangChain não instalado`
Execute `npm install` na pasta correta, depois `npm run build` e `npm start`. Se usar uma cópia diferente do ZIP, instale as dependências **nessa cópia**.

## `Ollama não respondeu`
Abra o Ollama e rode:
```powershell
ollama pull llama3.2
ollama run llama3.2
```
Saia do chat com `/bye` e, no ArchLab, execute `npm run check:ai`. O serviço normalmente fica em `http://127.0.0.1:11434`.

## Posso usar offline?
Sim, **depois** de instalar Node.js, dependências npm, Ollama e baixar o modelo. O navegador deve acessar `localhost`; abrir o HTML diretamente por `file://` não inicia a API. Fontes externas de interface podem usar fallback local, mas a inferência do modelo não depende da internet.

## A IA deu uma resposta errada
Os modelos podem gerar informações falsas. Confira sempre os valores com o painel e compare conceitos com as referências do curso. Não use este projeto para cálculos reais de engenharia sem validação independente.
