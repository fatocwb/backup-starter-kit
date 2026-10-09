* MODIFICAÇÕES 1 

[nav.js (line 42)](C:/Users/fabio/Downloads/Projetos/1-PicoWebDesign/2-Prospecção/prospecção/Code-Stitch/eacar/src/js/nav.js:42): adicionei o controle da classe scroll no body conforme a página rola.

const updateScrollState = () => {
    if (!elements.body) return;
    elements.body.classList.toggle(CONFIG.CLASSES.scroll, window.scrollY > 0);
};



* Decap CMS
Página admin.index adicionada, referente ao decap cms.

<!-- Netlify Identity em BaseLayout.astro -->
	<script is:inline src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>


