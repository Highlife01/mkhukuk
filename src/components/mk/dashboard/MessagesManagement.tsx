import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Mail, Search, CheckCircle2, Trash2, Clock, AlertCircle, X } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Yeni' | 'Okundu' | 'Yanıtlandı';
  createdAt: any;
}

const MessagesManagement = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: ContactMessage[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      setMessages(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { status: newStatus });
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'contactMessages', id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Yeni':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber/10 text-amber border border-amber/20">Yeni</span>;
      case 'Okundu':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">Okundu</span>;
      case 'Yanıtlandı':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Yanıtlandı</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0f1e3d]">İletişim Mesajları</h2>
          <p className="text-sm text-gray-500 mt-1">Siteden gelen iletişim formu mesajlarını yönetin.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="İsim, E-posta veya Konu ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Mail size={16} className="text-[#c9a84c]" /> Gelen Kutusu
            </h3>
            <span className="text-xs font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-1 rounded-md">
              {messages.length} Mesaj
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <AlertCircle size={32} className="mb-2 text-gray-300" />
                <span>Mesaj bulunamadı.</span>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'Yeni') handleStatusChange(msg.id, 'Okundu');
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedMessage?.id === msg.id 
                      ? 'bg-[#c9a84c]/5 border-[#c9a84c]/30' 
                      : msg.status === 'Yeni'
                        ? 'bg-white border-gray-100 shadow-sm hover:border-[#c9a84c]/30 hover:shadow-md'
                        : 'bg-gray-50/50 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-sm truncate pr-2 ${msg.status === 'Yeni' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {msg.name}
                    </h4>
                    {getStatusBadge(msg.status)}
                  </div>
                  <div className="text-xs text-gray-500 truncate font-medium mb-1.5">{msg.subject || 'Konu Belirtilmemiş'}</div>
                  <div className="text-xs text-gray-400 truncate line-clamp-1">{msg.message}</div>
                  <div className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
                    <Clock size={12} />
                    {msg.createdAt?.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[700px] overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.subject || 'Konu Belirtilmemiş'}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">{selectedMessage.name}</span>
                      <span>&bull;</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-[#c9a84c] hover:underline">{selectedMessage.email}</a>
                      {selectedMessage.phone && (
                        <>
                          <span>&bull;</span>
                          <a href={`tel:${selectedMessage.phone}`} className="hover:text-gray-700">{selectedMessage.phone}</a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedMessage.status)}
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                  >
                    <option value="Yeni">Yeni Olarak İşaretle</option>
                    <option value="Okundu">Okundu İşaretle</option>
                    <option value="Yanıtlandı">Yanıtlandı İşaretle</option>
                  </select>
                  
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} /> Sil
                  </button>
                  
                  <a
                    href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#c9a84c] to-[#a68630] rounded-lg hover:shadow-md transition-all ml-auto"
                  >
                    <Mail size={14} /> E-posta ile Yanıtla
                  </a>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-body">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Mail size={24} className="text-gray-300" />
              </div>
              <p className="font-semibold text-gray-600">Mesaj Seçilmedi</p>
              <p className="text-sm mt-1 max-w-xs">Görüntülemek ve yanıtlamak için sol taraftaki listeden bir mesaj seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManagement;
