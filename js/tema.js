const CHAVE_TEMA = "painel-osc-brasil-tema";

const obterPreferenciaInicial = () => {
  const salvo = localStorage.getItem(CHAVE_TEMA);

  if (salvo) {
    return salvo;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const aplicarTema = (tema) => {
  document.documentElement.dataset.theme = tema;
  document.querySelectorAll("[data-theme-label]").forEach((elemento) => {
    elemento.textContent = tema === "dark" ? "Modo claro" : "Modo escuro";
  });
  window.dispatchEvent(new CustomEvent("painel:tema-alterado", { detail: { tema } }));
};

export const iniciarTema = () => {
  aplicarTema(obterPreferenciaInicial());

  document.querySelectorAll("[data-theme-toggle]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const atual = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      const proximo = atual === "dark" ? "light" : "dark";
      localStorage.setItem(CHAVE_TEMA, proximo);
      aplicarTema(proximo);
    });
  });
};

export const iniciarMenuResponsivo = () => {
  const botao = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("#menu-principal");

  if (!botao || !menu || botao.dataset.menuReady === "true") {
    return;
  }

  botao.dataset.menuReady = "true";
  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("open");
    botao.setAttribute("aria-expanded", String(aberto));
  });
};

const iniciarBase = () => {
  iniciarTema();
  iniciarMenuResponsivo();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarBase, { once: true });
} else {
  iniciarBase();
}
