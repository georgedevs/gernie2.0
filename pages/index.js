import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, Send, RefreshCw, Pause, Play, Volume2, Lock, LogOut } from 'lucide-react';

const AuthScreen = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (password === 'iloveyou') {
      localStorage.setItem('isAuthenticated', 'true');
      onAuth(true);
    } else {
      setError('Incorrect password');
      setIsLoading(false);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {Array(20).fill(null).map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-500 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 30 + 10}px`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Glass card container */}
      <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 space-y-8 relative">
        <div className="text-center relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-lg opacity-70 animate-pulse"></div>
              <Lock className="relative w-16 h-16 text-white bg-gray-900 p-4 rounded-full border-2 border-white/20" />
            </div>
          </div>
          
          <h2 className="mt-8 text-3xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
              Welcome Back
            </span>
          </h2>
          <p className="mt-2 text-gray-300">Enter the password to access our special space</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-gray-400"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 px-4 rounded-lg animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg font-medium text-white hover:opacity-90 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden"
          >
            <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              <Lock className="w-4 h-4" />
              Enter
            </span>
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};



const loveMessages = [
  "Every moment with you is a blessing, my Teniola 💕",
  "You make my heart smile when I think of you ❤️",
  "Get well soon, my love! I miss you more than words can say 🤗",
  "Your smile lights up my entire universe ✨",
  "You're the most beautiful soul I've ever known, inside and out 💫",
  "Being with you is better than all my dreams combined 🌙",
  "You're my favorite person in the whole wide world 🌎",
  "I love you more than yesterday, less than tomorrow 💝",
  "You make everything better just by being you, my Teniola 🎀",
  "Can't wait to hold you again and make you smile 🤗",
  "Every little thing you do makes me fall in love all over again 💖",
  "You're the first thing I think about when I wake up 🌅",
  "Your love is the best medicine for my heart 💊",
  "I'm counting down the minutes until I see you next ⏰",
  "You're the missing piece to my puzzle 🧩",
  "Your laugh is my favorite sound in the world 🎵",
  "Being apart only makes my heart grow fonder 💗",
  "You're the reason I believe in love 🌈",
  "Every day with you is a new adventure 🗺️",
  "You make my heart skip a beat, every single time 💓",
  "Get well soon my princess, I hate seeing you unwell 🤒",
  "I promise to take care of you forever and always 🤝",
  "You're my today and all of my tomorrows 📅",
  "Your love is the greatest gift I've ever received 🎁",
  "Distance means nothing when someone means everything 🌍",
  "You're not just my girlfriend, you're my best friend 👫",
  "I fall more in love with you each passing day 📈",
  "You're the star that guides me home 🌟",
  "My love for you grows stronger with each heartbeat 💝",
  "You're my favorite notification 📱"
];

const dirtyMessages = [
  "I can not wait to put my hands all over you 😈🔥",
  "I miss holding your waist so badly 🥵💋",
  "I wish you could come over here and I could make you really happy 😏💦",
  "I need you so badly like so so badly 🥺🔥",
  "If you were here right now I would give you the best kisses 👄💋",
  "I want to kiss you so badly 😘💕",
  "You are so freaking sexyyyyyy 🥵🔥",
  "I'm just imagining you sitting on my lap right now and us making out 😈💋",
  "I have 2 fingers I know you might like (maybe 3 ) 😏✌️",
  "You always make me so turned on 🥵💦"
];

const poems = [
  {
    title: "A Special Message for My Love ❤️",
    date: "January 18, 2025",
    content: "My precious baby,\n\nWelcome to this little corner of the internet I created just for you 🥰 I wanted to make something special that could bring a smile to your face whenever you're feeling lonely or when I'm not online. This is your safe space, filled with all my love for you.\n\nI know the chicken pox has been overwhelming, and seeing you go through this makes my heart ache. But I want you to know something - every spot, every mark, they don't change how beautiful you are to me. They're just temporary visitors, but my love for you is permanent.\n\nIt's Friday now, and as we approach the weekend, I wish I could hold you close. Even though we're apart, my heart is always with you. When you feel down, scroll through these messages, listen to my voice, and remember that you have me - completely and unconditionally.\n\nTake all the time you need to heal. Don't worry about anything else. Just focus on getting better, and know that I'm here, loving you more with each passing moment.\n\nForever yours,\nYour love 💕"
  }
];

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentDirtyMessage, setCurrentDirtyMessage] = useState("");
  const [isMessageAnimating, setIsMessageAnimating] = useState(false);
  const [isDirtyMessageAnimating, setIsDirtyMessageAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState({});
  const audioRefs = useRef({});

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const audioFiles = [
    { id: 1, title: "Good Morning Beautiful", src: "/voice-notes/morning.mp3" },
    { id: 2, title: "I love You", src: "/voice-notes/love.mp3" },
    { id: 3, title: "I Miss You", src: "/voice-notes/miss.mp3" },
    { id: 4, title: "Sweet Dreams", src: "/voice-notes/dreams.mp3" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    audioFiles.forEach(file => {
      const audio = new Audio(file.src);
      // Prevent download behavior
      audio.controlsList = "nodownload";
      // Enable in-browser playback
      audio.preload = "metadata";
      audioRefs.current[file.id] = audio;
      
      audio.addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [file.id]: false }));
      });
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const generateRandomMessage = () => {
    setIsMessageAnimating(true);
    const randomIndex = Math.floor(Math.random() * loveMessages.length);
    setCurrentMessage(loveMessages[randomIndex]);
    setTimeout(() => setIsMessageAnimating(false), 500);
  };

  const generateRandomDirtyMessage = () => {
    setIsDirtyMessageAnimating(true);
    const randomIndex = Math.floor(Math.random() * dirtyMessages.length);
    setCurrentDirtyMessage(dirtyMessages[randomIndex]);
    setTimeout(() => setIsDirtyMessageAnimating(false), 500);
  };

  const handlePlay = (id) => {
    // Pause all other playing audio
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id.toString()) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0; // Reset other audio positions
        setIsPlaying(prev => ({ ...prev, [key]: false }));
      }
    });

    // Play/pause the clicked audio
    if (isPlaying[id]) {
      audioRefs.current[id].pause();
    } else {
      // Handle playback promise properly
      const playPromise = audioRefs.current[id].play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch(error => {
            console.error("Playback failed:", error);
          });
      }
    }
    setIsPlaying(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    audioFiles.forEach(file => {
      const audio = new Audio(file.src);
      audioRefs.current[file.id] = audio;
      audio.addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [file.id]: false }));
      });
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  
  if (!isAuthenticated) {
    return <AuthScreen onAuth={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative overflow-hidden font-jetbrains pb-20">
      {/* Background Love Messages */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <div className="animate-slide">
          {Array(20).fill("I Love You Teniola").map((text, index) => (
            <div key={index} className="transform -rotate-45 text-4xl font-bold m-8">
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto relative z-10 space-y-8 font-departure">
        {/* Header with Glowing Effect */}
        <header className="text-center space-y-4">
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
              For My Teniola
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-25 blur"></div>
          </div>
          <p className="text-gray-400 animate-bounce">Get well soon, my love! 💖</p>
        </header>

        {/* Random Message Generator with Enhanced Animation */}
        <div className="space-y-4">
          <button
            onClick={generateRandomMessage}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-25 group-hover:opacity-50 blur transition-opacity"></div>
            <RefreshCw className={`w-5 h-5 relative ${isMessageAnimating ? 'animate-spin' : ''}`} />
            <span className="relative">View a note</span>
          </button>
          {currentMessage && (
            <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-25 blur transition-opacity"></div>
              <p className="relative">{currentMessage}</p>
            </div>
          )}

          {/* Dirty Messages Section */}
          <button
            onClick={generateRandomDirtyMessage}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 rounded-lg opacity-25 group-hover:opacity-50 blur transition-opacity"></div>
            <RefreshCw className={`w-5 h-5 relative ${isDirtyMessageAnimating ? 'animate-spin' : ''}`} />
            <span className="relative">View a dirty note</span>
          </button>
          <p className="text-center text-gray-400 text-sm">(😅 why not)</p>
          {currentDirtyMessage && (
            <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-25 blur transition-opacity"></div>
              <p className="relative">{currentDirtyMessage}</p>
            </div>
          )}
        </div>

        {/* Rest of the component remains the same */}
        {/* Voice Messages Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-departure">
            Listen to My Voice
          </h2>
          <div className="space-y-2">
            {audioFiles.map((audio) => (
              <button
                key={audio.id}
                onClick={() => handlePlay(audio.id)}
                className="w-full p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all duration-300 flex items-center justify-between gap-3 group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-25 blur transition-opacity"></div>
                <div className="flex items-center gap-3 relative">
                  {isPlaying[audio.id] ? (
                    <Pause className="w-5 h-5 text-purple-500" />
                  ) : (
                    <Play className="w-5 h-5 text-purple-500" />
                  )}
                  <span>{audio.title}</span>
                </div>
                <Volume2 className={`w-5 h-5 ${isPlaying[audio.id] ? 'text-purple-500 animate-pulse' : 'text-gray-500'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Daily Poems Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-departure">
            Daily Poems/ Mini Blog
          </h2>
          <div className="space-y-4">
            {poems.map((poem, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all duration-300 relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-25 blur transition-opacity"></div>
                <div className="relative">
                  <h3 className="font-semibold text-lg text-purple-400">{poem.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{poem.date}</p>
                  <p className="whitespace-pre-line">{poem.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              setIsAuthenticated(false);
            }}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        </div>
        {/* Floating Hearts Animation */}
        <div className="fixed inset-0 pointer-events-none">
          {Array(10).fill(null).map((_, index) => (
            <Heart
              key={index}
              className={`absolute text-pink-500 opacity-50 animate-float-${index + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${index * 1.5}s`,
                fontSize: `${Math.random() * 20 + 10}px`
              }}
            />
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;