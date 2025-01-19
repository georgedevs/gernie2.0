import React, { useState, useEffect, useRef } from 'react';
import { Upload, Eye, Image, Film, X, Loader, Clock } from 'lucide-react';
import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  getDocs, 
  orderBy, 
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';

const ViewOnceMedia = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [media, setMedia] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [currentMedia, setCurrentMedia] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [expiryTime, setExpiryTime] = useState(10);
  const [isSelectingTime, setIsSelectingTime] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const timerRef = useRef(null);
  const hasViewedRef = useRef(false);
  const [currentSender, setCurrentSender] = useState('');

  useEffect(() => {
    const sender = localStorage.getItem('sender');
    setCurrentSender(sender || 'Anonymous');
  }, []);

  // Load available media
  const loadMedia = async () => {
    const mediaQuery = query(
      collection(db, 'view-once-media'),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(mediaQuery);
    if (!snapshot.empty) {
      const latestMedia = snapshot.docs[0].data();
      setMedia({
        id: snapshot.docs[0].id,
        ...latestMedia
      });
      if (latestMedia.expiryTime) {
        setTimeLeft(latestMedia.expiryTime);
      }
    } else {
      setMedia(null);
    }
  };

  useEffect(() => {
    loadMedia();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {

    if (media) {
        setUploadError('Hehe wait until it is viewed');
        event.target.value = ''; 
        return;
      }

    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setUploadError('Upload an image or video (Can be spicy😅)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setIsSelectingTime(true);
    setUploadError('');
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setIsSelectingTime(false);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await addDoc(collection(db, 'view-once-media'), {
            data: reader.result,
            type: selectedFile.type,
            timestamp: serverTimestamp(),
            sender: currentSender, // Fixed: Now using the variable instead of string
            expiryTime: expiryTime
          });

          await loadMedia();
          setSelectedFile(null);
        } catch (error) {
          console.error('Error saving media:', error);
          setUploadError('Failed to upload media. Please try again.');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError('Error reading file. Please try again.');
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };

  const deleteMedia = async () => {
    if (!media || !hasViewedRef.current) return;
    
    try {
      await deleteDoc(doc(db, 'view-once-media', media.id));
      setMedia(null);
      setCurrentMedia(null);
      setIsViewing(false);
      hasViewedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimeLeft(expiryTime);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const handleView = async () => {
    if (!media) return;
  

    const currentUserSender = localStorage.getItem('sender');
    const canView = (media.sender === 'Him' && currentUserSender === 'Teni') || 
                   (media.sender === 'Teni' && currentUserSender === 'Him');
  
    if (!canView) {
      setUploadError('This media is for your love not you 😂');
      return;
    }
  
    setCurrentMedia(media);
    setIsViewing(true);
    hasViewedRef.current = true;
    setTimeLeft(media.expiryTime || 10);
  
    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          deleteMedia();
          return media.expiryTime || 10;
        }
        return prev - 1;
      });
    }, 1000);
  };
  

  const handleClose = () => {
    deleteMedia();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        View Once Media
      </h2>

      {/* Upload Button or Time Selection */}
      {!isSelectingTime ? (
  <label className={`w-full ${media ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
    <div className={`px-6 py-3 rounded-lg ${
      media 
        ? 'bg-gray-700 opacity-50' 
        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 transform hover:scale-105'
    } transition-all duration-300 flex items-center justify-center gap-2 relative group`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-25 group-hover:opacity-50 blur transition-opacity -z-10"></div>
      <input
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading || media !== null}
      />
      {isUploading ? (
        <Loader className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Upload className="w-5 h-5" />
          <span>
            {media 
              ? 'Hehe wait until I view it 😁' 
              : 'Upload View Once Media (Can be spicy😅)'
            }
          </span>
        </>
      )}
    </div>
  </label>
) : (
        <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Select expiry time (seconds):</span>
          </div>
          
          <div className="flex gap-2">
            {[5, 10, 15, 30, 60].map((time) => (
              <button
                key={time}
                onClick={() => setExpiryTime(time)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  expiryTime === time
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {time}s
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsSelectingTime(false);
                setSelectedFile(null);
              }}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleFileUpload}
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-all duration-300"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded-lg">
          {uploadError}
        </div>
      )}

      {/* Available Media Card */}
      {media && !isViewing && (
  <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {media.type.startsWith('image/') ? (
          <Image className="w-5 h-5 text-purple-400" />
        ) : (
          <Film className="w-5 h-5 text-purple-400" />
        )}
        <span className="text-sm text-gray-300">
          New {media.type.startsWith('image/') ? 'Image' : 'Video'} from {media.sender}
        </span>
      </div>
      <span className="text-xs text-gray-400">
        {media.timestamp?.toDate().toLocaleString()}
      </span>
    </div>
    
    {/* Only show view button if user is allowed to view */}
    {((media.sender === 'Him' && currentSender === 'Teni') || 
      (media.sender === 'Teni' && currentSender === 'Him')) ? (
      <button
        onClick={handleView}
        className="w-full px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        <span>View Once ({media.expiryTime || 10}s)</span>
      </button>
    ) : (
      <div className="w-full px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-center text-sm">
        Why do you want to view it😂
      </div>
    )}
  </div>
)}
      {/* Media Viewer */}
      {isViewing && currentMedia && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative max-w-2xl w-full mx-4 media-container">
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            {currentMedia.type.startsWith('image/') ? (
              <img
                src={currentMedia.data}
                alt="View once"
                className="w-full h-auto rounded-lg select-none"
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              />
            ) : (
              <video
                src={currentMedia.data}
                controls
                autoPlay
                className="w-full h-auto rounded-lg select-none"
                onContextMenu={(e) => e.preventDefault()}
                disablePictureInPicture
                controlsList="nodownload"
                style={{
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              />
            )}
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full">
              <p className="text-sm text-white">Media will disappear in {timeLeft} seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOnceMedia;