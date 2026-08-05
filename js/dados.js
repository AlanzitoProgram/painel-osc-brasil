const caminhos = {
  transferencias: "data/transferencias-anuais.json",
  governos: "data/governos.json",
  areas: "data/areas-2024.json",
  fontes: "data/fontes.json"
};

const carregarJson = async (caminho) => {
  const resposta = await fetch(caminho);

  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar ${caminho}`);
  }

  return resposta.json();
};

export const carregarDados = async () => {
  const [transferencias, governos, areas, fontes] = await Promise.all([
    carregarJson(caminhos.transferencias),
    carregarJson(caminhos.governos),
    carregarJson(caminhos.areas),
    carregarJson(caminhos.fontes)
  ]);

  return {
    transferencias,
    governos,
    areas,
    fontes
  };
};
