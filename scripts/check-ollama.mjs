const endpoint = 'http://127.0.0.1:11434/api/tags';
const esperado = process.env.OLLAMA_MODEL || 'llama3.2';
try {
  const resposta = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const dados = await resposta.json();
  const modelos = (dados.models || []).map((m) => m.name || m.model).filter(Boolean);
  const encontrado = modelos.some((n) => n === esperado || n.startsWith(`${esperado}:`));
  console.log('Ollama local: OK');
  console.log('Modelos encontrados:', modelos.join(', ') || '(nenhum)');
  if (!encontrado) {
    console.error(`Modelo ${esperado} não encontrado. Execute: ollama pull ${esperado}`);
    process.exitCode = 1;
  } else {
    console.log(`Modelo ${esperado}: OK. Abra a aba IA local do ArchLab.`);
  }
} catch {
  console.error('Não foi possível acessar o Ollama em 127.0.0.1:11434.');
  console.error('Instale e inicie o Ollama: https://ollama.com/download');
  process.exitCode = 1;
}
