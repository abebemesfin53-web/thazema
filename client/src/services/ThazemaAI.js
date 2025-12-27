// Thazema AI - Smart Assistant Brain
// Built for Thazema App - No external APIs needed

class ThazemaAI {
  constructor() {
    this.memory = [];
    this.userName = 'User';
    this.language = 'en';
    this.adminEmail = 'abebemesfin53@gmail.com';
    
    // Massive knowledge base
    this.knowledge = {
      // App info
      'thazema': 'Thazema is a video and audio calling application with real-time communication, messaging, group calls, and user discovery features. Created by Abebe Mesfin.',
      'admin': 'The administrator is Abebe Mesfin. Contact: +251914319514, Email: abebemesfin53@gmail.com',
      'creator': 'Thazema was created by Abebe Mesfin from Ethiopia 🇪🇹',
      'features': 'Thazema features: Video calls, Audio calls, Group calls, Messaging, Contact management, Nearby users discovery, Profile settings, Call history, and Admin panel.',
      
      // World capitals
      'capital ethiopia': 'Addis Ababa (አዲስ አበባ) is the capital of Ethiopia, founded in 1886.',
      'capital usa': 'Washington, D.C. is the capital of the United States.',
      'capital china': 'Beijing (北京) is the capital of China.',
      'capital russia': 'Moscow (Москва) is the capital of Russia.',
      'capital france': 'Paris is the capital of France.',
      'capital japan': 'Tokyo (東京) is the capital of Japan.',
      'capital india': 'New Delhi is the capital of India.',
      'capital brazil': 'Brasília is the capital of Brazil.',
      'capital uk': 'London is the capital of the United Kingdom.',
      'capital germany': 'Berlin is the capital of Germany.',
      'capital italy': 'Rome is the capital of Italy.',
      'capital spain': 'Madrid is the capital of Spain.',
      'capital egypt': 'Cairo is the capital of Egypt.',
      'capital kenya': 'Nairobi is the capital of Kenya.',
      'capital south africa': 'Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial) are capitals of South Africa.',

      // Countries & Geography
      'largest country': 'Russia is the largest country by area (17.1 million km²).',
      'smallest country': 'Vatican City is the smallest country (0.44 km²).',
      'largest population': 'India has the largest population (over 1.4 billion people).',
      'tallest mountain': 'Mount Everest is the tallest mountain at 8,849 meters (29,032 feet).',
      'longest river': 'The Nile River is the longest at about 6,650 km.',
      'largest ocean': 'The Pacific Ocean is the largest, covering 165 million km².',
      'largest desert': 'The Sahara is the largest hot desert (9.2 million km²).',
      'largest lake': 'The Caspian Sea is the largest lake by area.',
      'deepest ocean': 'The Mariana Trench is the deepest point in the ocean at 10,994 meters.',
      
      // Science
      'speed of light': 'The speed of light is 299,792,458 m/s (about 300,000 km/s).',
      'planets': 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.',
      'sun': 'The Sun is a G-type main-sequence star, about 4.6 billion years old, 150 million km from Earth.',
      'moon': 'The Moon is Earth\'s only natural satellite, about 384,400 km away.',
      'gravity': 'Gravity on Earth is approximately 9.8 m/s². It\'s what keeps us on the ground!',
      'water': 'Water (H₂O) boils at 100°C and freezes at 0°C at sea level.',
      'dna': 'DNA (Deoxyribonucleic acid) carries genetic instructions for all living organisms.',
      'atom': 'An atom is the smallest unit of matter, made of protons, neutrons, and electrons.',
      'photosynthesis': 'Photosynthesis is how plants convert sunlight, water, and CO₂ into glucose and oxygen.',
      
      // Math
      'pi': 'Pi (π) ≈ 3.14159265359 - the ratio of a circle\'s circumference to its diameter.',
      'fibonacci': 'Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34... Each number is the sum of the two before it.',
      'prime numbers': 'Prime numbers are divisible only by 1 and themselves: 2, 3, 5, 7, 11, 13, 17, 19, 23...',
      'pythagoras': 'Pythagorean theorem: a² + b² = c² (for right triangles).',
      
      // Technology
      'ai': 'AI (Artificial Intelligence) enables machines to learn, reason, and make decisions like humans.',
      'internet': 'The Internet is a global network connecting billions of devices using TCP/IP protocols.',
      'programming': 'Programming is writing instructions for computers using languages like JavaScript, Python, Java, etc.',
      'computer': 'A computer processes data using a CPU, stores it in memory (RAM/storage), and displays output.',
      'smartphone': 'Smartphones are mobile devices combining phone, computer, camera, and internet capabilities.',
      'blockchain': 'Blockchain is a decentralized digital ledger technology used in cryptocurrencies.',
      'machine learning': 'Machine Learning is AI that learns from data to make predictions without explicit programming.',

      // History
      'world war 1': 'World War I (1914-1918) was a global conflict that killed about 17 million people.',
      'world war 2': 'World War II (1939-1945) was the deadliest conflict in history, with 70-85 million deaths.',
      'ancient egypt': 'Ancient Egypt civilization lasted from 3100 BC to 30 BC, known for pyramids and pharaohs.',
      'roman empire': 'The Roman Empire (27 BC - 476 AD) was one of the largest empires in ancient history.',
      'industrial revolution': 'The Industrial Revolution (1760-1840) transformed manufacturing with machines and factories.',
      
      // Ethiopia
      'ethiopia': 'Ethiopia is a country in East Africa, one of the oldest nations in the world. Population: ~120 million. Known for coffee, ancient history, and never being colonized.',
      'ethiopian history': 'Ethiopia has over 3,000 years of history. It was the only African country never colonized. Home to ancient Aksumite Empire.',
      'ethiopian food': 'Ethiopian cuisine features injera (sourdough flatbread) with various stews (wot) like doro wot and kitfo.',
      'ethiopian coffee': 'Ethiopia is the birthplace of coffee. The coffee ceremony is an important cultural tradition.',
      'amharic': 'Amharic (አማርኛ) is the official language of Ethiopia, using the Ge\'ez script (ፊደል).',
      'haile selassie': 'Haile Selassie I was Emperor of Ethiopia from 1930-1974, considered a messianic figure in Rastafari.',
      
      // Health
      'exercise': 'Regular exercise improves heart health, mental health, strength, and longevity. Aim for 150 minutes/week.',
      'sleep': 'Adults need 7-9 hours of sleep. Good sleep improves memory, mood, and immune function.',
      'nutrition': 'A balanced diet includes fruits, vegetables, proteins, whole grains, and healthy fats.',
      'mental health': 'Mental health is as important as physical health. Seek help if struggling - it\'s okay to ask for support.',
      
      // General knowledge
      'time zones': 'There are 24 time zones around the world, each roughly 15 degrees of longitude apart.',
      'seasons': 'Seasons are caused by Earth\'s 23.5° axial tilt as it orbits the Sun.',
      'rainbow': 'Rainbows form when sunlight refracts through water droplets, splitting into 7 colors: ROYGBIV.',
      'electricity': 'Electricity is the flow of electrons through a conductor. Measured in volts, amps, and watts.',
      'currency': 'Major currencies: USD (US Dollar), EUR (Euro), GBP (British Pound), JPY (Japanese Yen), CNY (Chinese Yuan).',
      'olympics': 'The Olympic Games are held every 4 years, alternating between Summer and Winter games.',
    };

    // Amharic responses
    this.amharicResponses = {
      greeting: 'ሰላም! እኔ ታዜማ AI ነኝ። እንዴት ልረዳዎት እችላለሁ? 😊',
      thanks: 'እንኳን ደስ አለዎት! ሌላ ጥያቄ አለዎት?',
      bye: 'ደህና ሁኑ! መልካም ቀን! 👋',
      dontKnow: 'ይቅርታ፣ ስለዚህ ጉዳይ በቂ መረጃ የለኝም። ሌላ ጥያቄ ይጠይቁኝ!',
      thinking: 'እያሰብኩ ነው...',
      ethiopia: 'ኢትዮጵያ በምስራቅ አፍሪካ የምትገኝ ጥንታዊ ሀገር ናት። ዋና ከተማዋ አዲስ አበባ ነው። ህዝቧ ከ120 ሚሊዮን በላይ ነው።',
      addisAbaba: 'አዲስ አበባ የኢትዮጵያ ዋና ከተማ ናት። በ1886 ዓ.ም. ተመሠረተች።',
      coffee: 'ኢትዮጵያ የቡና መገኛ ሀገር ናት! የቡና ሥነ-ሥርዓት ጠቃሚ ባህላዊ ወግ ነው።',
      amharic: 'አማርኛ የኢትዮጵያ ኦፊሴላዊ ቋንቋ ነው። የግዕዝ ፊደል ይጠቀማል።',
    };

    // Conversation patterns
    this.patterns = [
      { match: /^(hi|hello|hey|ሰላም|selam|hola|bonjour|ciao)/i, response: this.greet.bind(this) },
      { match: /how are you|እንዴት ነህ|እንደምን|how's it going/i, response: () => this.lang('am') ? 'እኔ ደህና ነኝ! 😊 እርስዎስ እንዴት ነዎት?' : "I'm doing great! 😊 How can I help you today?" },
      { match: /thank|አመሰግናለሁ|thanks|gracias|merci/i, response: () => this.lang('am') ? this.amharicResponses.thanks : "You're welcome! Anything else I can help with? 😊" },
      { match: /bye|goodbye|ደህና ሁን|see you|ciao/i, response: () => this.lang('am') ? this.amharicResponses.bye : "Goodbye! Have a great day! 👋" },
      { match: /your name|ስምህ|who are you/i, response: () => this.lang('am') ? 'ስሜ ታዜማ AI ነው! 🤖 ማንኛውንም ጥያቄ መመለስ እችላለሁ!' : "I'm Thazema AI, your smart assistant! 🤖 I can answer any question!" },
      { match: /who (made|created|built) you/i, response: () => "I was created by Abebe Mesfin for the Thazema app! 🇪🇹" },
      { match: /what can you do|ምን ማድረግ|help me|your abilities/i, response: () => this.lang('am') ? 'ማንኛውንም ጥያቄ መመለስ፣ ስሌት ማድረግ፣ የአየር ሁኔታ፣ መረጃ ከኢንተርኔት መፈለግ እችላለሁ!' : "I can:\n• Answer any question\n• Search the internet\n• Do math calculations\n• Get weather info\n• Generate passwords\n• Convert units\n• Tell jokes & quotes\n• Manage the app (admin)" },
      { match: /^time$|what time|ሰዓት ስንት/i, response: () => `🕐 Current time: ${new Date().toLocaleTimeString()}` },
      { match: /^date$|what.*date|today|ዛሬ/i, response: () => `📅 Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` },
      { match: /^year$|what year/i, response: () => `📅 Current year: ${new Date().getFullYear()}` },
      { match: /joke|funny|ቀልድ|make me laugh/i, response: this.tellJoke.bind(this) },
      { match: /quote|inspiration|motivat/i, response: this.getQuote.bind(this) },
      { match: /password|generate.*pass/i, response: this.generatePassword.bind(this) },
      { match: /flip.*coin|coin.*flip|heads or tails/i, response: () => Math.random() > 0.5 ? "🪙 Heads!" : "🪙 Tails!" },
      { match: /roll.*dice|dice.*roll/i, response: () => `🎲 You rolled: ${Math.floor(Math.random() * 6) + 1}` },
      { match: /random number|pick.*number/i, response: () => `🔢 Random number: ${Math.floor(Math.random() * 100) + 1}` },
      { match: /love you|i love/i, response: () => "Aww, thank you! 💙 I'm here to help you anytime!" },
      { match: /you.*smart|you.*intelligent|you.*awesome/i, response: () => "Thank you! I try my best to be helpful! 🤖✨" },
      { match: /convert.*celsius|celsius.*fahrenheit|°c.*°f/i, response: this.convertTemp.bind(this) },
      { match: /convert.*km|miles.*km|km.*miles/i, response: this.convertDistance.bind(this) },
      { match: /bmi|body mass/i, response: () => "To calculate BMI, tell me: 'BMI 70kg 175cm' (weight and height)" },
      { match: /bmi\s+(\d+)\s*kg?\s+(\d+)\s*cm?/i, response: this.calculateBMI.bind(this) },
      { match: /tip|calculate.*tip/i, response: () => "To calculate tip, say: 'tip 50 dollars 15%'" },
      { match: /fact|random fact|did you know/i, response: this.getFact.bind(this) },
      { match: /color|colour|hex/i, response: this.getRandomColor.bind(this) },
    ];
  }

  // Motivational quotes
  getQuote() {
    const quotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
      { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
      { text: "ተስፋ አትቁረጥ፣ ስኬት ይመጣል!", author: "Ethiopian Proverb" },
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return `💭 "${quote.text}"\n\n— ${quote.author}`;
  }

  // Generate secure password
  generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `🔐 Generated Password:\n\n${password}\n\n(Save this somewhere safe!)`;
  }

  // Temperature conversion
  convertTemp(match) {
    const input = match?.input || '';
    const numMatch = input.match(/(\d+)/);
    if (numMatch) {
      const num = parseFloat(numMatch[1]);
      const celsius = (num - 32) * 5/9;
      const fahrenheit = (num * 9/5) + 32;
      return `🌡️ Temperature Conversion:\n${num}°C = ${fahrenheit.toFixed(1)}°F\n${num}°F = ${celsius.toFixed(1)}°C`;
    }
    return "🌡️ Tell me a temperature to convert, like '25 celsius to fahrenheit'";
  }

  // Distance conversion
  convertDistance(match) {
    const input = match?.input || '';
    const numMatch = input.match(/(\d+\.?\d*)/);
    if (numMatch) {
      const num = parseFloat(numMatch[1]);
      const km = num * 1.60934;
      const miles = num / 1.60934;
      return `📏 Distance Conversion:\n${num} miles = ${km.toFixed(2)} km\n${num} km = ${miles.toFixed(2)} miles`;
    }
    return "📏 Tell me a distance to convert, like '10 km to miles'";
  }

  // BMI Calculator
  calculateBMI(match) {
    if (match && match[1] && match[2]) {
      const weight = parseFloat(match[1]);
      const height = parseFloat(match[2]) / 100;
      const bmi = weight / (height * height);
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight ✅';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      return `⚖️ BMI Calculator:\nWeight: ${weight}kg\nHeight: ${match[2]}cm\n\nBMI: ${bmi.toFixed(1)}\nCategory: ${category}`;
    }
    return "⚖️ To calculate BMI, say: 'BMI 70kg 175cm'";
  }

  // Random facts
  getFact() {
    const facts = [
      "🧠 The human brain uses about 20% of the body's total energy.",
      "🌍 Earth is the only planet not named after a god.",
      "🐙 Octopuses have three hearts and blue blood.",
      "🍯 Honey never spoils. 3000-year-old honey was found edible in Egyptian tombs.",
      "⚡ Lightning strikes Earth about 8 million times per day.",
      "🦈 Sharks have been around longer than trees.",
      "🌙 The Moon is slowly drifting away from Earth at 3.8cm per year.",
      "☕ Ethiopia is the birthplace of coffee!",
      "🦒 A giraffe's tongue is about 50cm long and is purple-black.",
      "🐋 Blue whales are the largest animals to ever exist on Earth.",
      "🔥 The Sun's core temperature is about 15 million degrees Celsius.",
      "🧬 Humans share 60% of their DNA with bananas.",
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  // Random color generator
  getRandomColor() {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `🎨 Random Color:\n\nHEX: ${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})`;
  }

  // Tell a joke
  tellJoke() {
    const jokes = [
      { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs! 🐛" },
      { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache! 💸" },
      { setup: "What's a programmer's favorite hangout place?", punchline: "Foo Bar! 🍺" },
      { setup: "Why do Java developers wear glasses?", punchline: "Because they can't C#! 👓" },
      { setup: "What do you call 8 hobbits?", punchline: "A hobbyte! 🧙" },
      { setup: "Why was the computer cold?", punchline: "It left its Windows open! 🪟" },
      { setup: "What's a computer's least favorite food?", punchline: "Spam! 📧" },
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return `😄 ${joke.setup}\n\n${joke.punchline}`;
  }

  lang(code) {
    return this.language === code;
  }

  setLanguage(lang) {
    this.language = lang;
  }

  greet() {
    if (this.lang('am')) return this.amharicResponses.greeting;
    const greetings = [
      "Hello! I'm Thazema AI. How can I help you today? 😊",
      "Hi there! What would you like to know? 🤖",
      "Hey! I'm here to help. Ask me anything!",
      "Welcome! I'm Thazema AI, your smart assistant. What's on your mind?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Math calculator
  calculate(expr) {
    try {
      // Extract numbers and operator
      const match = expr.match(/(-?\d+\.?\d*)\s*([+\-*/x×÷^%])\s*(-?\d+\.?\d*)/);
      if (match) {
        const a = parseFloat(match[1]);
        const op = match[2];
        const b = parseFloat(match[3]);
        let result;
        switch(op) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '*': case 'x': case '×': result = a * b; break;
          case '/': case '÷': result = b !== 0 ? a / b : 'Cannot divide by zero'; break;
          case '^': result = Math.pow(a, b); break;
          case '%': result = a % b; break;
          default: return null;
        }
        return `🔢 ${a} ${op} ${b} = ${result}`;
      }
      
      // Square root
      if (expr.match(/sqrt|√|square root/i)) {
        const num = parseFloat(expr.match(/\d+\.?\d*/)?.[0]);
        if (num >= 0) return `🔢 √${num} = ${Math.sqrt(num).toFixed(4)}`;
      }
      
      // Percentage
      if (expr.match(/(\d+)\s*%\s*of\s*(\d+)/i)) {
        const m = expr.match(/(\d+)\s*%\s*of\s*(\d+)/i);
        const result = (parseFloat(m[1]) / 100) * parseFloat(m[2]);
        return `🔢 ${m[1]}% of ${m[2]} = ${result}`;
      }

      // Tip calculator
      if (expr.match(/tip\s+(\d+\.?\d*)\s*(dollar|birr|euro)?\s*(\d+)?\s*%?/i)) {
        const m = expr.match(/tip\s+(\d+\.?\d*)\s*(dollar|birr|euro)?\s*(\d+)?/i);
        const amount = parseFloat(m[1]);
        const tipPercent = m[3] ? parseFloat(m[3]) : 15;
        const tip = amount * (tipPercent / 100);
        const total = amount + tip;
        return `💰 Tip Calculator:\nBill: ${amount}\nTip (${tipPercent}%): ${tip.toFixed(2)}\nTotal: ${total.toFixed(2)}`;
      }

      // Power/exponent
      if (expr.match(/(\d+)\s*(to the power of|power|pow|\^)\s*(\d+)/i)) {
        const m = expr.match(/(\d+)\s*(?:to the power of|power|pow|\^)\s*(\d+)/i);
        const result = Math.pow(parseFloat(m[1]), parseFloat(m[2]));
        return `🔢 ${m[1]}^${m[2]} = ${result}`;
      }

      // Factorial
      if (expr.match(/factorial|(\d+)!/i)) {
        const num = parseInt(expr.match(/\d+/)?.[0]);
        if (num <= 20) {
          let fact = 1;
          for (let i = 2; i <= num; i++) fact *= i;
          return `🔢 ${num}! = ${fact}`;
        }
      }

    } catch (e) {}
    return null;
  }

  // Search knowledge base
  searchKnowledge(query) {
    const q = query.toLowerCase();
    
    // Direct match
    for (const [key, value] of Object.entries(this.knowledge)) {
      if (q.includes(key) || key.split(' ').every(word => q.includes(word))) {
        return value;
      }
    }
    
    // Partial match
    for (const [key, value] of Object.entries(this.knowledge)) {
      const words = key.split(' ');
      const matchCount = words.filter(word => q.includes(word)).length;
      if (matchCount >= Math.ceil(words.length * 0.6)) {
        return value;
      }
    }
    
    return null;
  }

  // Search Wikipedia
  async searchWikipedia(query) {
    try {
      const cleanQuery = query.replace(/what is|who is|where is|tell me about|explain|how|why|\?/gi, '').trim();
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.extract) {
          return { text: data.extract.length > 600 ? data.extract.substring(0, 600) + '...' : data.extract, source: 'Wikipedia' };
        }
      }
    } catch (e) {}
    
    // Try search API
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&format=json&origin=*`);
      const data = await response.json();
      if (data[2]?.[0]) return { text: data[2][0], source: 'Wikipedia' };
    } catch (e) {}
    
    return null;
  }

  // Search DuckDuckGo Instant Answer API (free, no API key)
  async searchDuckDuckGo(query) {
    try {
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
      if (response.ok) {
        const data = await response.json();
        
        // Abstract (main answer)
        if (data.Abstract) {
          return { text: data.Abstract, source: data.AbstractSource || 'DuckDuckGo' };
        }
        
        // Answer (instant answer)
        if (data.Answer) {
          return { text: data.Answer, source: 'DuckDuckGo' };
        }
        
        // Definition
        if (data.Definition) {
          return { text: data.Definition, source: data.DefinitionSource || 'DuckDuckGo' };
        }
        
        // Related topics
        if (data.RelatedTopics?.[0]?.Text) {
          return { text: data.RelatedTopics[0].Text, source: 'DuckDuckGo' };
        }
      }
    } catch (e) {}
    return null;
  }

  // Search for current information (news, weather, etc.)
  async searchOnline(query) {
    const q = query.toLowerCase();
    
    // Weather query - use wttr.in
    if (q.includes('weather')) {
      try {
        const cityMatch = query.match(/weather (?:in|for|at) ([a-zA-Z\s]+)/i) || query.match(/([a-zA-Z\s]+) weather/i);
        const city = cityMatch ? cityMatch[1].trim() : 'Addis Ababa';
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        if (response.ok) {
          const data = await response.json();
          const current = data.current_condition[0];
          return {
            text: `Weather in ${city}:\n🌡️ Temperature: ${current.temp_C}°C (feels like ${current.FeelsLikeC}°C)\n💧 Humidity: ${current.humidity}%\n💨 Wind: ${current.windspeedKmph} km/h\n☁️ ${current.weatherDesc[0].value}`,
            source: 'wttr.in'
          };
        }
      } catch (e) {}
    }

    // Try DuckDuckGo first (faster)
    const ddgResult = await this.searchDuckDuckGo(query);
    if (ddgResult) return ddgResult;

    // Try Wikipedia
    const wikiResult = await this.searchWikipedia(query);
    if (wikiResult) return wikiResult;

    return null;
  }

  // Generate smart response
  generateResponse(query) {
    const q = query.toLowerCase();
    
    // Questions about "what is X"
    if (q.match(/what (is|are)/i)) {
      const topic = q.replace(/what (is|are)\s*/i, '').replace(/\?/g, '').trim();
      const knowledge = this.searchKnowledge(topic);
      if (knowledge) return `💡 ${knowledge}`;
    }
    
    // Questions about "who is X"
    if (q.match(/who (is|was)/i)) {
      const person = q.replace(/who (is|was)\s*/i, '').replace(/\?/g, '').trim();
      const knowledge = this.searchKnowledge(person);
      if (knowledge) return `👤 ${knowledge}`;
    }
    
    // Questions about "where is X"
    if (q.match(/where (is|are)/i)) {
      const place = q.replace(/where (is|are)\s*/i, '').replace(/\?/g, '').trim();
      const knowledge = this.searchKnowledge(place);
      if (knowledge) return `📍 ${knowledge}`;
    }
    
    // Questions about "how many" or "how much"
    if (q.match(/how (many|much)/i)) {
      const topic = q.replace(/how (many|much)\s*/i, '').replace(/\?/g, '').trim();
      const knowledge = this.searchKnowledge(topic);
      if (knowledge) return `📊 ${knowledge}`;
    }
    
    // Questions about "when"
    if (q.match(/^when/i)) {
      const topic = q.replace(/^when\s*/i, '').replace(/\?/g, '').trim();
      const knowledge = this.searchKnowledge(topic);
      if (knowledge) return `📅 ${knowledge}`;
    }
    
    // Questions about "why"
    if (q.match(/^why/i)) {
      const topic = q.replace(/^why\s*/i, '').replace(/\?/g, '').trim();
      const knowledge = this.searchKnowledge(topic);
      if (knowledge) return `🤔 ${knowledge}`;
    }

    // Questions about "define" or "meaning"
    if (q.match(/define|meaning of|what does.*mean/i)) {
      const word = q.replace(/define|meaning of|what does|mean|\?/gi, '').trim();
      const knowledge = this.searchKnowledge(word);
      if (knowledge) return `📖 ${knowledge}`;
    }

    // Questions about "how to"
    if (q.match(/how (to|do|can i)/i)) {
      // Check if we have specific how-to knowledge
      const knowledge = this.searchKnowledge(q);
      if (knowledge) return `📝 ${knowledge}`;
      return null; // Let it search online
    }

    // Questions about "tell me about"
    if (q.match(/tell me about|explain|describe/i)) {
      const topic = q.replace(/tell me about|explain|describe|\?/gi, '').trim();
      const knowledge = this.searchKnowledge(topic);
      if (knowledge) return `💡 ${knowledge}`;
    }
    
    // General knowledge search
    const knowledge = this.searchKnowledge(q);
    if (knowledge) return `💡 ${knowledge}`;
    
    return null;
  }

  // Main chat function
  async chat(message) {
    // Store in memory
    this.memory.push({ role: 'user', content: message, time: new Date() });
    if (this.memory.length > 20) this.memory.shift();
    
    const msg = message.trim();
    const lowerMsg = msg.toLowerCase();
    
    // Check patterns first (greetings, etc.)
    for (const pattern of this.patterns) {
      if (pattern.match.test(msg)) {
        const response = typeof pattern.response === 'function' ? pattern.response() : pattern.response;
        this.memory.push({ role: 'ai', content: response, time: new Date() });
        return response;
      }
    }
    
    // Math calculation
    const mathResult = this.calculate(lowerMsg);
    if (mathResult) {
      this.memory.push({ role: 'ai', content: mathResult, time: new Date() });
      return mathResult;
    }
    
    // Generate response from local knowledge
    const smartResponse = this.generateResponse(msg);
    if (smartResponse) {
      this.memory.push({ role: 'ai', content: smartResponse, time: new Date() });
      return smartResponse;
    }
    
    // Search online for unknown topics
    const onlineResult = await this.searchOnline(msg);
    if (onlineResult) {
      const response = `🌐 ${onlineResult.text}\n\n📚 Source: ${onlineResult.source}`;
      this.memory.push({ role: 'ai', content: response, time: new Date() });
      return response;
    }
    
    // Default response
    const defaultResponse = this.lang('am') 
      ? this.amharicResponses.dontKnow
      : "🤔 I couldn't find information about that. Try asking in a different way, or ask me something else!";
    
    this.memory.push({ role: 'ai', content: defaultResponse, time: new Date() });
    return defaultResponse;
  }

  clearMemory() {
    this.memory = [];
  }
}

// Export singleton
const thazemaAI = new ThazemaAI();
export default thazemaAI;
