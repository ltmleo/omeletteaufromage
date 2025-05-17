/**
 * Carregador dinâmico de episódios do Spotify
 * Omelette Au Fromage Podcast - 2025
 * Versão 3.0 - Primeiro episódio como iframe, demais com links diretos
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
            
            // Ordenar os episódios em ordem crescente para cada idioma
            data.idiomas.forEach(idioma => {
                idioma.episodios.sort((a, b) => {
                    // Extrair os nomes das categorias (ex: Saudações, Restaurante, etc)
                    const categoriaA = a.titulo.split(' - ')[1];
                    const categoriaB = b.titulo.split(' - ')[1];
                    
                    // Se for do tipo "Palavras X", ordenar pelo número
                    if (categoriaA && categoriaA.startsWith('Palavras') && 
                        categoriaB && categoriaB.startsWith('Palavras')) {
                        // Extrair os números (Palavras 1, Palavras 2, etc)
                        const numA = parseInt(categoriaA.split(' ')[1]);
                        const numB = parseInt(categoriaB.split(' ')[1]);
                        return numA - numB; // Ordem crescente
                    }

                    // Ordem predefinida para categorias comuns
                    const ordem = [
                        'Saudações',
                        'Restaurante',
                        'Compras',
                        'Transporte',
                        'Ajuda e Saúde',
                        'Saúde',
                        'Perguntas Essenciais',
                        'Turismo',
                        'Palavras', // Categorias que começam com "Palavras" serão ordenadas depois
                        'Perguntas' // Categorias que começam com "Perguntas" também
                    ];

                    // Determinar a posição de cada categoria na ordem predefinida
                    let posA = ordem.findIndex(cat => categoriaA && categoriaA.startsWith(cat));
                    let posB = ordem.findIndex(cat => categoriaB && categoriaB.startsWith(cat));

                    // Se não encontrado, colocar no final
                    posA = posA === -1 ? 999 : posA;
                    posB = posB === -1 ? 999 : posB;

                    return posA - posB;
                });
            });
            
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
                idioma.episodios.forEach((episodio, episodioIndex) => {
                    // O primeiro episódio é renderizado como iframe do Spotify
                    if (episodioIndex === 0) {
                        const iframeContainer = document.createElement('div');
                        iframeContainer.className = 'spotify-embed featured-episode';
                        
                        // Criar o player do Spotify para o primeiro episódio
                        iframeContainer.innerHTML = `
                            <div class="featured-label">
                                <i class="fas fa-play-circle"></i> Comece Aqui
                            </div>
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
                        
                        temporada.appendChild(iframeContainer);
                    } else {
                        // Os demais episódios são renderizados como cartões
                        const episodioCard = document.createElement('div');
                        episodioCard.className = 'episode-card';
                        
                        // Determinar a categoria para ícone
                        const categoria = episodio.titulo.split(' - ')[1] || '';
                        let icone = 'fas fa-comment'; // ícone padrão
                        
                        if (categoria.includes('Saudações')) {
                            icone = 'fas fa-hands-helping';
                        } else if (categoria.includes('Restaurante')) {
                            icone = 'fas fa-utensils';
                        } else if (categoria.includes('Compras')) {
                            icone = 'fas fa-shopping-cart';
                        } else if (categoria.includes('Transporte')) {
                            icone = 'fas fa-bus';
                        } else if (categoria.includes('Saúde')) {
                            icone = 'fas fa-heartbeat';
                        } else if (categoria.includes('Perguntas')) {
                            icone = 'fas fa-question-circle';
                        } else if (categoria.includes('Turismo')) {
                            icone = 'fas fa-map-marked-alt';
                        } else if (categoria.includes('Palavras')) {
                            icone = 'fas fa-book';
                        }
                        
                        // Criar HTML do cartão
                        episodioCard.innerHTML = `
                            <div class="episode-icon">
                                <i class="${icone}"></i>
                            </div>
                            <div class="episode-details">
                                <h4 class="episode-title">${episodio.titulo}</h4>
                                <p class="episode-duration">${episodio.duracao}</p>
                                <div class="episode-actions">
                                    <a href="https://open.spotify.com/episode/${episodio.id}" target="_blank" class="btn-listen">
                                        <i class="fab fa-spotify"></i> Ouvir no Spotify
                                    </a>
                                </div>
                            </div>
                        `;
                        
                        temporada.appendChild(episodioCard);
                    }
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
});