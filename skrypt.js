// ====================================
// Configuration - FIREBASE
// ====================================
const firebaseConfig = {
    apiKey: "AIzaSyAb2TQUjho-_JGYIpjt2qT8qMVYnoyf_Cs",
    authDomain: "tatotesknie.firebaseapp.com",
    projectId: "tatotesknie",
    storageBucket: "tatotesknie.firebasestorage.app",
    messagingSenderId: "800800120840",
    appId: "1:800800120840:web:47ffc1e626df125763f1bd"
};

// ====================================
// Quotes about fathers and longing
// ====================================
const quotes = [
    "Śmierć ojca to pierwsze prawdziwe smutne wydarzenie, które odczuwamy. - Anatole France",
    "Gdy ojciec odchodzi, zabiera ze sobą część dzieciństwa. - Nieznany",
    "Tęsknota to miłość, która przetrwała rozłąkę. - Nieznany",
    "Ojciec może nie zawsze mówić dużo, ale jego obecność mówi wszystko. - Nieznany",
    "Nie ma większej siły niż cicha miłość ojca. - Nieznany",
    "Pamięć o ojcu to skarb, którego nikt nie może zabrać. - Nieznany",
    "Dobry ojciec jest jednym z najbardziej niezrozumianych, niewysławianych postaci w naszym społeczeństwie. - Billy Graham",
    "Ojciec nie uczy nas żyć, ale pokazuje, jak warto żyć. - Nieznany",
    "Tęsknota nie znika. Uczymy się z nią żyć. - Nieznany",
    "Miłość ojca jest cicha, ale głośniejsza niż słowa. - Nieznany"
];

function displayRandomQuote() {
    const quoteElement = document.getElementById('random-quote');
    if (quoteElement) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
    }
}

// ====================================
// Firebase Initialization
// ====================================
let db;
let lettersCollection;

function isFirebaseConfigured() {
    return typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "TWOJ_API_KEY";
}

// Inicjalizuj Firebase tylko jeśli biblioteka jest załadowana
if (isFirebaseConfigured()) {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        lettersCollection = db.collection('letters');
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// ====================================
// Local Storage Fallback
// ====================================
const LOCAL_STORAGE_KEY = 'tatotesknie_letters';

function getLettersFromLocalStorage() {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveLetterToLocalStorage(letter) {
    const letters = getLettersFromLocalStorage();
    letters.unshift(letter);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(letters));
}

// ====================================
// Character Counter
// ====================================
const textarea = document.getElementById('letter-content');
const charCount = document.getElementById('char-count');

if (textarea && charCount) {
    textarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 1800) {
            charCount.style.color = 'var(--color-sepia)';
        } else {
            charCount.style.color = 'var(--color-text-muted)';
        }
    });
}

// ====================================
// Form Submission
// ====================================
const letterForm = document.getElementById('letter-form');
const successMessage = document.getElementById('success-message');

if (letterForm) {
    letterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const content = document.getElementById('letter-content').value.trim();
        const signature = document.getElementById('letter-signature').value.trim();
        const consent = document.getElementById('privacy-consent').checked;
        
        if (!content) {
            alert('Proszę napisać treść listu.');
            return;
        }
        
        if (!consent) {
            alert('Aby wysłać list, musisz zaakceptować politykę prywatności.');
            return;
        }
        
        const submitButton = this.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoading = submitButton.querySelector('.button-loading');
        
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';
        
        const letter = {
            content: content,
            signature: signature || 'Anonimowo',
            yearsPassed: document.getElementById('years-passed').value.trim() || null,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            candles: 0
        };
        
        try {
            if (isFirebaseConfigured()) {
                await lettersCollection.add(letter);
            } else {
                saveLetterToLocalStorage(letter);
            }
            
            // Animacja listu
            showFlyingLetterAnimation(content, signature || 'Anonimowo');
            
            // Po 3 sekundach pokaż sukces
            setTimeout(async () => {
                successMessage.style.display = 'block';
                letterForm.reset();
                charCount.textContent = '0';
                
                await loadLetters();
                
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
                
                setTimeout(() => {
                    const feedSection = document.getElementById('letters-feed');
                    if (feedSection) {
                        feedSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 1000);
            }, 3000);
            
        } catch (error) {
            console.error('Błąd podczas wysyłania listu:', error);
            alert('Wystąpił błąd podczas wysyłania listu. Spróbuj ponownie.');
        } finally {
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
        }
    });
}

