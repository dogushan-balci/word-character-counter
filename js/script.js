class TextAnalyzer {
    constructor() {
        this.textarea = document.getElementById('text-input');
        this.wordCount = document.getElementById('word-count');
        this.charCount = document.getElementById('char-count');
        this.charNoSpaceCount = document.getElementById('char-no-space-count');
        this.lineCount = document.getElementById('line-count');
        this.paragraphCount = document.getElementById('paragraph-count');
        this.uniqueWordCount = document.getElementById('unique-word-count');
        this.distributionGrid = document.getElementById('distribution-grid');
        this.wordsList = document.getElementById('words-list');
        this.avgWordLength = document.getElementById('avg-word-length');
        this.longestWord = document.getElementById('longest-word');
        this.longestWordLength = document.getElementById('longest-word-length');
        this.clearBtn = document.getElementById('clear-btn');
        this.copyBtn = document.getElementById('copy-btn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.textarea.addEventListener('input', () => this.analyzeText());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.copyBtn.addEventListener('click', () => this.copyText());
    }

    analyzeText() {
        const text = this.textarea.value;
        this.updateBasicStats(text);
        this.updateWordAnalysis(text);
        this.updateWordLengthDistribution(text);
        this.updateMostUsedWords(text);
    }

    updateBasicStats(text) {
        // Kelime sayısı
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        this.wordCount.textContent = words.length;

        // Karakter sayısı (boşluklu ve boşluksuz)
        this.charCount.textContent = text.length;
        this.charNoSpaceCount.textContent = text.replace(/\s/g, '').length;

        // Satır sayısı
        const lines = text.split('\n');
        this.lineCount.textContent = lines.length;

        // Paragraf sayısı
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        this.paragraphCount.textContent = paragraphs.length;

        // Benzersiz kelime sayısı
        const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[.,!?]/g, '')));
        this.uniqueWordCount.textContent = uniqueWords.size;
    }

    updateWordAnalysis(text) {
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        
        if (words.length === 0) {
            this.avgWordLength.textContent = '0';
            this.longestWord.textContent = '-';
            this.longestWordLength.textContent = '0';
            return;
        }

        // Ortalama kelime uzunluğu
        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        const average = (totalLength / words.length).toFixed(1);
        this.avgWordLength.textContent = average;

        // En uzun kelime
        const longest = words.reduce((a, b) => a.length > b.length ? a : b);
        this.longestWord.textContent = longest;
        this.longestWordLength.textContent = longest.length;
        // En uzun kelime için font boyutunu ayarla
        if (longest.length > 15) {
            this.longestWord.style.fontSize = '0.875rem';
        } else {
            this.longestWord.style.fontSize = '2rem';
        }
    }

    updateWordLengthDistribution(text) {
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        const distribution = new Array(9).fill(0); // 2-10 harf aralığı için 9 eleman

        words.forEach(word => {
            const length = word.length;
            if (length >= 2 && length <= 10) {
                distribution[length - 2]++; // 2'den başlayarak indeksleme
            }
        });

        this.distributionGrid.innerHTML = '';
        distribution.forEach((count, index) => {
            const item = document.createElement('div');
            item.className = 'distribution-item';
            item.setAttribute('data-length', `${index + 2} letters`);
            item.innerHTML = `<span>${count}</span>`;
            this.distributionGrid.appendChild(item);
        });
    }

    updateMostUsedWords(text) {
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        const wordCount = new Map();

        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
            if (cleanWord) {
                wordCount.set(cleanWord, (wordCount.get(cleanWord) || 0) + 1);
            }
        });

        const sortedWords = Array.from(wordCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12); // En çok kullanılan 12 kelime

        this.wordsList.innerHTML = '';
        sortedWords.forEach(([word, count]) => {
            const item = document.createElement('div');
            item.className = 'word-item';
            item.innerHTML = `
                <span>${word}</span>
                <span>${count}</span>
            `;
            this.wordsList.appendChild(item);
        });
    }

    clearText() {
        this.textarea.value = '';
        this.analyzeText();
        this.showToast('Text cleared', 'success');
    }

    copyText() {
        const text = this.textarea.value;
        if (!text) {
            this.showToast('No text to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => this.showToast('Text copied to clipboard', 'success'))
            .catch(() => this.showToast('Failed to copy text', 'error'));
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Sayfa yüklendiğinde TextAnalyzer'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new TextAnalyzer();
}); 