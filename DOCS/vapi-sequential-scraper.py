#!/usr/bin/env python3
"""
🎯 VAPI DOCUMENTATION SEQUENTIAL SCRAPER
========================================

Script Python qui suit automatiquement les boutons "Next" pour scrapper
toute la documentation Vapi de manière séquentielle.

Usage: python vapi-sequential-scraper.py
Output: ./vapi-knowledge-base-complete.json
"""

import json
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from urllib.parse import urljoin, urlparse
import logging
from datetime import datetime

# Configuration du scraper
SCRAPER_CONFIG = {
    'start_url': 'https://docs.vapi.ai/quickstart/dashboard',
    'base_url': 'https://docs.vapi.ai',
    'output_file': './DOCS/vapi-knowledge-base-complete.json',
    'delay': 2,  # Délai entre les pages (réduit pour aller plus vite)
    'max_pages': 500,  # Limite augmentée pour scrapper toute la doc
    'timeout': 30
}

# Configuration du logging (sans emojis pour éviter les erreurs d'encodage)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('vapi-scraper.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

class VapiSequentialScraper:
    def __init__(self):
        self.driver = None
        self.scraped_data = {
            'metadata': {
                'scraped_at': datetime.now().isoformat(),
                'total_pages': 0,
                'version': '2.0.0',
                'scraping_method': 'sequential_next_button'
            },
            'pages': {},
            'navigation_path': [],
            'parameters': {
                'all': set(),
                'categories': {}
            },
            'examples': [],
            'schemas': []
        }
        self.visited_urls = set()
        
    def setup_driver(self):
        """Initialiser le driver Selenium avec Chrome"""
        logging.info("Initialisation du driver Chrome...")
        
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Mode sans interface
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            # Masquer le fait que c'est un bot
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            logging.info("Driver Chrome initialise avec succes")
        except Exception as e:
            logging.error(f"Erreur lors de l'initialisation du driver: {e}")
            raise
    
    def extract_page_data(self, url):
        """Extraire toutes les données d'une page"""
        logging.info(f"Extraction des donnees de: {url}")
        
        try:
            # Attendre que la page soit complètement chargée
            WebDriverWait(self.driver, SCRAPER_CONFIG['timeout']).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Extraire les données avec JavaScript
            page_data = self.driver.execute_script("""
                const data = {
                    url: window.location.href,
                    title: document.title,
                    headings: [],
                    parameters: [],
                    examples: [],
                    schemas: [],
                    content: {},
                    navigation: {
                        next: null,
                        previous: null,
                        breadcrumb: []
                    }
                };
                
                // Extraire les titres
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                headings.forEach(h => {
                    data.headings.push({
                        level: h.tagName.toLowerCase(),
                        text: h.textContent.trim(),
                        id: h.id || null
                    });
                });
                
                // Extraire les paramètres Vapi de manière plus exhaustive
                const vapiKeywords = [
                    // Assistant parameters
                    'transcriber', 'model', 'voice', 'firstMessage', 'endCallMessage',
                    'silenceTimeoutSeconds', 'maxDurationSeconds', 'backgroundSound',
                    'forwardingPhoneNumber', 'clientMessages', 'serverMessages',
                    'artifactPlan', 'analysisPlan', 'monitorPlan', 'startSpeakingPlan',
                    'stopSpeakingPlan', 'credentialIds', 'server', 'tools', 'functions',
                    'knowledgeBases', 'workflows', 'provider', 'voiceId', 'systemPrompt',
                    'temperature', 'maxTokens', 'language', 'confidenceThreshold',
                    'recordingEnabled', 'transcriptPlan', 'videoRecordingEnabled',
                    'summaryPrompt', 'structuredDataPrompt', 'successEvaluationPrompt',
                    'listenEnabled', 'controlEnabled', 'waitSeconds', 'numWords',
                    'voiceSeconds', 'backoffSeconds', 'observabilityPlan',
                    'transportConfigurations', 'credentials', 'hooks', 'variableValues',
                    'endCallPhrases', 'voicemailMessage', 'voicemailDetection',
                    'firstMessageMode', 'firstMessageInterruptionsEnabled',
                    'endCallAfterSilence', 'backgroundDenoisingEnabled',
                    'modelOutputInMessagesEnabled', 'stability', 'similarityBoost',
                    'style', 'useSpeakerBoost', 'speed', 'pitch', 'emotion',
                    'voiceGuidance', 'styleGuidance', 'textGuidance', 'assistant',
                    'phoneNumber', 'call', 'webhook', 'integration', 'api', 'sdk',
                    // Voice providers
                    'elevenlabs', 'playht', 'azure', 'openai', 'cartesia', 'deepgram',
                    'rimeai', 'sesame', 'tavus', 'imnt',
                    // Model providers  
                    'gpt-4', 'gpt-3.5', 'claude', 'gemini', 'groq', 'deepinfra',
                    'perplexity', 'togetherai', 'openrouter',
                    // Transcriber providers
                    'assembly-ai', 'google', 'gladia', 'talkscriber',
                    // Advanced features
                    'squad', 'transfer', 'forwarding', 'sip', 'websocket',
                    'realtime', 'streaming', 'interruption', 'endpointing',
                    'multilingual', 'personalization', 'dynamic', 'custom'
                ];
                
                const allText = document.body.innerText.toLowerCase();
                const foundKeywords = [];
                
                // Chercher chaque mot-clé dans le texte
                vapiKeywords.forEach(keyword => {
                    if (allText.includes(keyword.toLowerCase())) {
                        foundKeywords.push(keyword);
                    }
                });
                
                // Chercher aussi dans les attributs et propriétés
                const codeElements = document.querySelectorAll('code, pre, .highlight');
                codeElements.forEach(element => {
                    const codeText = element.textContent.toLowerCase();
                    vapiKeywords.forEach(keyword => {
                        if (codeText.includes(keyword.toLowerCase()) && !foundKeywords.includes(keyword)) {
                            foundKeywords.push(keyword);
                        }
                    });
                });
                
                data.parameters = foundKeywords;
                
                // Extraire les exemples de code
                const codeBlocks = document.querySelectorAll('code, pre');
                codeBlocks.forEach(block => {
                    const code = block.textContent.trim();
                    if (code && code.length > 20 && code.length < 2000) {
                        data.examples.push({
                            type: block.tagName.toLowerCase(),
                            content: code,
                            language: block.className || 'unknown',
                            context: block.closest('section, div')?.querySelector('h1, h2, h3, h4')?.textContent?.trim() || 'unknown'
                        });
                    }
                });
                
                // Extraire les schémas JSON
                const jsonBlocks = Array.from(codeBlocks).filter(block => {
                    const text = block.textContent;
                    return text.includes('{') && text.includes('}') && text.includes('"');
                });
                
                jsonBlocks.forEach(block => {
                    const jsonText = block.textContent.trim();
                    if ((jsonText.startsWith('{') || jsonText.startsWith('[')) && jsonText.length < 3000) {
                        data.schemas.push({
                            content: jsonText,
                            context: block.closest('section, div')?.querySelector('h1, h2, h3, h4')?.textContent?.trim() || 'unknown'
                        });
                    }
                });
                
                // Chercher le bouton Next avec une approche plus robuste
                let nextLink = null;
                
                // Méthode 1: Chercher par texte "Next"
                const allLinks = document.querySelectorAll('a[href]');
                for (let link of allLinks) {
                    const text = link.textContent.toLowerCase().trim();
                    if (text.includes('next') || text.includes('suivant') || text === '→' || text === '>') {
                        nextLink = link.href;
                        break;
                    }
                }
                
                // Méthode 2: Chercher par attributs
                if (!nextLink) {
                    const nextSelectors = [
                        'a[href*="next"]',
                        '.next a',
                        '[aria-label*="next" i] a',
                        'nav a:last-child',
                        '.pagination a:last-child'
                    ];
                    
                    for (let selector of nextSelectors) {
                        try {
                            const element = document.querySelector(selector);
                            if (element && element.href) {
                                nextLink = element.href;
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                }
                
                if (nextLink) {
                    data.navigation.next = nextLink;
                }
                
                // Chercher aussi les liens de navigation en bas de page
                const navLinks = document.querySelectorAll('nav a, .navigation a, .pagination a, footer a');
                navLinks.forEach(link => {
                    const text = link.textContent.toLowerCase().trim();
                    if ((text.includes('next') || text.includes('suivant')) && link.href) {
                        data.navigation.next = link.href;
                    }
                    if ((text.includes('previous') || text.includes('précédent') || text.includes('prev')) && link.href) {
                        data.navigation.previous = link.href;
                    }
                });
                
                // Extraire le breadcrumb
                const breadcrumbs = document.querySelectorAll('.breadcrumb a, [aria-label="breadcrumb"] a, nav[aria-label="breadcrumb"] a');
                breadcrumbs.forEach(crumb => {
                    if (crumb.href && crumb.textContent.trim()) {
                        data.navigation.breadcrumb.push({
                            text: crumb.textContent.trim(),
                            href: crumb.href
                        });
                    }
                });
                
                // Extraire le contenu principal
                const mainContent = document.querySelector('main, .content, article, .documentation, [role="main"]');
                if (mainContent) {
                    data.content.text = mainContent.textContent.trim().substring(0, 5000);
                    data.content.wordCount = mainContent.textContent.trim().split(/\\s+/).length;
                }
                
                return data;
            """)
            
            logging.info(f"Donnees extraites: {len(page_data.get('parameters', []))} parametres, {len(page_data.get('examples', []))} exemples")
            return page_data
            
        except Exception as e:
            logging.error(f"Erreur lors de l'extraction de {url}: {e}")
            return {
                'url': url,
                'error': str(e),
                'scraped_at': datetime.now().isoformat()
            }
    
    def find_next_link(self):
        """Trouver le lien Next sur la page actuelle"""
        try:
            # Utiliser JavaScript pour chercher le lien Next de manière robuste
            next_link = self.driver.execute_script("""
                // Méthode 1: Chercher par texte
                const allLinks = document.querySelectorAll('a[href]');
                for (let link of allLinks) {
                    const text = link.textContent.toLowerCase().trim();
                    if (text.includes('next') || text.includes('suivant') || text === '→' || text === '>') {
                        return link.href;
                    }
                }
                
                // Méthode 2: Chercher dans la navigation
                const navLinks = document.querySelectorAll('nav a, .navigation a, .pagination a');
                for (let link of navLinks) {
                    const text = link.textContent.toLowerCase().trim();
                    if (text.includes('next') || text.includes('suivant')) {
                        return link.href;
                    }
                }
                
                // Méthode 3: Chercher par position (dernier lien de navigation)
                const navSections = document.querySelectorAll('nav, .navigation, .pagination');
                for (let nav of navSections) {
                    const links = nav.querySelectorAll('a[href]');
                    if (links.length >= 2) {
                        const lastLink = links[links.length - 1];
                        const text = lastLink.textContent.toLowerCase().trim();
                        if (!text.includes('previous') && !text.includes('précédent') && !text.includes('prev')) {
                            return lastLink.href;
                        }
                    }
                }
                
                return null;
            """)
            
            return next_link
            
        except Exception as e:
            logging.error(f"Erreur lors de la recherche du lien Next: {e}")
            return None
    
    def scrape_sequentially(self):
        """Scrapper séquentiellement en suivant les liens Next"""
        current_url = SCRAPER_CONFIG['start_url']
        page_count = 0
        
        logging.info(f"Debut du scrapping sequentiel depuis: {current_url}")
        
        while current_url and page_count < SCRAPER_CONFIG['max_pages']:
            if current_url in self.visited_urls:
                logging.warning(f"URL deja visitee, arret: {current_url}")
                break
                
            try:
                # Naviguer vers la page
                logging.info(f"Page {page_count + 1}/{SCRAPER_CONFIG['max_pages']}: {current_url}")
                self.driver.get(current_url)
                self.visited_urls.add(current_url)
                
                # Attendre le chargement
                time.sleep(SCRAPER_CONFIG['delay'])
                
                # Extraire les données
                page_data = self.extract_page_data(current_url)
                self.scraped_data['pages'][current_url] = page_data
                self.scraped_data['navigation_path'].append(current_url)
                
                # Consolider les paramètres
                if 'parameters' in page_data:
                    self.scraped_data['parameters']['all'].update(page_data['parameters'])
                
                # Consolider les exemples
                if 'examples' in page_data:
                    self.scraped_data['examples'].extend(page_data['examples'])
                
                # Consolider les schémas
                if 'schemas' in page_data:
                    self.scraped_data['schemas'].extend(page_data['schemas'])
                
                # Chercher le lien Next
                next_url = self.find_next_link()
                
                if next_url:
                    # Normaliser l'URL
                    if next_url.startswith('/'):
                        next_url = urljoin(SCRAPER_CONFIG['base_url'], next_url)
                    
                    # Vérifier que c'est bien une page de documentation Vapi
                    if 'docs.vapi.ai' in next_url:
                        current_url = next_url
                        page_count += 1
                    else:
                        logging.warning(f"Lien Next hors documentation: {next_url}")
                        break
                else:
                    logging.info("Aucun lien Next trouve, fin du scrapping")
                    break
                    
            except Exception as e:
                logging.error(f"Erreur lors du scrapping de {current_url}: {e}")
                break
        
        self.scraped_data['metadata']['total_pages'] = len(self.scraped_data['pages'])
        logging.info(f"Scrapping termine: {self.scraped_data['metadata']['total_pages']} pages")
    
    def generate_knowledge_base(self):
        """Générer la base de connaissances finale"""
        logging.info("Generation de la base de connaissances...")
        
        # Convertir le set en liste pour la sérialisation JSON
        self.scraped_data['parameters']['all'] = list(self.scraped_data['parameters']['all'])
        
        # Créer des catégories de paramètres
        all_params = self.scraped_data['parameters']['all']
        
        self.scraped_data['parameters']['categories'] = {
            'assistant': [p for p in all_params if any(keyword in p.lower() for keyword in ['assistant', 'firstmessage', 'endcall', 'prompt'])],
            'voice': [p for p in all_params if any(keyword in p.lower() for keyword in ['voice', 'speech', 'audio', 'tts', 'sound'])],
            'model': [p for p in all_params if any(keyword in p.lower() for keyword in ['model', 'llm', 'temperature', 'token', 'provider'])],
            'transcription': [p for p in all_params if any(keyword in p.lower() for keyword in ['transcrib', 'stt', 'speech', 'recognition'])],
            'tools': [p for p in all_params if any(keyword in p.lower() for keyword in ['tool', 'function', 'webhook', 'api'])],
            'calls': [p for p in all_params if any(keyword in p.lower() for keyword in ['call', 'phone', 'number', 'dial'])],
            'monitoring': [p for p in all_params if any(keyword in p.lower() for keyword in ['monitor', 'analys', 'observ', 'log'])]
        }
        
        # Statistiques finales
        stats = {
            'total_pages': len(self.scraped_data['pages']),
            'total_parameters': len(self.scraped_data['parameters']['all']),
            'total_examples': len(self.scraped_data['examples']),
            'total_schemas': len(self.scraped_data['schemas']),
            'navigation_depth': len(self.scraped_data['navigation_path'])
        }
        
        self.scraped_data['metadata']['statistics'] = stats
        
        logging.info(f"Base de connaissances generee:")
        logging.info(f"   {stats['total_pages']} pages")
        logging.info(f"   {stats['total_parameters']} parametres uniques")
        logging.info(f"   {stats['total_examples']} exemples de code")
        logging.info(f"   {stats['total_schemas']} schemas JSON")
    
    def save_data(self):
        """Sauvegarder les données"""
        try:
            with open(SCRAPER_CONFIG['output_file'], 'w', encoding='utf-8') as f:
                json.dump(self.scraped_data, f, indent=2, ensure_ascii=False)
            
            logging.info(f"Donnees sauvegardees dans: {SCRAPER_CONFIG['output_file']}")
            
            # Sauvegarder aussi un résumé
            summary_file = SCRAPER_CONFIG['output_file'].replace('.json', '-summary.json')
            summary = {
                'metadata': self.scraped_data['metadata'],
                'navigation_path': self.scraped_data['navigation_path'],
                'parameters_summary': self.scraped_data['parameters']['categories']
            }
            
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, ensure_ascii=False)
            
            logging.info(f"Resume sauvegarde dans: {summary_file}")
            
        except Exception as e:
            logging.error(f"Erreur lors de la sauvegarde: {e}")
    
    def cleanup(self):
        """Nettoyer les ressources"""
        if self.driver:
            self.driver.quit()
            logging.info("Driver ferme")
    
    def run(self):
        """Exécuter le scrapping complet"""
        try:
            self.setup_driver()
            self.scrape_sequentially()
            self.generate_knowledge_base()
            self.save_data()
            
            logging.info("Scrapping termine avec succes !")
            
        except Exception as e:
            logging.error(f"Erreur lors du scrapping: {e}")
        finally:
            self.cleanup()

if __name__ == "__main__":
    print("VAPI DOCUMENTATION SEQUENTIAL SCRAPER")
    print("=====================================")
    print(f"URL de depart: {SCRAPER_CONFIG['start_url']}")
    print(f"Fichier de sortie: {SCRAPER_CONFIG['output_file']}")
    print(f"Delai entre pages: {SCRAPER_CONFIG['delay']}s")
    print(f"Limite de pages: {SCRAPER_CONFIG['max_pages']}")
    print()
    
    scraper = VapiSequentialScraper()
    scraper.run() 