# Meta.astro — guia para personalizar o template

`Meta.astro` é o componente que preenche a área invisível `<head>` de todas as páginas do site. Ele não cria algo que o visitante veja dentro da página, mas informa ao Google, ao navegador e às redes sociais como aquela página deve ser apresentada.

Ele é chamado pelo arquivo `src/layouts/BaseLayout.astro`. Por isso, em geral, você **não precisa editar este arquivo ao montar um novo template**: basta atualizar os dados do cliente em `src/data/client.ts` e passar título, descrição e imagem para cada página pelo `BaseLayout`.

## O que você normalmente deve alterar para um novo cliente

Edite `src/data/client.ts`:

- `SITE.title`: nome do negócio/site.
- `SITE.description`: descrição geral do negócio.
- `SITE.url`: endereço final do site, com `https://`.
- `SITE.author` e `SITE.locale`: autor e idioma do site (`pt-BR`, por exemplo).
- `BUSINESS`: nome, endereço e demais informações da empresa. Esses dados também alimentam o SEO local.
- `OG.locale`: idioma para compartilhamentos, como `pt_BR`.
- `OG.image`: imagem padrão de compartilhamento, guardada em `public/assets/social.jpg` (ou ajuste o caminho).

Também substitua os arquivos em `public/assets/favicons/` pelos ícones da nova marca. Eles aparecem na aba do navegador e em atalhos salvos.

Para uma página específica, como a inicial ou uma página de serviços, informe no `BaseLayout` um `title`, uma `description` e, se existir, `heroImage`. Essa imagem será usada no compartilhamento daquela página.

## Explicação dos imports

### `getImage` de `astro:assets`

É uma ferramenta do Astro que prepara uma imagem para a web. Aqui ela é usada quando a página fornece uma imagem original: o sistema gera uma versão apropriada para redes sociais, com 1200 × 600 pixels.

### `GetImageResult` de `astro`

É apenas um tipo do TypeScript. Ele ajuda o editor a reconhecer uma imagem que já foi processada pelo Astro; não envia nada ao navegador e não tem efeito visual direto.

### `BUSINESS`, `OG` e `SITE` de `@data/client`

São os dados centralizados do cliente:

- `SITE` fornece nome, descrição, autor e URL do site.
- `BUSINESS` fornece o nome e a localização da empresa.
- `OG` fornece idioma e imagem padrão para redes sociais.

O símbolo `@` é um atalho configurado para a pasta `src`. Portanto, `@data/client` aponta para `src/data/client.ts`.

### `getLocalBusinessSchema`

Vem de `src/js/localBusinessSchema.js`. Ele monta um objeto com os dados da empresa no formato entendido pelo Google para negócios locais.

## Bloco inicial entre `---`

Em arquivos `.astro`, tudo entre os dois pares de `---` é executado no servidor durante a montagem da página. É onde ficam imports, tipos, cálculos e regras. Nada desse bloco aparece diretamente na tela.

### `Props` e valores recebidos

O componente pode receber três informações da página:

- `title`: título específico da página;
- `description`: resumo específico da página;
- `heroImage`: imagem principal da página.

Se título ou descrição não forem enviados, ele usa os valores gerais de `SITE` definidos em `client.ts`.

### URL, título e página inicial

- `canonical` usa a URL completa da página atual. Isso informa aos buscadores qual é a versão oficial daquela página, evitando conteúdo duplicado.
- `isHomePage` identifica a rota `/`, isto é, a página inicial.
- `pageTitle` inclui o nome da empresa em todas as páginas. Na inicial, também inclui cidade e estado, uma ajuda para buscas locais.

Exemplo: `Móveis sob medida | Marcenaria Exemplo | Curitiba, PR`.

### Schema do negócio local

`localBusinessSchema` reúne dados estruturados da empresa usando a URL atual como base. Ele será convertido para JSON no `<script type="application/ld+json">` abaixo.

### Imagem para redes sociais

`socialImage` segue esta prioridade:

1. imagem da página (`heroImage`), se ela for enviada;
2. imagem padrão definida em `OG.image`, se a página não tiver imagem própria.

Quando necessário, o Astro otimiza a imagem própria antes de usá-la. A URL final sempre recebe o domínio do site para que Facebook, WhatsApp, LinkedIn e X consigam encontrá-la.

## Blocos dentro do `<head>`

### Dados estruturados e slot `schema`

O primeiro `<script>` envia o schema `LocalBusiness` para mecanismos de busca. O `<slot name="schema" />` permite que páginas especiais acrescentem outro schema — por exemplo, `BlogPosting` em um artigo — sem remover o schema da empresa.

### `<title>`

Define o texto da aba do navegador e, normalmente, o título azul mostrado pelo Google nos resultados.

### Meta tags padrão

- `charset="utf-8"`: permite exibir corretamente acentos e caracteres especiais.
- `description`: resumo que mecanismos de busca podem usar nos resultados.
- `web_author`: identifica o autor do site.
- `viewport`: adapta a largura da página para celulares e limita o zoom.
- `X-UA-Compatible`: compatibilidade com versões antigas do Internet Explorer; hoje tem pouca relevância, mas pode permanecer.
- `canonical`: URL oficial da página atual.

### Open Graph

As tags que começam com `og:` definem o cartão mostrado quando alguém compartilha um link no WhatsApp, Facebook, LinkedIn e outras plataformas: URL, título, texto e imagem.

O arquivo atualmente gera a imagem otimizada em formato **WebP**, mas a tag `og:image:type` está escrita como `image/jpeg`. Se for manter a otimização em WebP, troque esse valor para `image/webp`; se usar uma imagem JPG como padrão, o valor atual faz sentido para ela. Manter tipo e arquivo coerentes evita problemas em alguns compartilhamentos.

### Twitter Card

Faz o mesmo para o X/Twitter. `summary_large_image` pede uma prévia grande com imagem.

### Favicons

São os ícones do site para abas, favoritos, atalhos no celular e alguns dispositivos Windows. Os caminhos apontam para a pasta `public/assets/favicons/`.

## Checklist antes de publicar

- Atualizar todos os dados em `src/data/client.ts`, inclusive `SITE.url`.
- Confirmar que o idioma está em `SITE.locale` e `OG.locale`.
- Criar/substituir `public/assets/social.jpg` e os favicons da nova marca.
- Conferir que cada página importante envia título e descrição próprios.
- Testar um link em uma ferramenta de prévia de compartilhamento após o site estar publicado.
- Conferir, no código, se `og:image:type` corresponde ao formato da imagem gerada.
