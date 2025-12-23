// ====================================
// Configuration - FIREBASE (Musisz uzupełnić!)
// ====================================
// Instrukcja konfiguracji Firebase jest w pliku INSTRUKCJA.txt

const firebaseConfig = {
    apiKey: "AIzaSyAb2TQUjho-_JGYIpjt2qT8qMVYnoyf_Cs",
    authDomain: "tatotesknie.firebaseapp.com",
    projectId: "tatotesknie",
    storageBucket: "tatotesknie.firebasestorage.app",
    messagingSenderId: "800800120840",
    appId: "1:800800120840:web:47ffc1e626df125763f1bd"
};

// ====================================
// Firebase Initialization
// ====================================
let db;
let lettersCollection;

// Sprawdź czy Firebase jest skonfigurowany
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "TWOJ_API_KEY";
}

// Inicjalizuj Firebase tylko jeśli jest skonfigurowany
if (isFirebaseConfigured()) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    lettersCollection = db.collection('letters');
}

// ====================================
// Local Storage Fallback (dla testów)
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

textarea.addEventListener('input', function() {
    const count = this.value.length;
    charCount.textContent = count;
    
    // Visual feedback when approaching limit
    if (count > 1800) {
        charCount.style.color = 'var(--color-sepia)';
    } else {
        charCount.style.color = 'var(--color-ink-light)';
    }
});

// ====================================
// Form Submission
// ====================================
const letterForm = document.getElementById('letter-form');
const successMessage = document.getElementById('success-message');

letterForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const content = document.getElementById('letter-content').value.trim();
    const signature = document.getElementById('letter-signature').value.trim();
    
    if (!content) {
        alert('Proszę napisać treść listu.');
        return;
    }
    
    // Disable button during submission
    const submitButton = this.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoading = submitButton.querySelector('.button-loading');
    
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline';
    
    const letter = {
        content: content,
        signature: signature || 'Anonimowo',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
    
    try {
        if (isFirebaseConfigured()) {
            // Save to Firebase
            await lettersCollection.add(letter);
        } else {
            // Save to Local Storage (fallback)
            saveLetterToLocalStorage(letter);
        }
        
        // Show success message
        successMessage.style.display = 'block';
        letterForm.reset();
        charCount.textContent = '0';
        
        // Reload letters
        await loadLetters();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        // Scroll to letters feed
        setTimeout(() => {
            document.getElementById('letters-feed').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 1000);
        
    } catch (error) {
        console.error('Błąd podczas wysyłania listu:', error);
        alert('Wystąpił błąd podczas wysyłania listu. Spróbuj ponownie.');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
    }
});

// ====================================
// Load Letters
// ====================================
async function loadLetters() {
    const container = document.getElementById('letters-container');
    
    try {
        let letters = [];
        
        if (isFirebaseConfigured()) {
            // Load from Firebase
            const snapshot = await lettersCollection
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();
            
            letters = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } else {
            // Load from Local Storage
            letters = getLettersFromLocalStorage();
        }
        
        if (letters.length === 0) {
            container.innerHTML = `
                <div class="no-letters">
                    <p>Jeszcze nie ma żadnych listów. Bądź pierwszą osobą, która podzieli się swoimi słowami.</p>
                </div>
            `;
            return;
        }
        
        // Render letters
        container.innerHTML = letters.map((letter, index) => `
            <div class="letter-card" style="animation-delay: ${index * 0.1}s">
                <div class="letter-content">${escapeHtml(letter.content)}</div>
                <div class="letter-signature">— ${escapeHtml(letter.signature)}</div>
                <div class="letter-date">${letter.date}</div>
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
        
        // Create modal with random letter
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            animation: fadeIn 0.3s ease-out;
        `;
        
        modal.innerHTML = `
            <div style="
                background-color: var(--color-paper);
                max-width: 600px;
                width: 100%;
                padding: 2rem;
                border-radius: 2px;
                box-shadow: var(--shadow-medium);
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            ">
                <button onclick="this.closest('div[style*=fixed]').remove()" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--color-ink-light);
                    line-height: 1;
                    padding: 0.5rem;
                ">×</button>
                <h3 style="
                    font-family: var(--font-serif);
                    font-size: 1.8rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-ink);
                ">Wylosowany list</h3>
                <div style="
                    font-size: 1.05rem;
                    line-height: 1.8;
                    color: var(--color-ink);
                    margin-bottom: 1rem;
                    white-space: pre-wrap;
                ">${escapeHtml(randomLetter.content)}</div>
                <div style="
                    text-align: right;
                    font-style: italic;
                    color: var(--color-ink-light);
                    margin-top: 1rem;
                ">— ${escapeHtml(randomLetter.signature)}</div>
                <div style="
                    text-align: right;
                    font-size: 0.85rem;
                    color: var(--color-accent);
                    margin-top: 0.5rem;
                ">${randomLetter.date}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
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
    document.getElementById('write-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
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
// Initialize on Page Load
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    loadLetters();
    
    // Show warning if Firebase is not configured
    if (!isFirebaseConfigured()) {
        console.warn('Firebase nie jest skonfigurowany. Używam Local Storage jako backup.');
        console.warn('Przeczytaj plik INSTRUKCJA.txt aby skonfigurować Firebase.');
    }
});
