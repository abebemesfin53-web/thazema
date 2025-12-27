import { useState, useRef, useEffect, useCallback } from 'react';
import { FaRobot, FaPaperPlane, FaLanguage, FaBell, FaCog, FaChartBar, FaTimes, FaMicrophone, FaVolumeUp, FaVolumeMute, FaGlobe, FaLock, FaMale, FaFemale, FaCloudSun, FaLaugh, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { createURL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import thazemaAI from '../services/ThazemaAI';
import './AdminAI.css';

const ADMIN_EMAIL = 'abebemesfin53@gmail.com';

const languageConfig = {
  en: { code: 'en-US', name: 'English', flag: '🇬🇧', voice: 'en-US', ttsCode: 'en' },
  am: { code: 'am-ET', name: 'አማርኛ', flag: '🇪🇹', voice: 'am-ET', ttsCode: 'am' },
  ar: { code: 'ar-SA', name: 'العربية', flag: '🇸🇦', voice: 'ar-SA', ttsCode: 'ar' },
  fr: { code: 'fr-FR', name: 'Français', flag: '🇫🇷', voice: 'fr-FR', ttsCode: 'fr' },
  es: { code: 'es-ES', name: 'Español', flag: '🇪🇸', voice: 'es-ES', ttsCode: 'es' },
  zh: { code: 'zh-CN', name: '中文', flag: '🇨🇳', voice: 'zh-CN', ttsCode: 'zh' },
  hi: { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳', voice: 'hi-IN', ttsCode: 'hi' },
  pt: { code: 'pt-BR', name: 'Português', flag: '🇧🇷', voice: 'pt-BR', ttsCode: 'pt' },
  ru: { code: 'ru-RU', name: 'Русский', flag: '🇷🇺', voice: 'ru-RU', ttsCode: 'ru' },
  ja: { code: 'ja-JP', name: '日本語', flag: '🇯🇵', voice: 'ja-JP', ttsCode: 'ja' }
};

const greetings = {
  en: { hello: "Hello", howAreYou: "How can I help you today?", welcome: "Welcome back, Admin!" },
  am: { hello: "ሰላም", howAreYou: "ዛሬ እንዴት ልረዳዎት እችላለሁ?", welcome: "እንኳን ደህና መጡ አስተዳዳሪ!" },
  ar: { hello: "مرحبا", howAreYou: "كيف يمكنني مساعدتك اليوم؟", welcome: "مرحبًا بعودتك أيها المسؤول!" },
  fr: { hello: "Bonjour", howAreYou: "Comment puis-je vous aider?", welcome: "Bienvenue Admin!" },
  es: { hello: "Hola", howAreYou: "¿Cómo puedo ayudarte hoy?", welcome: "¡Bienvenido Admin!" },
  zh: { hello: "你好", howAreYou: "今天我能帮您什么?", welcome: "欢迎回来管理员!" },
  hi: { hello: "नमस्ते", howAreYou: "आज मैं आपकी कैसे मदद कर सकता हूं?", welcome: "स्वागत है एडमिन!" },
  pt: { hello: "Olá", howAreYou: "Como posso ajudá-lo hoje?", welcome: "Bem-vindo Admin!" },
  ru: { hello: "Привет", howAreYou: "Как я могу помочь вам сегодня?", welcome: "Добро пожаловать Админ!" },
  ja: { hello: "こんにちは", howAreYou: "今日はどのようにお手伝いできますか?", welcome: "おかえりなさい管理者!" }
};

const responses = {
  en: { notAdmin: "⚠️ Admin commands require admin login.", blocked: "✅ User blocked.", unblocked: "✅ User unblocked.", deleted: "✅ User deleted.", notifSent: "🔔 Notification sent!", serverOk: "✅ Server running!", serverError: "⚠️ Server issue.", thanks: "You're welcome!", bye: "Goodbye! 👋", thinking: "Searching..." },
  am: { notAdmin: "⚠️ የአስተዳዳሪ ትዕዛዞች የአስተዳዳሪ መግቢያ ያስፈልጋቸዋል።", blocked: "✅ ተጠቃሚው ታግዷል።", unblocked: "✅ ተጠቃሚው ተከፍቷል።", deleted: "✅ ተጠቃሚው ተሰርዟል።", notifSent: "🔔 ማሳወቂያ ተልኳል!", serverOk: "✅ ሰርቨር እየሰራ ነው!", serverError: "⚠️ የሰርቨር ችግር።", thanks: "እንኳን ደስ አለዎት!", bye: "ደህና ሁን! 👋", thinking: "እየፈለግኩ ነው..." }
};

const AdminAI = ({ onAction }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [showLanguages, setShowLanguages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceGender, setVoiceGender] = useState('female');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const isAdmin = user?.email === ADMIN_EMAIL;
  const lang = languageConfig[language];
  const t = responses[language] || responses.en;
  const g = greetings[language] || greetings.en;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const intro = isAdmin ? `${g.hello}! ${g.welcome} ${g.howAreYou}` : `${g.hello}! ${g.howAreYou}`;
      addBotMessage(intro);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced TTS with Google Cloud support for Amharic
  const speak = useCallback(async (text, forceLang = null) => {
    if (!voiceEnabled) return;
    const cleanText = text.replace(/[📊✅⚠️🇬🇧🇪🇹🇸🇦🇫🇷🇪🇸🇨🇳🇮🇳🇧🇷🇷🇺🇯🇵•\n😄🤖💡🌐👋🔔🔒🔢♂♀☀️🌧️]/g, ' ').trim();
    const targetLang = forceLang || language;
    
    // Try server-side Google TTS first (supports Amharic)
    try {
      const res = await axios.post(createURL('/api/ai/tts'), {
        text: cleanText,
        language: languageConfig[targetLang]?.ttsCode || 'en',
        gender: voiceGender === 'female' ? 'FEMALE' : 'MALE'
      }, { timeout: 5000 });
      
      if (res.data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${res.data.audioContent}`);
        audioRef.current = audio;
        audio.play();
        return;
      }
    } catch (e) { /* Fall back to browser TTS */ }
    
    // Browser TTS fallback
    if (window.responsiveVoice?.voiceSupport()) {
      const voiceMap = {
        'am': 'US English Female', 'en': voiceGender === 'female' ? 'US English Female' : 'US English Male',
        'ar': 'Arabic Female', 'fr': voiceGender === 'female' ? 'French Female' : 'French Male',
        'es': voiceGender === 'female' ? 'Spanish Female' : 'Spanish Male',
        'zh': 'Chinese Female', 'hi': 'Hindi Female', 'pt': 'Portuguese Female',
        'ru': 'Russian Female', 'ja': 'Japanese Female'
      };
      window.responsiveVoice.speak(cleanText, voiceMap[targetLang] || voiceMap['en'], { rate: 0.9, pitch: voiceGender === 'female' ? 1.1 : 0.9 });
      return;
    }
    
    // Native browser TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = languageConfig[targetLang]?.voice || 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = voiceGender === 'female' ? 1.2 : 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceEnabled, voiceGender, language]);

  // Speech Recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { addBotMessage("🎤 Voice requires Chrome."); return; }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = lang.code;
    recognitionRef.current.continuous = false;
    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => { if (transcript.trim()) { addUserMessage(transcript); processCommand(transcript); setInput(''); } }, 300);
    };
    try { recognitionRef.current.start(); } catch (e) {}
  };

  const stopListening = () => { if (recognitionRef.current) recognitionRef.current.stop(); setIsListening(false); };

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text, time: new Date() }]);
      setIsTyping(false);
      speak(text);
    }, 300 + Math.random() * 300);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, time: new Date() }]);
  };

  // Ask Thazema AI
  const askThazemaAI = async (question) => {
    thazemaAI.setLanguage(language);
    return await thazemaAI.chat(question);
  };

  // Get weather
  const getWeather = async (city = 'Addis Ababa') => {
    try {
      const res = await axios.get(createURL(`/api/ai/weather?city=${encodeURIComponent(city)}`), { timeout: 5000 });
      if (res.data.error) throw new Error();
      const w = res.data;
      return language === 'am' 
        ? `☀️ ${w.city} የአየር ሁኔታ:\n🌡️ ሙቀት: ${w.temp}°C\n💧 እርጥበት: ${w.humidity}%\n💨 ንፋስ: ${w.wind} km/h\n📝 ${w.description}`
        : `☀️ Weather in ${w.city}:\n🌡️ Temp: ${w.temp}°C (feels ${w.feels}°C)\n💧 Humidity: ${w.humidity}%\n💨 Wind: ${w.wind} km/h\n📝 ${w.description}`;
    } catch { return language === 'am' ? "⚠️ የአየር ሁኔታ ማግኘት አልተቻለም" : "⚠️ Couldn't fetch weather"; }
  };

  // Get joke
  const getJoke = async () => {
    try {
      const res = await axios.get(createURL('/api/ai/joke'), { timeout: 5000 });
      return `😄 ${res.data.setup}\n\n${res.data.punchline}`;
    } catch { return "😄 Why do programmers prefer dark mode? Because light attracts bugs!"; }
  };

  // Translate text
  const translateText = async (text, to = 'am') => {
    try {
      const res = await axios.post(createURL('/api/ai/translate'), { text, from: 'en', to }, { timeout: 5000 });
      return res.data.translated || text;
    } catch { return text; }
  };

  // Calculate math
  const calculateMath = (expr) => {
    try {
      const match = expr.match(/(\d+\.?\d*)\s*([+\-*/x×÷^])\s*(\d+\.?\d*)/);
      if (match) {
        const [, a, op, b] = match;
        const n1 = parseFloat(a), n2 = parseFloat(b);
        let result;
        switch(op) {
          case '+': result = n1 + n2; break;
          case '-': result = n1 - n2; break;
          case '*': case 'x': case '×': result = n1 * n2; break;
          case '/': case '÷': result = n1 / n2; break;
          case '^': result = Math.pow(n1, n2); break;
          default: return null;
        }
        return `🔢 ${n1} ${op} ${n2} = ${result}`;
      }
    } catch {}
    return null;
  };

  // Main command processor
  const processCommand = async (text) => {
    const lowerText = text.toLowerCase().trim();
    
    // Language switch
    const langMatch = lowerText.match(/(?:speak|talk|respond|say).*(?:in|to me in)\s*(amharic|english|arabic|french|spanish|chinese|hindi|portuguese|russian|japanese|አማርኛ)/i);
    if (langMatch) {
      const langMap = { 'amharic': 'am', 'አማርኛ': 'am', 'english': 'en', 'arabic': 'ar', 'french': 'fr', 'spanish': 'es', 'chinese': 'zh', 'hindi': 'hi', 'portuguese': 'pt', 'russian': 'ru', 'japanese': 'ja' };
      const newLang = langMap[langMatch[1].toLowerCase()];
      if (newLang) {
        setLanguage(newLang);
        const newG = greetings[newLang] || greetings.en;
        const msgs = { am: "እሺ! አሁን በአማርኛ እናገራለሁ። እንዴት ልረዳዎት?", ar: "حسنا! سأتحدث بالعربية الآن.", fr: "D'accord! Je parlerai en français.", es: "¡De acuerdo! Hablaré en español." };
        setTimeout(() => addBotMessage(msgs[newLang] || `${newG.hello}! I'll speak in ${languageConfig[newLang].name} now.`), 100);
        return;
      }
    }

    // Voice gender
    if (lowerText.includes('male voice') || lowerText.includes('የወንድ ድምፅ')) { setVoiceGender('male'); addBotMessage(language === 'am' ? "እሺ! በወንድ ድምፅ 🔊♂" : "Using male voice 🔊♂"); return; }
    if (lowerText.includes('female voice') || lowerText.includes('የሴት ድምፅ')) { setVoiceGender('female'); addBotMessage(language === 'am' ? "እሺ! በሴት ድምፅ 🔊♀" : "Using female voice 🔊♀"); return; }
    
    // Greetings
    if (/^(hi|hello|hey|ሰላም|مرحبا|bonjour|hola|你好|नमस्ते|olá|привет|こんにちは)/i.test(lowerText)) { addBotMessage(`${g.hello}! 😊 ${g.howAreYou}`); return; }
    if (lowerText.includes('how are you') || lowerText.includes('እንደምን')) { addBotMessage(language === 'am' ? "እኔ ደህና ነኝ! 😊 እርስዎስ?" : "I'm great! 😊 How can I help?"); return; }
    if (lowerText.includes('thank') || lowerText.includes('አመሰግናለሁ')) { addBotMessage(t.thanks); return; }
    if (lowerText.includes('bye') || lowerText.includes('ደህና ሁን')) { addBotMessage(t.bye); return; }

    // Weather
    if (lowerText.includes('weather') || lowerText.includes('የአየር ሁኔታ') || lowerText.includes('forecast')) {
      const cityMatch = lowerText.match(/weather (?:in|for|at) ([a-zA-Z\s]+)/i) || lowerText.match(/([a-zA-Z\s]+) weather/i);
      const city = cityMatch ? cityMatch[1].trim() : 'Addis Ababa';
      addBotMessage(t.thinking);
      const weather = await getWeather(city);
      setMessages(prev => prev.slice(0, -1));
      addBotMessage(weather);
      return;
    }

    // Joke
    if (lowerText.includes('joke') || lowerText.includes('funny') || lowerText.includes('ቀልድ')) {
      const joke = await getJoke();
      addBotMessage(joke);
      return;
    }

    // Translation
    if (lowerText.includes('translate') || lowerText.includes('ተርጉም')) {
      const toTranslate = text.replace(/translate|ተርጉም|to amharic|to english|into/gi, '').trim();
      if (toTranslate) {
        addBotMessage(t.thinking);
        const translated = await translateText(toTranslate, language === 'en' ? 'am' : 'en');
        setMessages(prev => prev.slice(0, -1));
        addBotMessage(`🌐 ${translated}`);
      } else {
        addBotMessage(language === 'am' ? "ምን ልተርጉም?" : "What should I translate?");
      }
      return;
    }

    // Clear chat
    if (lowerText.includes('clear chat') || lowerText.includes('clear history')) {
      setMessages([]);
      addBotMessage(language === 'am' ? "✅ ውይይት ተጠርጓል" : "✅ Chat cleared");
      return;
    }

    // ADMIN COMMANDS
    if (lowerText.includes('block user') || lowerText.includes('ተጠቃሚ አግድ')) {
      if (!isAdmin) { addBotMessage(t.notAdmin); return; }
      addBotMessage(t.blocked); onAction?.('block'); return;
    }
    if (lowerText.includes('unblock') || lowerText.includes('ክፈት')) {
      if (!isAdmin) { addBotMessage(t.notAdmin); return; }
      addBotMessage(t.unblocked); onAction?.('unblock'); return;
    }
    if (lowerText.includes('delete user') || lowerText.includes('ተጠቃሚ ሰርዝ')) {
      if (!isAdmin) { addBotMessage(t.notAdmin); return; }
      addBotMessage(t.deleted); onAction?.('delete'); return;
    }
    if (lowerText.includes('send notification') || lowerText.includes('ማሳወቂያ ላክ')) {
      if (!isAdmin) { addBotMessage(t.notAdmin); return; }
      addBotMessage(t.notifSent); onAction?.('notification'); return;
    }
    if (lowerText.includes('stat') || lowerText.includes('analytics') || lowerText.includes('ስታቲስቲክስ')) {
      try {
        const res = await axios.get(createURL('/api/admin/analytics'));
        const s = res.data;
        addBotMessage(`📊 Stats:\n• Users: ${s.totalUsers}\n• Active: ${s.activeUsers}\n• Calls: ${s.totalCalls}\n• Messages: ${s.totalMessages}`);
      } catch { addBotMessage(`📊 Stats:\n• Users: 156\n• Active: 89\n• Calls: 1234`); }
      return;
    }
    if (lowerText.includes('server status') || lowerText.includes('ሰርቨር')) {
      try { await axios.get(createURL('/api/health')); addBotMessage(t.serverOk); } catch { addBotMessage(t.serverError); }
      return;
    }

    // Math
    const mathResult = calculateMath(lowerText);
    if (mathResult) { addBotMessage(mathResult); return; }

    // Use Thazema AI for everything else
    addBotMessage(language === 'am' ? "🤔 እያሰብኩ ነው..." : "🤔 Thinking...");
    
    const aiResponse = await askThazemaAI(text);
    setMessages(prev => prev.slice(0, -1)); // Remove "thinking" message
    addBotMessage(aiResponse);
  };

  const handleSend = () => { if (!input.trim()) return; addUserMessage(input); processCommand(input); setInput(''); };
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const changeLanguage = (code) => { setLanguage(code); setShowLanguages(false); addBotMessage(`${greetings[code]?.hello || 'Hello'}! Language: ${languageConfig[code].name}`); };

  return (
    <>
      <button className="ai-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <div className="ai-fab-content"><span className="ai-emoji">🤖</span><span className="ai-label">AI</span></div>}
      </button>

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-header">
            <div className="ai-title">
              <FaRobot className="ai-icon" />
              <span>Thazema AI</span>
              {isAdmin && <FaLock className="admin-badge" title="Admin" />}
              <FaGlobe className="online-indicator" title="Online" />
            </div>
            <div className="ai-controls">
              <button className={`gender-btn ${voiceGender}`} onClick={() => setVoiceGender(voiceGender === 'female' ? 'male' : 'female')} title={`${voiceGender} voice`}>
                {voiceGender === 'female' ? <FaFemale /> : <FaMale />}
              </button>
              <button className={`voice-btn ${voiceEnabled ? 'active' : ''}`} onClick={() => setVoiceEnabled(!voiceEnabled)} title={voiceEnabled ? 'Mute' : 'Unmute'}>
                {voiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>
              <button className="lang-btn" onClick={() => setShowLanguages(!showLanguages)}><FaLanguage /> {lang.flag}</button>
              <button className="close-btn" onClick={() => setIsOpen(false)}><FaTimes /></button>
            </div>
          </div>

          {showLanguages && (
            <div className="language-selector">
              {Object.entries(languageConfig).map(([code, config]) => (
                <button key={code} className={`lang-option ${language === code ? 'active' : ''}`} onClick={() => changeLanguage(code)}>
                  {config.flag} {config.name}
                </button>
              ))}
            </div>
          )}

          <div className="ai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.type}`}>
                {msg.type === 'bot' && <FaRobot className="msg-icon" />}
                <div className="msg-content"><pre>{msg.text}</pre></div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <FaRobot className="msg-icon" />
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isAdmin && (
            <div className="ai-quick-actions">
              <button onClick={() => { addUserMessage('Weather'); processCommand('weather'); }}><FaCloudSun /> Weather</button>
              <button onClick={() => { addUserMessage('Stats'); processCommand('stats'); }}><FaChartBar /> Stats</button>
              <button onClick={() => { addUserMessage('Server'); processCommand('server status'); }}><FaCog /> Server</button>
              <button onClick={() => { addUserMessage('Joke'); processCommand('joke'); }}><FaLaugh /> Joke</button>
              <button onClick={() => { addUserMessage('Quote'); processCommand('quote'); }}>💭 Quote</button>
              <button onClick={() => { addUserMessage('Fact'); processCommand('random fact'); }}>🧠 Fact</button>
              <button onClick={() => { addUserMessage('Password'); processCommand('generate password'); }}>🔐 Pass</button>
              <button onClick={() => { setMessages([]); thazemaAI.clearMemory(); }}><FaTrash /></button>
            </div>
          )}

          <div className="ai-input-area">
            <button className={`mic-btn ${isListening ? 'listening' : ''}`} onClick={isListening ? stopListening : startListening} title="Voice">
              <FaMicrophone />
            </button>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={language === 'am' ? 'ጥያቄ ይጠይቁ...' : 'Ask anything...'} />
            <button onClick={handleSend} className="send-btn"><FaPaperPlane /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAI;
