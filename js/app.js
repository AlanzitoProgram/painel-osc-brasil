import { carregarDados } from "./dados.js";
import { aplicarFiltros, criarFiltros } from "./filtros.js";
import { renderizarGraficos } from "./graficos.js";
import { renderizarIndicadores } from "./indicadores.js";
import { atualizarTabela, iniciarTabela } from "./tabela.js";
import "./tema.js";

const estado = {
  dados: null,
  filtros: null,
  renderizacaoPronta: false
};

const obterDadosFiltrados = () => {
  const dadosAnuais = estado.dados.transferencias.dados;
  const periodos = estado.dados.governos.periodos;
  return aplicarFiltros(dadosAnuais, periodos, estado.filtros);
};

const atualizarPainel = () => {
  if (!estado.dados || !estado.filtros) {
    return;
  }

  const dadosFiltrados = obterDadosFiltrados();
  renderizarIndicadores(dadosFiltrados, document.querySelector("[data-indicator-cards]"));
  renderizarGraficos({
    transferencias: dadosFiltrados,
    governos: estado.dados.governos,
    areas: estado.dados.areas
  });
  atualizarTabela(dadosFiltrados);
  estado.renderizacaoPronta = true;
};

const mostrarErro = (erro) => {
  const destino = document.querySelector("[data-indicator-cards]");

  if (destino) {
    destino.innerHTML = `
      <article class="card indicator-card">
        <h3>Erro ao carregar dados</h3>
        <span class="indicator-value">Dados indisponíveis</span>
        <span class="indicator-note">${erro.message}</span>
      </article>
    `;
  }
};

const iniciar = async () => {
  iniciarTabela();

  try {
    estado.dados = await carregarDados();
    estado.filtros = criarFiltros({
      transferencias: estado.dados.transferencias.dados,
      governos: estado.dados.governos,
      aoAlterar: (novosFiltros) => {
        estado.filtros = novosFiltros;
        atualizarPainel();
      }
    });
    atualizarPainel();
  } catch (erro) {
    mostrarErro(erro);
  }
};

window.addEventListener("painel:tema-alterado", () => {
  if (estado.renderizacaoPronta) {
    atualizarPainel();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
