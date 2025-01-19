import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Send, Loader, Trash2 } from 'lucide-react';
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

const LoveNotes = ({ hisNotes, hisDirtyNotes }) => {
  const [currentHisNote, setCurrentHisNote] = useState("");
  const [currentHisDirtyNote, setCurrentHisDirtyNote] = useState("");
  const [currentHerNote, setCurrentHerNote] = useState("");
  const [currentHerDirtyNote, setCurrentHerDirtyNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAddingDirtyNote, setIsAddingDirtyNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newDirtyNote, setNewDirtyNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [herNotes, setHerNotes] = useState([]);
  const [herDirtyNotes, setHerDirtyNotes] = useState([]);
  const [isAnimating, setIsAnimating] = useState({
    his: false,
    her: false,
    hisDirty: false,
    herDirty: false
  });

  // Load her notes from Firestore
  const loadHerNotes = async () => {
    const notesQuery = query(collection(db, 'her-notes'), orderBy('timestamp', 'desc'));
    const dirtyNotesQuery = query(collection(db, 'her-dirty-notes'), orderBy('timestamp', 'desc'));

    const [notesSnapshot, dirtyNotesSnapshot] = await Promise.all([
      getDocs(notesQuery),
      getDocs(dirtyNotesQuery)
    ]);

    setHerNotes(notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setHerDirtyNotes(dirtyNotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    loadHerNotes();
  }, []);

  const generateRandomNote = (type) => {
    setIsAnimating(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setIsAnimating(prev => ({ ...prev, [type]: false })), 500);

    switch(type) {
      case 'his':
        const hisIndex = Math.floor(Math.random() * hisNotes.length);
        setCurrentHisNote(hisNotes[hisIndex]);
        break;
      case 'her':
        if (herNotes.length > 0) {
          const herIndex = Math.floor(Math.random() * herNotes.length);
          setCurrentHerNote(herNotes[herIndex].text);
        }
        break;
      case 'hisDirty':
        const hisDirtyIndex = Math.floor(Math.random() * hisDirtyNotes.length);
        setCurrentHisDirtyNote(hisDirtyNotes[hisDirtyIndex]);
        break;
      case 'herDirty':
        if (herDirtyNotes.length > 0) {
          const herDirtyIndex = Math.floor(Math.random() * herDirtyNotes.length);
          setCurrentHerDirtyNote(herDirtyNotes[herDirtyIndex].text);
        }
        break;
    }
  };

  const handleAddNote = async (isDirty = false) => {
    const noteText = isDirty ? newDirtyNote : newNote;
    if (!noteText.trim()) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, isDirty ? 'her-dirty-notes' : 'her-notes'), {
        text: noteText,
        timestamp: serverTimestamp()
      });

      await loadHerNotes();

      if (isDirty) {
        setNewDirtyNote('');
        setIsAddingDirtyNote(false);
      } else {
        setNewNote('');
        setIsAddingNote(false);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* His Notes */}
      <div className="space-y-4">
        <button
          onClick={() => generateRandomNote('his')}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-25 group-hover:opacity-50 blur transition-opacity -z-10"></div>
          <RefreshCw className={`w-5 h-5 relative ${isAnimating.his ? 'animate-spin' : ''}`} />
          <span className="relative">View His Note</span>
        </button>

        {currentHisNote && (
          <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center">
            <p>{currentHisNote}</p>
          </div>
        )}
      </div>

      {/* Her Notes */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => generateRandomNote('her')}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-25 group-hover:opacity-50 blur transition-opacity -z-10"></div>
            <RefreshCw className={`w-5 h-5 relative ${isAnimating.her ? 'animate-spin' : ''}`} />
            <span className="relative">View Her Note</span>
          </button>
          
          <button
            onClick={() => setIsAddingNote(true)}
            className="px-3 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {currentHerNote && (
          <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center">
            <p>{currentHerNote}</p>
          </div>
        )}

        {isAddingNote && (
          <div className="space-y-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your love note..."
              className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-gray-400 resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingNote(false)}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNote(false)}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition-all duration-300 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Add Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* His Dirty Notes */}
      <div className="space-y-4">
        <button
          onClick={() => generateRandomNote('hisDirty')}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 rounded-lg opacity-25 group-hover:opacity-50 blur transition-opacity -z-10"></div>
          <RefreshCw className={`w-5 h-5 relative ${isAnimating.hisDirty ? 'animate-spin' : ''}`} />
          <span className="relative">View His Dirty Note</span>
        </button>

        {currentHisDirtyNote && (
          <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center">
            <p>{currentHisDirtyNote}</p>
          </div>
        )}
      </div>

      {/* Her Dirty Notes */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => generateRandomNote('herDirty')}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 rounded-lg opacity-25 group-hover:opacity-50 blur transition-opacity -z-10"></div>
            <RefreshCw className={`w-5 h-5 relative ${isAnimating.herDirty ? 'animate-spin' : ''}`} />
            <span className="relative">View Her Dirty Note</span>
          </button>
          
          <button
            onClick={() => setIsAddingDirtyNote(true)}
            className="px-3 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {currentHerDirtyNote && (
          <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg animate-fade-in text-center">
            <p>{currentHerDirtyNote}</p>
          </div>
        )}

        {isAddingDirtyNote && (
          <div className="space-y-2">
            <textarea
              value={newDirtyNote}
              onChange={(e) => setNewDirtyNote(e.target.value)}
              placeholder="Write your dirty note..."
              className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none text-white placeholder-gray-400 resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingDirtyNote(false)}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNote(true)}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-500 hover:opacity-90 transition-all duration-300 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Add Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveNotes;