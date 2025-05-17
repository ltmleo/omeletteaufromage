# Omelette Au Fromage - Landing Page do Podcast

Landing page para o podcast "Omelette Au Fromage", um podcast dedicado a ensinar frases em outras línguas por repetição para falantes de português.

## Estrutura do Projeto

```
omelette/
├── assets/
│   └── logo.png
├── css/
│   └── styles.css
├── js/
│   ├── episodes-loader.js
│   ├── episodes.json
│   └── script.js
├── index.html
├── generate_episodes.py
└── README.md
```

## Gerador Automático de Episódios do Spotify

O script `generate_episodes.py` foi criado para automatizar a geração do arquivo `js/episodes.json` com todos os episódios do podcast organizados por idioma.

### Requisitos

1. Python 3.6 ou superior
2. Biblioteca Spotipy

```bash
pip install spotipy
```

### Configuração da API do Spotify

Para usar o script, você precisa criar um aplicativo no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) e obter suas credenciais:

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Faça login com sua conta Spotify
3. Clique em "Create an app"
4. Preencha os campos "App name" e "App description" e clique em "Create"
5. Na página do seu app, você encontrará o "Client ID" e "Client Secret"

### Como usar o script

Existem duas formas de configurar as credenciais:

#### 1. Usando variáveis de ambiente (recomendado):

```bash
export SPOTIFY_CLIENT_ID='seu_client_id'
export SPOTIFY_CLIENT_SECRET='seu_client_secret'
python generate_episodes.py
```

#### 2. Editando o script (não recomendado para produção):

Abra o arquivo `generate_episodes.py` e edite as linhas:

```python
SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID', 'seu_client_id')
SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET', 'seu_client_secret')
```

Depois execute:

```bash
python generate_episodes.py
```

### Como o script funciona

1. O script se conecta à API do Spotify usando suas credenciais
2. Busca todos os episódios do podcast "Omelette Au Fromage"
3. Analisa o título de cada episódio para determinar o idioma (ex: "Holandês Básico - Palavras 1" → idioma = "Holandês")
4. Organiza os episódios por idioma
5. Gera o arquivo `js/episodes.json` com a estrutura adequada para ser consumido pelo site

### Execução automática

Para manter seu site atualizado, você pode configurar uma tarefa agendada (cron job) para executar o script periodicamente:

```bash
# Exemplo de cron job para executar o script toda segunda-feira às 8h
0 8 * * 1 cd /caminho/para/omelette && python generate_episodes.py
```

## Hospedagem no GitHub Pages

Para hospedar a landing page no GitHub Pages:

1. Certifique-se de que o repositório está no GitHub
2. Acesse as configurações do repositório (Settings)
3. Na seção "GitHub Pages", selecione a branch principal (main/master)
4. Clique em "Save"
5. O site estará disponível em `https://seu-usuario.github.io/omelette/`

---

© 2025 Omelette Au Fromage