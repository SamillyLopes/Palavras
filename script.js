document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const extractBtn = document.getElementById('extract-btn');
    const keywordsContainer = document.getElementById('keywords-container');
    
    extractBtn.addEventListener('click', extractKeywords);
    
    function extractKeywords() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Por favor, insira algum texto para análise.');
            return;
        }
        
        // Limpa resultados anteriores
        keywordsContainer.innerHTML = '';
        
        // Processa o texto e extrai palavras-chave
        const keywords = processText(text);
        
        if (keywords.length === 0) {
            keywordsContainer.innerHTML = '<p class="placeholder">Nenhuma palavra-chave relevante encontrada.</p>';
            return;
        }
        
        // Exibe as palavras-chave
        keywords.forEach(keyword => {
            const keywordElement = document.createElement('div');
            keywordElement.className = 'keyword';
            keywordElement.textContent = keyword;
            
            // Destaca palavras mais importantes (as primeiras da lista)
            if (keywords.indexOf(keyword) < 5) {
                keywordElement.classList.add('highlight');
            }
            
            keywordElement.addEventListener('click', function() {
                highlightInText(keyword);
            });
            
            keywordsContainer.appendChild(keywordElement);
        });
    }
    
    function processText(text) {
        // Remove caracteres especiais e converte para minúsculas
        const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
        
        // Lista de palavras comuns a serem ignoradas (stop words)
        const stopWords = new Set([
            'a', 'o', 'e', 'é', 'de', 'do', 'da', 'das', 'dos', 'em', 'no', 'na', 'nas', 'nos',
            'por', 'para', 'com', 'como', 'que', 'se', 'ou', 'mas', 'ao', 'à', 'às', 'um', 'uma',
            'uns', 'umas', 'meu', 'minha', 'teu', 'tua', 'seu', 'sua', 'nossa', 'nosso', 'deles',
            'delas', 'isto', 'isso', 'aquilo', 'este', 'esta', 'esse', 'essa', 'aquele', 'aquela',
            'aqueles', 'aquelas', 'outro', 'outra', 'outros', 'outras', 'qual', 'quais', 'quando',
            'onde', 'como', 'porque', 'porquê', 'quem', 'cujo', 'cuja', 'cujos', 'cujas', 'quanto',
            'quantos', 'quanta', 'quantas', 'tanto', 'tantos', 'tanta', 'tantas', 'cada', 'algo',
            'algum', 'alguma', 'alguns', 'algumas', 'nenhum', 'nenhuma', 'nenhuns', 'nenhumas',
            'todo', 'todos', 'toda', 'todas', 'outrem', 'quê', 'nada', 'ninguém', 'qualquer',
            'quaisquer', 'tudo', 'ambos', 'cerca', 'demais', 'mesmo', 'próprio', 'própria', 'próprios',
            'próprias', 'ser', 'estar', 'ter', 'haver', 'fazer', 'poder', 'ir', 'vir', 'ver', 'dar',
            'saber', 'querer', 'dizer', 'ficar', 'dever', 'passar', 'achar', 'deixar', 'entrar', 'tornar',
            'viver', 'sentir', 'olhar', 'aparecer', 'acabar', 'permitir', 'existir', 'considerar', 'esperar',
            'partir', 'voltar', 'encontrar', 'lembrar', 'continuar', 'começar', 'parar', 'perguntar',
            'conhecer', 'tratar', 'formar', 'levar', 'produzir', 'significar', 'morrer', 'nascer', 'perder',
            'correr', 'criar', 'pegar', 'valer', 'ganhar', 'reconhecer', 'manter', 'defender', 'seguir',
            'realizar', 'construir', 'compreender', 'escrever', 'incluir', 'apresentar', 'dirigir', 'pagar',
            'sobreviver', 'desenvolver', 'obter', 'precisar', 'estudar', 'alcançar', 'mostrar', 'escolher',
            'abrir', 'ouvir', 'aceitar', 'responder', 'trabalhar', 'jogar', 'gostar', 'importar', 'servir',
            'acreditar', 'sentar', 'custar', 'cortar', 'controlar', 'descrever', 'desenhar', 'beijar', 'matar',
            'mudar', 'oferecer', 'julgar', 'movimentar', 'organizar', 'preparar', 'combater', 'cobrir',
            'decidir', 'destruir', 'dividir', 'expressar', 'fechar', 'imaginar', 'ligar', 'pousar', 'quebrar',
            'recusar', 'saltar', 'tirar', 'transformar', 'usar', 'vender', 'visitar', 'voar', 'ajudar', 'amar',
            'andar', 'aprender', 'beber', 'comer', 'conduzir', 'conversar', 'dormir', 'ensinar', 'esquecer',
            'evitar', 'falar', 'gritar', 'largar', 'ler', 'limpar', 'mentir', 'odiar', 'pedir', 'pensar',
            'prender', 'prometer', 'rir', 'sorrir', 'tocar', 'tomar', 'vender', 'viajar', 'votar'
        ]);
        
        // Divide o texto em palavras individuais
        const words = cleanedText.split(/\s+/);
        
        // Conta a frequência de cada palavra
        const wordFrequency = {};
        words.forEach(word => {
            if (word.length > 3 && !stopWords.has(word)) { // Ignora palavras muito curtas e stop words
                wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            }
        });
        
        // Converte o objeto em array e ordena por frequência
        const sortedKeywords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
        
        // Retorna as 20 palavras mais frequentes
        return sortedKeywords.slice(0, 20);
    }
    
    function highlightInText(keyword) {
        const text = textInput.value;
        if (!text) return;
        
        // Cria uma expressão regular para encontrar a palavra (case insensitive)
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        
        // Substitui no texto original com marcação de destaque
        const highlightedText = text.replace(regex, match => 
            `<span class="text-highlight">${match}</span>`
        );
        
        // Cria um elemento temporário para mostrar o texto destacado
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
            <div class="highlighted-text-container">
                <h3>Palavra-chave: "${keyword}"</h3>
                <div class="highlighted-text">${highlightedText}</div>
                <button id="close-highlight">Fechar</button>
            </div>
        `;
        
        // Remove qualquer destaque anterior
        const oldHighlight = document.querySelector('.highlighted-text-container');
        if (oldHighlight) oldHighlight.remove();
        
        // Adiciona ao DOM
        document.body.appendChild(tempDiv.firstChild);
        
        // Adiciona evento para fechar o destaque
        document.getElementById('close-highlight').addEventListener('click', function() {
            document.querySelector('.highlighted-text-container').remove();
        });
    }
});
