import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, Send, RefreshCw, Pause, Play, Volume2, Lock, LogOut, Smile, Meh, Frown, Clock } from 'lucide-react';


const loveReasons = [
  "Your beautiful smile that lights up my whole world",
  "How you always make time for me evern when you are super busy",
  "Your incredible strength dealing with the chicken pox - you're amazing!",
  "How you always remember the little details about my day",
  "The way you care so deeply about your family and friends",
  "The way you make everyone around you feel special",
  "The way you support my goals and dreams",
  "Your kind heart and how you always try to help others",
  "The cute faces you make when you're concentrating and also when you are angry"
];

export const LoveCounter = () => {
  const [currentReason, setCurrentReason] = useState('');
  const [nextAvailable, setNextAvailable] = useState(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const lastViewed = localStorage.getItem('lastReasonViewed');
    const count = parseInt(localStorage.getItem('reasonCount') || '0');
    const nextTime = localStorage.getItem('nextReasonAvailable');

    setCurrentCount(count);
    
    if (nextTime) {
      setNextAvailable(new Date(nextTime));
    }

    if (lastViewed) {
      setCurrentReason(loveReasons[count - 1]);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextAvailable) {
        const now = new Date();
        const diff = nextAvailable.getTime() - now.getTime();
        
        if (diff <= 0) {
          setNextAvailable(null);
          setTimeRemaining('');
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(
          `${hours}h ${minutes}m ${seconds}s`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextAvailable]);

  const revealNewReason = () => {
    if (nextAvailable && new Date() < nextAvailable) {
      return;
    }

    const newCount = currentCount + 1;
    const next = new Date();
    next.setHours(next.getHours() + 24);

    setCurrentCount(newCount);
    setCurrentReason(loveReasons[newCount - 1]);
    setNextAvailable(next);
    
    localStorage.setItem('reasonCount', newCount.toString());
    localStorage.setItem('lastReasonViewed', new Date().toISOString());
    localStorage.setItem('nextReasonAvailable', next.toISOString());
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Why I Love You ({currentCount}/{loveReasons.length})
      </h2>
      
      <button
        onClick={revealNewReason}
        disabled={nextAvailable && new Date() < nextAvailable}
        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {nextAvailable && new Date() < nextAvailable ? (
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Next reason in: {timeRemaining}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <span>Reveal Today&apos;s Reason</span>
          </div>
        )}
      </button>

      {currentReason && (
        <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center">
          <p>{currentReason}</p>
        </div>
      )}
    </div>
  );
};

export const WellnessCheck = () => {
  const [mood, setMood] = useState('');
  const [isHugging, setIsHugging] = useState(false);

  const moodMessages = {
    happy: "Your happiness makes my whole day brighter! Keep shining, beautiful! 🌟",
    sad: "I wish I could hold you right now. Remember, tough times don't last, but tough people like you do! That's why you are my girl 💕",
    okay: "Sometimes 'okay' is perfectly fine. You're doing great, and I'm always here for you! 🤗"
  };

  const sendVirtualHug = () => {
    setIsHugging(true);
    setTimeout(() => setIsHugging(false), 3000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        How Are You Feeling?
      </h2>

      <div className="flex justify-between gap-2">
        <button
          onClick={() => setMood('happy')}
          className={`flex-1 p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 flex items-center justify-center gap-2 ${
            mood === 'happy' ? 'bg-green-500/20 border-green-500' : 'bg-gray-800/50 border-gray-700 hover:border-green-500'
          }`}
        >
          <Smile className="w-6 h-6" />
        </button>
        <button
          onClick={() => setMood('okay')}
          className={`flex-1 p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 flex items-center justify-center gap-2 ${
            mood === 'okay' ? 'bg-yellow-500/20 border-yellow-500' : 'bg-gray-800/50 border-gray-700 hover:border-yellow-500'
          }`}
        >
          <Meh className="w-6 h-6" />
        </button>
        <button
          onClick={() => setMood('sad')}
          className={`flex-1 p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 flex items-center justify-center gap-2 ${
            mood === 'sad' ? 'bg-red-500/20 border-red-500' : 'bg-gray-800/50 border-gray-700 hover:border-blue-500'
          }`}
        >
          <Frown className="w-6 h-6" />
        </button>
      </div>

      {mood && (
        <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center">
          <p>{moodMessages[mood]}</p>
          
          <button
            onClick={sendVirtualHug}
            className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Virtual Hug</span>
          </button>
        </div>
      )}

      {isHugging && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          {/* Center burst of hearts */}
          <div className="relative">
            {/* Large central heart */}
            <Heart className="w-32 h-32 text-pink-500 animate-ping" />
            <Heart className="absolute inset-0 w-32 h-32 text-pink-500 animate-pulse" />
            
            {/* Orbiting hearts */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  animation: `orbit ${2}s linear infinite`,
                  transformOrigin: 'center',
                  transform: `rotate(${i * 45}deg) translateX(100px)`
                }}
              >
                <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
              </div>
            ))}
            
            {/* Expanding ring of hearts */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`ring-${i}`}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${i * 30}deg)`,
                }}
              >
                <Heart 
                  className="w-6 h-6 text-pink-500 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: 'expand 1.5s ease-out infinite',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes expand {
          0% { transform: translateY(0) scale(0); opacity: 1; }
          100% { transform: translateY(-100px) scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

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
    title: "Sundays, Worries, and Endless Love 💝",
    date: "January 19, 2025",
    content: "Good morning my precious baby,\n\nWelcome to our safe space - this little corner I've created just for us 🤗\n\nI know we've been feeling a bit DISTANT lately, and I want you to apologize for that. But more importantly, I want you to know something: I'm okay, truly. Your worried heart can rest.\n\nWhat's really filling my thoughts is you - how you're feeling, how you're coping. I know this isn't easy, dealing with everything. But I want you to know that I'm here for you , every single day.\n\nIt's Sunday, and you won't be at church (not for a reason you'd choose, but hey, it's a silver lining innit 😂), I wanted to share my plans for after church today... absolutely nothing! And you know what? I think that's perfectly okay,I saw something I totally fucked with today 'Sometimes the best plan is no plan at all'.\n\nPeople keep telling me how well I'm doing, but honestly? I can't see it myself. Maybe that's just how it is sometimes - we're our own toughest critics.\n\nI love you so much, baby. I miss you more than words can say. And yes, I worry about you - about how you're really feeling, about everything you're going through.\n\nRest well today, my love. I hope this is Sunday a good one, even if we're apart.\n\nWith all my love and worry (because that's just how much I care),\nYour love 💕"
  }
  // {
  //   title: "A Special Message for My Love ❤️",
  //   date: "January 18, 2025",
  //   content: "My precious baby,\n\nWelcome to this little corner of the internet I created just for you 🥰 I wanted to make something special that could bring a smile to your face whenever you're feeling lonely or when I'm not online. This is your safe space, filled with all my love for you.\n\nI know the chicken pox has been overwhelming, and seeing you go through this makes my heart ache. But I want you to know something - every spot, every mark, they don't change how beautiful you are to me. They're just temporary visitors, but my love for you is permanent.\n\nIt's Friday now, and as we approach the weekend, I wish I could hold you close. Even though we're apart, my heart is always with you. When you feel down, scroll through these messages, listen to my voice, and remember that you have me - completely and unconditionally.\n\nTake all the time you need to heal. Don't worry about anything else. Just focus on getting better, and know that I'm here, loving you more with each passing moment.\n\nForever yours,\nYour love 💕"
  // }
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


        <LoveCounter />
  <WellnessCheck />
  

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