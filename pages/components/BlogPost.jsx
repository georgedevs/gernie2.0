import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Loader } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/firebase';

const BlogPost = ({ poem }) => {
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const repliesQuery = query(
      collection(db, 'replies'),
      where('poemDate', '==', poem.date),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
      const newReplies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString()
      }));
      setReplies(newReplies);
    }, (error) => {
      console.error("Error fetching replies:", error);
    });

    return () => unsubscribe();
  }, [poem.date]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'replies'), {
        text: reply,
        poemDate: poem.date,
        timestamp: serverTimestamp()
      });
      setReply('');
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyClick = () => {
    console.log('Reply button clicked');
    setShowReplyBox(!showReplyBox);
  };

  return (
    <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all duration-300 relative">
      {/* Main content */}
      <div className="relative z-10">
        <h3 className="font-semibold text-lg text-purple-400">{poem.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{poem.date}</p>
        <p className="whitespace-pre-line">{poem.content}</p>
      </div>

      {/* Glowing effect (behind the content) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-25 blur transition-opacity -z-10"></div>

      {/* Reply section */}
      <div className="relative z-10 mt-4">
        {/* Reply Button */}
        <button
          onClick={handleReplyClick}
          className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors p-2 rounded-lg hover:bg-gray-700/30"
        >
          <MessageSquare className="w-4 h-4" />
          {replies.length > 0 ? `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}` : 'Reply'}
        </button>

        {/* Replies Section */}
        {showReplyBox && (
          <div className="space-y-4 mt-4">
            {/* Reply Form */}
            <form onSubmit={handleSubmitReply} className="space-y-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-gray-400 resize-none"
                rows={3}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reply
                  </>
                )}
              </button>
            </form>

            {/* Existing Replies */}
            <div className="space-y-3">
              {replies.map((existingReply) => (
                <div
                  key={existingReply.id}
                  className="p-3 rounded bg-gray-800/30 border border-gray-700 space-y-1"
                >
                  <p className="text-sm">{existingReply.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(existingReply.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;