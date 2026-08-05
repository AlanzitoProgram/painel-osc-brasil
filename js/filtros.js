export const criarFiltros = ({ transferencias, governos, aoAlterar }) => {
  const anoInicio = document.querySelector("[data-filter-start]");
  const anoFim = document.querySelector("[data-filter-end]");
  const governo = document.querySelector("[data-filter-government]");
  const limpar = document.querySelector("[data-reset-filters]");

  if (!anoInicio || !anoFim || !governo) {
    return null;
  }

  const anos = transferencias.map((item) => item.ano).sort((a, b) => a - b);
  const menorAno = anos[0];
  const maiorAno = anos[anos.length - 1];
  const estado = {
    inicio: menorAno,
    fim: maiorAno,
    governo: "todos"
  };

  const montarOpcoesAno = (select, valorPadrao) => {
    select.innerHTML = anos.map((ano) => `<option value="${ano}">${ano}</option>`).join("");
    select.value = String(valorPadrao);
  };

  montarOpcoesAno(anoInicio, menorAno);
  montarOpcoesAno(anoFim, maiorAno);

  governo.innerHTML = [
    '<option value="todos">Todos</option>',
    ...governos.periodos.map((periodo) => `<option value="${periodo.id}">${periodo.nome}</option>`)
  ].join("");

  const emitir = () => {
    aoAlterar({ ...estado });
  };

  anoInicio.addEventListener("change", () => {
    estado.inicio = Number(anoInicio.value);

    if (estado.inicio > estado.fim) {
      estado.fim = estado.inicio;
      anoFim.value = String(estado.fim);
    }

    emitir();
  });

  anoFim.addEventListener("change", () => {
    estado.fim = Number(anoFim.value);

    if (estado.fim < estado.inicio) {
      estado.inicio = estado.fim;
      anoInicio.value = String(estado.inicio);
    }

    emitir();
  });

  governo.addEventListener("change", () => {
    estado.governo = governo.value;
    emitir();
  });

  limpar?.addEventListener("click", () => {
    estado.inicio = menorAno;
    estado.fim = maiorAno;
    estado.governo = "todos";
    anoInicio.value = String(menorAno);
    anoFim.value = String(maiorAno);
    governo.value = "todos";
    emitir();
  });

  return estado;
};

export const aplicarFiltros = (dados, periodos, filtros) => {
  const periodoSelecionado = periodos.find((periodo) => periodo.id === filtros.governo);

  return dados.filter((item) => {
    const estaNoIntervalo = item.ano >= filtros.inicio && item.ano <= filtros.fim;
    const estaNoGoverno = !periodoSelecionado || periodoSelecionado.anos_incluidos.includes(item.ano);
    return estaNoIntervalo && estaNoGoverno;
  });
};

export const iniciarMenuResponsivo = () => {
  const botao = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("#menu-principal");

  if (!botao || !menu) {
    return;
  }

  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("open");
    botao.setAttribute("aria-expanded", String(aberto));
  });
};