// ====================================
// Load Letters
// ====================================
async function loadLetters() {
    const container = document.getElementById('letters-container');
    if (!container) return;
    
    try {
        let letters = [];
        
        if (isFirebaseConfigured()) {
            const snapshot = await lettersCollection
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();
            
            letters = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } else {
            letters = getLettersFromLocalStorage();
        }
        
        if (letters.length === 0) {
            container.innerHTML = `
                <div class="no-letters">
                    <p>Jeszcze nie ma żadnych listów. Bądź pierwszą osobą, która podzieli się swoimi słowami.</p>
                </div>
            `;
            updateLetterCounter(0);
            return;
        }
        
        // Update counter
        updateLetterCounter(letters.length);
        
        container.innerHTML = letters.map((letter, index) => `
            <div class="letter-card" style="animation-delay: ${index * 0.1}s" data-letter-id="${letter.id || index}">
                <div class="letter-content">${escapeHtml(letter.content)}</div>
                <div class="letter-signature">— ${escapeHtml(letter.signature)}</div>
                ${letter.yearsPassed ? `<div class="letter-years">⏳ ${escapeHtml(letter.yearsPassed)}</div>` : ''}
                <div class="letter-date">${letter.date}</div>
                <div class="candle-actions">
                    <button class="candle-button" onclick="lightCandle('${letter.id || index}')" data-candle-btn="${letter.id || index}">
                        <span class="candle-icon">🕯️</span>
                        <span class="candle-count" data-candle-count="${letter.id || index}">${letter.candles || 0}</span>
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Błąd podczas ładowania listów:', error);
        container.innerHTML = `
            <div class="loading-state">
                <p>Nie udało się załadować listów. Spróbuj odświeżyć stronę.</p>
            </div>
        `;
    }
}

// ====================================
// Random Letter Feature
// ====================================
window.showRandomLetter = async function() {
    try {
        let letters = [];
        
        if (isFirebaseConfigured()) {
            const snapshot = await lettersCollection.get();
            letters = snapshot.docs.map(doc => doc.data());
        } else {
            letters = getLettersFromLocalStorage();
        }
        
        if (letters.length === 0) {
            alert('Nie ma jeszcze żadnych listów do wylosowania.');
            return;
        }
        
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            animation: fadeIn 0.3s ease-out;
        `;
        
        modal.innerHTML = `
            <div style="
                background-color: var(--color-paper-dark);
                max-width: 600px;
                width: 100%;
                padding: 2rem;
                border-radius: 2px;
                box-shadow: var(--shadow-medium);
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                border: 1px solid rgba(212, 165, 116, 0.3);
            ">
                <button onclick="this.closest('div[style*=fixed]').remove()" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--color-text-secondary);
                    line-height: 1;
                    padding: 0.5rem;
                ">×</button>
                <h3 style="
                    font-family: var(--font-serif);
                    font-size: 1.8rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-text-primary);
                ">Wylosowany list</h3>
                <div style="
                    font-size: 1.05rem;
                    line-height: 1.8;
                    color: var(--color-text-primary);
                    margin-bottom: 1rem;
                    white-space: pre-wrap;
                ">${escapeHtml(randomLetter.content)}</div>
                <div style="
                    text-align: right;
                    font-style: italic;
                    color: var(--color-text-secondary);
                    margin-top: 1rem;
                ">— ${escapeHtml(randomLetter.signature)}</div>
                <div style="
                    text-align: right;
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    margin-top: 0.5rem;
                ">${randomLetter.date}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('Błąd podczas losowania listu:', error);
        alert('Nie udało się wylosować listu.');
    }
};

// ====================================
// Scroll to Form Function
// ====================================
window.scrollToForm = function() {
    const section = document.getElementById('write-section');
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// ====================================
// Utility Functions
// ====================================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ====================================
// Letter Counter
// ====================================
function updateLetterCounter(count) {
    const counterElement = document.getElementById('total-letters-count');
    if (counterElement) {
        counterElement.textContent = count;
    }
}

// ====================================
// Candle Lighting Feature
// ====================================
window.lightCandle = async function(letterId) {
    const button = document.querySelector(`[data-candle-btn="${letterId}"]`);
    const countElement = document.querySelector(`[data-candle-count="${letterId}"]`);
    
    if (!button || !countElement) return;
    
    // Check if already lit by this user (localStorage)
    const litCandles = JSON.parse(localStorage.getItem('lit_candles') || '[]');
    
    if (litCandles.includes(letterId)) {
        // Already lit
        return;
    }
    
    // Add visual feedback
    button.classList.add('lit');
    
    // Update count
    let currentCount = parseInt(countElement.textContent) || 0;
    currentCount++;
    countElement.textContent = currentCount;
    
    // Save to localStorage
    litCandles.push(letterId);
    localStorage.setItem('lit_candles', JSON.stringify(litCandles));
    
    // Update in Firebase (if configured)
    if (isFirebaseConfigured() && letterId.length > 10) {
        try {
            await lettersCollection.doc(letterId).update({
                candles: firebase.firestore.FieldValue.increment(1)
            });
        } catch (error) {
            console.error('Error updating candle count:', error);
        }
    }
};

// ====================================
// Flying Letter Animation
// ====================================
function showFlyingLetterAnimation(content, signature) {
    const shortContent = content.length > 150 
        ? content.substring(0, 150) + '...' 
        : content;
    
    const container = document.createElement('div');
    container.className = 'flying-letter-container';
    
    container.innerHTML = `
        <div class="flying-letter">
            <div class="sparkle"></div>
            <div class="sparkle"></div>
            <div class="sparkle"></div>
            <div class="sparkle"></div>
            <div class="sparkle"></div>
            <div class="flying-letter-content">${escapeHtml(shortContent)}</div>
            <div class="flying-letter-signature">— ${escapeHtml(signature)}</div>
        </div>
    `;
    
    document.body.appendChild(container);
    
    setTimeout(() => {
        container.remove();
    }, 3000);
}

// ====================================
// Initialize on Page Load
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    // Display random quote
    displayRandomQuote();
    
    // Load letters
    loadLetters();
    
    // Restore lit candles from localStorage
    setTimeout(() => {
        const litCandles = JSON.parse(localStorage.getItem('lit_candles') || '[]');
        litCandles.forEach(letterId => {
            const button = document.querySelector(`[data-candle-btn="${letterId}"]`);
            if (button) {
                button.classList.add('lit');
            }
        });
    }, 500);
    
    if (!isFirebaseConfigured()) {
        console.warn('Firebase nie jest skonfigurowany. Używam Local Storage jako backup.');
    }
});
