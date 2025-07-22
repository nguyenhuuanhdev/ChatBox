const translations = {
    'en-vi': {
        'hello': 'xin chào',
        'hi': 'chào',
        'goodbye': 'tạm biệt',
        'thank you': 'cảm ơn',
        'thanks': 'cảm ơn',
        'yes': 'có',
        'no': 'không',
        'please': 'xin hãy',
        'sorry': 'xin lỗi',
        'excuse me': 'xin lỗi',
        'how are you': 'bạn có khỏe không',
        'i love you': 'anh yêu em',
        'good morning': 'chào buổi sáng',
        'good night': 'chúc ngủ ngon',
        'water': 'nước',
        'food': 'thức ăn',
        'house': 'nhà',
        'cat': 'mèo',
        'dog': 'chó',
        'beautiful': 'đẹp',
        'good': 'tốt',
        'bad': 'xấu',
        'big': 'lớn',
        'small': 'nhỏ'
    },
    'vi-en': {
        'xin chào': 'hello',
        'chào': 'hi',
        'tạm biệt': 'goodbye',
        'cảm ơn': 'thank you',
        'có': 'yes',
        'không': 'no',
        'xin hãy': 'please',
        'xin lỗi': 'sorry',
        'bạn có khỏe không': 'how are you',
        'anh yêu em': 'i love you',
        'chào buổi sáng': 'good morning',
        'chúc ngủ ngon': 'good night',
        'nước': 'water',
        'thức ăn': 'food',
        'nhà': 'house',
        'mèo': 'cat',
        'chó': 'dog',
        'đẹp': 'beautiful',
        'tốt': 'good',
        'xấu': 'bad',
        'lớn': 'big',
        'nhỏ': 'small'
    },
    'en-ko': {
        'hello': '안녕하세요',
        'hi': '안녕',
        'goodbye': '안녕히 가세요',
        'thank you': '감사합니다',
        'yes': '네',
        'no': '아니요',
        'please': '부탁합니다',
        'sorry': '죄송합니다',
        'how are you': '어떻게 지내세요',
        'i love you': '사랑해요',
        'good morning': '좋은 아침',
        'good night': '잘 자요',
        'water': '물',
        'food': '음식',
        'house': '집',
        'cat': '고양이',
        'dog': '개',
        'beautiful': '아름다운',
        'good': '좋은',
        'bad': '나쁜'
    },
    'en-ja': {
        'hello': 'こんにちは',
        'hi': 'やあ',
        'goodbye': 'さようなら',
        'thank you': 'ありがとうございます',
        'yes': 'はい',
        'no': 'いいえ',
        'please': 'お願いします',
        'sorry': 'すみません',
        'how are you': '元気ですか',
        'i love you': '愛してる',
        'good morning': 'おはようございます',
        'good night': 'おやすみなさい',
        'water': '水',
        'food': '食べ物',
        'house': '家',
        'cat': '猫',
        'dog': '犬',
        'beautiful': '美しい',
        'good': '良い',
        'bad': '悪い'
    }
};

function swapLanguages() {
    const fromLang = document.getElementById('fromLang');
    const toLang = document.getElementById('toLang');
    const temp = fromLang.value;
    fromLang.value = toLang.value;
    toLang.value = temp;
}

function handleKeyUp(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
        translateText();
    }
}

async function translateText() {
    const text = document.getElementById("inputText").value.trim();
    const from = document.getElementById("fromLang").value;
    const to = document.getElementById("toLang").value;
    const output = document.getElementById("output");
    const btn = document.getElementById("translateBtn");

    if (!text) {
        output.textContent = "⚠️ Please enter some text to translate.";
        return;
    }

    if (from === to) {
        output.textContent = "⚠️ Please select different source and target languages.";
        return;
    }

    btn.disabled = true;
    btn.innerHTML = "⏳ Translating...";
    output.textContent = "⏳ Translating...";

    try {
        // Try multiple translation APIs
        let translated = await tryTranslateWithAPIs(text, from, to);

        if (!translated) {
            // Fallback to local dictionary
            translated = translateWithDictionary(text, from, to);
        }

        if (translated) {
            output.innerHTML = `<strong>Translation:</strong><br>${translated}`;
        } else {
            output.innerHTML = `<strong>⚠️ Translation not available</strong><br>Try using a different API or check your internet connection.<br><br><em>Suggestion: Try simple words like "hello", "thank you", etc.</em>`;
        }
    } catch (error) {
        console.error("Translation error:", error);
        output.innerHTML = `<strong>❌ Translation failed</strong><br>Error: ${error.message}<br><br><em>Suggestion: Try simpler text or check your connection.</em>`;
    } finally {
        btn.disabled = false;
        btn.innerHTML = " Translate";
    }
}

async function tryTranslateWithAPIs(text, from, to) {
    const apis = [
        // API 1: MyMemory Translation
        async () => {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
            const data = await response.json();
            if (data.responseStatus === 200 && data.responseData.translatedText) {
                return data.responseData.translatedText;
            }
            return null;
        },

        // API 2: Translate.googleapis.com (free tier)
        async () => {
            try {
                const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
                const data = await response.json();
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    return data[0][0][0];
                }
            } catch (e) {
                return null;
            }
            return null;
        }
    ];

    for (let api of apis) {
        try {
            const result = await api();
            if (result && result.trim() && result.toLowerCase() !== text.toLowerCase()) {
                return result;
            }
        } catch (error) {
            console.log("API failed, trying next:", error);
            continue;
        }
    }
    return null;
}

function translateWithDictionary(text, from, to) {
    const key = `${from}-${to}`;
    const dict = translations[key];

    if (!dict) {
        return null;
    }

    const lowerText = text.toLowerCase().trim();

    // Exact match
    if (dict[lowerText]) {
        return dict[lowerText];
    }

    // Word by word translation for simple cases
    const words = lowerText.split(' ');
    const translatedWords = words.map(word => {
        const cleanWord = word.replace(/[^\w\s]/g, '');
        return dict[cleanWord] || word;
    });

    const result = translatedWords.join(' ');
    return result !== lowerText ? result : null;
}

// Auto-translate on page load with sample text
window.onload = function () {
    document.getElementById("inputText").value = "Hello, how are you?";
    setTimeout(() => {
        translateText();
    }, 1000);
};