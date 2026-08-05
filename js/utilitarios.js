export const formatarMoedaBilhoes = (valorMilhoes) => {
  const valorBilhoes = valorMilhoes / 1000;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valorBilhoes) + " bi";
};

export const formatarMilhoes = (valorMilhoes) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(valorMilhoes) + " mi";
};

export const formatarInteiro = (valor) => {
  return new Intl.NumberFormat("pt-BR").format(valor);
};

export const somar = (dados, campo) => {
  return dados.reduce((total, item) => total + Number(item[campo] || 0), 0);
};

export const media = (dados, campo) => {
  if (!dados.length) {
    return 0;
  }

  return somar(dados, campo) / dados.length;
};

export const calcularVariacaoPercentual = (inicial, final) => {
  if (!inicial) {
    return 0;
  }

  return ((final - inicial) / inicial) * 100;
};

export const baixarArquivo = (nome, conteudo, tipo = "text/csv;charset=utf-8") => {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const normalizarTexto = (texto) => {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const obterCoresDoTema = () => {
  const estilos = getComputedStyle(document.documentElement);
  return {
    text: estilos.getPropertyValue("--text").trim(),
    muted: estilos.getPropertyValue("--muted").trim(),
    border: estilos.getPropertyValue("--border").trim(),
    primary: estilos.getPropertyValue("--primary").trim(),
    primaryStrong: estilos.getPropertyValue("--primary-strong").trim(),
    accent: estilos.getPropertyValue("--accent").trim(),
    blue: estilos.getPropertyValue("--blue").trim(),
    danger: estilos.getPropertyValue("--danger").trim(),
    surface: estilos.getPropertyValue("--surface").trim()
  };
};
