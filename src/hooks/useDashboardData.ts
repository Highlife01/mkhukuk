import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface DashboardStat {
  activeCases: number;
  wonCases: number;
  clients: number;
  chatbotQueries: number;
  totalRevenue: number;
  pendingReceivables: number;
  upcomingCriticalCases: number;
  winRate: number; // yüzde
}

export interface DashboardAppointment {
  id: string;
  time: string;
  title: string;
  client: string;
  status: string;
  color: string;
}

export interface DashboardActivity {
  id: string;
  text: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

export interface DashboardChatbotConversation {
  id: string;
  name: string;
  topic: string;
  status: string;
}

const DEFAULT_STATS: DashboardStat = {
  activeCases: 47,
  wonCases: 89,
  clients: 243,
  chatbotQueries: 1200,
  totalRevenue: 1245000,
  pendingReceivables: 358000,
  upcomingCriticalCases: 5,
  winRate: 73,
};

const DEFAULT_APPOINTMENTS: DashboardAppointment[] = [
  { id: 'a1', time: '09:00', title: 'İlk Danışma', client: 'Mehmet Yıldız', status: 'Bekliyor', color: 'bg-[#c9a84c]' },
  { id: 'a2', time: '11:30', title: 'Dava Görüşmesi', client: 'Fatma Kaya', status: 'Video', color: 'bg-[#185fa5]' },
  { id: 'a3', time: '14:00', title: 'Sözleşme İmzası', client: 'Ahmet Demir', status: 'Onaylı', color: 'bg-[#1d9e75]' },
];

const DEFAULT_ACTIVITIES: DashboardActivity[] = [
  { id: 'act1', text: 'Dava #2024-089 mahkemede kazanıldı', time: '10 dk önce', type: 'success' },
  { id: 'act2', text: 'Yeni müvekkil kaydı: Zeynep Kara', time: '42 dk önce', type: 'info' },
  { id: 'act3', text: 'Blog yazısı taslak: "Boşanma Hukuku Rehberi"', time: '1 sa önce', type: 'warning' },
];

const DEFAULT_CHATBOT_CONVERSATIONS: DashboardChatbotConversation[] = [
  { id: 'c1', name: 'Anonim', topic: 'İş Hukuku', status: 'Çözüldü' },
  { id: 'c2', name: 'M. Arslan', topic: 'Boşanma', status: 'Devam' },
  { id: 'c3', name: 'Anonim', topic: 'Miras', status: 'Yönlendirme' },
];

const normalizeSnapshot = <T>(snapshot: QueryDocumentSnapshot<DocumentData>) => ({
  id: snapshot.id,
  ...snapshot.data(),
} as T);

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStat>(DEFAULT_STATS);
  const [appointments, setAppointments] = useState<DashboardAppointment[]>(DEFAULT_APPOINTMENTS);
  const [activities, setActivities] = useState<DashboardActivity[]>(DEFAULT_ACTIVITIES);
  const [conversations, setConversations] = useState<DashboardChatbotConversation[]>(DEFAULT_CHATBOT_CONVERSATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubAppointments: (() => void) | undefined;
    let unsubActivities: (() => void) | undefined;
    let unsubConversations: (() => void) | undefined;

    const fetchStats = async () => {
      try {
        const statsDoc = doc(db, 'dashboard', 'stats');
        const snapshot = await getDoc(statsDoc);
        if (snapshot.exists()) {
          setStats(snapshot.data() as DashboardStat);
        }
      } catch (error) {
        console.warn('Dashboard stats fetch failed', error);
      }
    };

    const subscribeAppointments = () => {
      try {
        const q = query(collection(db, 'dashboard', 'appointments', 'items'), orderBy('time', 'asc'));
        unsubAppointments = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((doc) => normalizeSnapshot<DashboardAppointment>(doc));
            if (items.length) setAppointments(items);
          },
          (error) => {
            console.warn('Appointments snapshot error', error);
          }
        );
      } catch (error) {
        console.warn('Appointments subscription failed', error);
      }
    };

    const subscribeActivities = () => {
      try {
        const q = query(collection(db, 'dashboard', 'activities', 'items'), orderBy('createdAt', 'desc'));
        unsubActivities = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((doc) => normalizeSnapshot<DashboardActivity>(doc));
            if (items.length) setActivities(items);
          },
          (error) => {
            console.warn('Activities snapshot error', error);
          }
        );
      } catch (error) {
        console.warn('Activities subscription failed', error);
      }
    };

    const subscribeChatbotConversations = () => {
      try {
        const q = query(collection(db, 'dashboard', 'chatbotConversations', 'items'), orderBy('createdAt', 'desc'));
        unsubConversations = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((doc) => normalizeSnapshot<DashboardChatbotConversation>(doc));
            if (items.length) setConversations(items);
          },
          (error) => {
            console.warn('Chatbot conversations snapshot error', error);
          }
        );
      } catch (error) {
        console.warn('Chatbot conversations subscription failed', error);
      }
    };

    Promise.all([fetchStats()]).finally(() => setLoading(false));
    subscribeAppointments();
    subscribeActivities();
    subscribeChatbotConversations();

    return () => {
      unsubAppointments?.();
      unsubActivities?.();
      unsubConversations?.();
    };
  }, []);

  return { stats, appointments, activities, conversations, loading };
};
