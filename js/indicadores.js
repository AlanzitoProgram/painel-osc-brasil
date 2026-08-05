import { calcularVariacaoPercentual, formatarInteiro, formatarMoedaBilhoes, media, somar } from "./utilitarios.js";

const criarCard = ({ titulo, valor, nota }) => {
  return `
    <article class="card indicator-card">
      <h3>${titulo}</h3>
      <span class="indicator-value">${valor}</span>
      <span class="indicator-note">${nota}</span>
    </article>
  `;
};

export const renderizarIndicadores = (dados, elemento) => {
  if (!elemento) {
    return;
  }

  if (!dados.length) {
    elemento.innerHTML = criarCard({
      titulo: "Sem dados",
      valor: "-",
      nota: "Ajuste os filtros para exibir resultados."
    });
    return;
  }

  const ordenados = [...dados].sort((a, b) => a.ano - b.ano);
  const total = somar(ordenados, "valor_milhoes");
  const mediaAnual = media(ordenados, "valor_milhoes");
  const maiorAno = ordenados.reduce((maior, item) => item.valor_milhoes > maior.valor_milhoes ? item : maior, ordenados[0]);
  const mediaOscs = Math.round(media(ordenados, "oscs_beneficiadas"));
  const primeiro = ordenados[0];
  const ultimo = ordenados[ordenados.length - 1];
  const variacao = calcularVariacaoPercentual(primeiro.valor_milhoes, ultimo.valor_milhoes);
  const sinal = variacao >= 0 ? "+" : "";

  elemento.innerHTML = [
    criarCard({
      titulo: "Total transferido",
      valor: formatarMoedaBilhoes(total),
      nota: `${ordenados.length} ano(s) no recorte selecionado`
    }),
    criarCard({
      titulo: "Média anual",
      valor: formatarMoedaBilhoes(mediaAnual),
      nota: "Indicador recomendado para comparar períodos"
    }),
    criarCard({
      titulo: "Maior valor anual",
      valor: formatarMoedaBilhoes(maiorAno.valor_milhoes),
      nota: `${maiorAno.ano}, ${maiorAno.periodo_governamental}`
    }),
    criarCard({
      titulo: "Média de OSCs",
      valor: formatarInteiro(mediaOscs),
      nota: `${sinal}${variacao.toFixed(1).replace(".", ",")}% entre ${primeiro.ano} e ${ultimo.ano}`
    })
  ].join("");
};
