import { baixarArquivo, formatarInteiro, formatarMoedaBilhoes, normalizarTexto } from "./utilitarios.js";

let linhasAtuais = [];
let linhasVisiveis = [];
let campoOrdenacao = "ano";
let direcao = "asc";

const selecionarTabela = () => document.querySelector("[data-history-table]");
const selecionarBusca = () => document.querySelector("[data-table-search]");
const selecionarStatus = () => document.querySelector("[data-table-status]");

const comparar = (a, b, campo) => {
  const valorA = a[campo];
  const valorB = b[campo];

  if (typeof valorA === "number" && typeof valorB === "number") {
    return valorA - valorB;
  }

  return String(valorA).localeCompare(String(valorB), "pt-BR");
};

const filtrarBusca = (linhas) => {
  const busca = selecionarBusca();
  const termo = normalizarTexto(busca?.value || "");

  if (!termo) {
    return linhas;
  }

  return linhas.filter((item) => {
    const texto = [
      item.ano,
      item.periodo_governamental,
      item.grupo_comparacao,
      item.valor_milhoes,
      item.oscs_beneficiadas
    ].join(" ");

    return normalizarTexto(texto).includes(termo);
  });
};

const gerarTextoTabela = (linhas) => {
  const cabecalho = ["Ano", "Governo predominante", "Valor em milhões", "OSCs beneficiadas", "Grupo"];
  const corpo = linhas.map((item) => [
    item.ano,
    item.periodo_governamental,
    item.valor_milhoes,
    item.oscs_beneficiadas,
    item.grupo_comparacao
  ]);

  return [cabecalho, ...corpo]
    .map((linha) => linha.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(","))
    .join("\n");
};

const renderizar = () => {
  const tabela = selecionarTabela();
  const status = selecionarStatus();

  if (!tabela) {
    return;
  }

  linhasVisiveis = filtrarBusca(linhasAtuais)
    .sort((a, b) => {
      const resultado = comparar(a, b, campoOrdenacao);
      return direcao === "asc" ? resultado : -resultado;
    });

  const tbody = tabela.querySelector("tbody");
  tbody.innerHTML = linhasVisiveis.map((item) => `
    <tr>
      <td>${item.ano}</td>
      <td>${item.periodo_governamental}</td>
      <td data-align="right">${formatarMoedaBilhoes(item.valor_milhoes)}</td>
      <td data-align="right">${formatarInteiro(item.oscs_beneficiadas)}</td>
      <td><span class="badge">${item.grupo_comparacao}</span></td>
    </tr>
  `).join("");

  if (status) {
    status.textContent = `${linhasVisiveis.length} registro(s) exibido(s).`;
  }
};

export const atualizarTabela = (dados) => {
  linhasAtuais = [...dados];
  renderizar();
};

export const iniciarTabela = () => {
  const tabela = selecionarTabela();
  const busca = selecionarBusca();
  const copiar = document.querySelector("[data-copy-table]");
  const exportar = document.querySelector("[data-export-csv]");
  const status = selecionarStatus();

  tabela?.querySelectorAll("[data-sort]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const novoCampo = botao.dataset.sort;

      if (campoOrdenacao === novoCampo) {
        direcao = direcao === "asc" ? "desc" : "asc";
      } else {
        campoOrdenacao = novoCampo;
        direcao = "asc";
      }

      renderizar();
    });
  });

  busca?.addEventListener("input", renderizar);

  copiar?.addEventListener("click", async () => {
    const texto = gerarTextoTabela(linhasVisiveis);

    try {
      await navigator.clipboard.writeText(texto);
      if (status) {
        status.textContent = "Tabela copiada para a área de transferência.";
      }
    } catch {
      if (status) {
        status.textContent = "Não foi possível copiar automaticamente. Use a exportação CSV.";
      }
    }
  });

  exportar?.addEventListener("click", () => {
    baixarArquivo("painel-osc-brasil-serie-historica.csv", gerarTextoTabela(linhasVisiveis));
  });
};
