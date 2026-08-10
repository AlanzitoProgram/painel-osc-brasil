import { formatarInteiro, formatarMoedaBilhoes, formatarMilhoes, media, obterCoresDoTema, somar } from "./utilitarios.js";

const instancias = {};
const ouvintesRedimensionamento = {};

const redimensionarGrafico = (instancia) => {
  if (!instancia?.canvas?.isConnected) {
    return;
  }

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => {
      if (instancia?.canvas?.isConnected) {
        instancia.resize();
      }
    });
    return;
  }

  instancia.resize();
};

const destruir = (id) => {
  const instancia = instancias[id];

  if (instancia) {
    if (ouvintesRedimensionamento[id]) {
      window.removeEventListener("resize", ouvintesRedimensionamento[id]);
      delete ouvintesRedimensionamento[id];
    }

    instancia.destroy();
    delete instancias[id];
  }
};

const opcoesBase = (tituloTooltip) => {
  const cores = obterCoresDoTema();

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: cores.muted,
          boxWidth: 14
        }
      },
      tooltip: {
        callbacks: {
          label: (contexto) => {
            const eixoHorizontal = contexto.chart.options.indexAxis === "y";
            const valor = eixoHorizontal ? contexto.parsed.x : contexto.parsed.y;
            return `${contexto.dataset.label || "Valor"}: ${tituloTooltip(valor)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: cores.muted },
        grid: { color: cores.border }
      },
      y: {
        ticks: { color: cores.muted },
        grid: { color: cores.border }
      }
    }
  };
};

const criarGrafico = (idCanvas, configuracao) => {
  const canvas = document.getElementById(idCanvas);

  if (!canvas || !window.Chart) {
    return;
  }

  destruir(idCanvas);

  const instancia = new Chart(canvas, configuracao);
  instancias[idCanvas] = instancia;

  if (ouvintesRedimensionamento[idCanvas]) {
    window.removeEventListener("resize", ouvintesRedimensionamento[idCanvas]);
  }

  const tratarRedimensionamento = () => redimensionarGrafico(instancia);
  ouvintesRedimensionamento[idCanvas] = tratarRedimensionamento;
  window.addEventListener("resize", tratarRedimensionamento);

  redimensionarGrafico(instancia);
  return instancia;
};

export const calcularPeriodos = (transferencias, governos) => {
  const totalGeral = somar(transferencias, "valor_milhoes");

  return governos.periodos
    .map((periodo) => {
      const anos = transferencias.filter((item) => periodo.anos_incluidos.includes(item.ano));

      if (!anos.length) {
        return null;
      }

      const total = somar(anos, "valor_milhoes");
      const ordenados = [...anos].sort((a, b) => a.ano - b.ano);

      return {
        ...periodo,
        total_milhoes: total,
        media_anual_milhoes: media(anos, "valor_milhoes"),
        menor_valor_milhoes: Math.min(...anos.map((item) => item.valor_milhoes)),
        maior_valor_milhoes: Math.max(...anos.map((item) => item.valor_milhoes)),
        media_oscs: Math.round(media(anos, "oscs_beneficiadas")),
        participacao_total: totalGeral ? (total / totalGeral) * 100 : 0,
        crescimento_milhoes: ordenados[ordenados.length - 1].valor_milhoes - ordenados[0].valor_milhoes
      };
    })
    .filter(Boolean);
};

export const renderizarGraficos = ({ transferencias, governos, areas }) => {
  const cores = obterCoresDoTema();
  const labelsAnos = transferencias.map((item) => item.ano);

  criarGrafico("grafico-evolucao", {
    type: "line",
    data: {
      labels: labelsAnos,
      datasets: [{
        label: "Transferências",
        data: transferencias.map((item) => item.valor_milhoes),
        borderColor: cores.primary,
        backgroundColor: cores.primary,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.25
      }]
    },
    options: {
      ...opcoesBase(formatarMoedaBilhoes),
      scales: {
        x: opcoesBase(formatarMoedaBilhoes).scales.x,
        y: {
          ...opcoesBase(formatarMoedaBilhoes).scales.y,
          ticks: {
            color: cores.muted,
            callback: (valor) => formatarMoedaBilhoes(valor)
          }
        }
      }
    }
  });

  criarGrafico("grafico-oscs", {
    type: "bar",
    data: {
      labels: labelsAnos,
      datasets: [{
        label: "OSCs beneficiadas",
        data: transferencias.map((item) => item.oscs_beneficiadas),
        backgroundColor: cores.blue,
        borderRadius: 6
      }]
    },
    options: {
      ...opcoesBase(formatarInteiro),
      scales: {
        x: opcoesBase(formatarInteiro).scales.x,
        y: {
          ...opcoesBase(formatarInteiro).scales.y,
          ticks: {
            color: cores.muted,
            callback: (valor) => formatarInteiro(valor)
          }
        }
      }
    }
  });

  const periodos = calcularPeriodos(transferencias, governos);
  criarGrafico("grafico-governos", {
    type: "bar",
    data: {
      labels: periodos.map((periodo) => periodo.nome),
      datasets: [{
        label: "Média anual",
        data: periodos.map((periodo) => periodo.media_anual_milhoes),
        backgroundColor: [cores.primary, cores.accent, cores.blue, cores.danger, cores.primaryStrong],
        borderRadius: 6
      }]
    },
    options: {
      ...opcoesBase(formatarMoedaBilhoes),
      plugins: {
        ...opcoesBase(formatarMoedaBilhoes).plugins,
        legend: { display: false }
      },
      scales: {
        x: {
          ...opcoesBase(formatarMoedaBilhoes).scales.x,
          ticks: {
            color: cores.muted,
            maxRotation: 35,
            minRotation: 0
          }
        },
        y: {
          ...opcoesBase(formatarMoedaBilhoes).scales.y,
          ticks: {
            color: cores.muted,
            callback: (valor) => formatarMoedaBilhoes(valor)
          }
        }
      }
    }
  });

  const areasOrdenadas = [...areas.dados].sort((a, b) => a.valor_milhoes - b.valor_milhoes);
  criarGrafico("grafico-areas", {
    type: "bar",
    data: {
      labels: areasOrdenadas.map((item) => item.area),
      datasets: [{
        label: "Valor em 2024",
        data: areasOrdenadas.map((item) => item.valor_milhoes),
        backgroundColor: cores.accent,
        borderRadius: 6
      }]
    },
    options: {
      ...opcoesBase(formatarMilhoes),
      indexAxis: "y",
      plugins: {
        ...opcoesBase(formatarMilhoes).plugins,
        legend: { display: false }
      },
      scales: {
        x: {
          ...opcoesBase(formatarMilhoes).scales.x,
          ticks: {
            color: cores.muted,
            callback: (valor) => formatarMilhoes(valor)
          }
        },
        y: {
          ...opcoesBase(formatarMilhoes).scales.y,
          ticks: { color: cores.muted }
        }
      }
    }
  });
};
