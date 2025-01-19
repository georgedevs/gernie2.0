import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Upload, Trash2, Loader } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/firebase';

const VoiceMessages = () => {
  const [isPlaying, setIsPlaying] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [teniVoices, setTeniVoices] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const audioRefs = useRef({});
  
  const myAudioFiles = [
    { id: 1, title: "Good Morning Beautiful", src: "/voice-notes/morning.mp3" },
    { id: 2, title: "I love You", src: "/voice-notes/love.mp3" },
    { id: 3, title: "I Miss You", src: "/voice-notes/miss.mp3" },
    { id: 4, title: "Sweet Dreams", src: "/voice-notes/dreams.mp3" }
  ];

  // Load Teni's voices from Firestore
  useEffect(() => {
    const voicesQuery = query(
      collection(db, 'voices'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(voicesQuery, (snapshot) => {
      const voices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        src: doc.data().audioData
      }));
      setTeniVoices(voices);
    });

    return () => unsubscribe();
  }, []);

  // Handle audio playback
  useEffect(() => {
    const setupAudio = () => {
      [...myAudioFiles, ...teniVoices].forEach(file => {
        const audio = new Audio(file.src);
        audio.controlsList = "nodownload";
        audio.preload = "metadata";
        audioRefs.current[file.id] = audio;
        
        audio.addEventListener('ended', () => {
          setIsPlaying(prev => ({ ...prev, [file.id]: false }));
        });
      });
    };

    setupAudio();

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [teniVoices]);

  const handlePlay = (id) => {
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== id.toString()) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(prev => ({ ...prev, [key]: false }));
      }
    });

    if (isPlaying[id]) {
      audioRefs.current[id].pause();
    } else {
      const playPromise = audioRefs.current[id].play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.error("Playback failed:", error));
      }
    }
    setIsPlaying(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setUploadError('Please upload an audio file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const title = event.target.getAttribute('data-title');
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target.result;
          
          // Add to Firestore
          await addDoc(collection(db, 'voices'), {
            title: title,
            audioData: base64String,
            timestamp: new Date(),
            type: file.type
          });

          event.target.value = ''; // Reset input
        } catch (error) {
          console.error('Error saving to Firestore:', error);
          setUploadError('Failed to save voice note. Please try again.');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError('Error reading file. Please try again.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };

  const handleDelete = async (voiceFile) => {    
    try {
      await deleteDoc(doc(db, 'voices', voiceFile.id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* His Voice Messages */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Listen to His Voice
        </h2>
        <div className="space-y-2">
          {myAudioFiles.map((audio) => (
            <div key={audio.id} className="relative group">
              <button
                onClick={() => handlePlay(audio.id)}
                className="w-full p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all duration-300 flex items-center justify-between gap-3 relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-25 blur transition-opacity -z-10"></div>
                <div className="flex items-center gap-3 relative">
                  {isPlaying[audio.id] ? (
                    <Pause className="w-5 h-5 text-purple-500" />
                  ) : (
                    <Play className="w-5 h-5 text-purple-500" />
                  )}
                  <span>{audio.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className={`w-5 h-5 ${isPlaying[audio.id] ? 'text-purple-500 animate-pulse' : 'text-gray-500'}`} />
                  
                {/* Upload Button */}
<label className="cursor-pointer p-2 hover:bg-gray-700/30 rounded-lg transition-colors relative z-20">
  <input
    type="file"
    accept="audio/*"
    className="hidden"
    onChange={handleFileUpload}
    data-title={audio.title}
    disabled={isUploading}
  />
  <Upload className="w-5 h-5 text-gray-400 hover:text-purple-500" />
</label>

                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Error Message */}
      {uploadError && (
        <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded-lg">
          {uploadError}
        </div>
      )}

      {/* Loading Indicator */}
      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-purple-400">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {/* Her Voice Messages */}
      {teniVoices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            Listen to Her Voice
          </h2>
          <div className="space-y-2">
            {teniVoices.map((audio) => (
              <button
                key={audio.id}
                onClick={() => handlePlay(audio.id)}
                className="w-full p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-pink-500 transition-all duration-300 flex items-center justify-between gap-3 group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-25 blur transition-opacity"></div>
                <div className="flex items-center gap-3 relative">
                  {isPlaying[audio.id] ? (
                    <Pause className="w-5 h-5 text-pink-500" />
                  ) : (
                    <Play className="w-5 h-5 text-pink-500" />
                  )}
                  <span>{audio.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className={`w-5 h-5 ${isPlaying[audio.id] ? 'text-pink-500 animate-pulse' : 'text-gray-500'}`} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(audio);
                    }}
                    className="p-2 hover:bg-gray-700/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 relative z-20" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceMessages;