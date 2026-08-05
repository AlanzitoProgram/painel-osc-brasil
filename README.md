# Painel OSC Brasil

Projeto estático para apresentar dados oficiais sobre transferências voluntárias de recursos públicos federais para Organizações da Sociedade Civil (OSCs) no Brasil.

## Objetivo

O painel organiza dados de 2015 a 2024 de forma neutra, verificável e acessível. Ele foi criado para funcionar no GitHub Pages usando apenas HTML5, CSS3, JavaScript puro, Chart.js por CDN e arquivos JSON.

## O que está incluído

- Página inicial com cartões de indicadores.
- Filtros por ano inicial, ano final e governo.
- Quatro gráficos com Chart.js.
- Tabela histórica ordenável.
- Busca na tabela.
- Exportação CSV.
- Cópia da tabela.
- Modo claro e escuro.
- Páginas de metodologia, fontes e sobre.
- CSS e JavaScript organizados em módulos.
- Dados separados em JSON.
- Layout responsivo e recursos básicos de acessibilidade.

## Estrutura

```text
painel-osc-brasil/
├── index.html
├── metodologia.html
├── fontes.html
├── sobre.html
├── README.md
├── LICENSE
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── dados.js
│   ├── filtros.js
│   ├── graficos.js
│   ├── indicadores.js
│   ├── tabela.js
│   ├── tema.js
│   └── utilitarios.js
└── data/
    ├── transferencias-anuais.json
    ├── governos.json
    ├── areas-2024.json
    └── fontes.json
```

## Fontes principais

- Mapa das Organizações da Sociedade Civil / Ipea: https://bookdown.org/mosc_ipea/relatorio-estatistico-MOSC-2025/cap-transferenciasosc.html
- Dados.gov.br: https://dados.gov.br/dados/conjuntos-dados/mapaosc
- Transferegov.br: https://www.gov.br/transferegov/pt-br/sobre/mapeamento/transferencias-operacionalizadas
- Lei nº 13.019/2014: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13019.htm

## Observação metodológica

Os números representam transferências voluntárias federais para OSCs identificadas pelo Mapa das OSCs/Ipea. Eles não representam necessariamente todos os gastos públicos com entidades sem fins lucrativos.

## Como testar localmente

Como o projeto usa `fetch()` para ler arquivos JSON, abra-o por um servidor local simples ou publique no GitHub Pages. Exemplos:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Publicação no GitHub Pages

Envie a pasta do projeto para um repositório no GitHub e ative o GitHub Pages apontando para a branch principal. Não há backend, banco de dados ou etapa de build.
