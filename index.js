function translateText() {
    const text = document.getElementById('textInput').value;
    const language = document.querySelector('input[name="language"]:checked').value;
    const originalDisplay = document.getElementById('originalText');
    const translatedDisplay = document.getElementById('translatedText');

    originalDisplay.textContent = text;

    // Simple hardcoded translations for demo
    let translation = '';
    if (language === 'fr') {
        translation = 'Comment allez-vous?'; // For "How are you?"
    } else if (language === 'es') {
        translation = '¿Cómo estás?';
    } else if (language === 'ja') {
        translation = '元気ですか？';
    }

    translatedDisplay.textContent = translation || 'Translation not available yet.';

    document.getElementById('inputForm').style.display = 'none';
    document.getElementById('resultForm').style.display = 'block';
}

function startOver() {
    document.getElementById('inputForm').style.display = 'block';
    document.getElementById('resultForm').style.display = 'none';
    document.getElementById('textInput').value = 'How are you?';
    document.querySelector('input[name="language"][value="fr"]').checked = true;
}