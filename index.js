// IMPORTANT: Replace the placeholder below with your actual OpenAI API key
// Get one at https://platform.openai.com/api-keys
// Never commit or share this key publicly!
const OPENAI_API_KEY = 'your-openai-api-key-here';

const MODEL = 'gpt-4o-mini'; // You can change to 'gpt-3.5-turbo' or 'gpt-4o' if preferred

const translateBtn = document.getElementById('translateBtn');

async function translateText() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        alert('Please enter some text to translate.');
        return;
    }

    // Check API key
    if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('your-openai-api-key-here')) {
        alert('Please set a valid OpenAI API key in the JavaScript code.');
        return;
    }

    const languageCode = document.querySelector('input[name="language"]:checked').value;

    const languageName = {
        fr: 'French',
        es: 'Spanish',
        ja: 'Japanese'
    }[languageCode];

    const originalDisplay = document.getElementById('originalText');
    const translatedDisplay = document.getElementById('translatedText');

    // Show results with loading state
    originalDisplay.textContent = text;
    translatedDisplay.textContent = 'Translating...';

    document.getElementById('inputForm').style.display = 'none';
    document.getElementById('resultForm').style.display = 'block';

    // Disable button
    translateBtn.disabled = true;
    translateBtn.textContent = 'Translating...';

    const messages = [
        {
            role: "system",
            content: "You are a professional translator. Translate the given text accurately and naturally into the target language. Output ONLY the translated text with no additional explanations, quotes, or formatting."
        },
        {
            role: "user",
            content: `Text to translate: "${text}"\nTarget language: ${languageName}`
        }
    ];

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messages,
                temperature: 0,         // Low temperature for consistent translations
                max_tokens: 500        // Sufficient for most translations
            })
        });

        if (!response.ok) {
            let errorMsg = 'OpenAI API request failed';
            if (response.status === 401) errorMsg = 'Invalid API key';
            if (response.status === 429) errorMsg = 'Rate limit or quota exceeded';
            if (response.status === 500) errorMsg = 'OpenAI server error';
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            throw new Error('No translation returned');
        }

        const translation = data.choices[0].message.content.trim();
        translatedDisplay.textContent = translation;

    } catch (error) {
        console.error('Translation error:', error);
        translatedDisplay.textContent = `Error: ${error.message || 'Could not translate. Check console or try again.'}`;
    }

    // Button stays disabled until Start Over (cleaner UX)
}

function startOver() {
    document.getElementById('inputForm').style.display = 'block';
    document.getElementById('resultForm').style.display = 'none';

    document.getElementById('textInput').value = 'How are you?';
    document.querySelector('input[name="language"][value="fr"]').checked = true;

    translateBtn.disabled = false;
    translateBtn.textContent = 'Translate';

    document.getElementById('originalText').textContent = '';
    document.getElementById('translatedText').textContent = 'Translating..';
}

translateBtn.addEventListener('click', translateText);