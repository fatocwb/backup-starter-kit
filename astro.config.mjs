/* Entre as configurações mais comuns estão:

    URL do site (site)
    Diretório de saída (outDir)
    Modo de build (estático ou SSR)
    Adaptador de hospedagem (Cloudflare, Netlify, Node, Vercel...)
    Integrações (Tailwind, MDX, React, Vue, etc.)
    Configurações do Vite
    Internacionalização (i18n)
    Compressão de imagens
    Redirecionamentos
    Headers
    Configurações experimentais 
*/

import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // update me!
  site: "https://webdesigndemos.github.io",
  //base: "/delta-demo",

  integrations: [
      icon(),
      sitemap({
          filter: (page) => !page.includes("/admin"),
          changefreq: "weekly",
          priority: 0.7,
      }),
	],

  image: {
      layout: "constrained",
	},

  fonts: [
      {
    //textos    
    provider: fontProviders.google(),
    name: "Inter",
    cssVariable: "--font-primary",
    fallbacks: ["Arial", "sans-serif"],
    weights: [400, 500, 600, 700, 800, 900],
    styles: ["normal"],
  },
  {
    //titulos
    provider: fontProviders.google(),
    name: "Manrope",
    cssVariable: "--font-heading",
    fallbacks: ["Arial", "sans-serif"],
    weights: [600, 700, 800, 900],
    styles: ["normal"],
  },
	],

  vite: {
    plugins: [tailwindcss()],
  },
});