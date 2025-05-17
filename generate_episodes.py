#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Gerador de episodes.json para o podcast Omelette Au Fromage
Este script busca os episódios do podcast no Spotify e gera o arquivo episodes.json
organizado por idiomas (temporadas).

Requisitos:
    - pip install spotipy
    - Criar um app no Spotify Developer Dashboard (https://developer.spotify.com/dashboard/)

Uso:
    python generate_episodes.py

Autor: GitHub Copilot
Data: 17 de maio de 2025
"""

import os
import json
import re
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Configurações do Spotify API
# Você precisa criar um app no Spotify Developer Dashboard e configurar estas variáveis
# como variáveis de ambiente ou alterar diretamente aqui (não recomendado para produção)
SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID', '')
SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET', '')
SPOTIFY_SHOW_ID = '5LOKjg5q8T9Hq0qjPDRHj7'  # ID do podcast Omelette Au Fromage

# Padrão regex para detectar o idioma no título do episódio
# Exemplo: "Holandês Básico - Palavras 1" -> idioma = "Holandês"
LANGUAGE_PATTERN = r'^(\w+)'

# Função para conectar ao Spotify
def connect_to_spotify():
    """Conecta à API do Spotify"""
    try:
        client_credentials_manager = SpotifyClientCredentials(
            client_id=SPOTIFY_CLIENT_ID,
            client_secret=SPOTIFY_CLIENT_SECRET
        )
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
        return sp
    except Exception as e:
        print(f"Erro ao conectar ao Spotify: {e}")
        exit(1)

# Função para obter episódios de um show
def get_show_episodes(sp, show_id):
    """Obtém todos os episódios de um podcast"""
    episodes = []
    results = sp.show_episodes(show_id, limit=50)
    episodes.extend(results['items'])
    
    while results['next']:
        results = sp.next(results)
        episodes.extend(results['items'])
    
    return episodes

# Função para extrair o idioma do título do episódio
def extract_language(title):
    """Extrai o idioma do título do episódio"""
    match = re.match(LANGUAGE_PATTERN, title)
    if match:
        return match.group(1)
    return "Outros"

# Função para organizar os episódios por idioma
def organize_episodes_by_language(episodes):
    """Organiza os episódios por idioma"""
    languages = {}
    
    for episode in episodes:
        title = episode['name']
        language = extract_language(title)
        
        if language not in languages:
            languages[language] = []
        
        # Extrair a duração em minutos
        duration_ms = episode['duration_ms']
        duration_min = round(duration_ms / 60000)
        
        # Adicionar o episódio na lista do idioma correspondente
        languages[language].append({
            "titulo": title,
            "id": episode['id'],
            "duracao": f"{duration_min}min"
        })
    
    return languages

# Função para gerar o arquivo JSON
def generate_json(languages):
    """Gera o arquivo JSON com os episódios organizados por idioma"""
    # Formatar os dados para o formato desejado
    idiomas = []
    temporada = 1
    
    for language, eps in languages.items():
        idiomas.append({
            "nome": language,
            "temporada": temporada,
            "episodios": eps
        })
        temporada += 1
    
    # Criar o objeto JSON final
    json_data = {"idiomas": idiomas}
    
    # Salvar em arquivo
    with open('js/episodes.json', 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    print(f"Arquivo episodes.json gerado com sucesso!")
    print(f"Total de idiomas: {len(idiomas)}")
    print(f"Total de episódios: {sum(len(eps['episodios']) for eps in idiomas)}")

# Função principal
def main():
    """Função principal"""
    print("Gerando arquivo episodes.json para o podcast Omelette Au Fromage...")
    
    # Verificar credenciais
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        print("ERRO: As credenciais do Spotify não foram configuradas!")
        print("Defina as variáveis de ambiente SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET")
        print("Ou edite o script para incluir suas credenciais.")
        exit(1)
    
    # Conectar ao Spotify
    print("Conectando ao Spotify...")
    sp = connect_to_spotify()
    
    # Obter informações do show
    print(f"Obtendo informações do podcast (ID: {SPOTIFY_SHOW_ID})...")
    show = sp.show(SPOTIFY_SHOW_ID, market='BR')
    print(f"Podcast: {show['name']}")
    print(f"Descrição: {show['description'][:60]}...")
    
    # Obter episódios
    print("Buscando episódios...")
    episodes = get_show_episodes(sp, SPOTIFY_SHOW_ID)
    print(f"Total de episódios encontrados: {len(episodes)}")
    
    # Organizar os episódios por idioma
    print("Organizando episódios por idioma...")
    languages = organize_episodes_by_language(episodes)
    
    # Gerar o arquivo JSON
    generate_json(languages)

if __name__ == "__main__":
    main()