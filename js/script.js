// Script para o Omelette Au Fromage - Landing Page

// Função para animação ao rolar a página
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar classe para animações de rolagem
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-section');
    });

    // Detectar seções visíveis durante a rolagem
    const checkScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight * 0.8) {
                section.classList.add('visible');
            }
        });
    };

    // Verificar seções visíveis ao carregar a página
    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // Header com efeito de mudança ao rolar
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(18, 18, 18, 0.95)';
        } else {
            header.style.padding = '20px 0';
            header.style.background = 'rgba(18, 18, 18, 0.9)';
        }
    });

    // Rolagem suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Adicionar efeito de hover aos cards de episódios
    const episodioCards = document.querySelectorAll('.episodio-card');
    episodioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.episodio-thumbnail').classList.add('pulse');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.episodio-thumbnail').classList.remove('pulse');
        });
    });

    // Feedback visual para botões
    const buttons = document.querySelectorAll('.btn, .btn-listen, .social-icon');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // Simular carregamento de conteúdo - remover em produção
    // Este código é apenas para demonstração
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    // Função para inicializar os cartões de idiomas clicáveis
    function initIdiomaCards() {
        // Aguardar um pouco para garantir que as abas de idiomas já foram carregadas
        setTimeout(() => {
            const idiomaCards = document.querySelectorAll('.idioma-card:not(.coming-soon)');
            
            idiomaCards.forEach((card, index) => {
                // Tornar o cartão clicável
                card.style.cursor = 'pointer';
                
                // Adicionar evento de clique
                card.addEventListener('click', function() {
                    // Rolar até a seção de episódios
                    const episodiosSection = document.getElementById('episodios');
                    if (episodiosSection) {
                        window.scrollTo({
                            top: episodiosSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Esperar a rolagem antes de ativar a aba correta
                        setTimeout(() => {
                            // Obter o nome do idioma sem emoji
                            const idiomaNome = card.querySelector('h3').textContent.split(' ')[0];
                            
                            // Encontrar a aba de idioma correspondente
                            const idiomaTabs = document.querySelectorAll('.idioma-tab');
                            idiomaTabs.forEach(tab => {
                                if (tab.textContent.includes(idiomaNome)) {
                                    // Simular um clique na aba
                                    tab.click();
                                }
                            });
                        }, 500);
                    }
                });
                
                // Adicionar tooltip para indicar a ação
                card.setAttribute('title', 'Clique para ver os episódios deste idioma');
            });
        }, 1000); // Esperar 1 segundo para garantir que tudo foi carregado
    }
    
    // Inicializar os cartões de idiomas clicáveis
    initIdiomaCards();
});

// Função para inicializar o player integrado do Spotify
// Esta é uma função de exemplo - para implementar o player real do Spotify
// seria necessário utilizar a Web API do Spotify
function initSpotifyPlayer() {
    console.log('Spotify player initialized');
    // Implementar integração com Spotify Web API aqui
}

// Chamada do player - pode ser removido em produção
// initSpotifyPlayer();