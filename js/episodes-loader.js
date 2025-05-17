/**
 * Carregador dinâmico de episódios do Spotify
 * Omelette Au Fromage Podcast - 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    const idiomaTabsContainer = document.querySelector('.idioma-tabs');
    const episodiosContainer = document.querySelector('.episodios-container');
    
    // Inicializar a interface com placeholders
    episodiosContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-pulse"></i>
            <p>Carregando episódios...</p>
        </div>
    `;

    // Carregar dados dos episódios do arquivo JSON
    fetch('js/episodes.json')
        .then(response => response.json())
        .then(data => {
            // Remover o indicador de carregamento
            episodiosContainer.innerHTML = '';
            
            // Criar abas para cada idioma
            data.idiomas.forEach((idioma, index) => {
                // Criar aba de idioma
                const tab = document.createElement('div');
                tab.className = 'idioma-tab';
                tab.textContent = idioma.nome;
                tab.dataset.idioma = index;
                
                // Definir a primeira aba como ativa
                if (index === 0) {
                    tab.classList.add('active');
                }
                
                // Adicionar evento de clique para trocar de idioma
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.idioma-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.temporada').forEach(t => t.classList.remove('active'));
                    
                    tab.classList.add('active');
                    document.querySelector(`.temporada[data-idioma="${index}"]`).classList.add('active');
                });
                
                idiomaTabsContainer.appendChild(tab);
                
                // Criar container de episódios para esse idioma
                const temporada = document.createElement('div');
                temporada.className = 'temporada';
                temporada.dataset.idioma = index;
                
                // Definir a primeira temporada como ativa
                if (index === 0) {
                    temporada.classList.add('active');
                }
                
                // Adicionar título da temporada/idioma
                const temporadaTitulo = document.createElement('h3');
                temporadaTitulo.className = 'temporada-titulo';
                temporadaTitulo.textContent = `${idioma.nome}`;
                temporada.appendChild(temporadaTitulo);
                
                // Adicionar episódios dessa temporada/idioma
                idioma.episodios.forEach(episodio => {
                    const episodioContainer = document.createElement('div');
                    episodioContainer.className = 'spotify-embed';
                    
                    // Criar o player do Spotify
                    episodioContainer.innerHTML = `
                        <iframe 
                            style="border-radius:12px" 
                            src="https://open.spotify.com/embed/episode/${episodio.id}?utm_source=generator&theme=0" 
                            width="100%" 
                            height="352" 
                            frameBorder="0" 
                            allowfullscreen="" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy">
                        </iframe>
                    `;
                    
                    temporada.appendChild(episodioContainer);
                });
                
                episodiosContainer.appendChild(temporada);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os episódios:', error);
            episodiosContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Ocorreu um erro ao carregar os episódios. Por favor, tente novamente mais tarde.</p>
                </div>
            `;
        });

    // Adicionar efeito de carregamento progressivo
    window.addEventListener('scroll', lazyLoadEpisodes);
    
    function lazyLoadEpisodes() {
        const embeds = document.querySelectorAll('.spotify-embed iframe');
        embeds.forEach(embed => {
            if (isElementInViewport(embed.parentElement) && !embed.src.includes('autoplay')) {
                // Garantir que o iframe seja carregado apenas quando visível
                if (embed.dataset.src && !embed.src) {
                    embed.src = embed.dataset.src;
                }
            }
        });
    }
    
    // Verificar se elemento está visível na janela
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});