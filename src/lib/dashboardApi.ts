import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export type TeamMember = {
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    createdAt?: Timestamp;
};

export type FinanceAgreement = {
    id: string;
    clientName: string;
    description?: string;
    agreedAmount: number;
    paidAmount: number;
    dueAmount: number;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

export type CaseItem = {
    id: string;
    fileNo: string;
    court: string;
    subject: string;
    status: 'open' | 'closed' | 'pending';
    clientName?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

export type ClientItem = {
    id: string;
    fullName: string;
    identityNo?: string;
    phone?: string;
    email?: string;
    notes?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

export type AppointmentItem = {
    id: string;
    time: string;
    title: string;
    client: string;
    status: string;
    color: string;
    createdAt?: Timestamp;
};

export type DocumentItem = {
    id: string;
    title: string;
    type: string;
    clientName?: string;
    status: 'draft' | 'review' | 'approved';
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

export type ChatbotConversationItem = {
    id: string;
    name: string;
    topic: string;
    status: string;
    createdAt?: Timestamp;
};

export type SeoSettings = {
    id: string;
    siteTitle: string;
    siteDescription: string;
    defaultOgImage: string;
    robotsIndex: boolean;
    updatedAt?: Timestamp;
};

const teamCollection = collection(db, 'teamMembers');
const financeCollection = collection(db, 'financeAgreements');
const casesCollection = collection(db, 'cases');
const clientsCollection = collection(db, 'clients');
const appointmentsCollection = collection(db, 'dashboard', 'appointments', 'items');
const documentsCollection = collection(db, 'documents');
const chatbotCollection = collection(db, 'dashboard', 'chatbotConversations', 'items');
const seoDoc = doc(db, 'seoSettings', 'global');

export const subscribeTeamMembers = (onData: (data: TeamMember[]) => void, onError: (err: unknown) => void) => {
    return onSnapshot(
        query(teamCollection, orderBy('createdAt', 'desc')),
        (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TeamMember, 'id'>) }))),
        onError
    );
};

export const createTeamMember = async (payload: Omit<TeamMember, 'id'>) => {
    await addDoc(teamCollection, { ...payload, createdAt: Timestamp.now() });
};

export const deleteTeamMember = async (id: string) => {
    await deleteDoc(doc(db, 'teamMembers', id));
};

export const subscribeFinanceAgreements = (
    onData: (data: FinanceAgreement[]) => void,
    onError: (err: unknown) => void
) => {
    return onSnapshot(
        query(financeCollection, orderBy('createdAt', 'desc')),
        (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FinanceAgreement, 'id'>) }))),
        onError
    );
};

export const createFinanceAgreement = async (payload: Omit<FinanceAgreement, 'id'>) => {
    await addDoc(financeCollection, { ...payload, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
};

export const deleteFinanceAgreement = async (id: string) => {
    await deleteDoc(doc(db, 'financeAgreements', id));
};

export const subscribeCases = (onData: (data: CaseItem[]) => void, onError: (err: unknown) => void) => {
    return onSnapshot(
        query(casesCollection, orderBy('createdAt', 'desc')),
        (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CaseItem, 'id'>) }))),
        onError
    );
};

export const upsertCase = async (payload: Omit<CaseItem, 'id'>, id?: string) => {
    const ref = id ? doc(db, 'cases', id) : doc(casesCollection);
    await setDoc(
        ref,
        {
            ...payload,
            updatedAt: Timestamp.now(),
            createdAt: payload.createdAt ?? Timestamp.now(),
        },
        { merge: true }
    );
};

export const deleteCase = async (id: string) => {
    await deleteDoc(doc(db, 'cases', id));
};

export const subscribeClients = (onData: (data: ClientItem[]) => void, onError: (err: unknown) => void) => {
    return onSnapshot(
        query(clientsCollection, orderBy('createdAt', 'desc')),
        (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ClientItem, 'id'>) }))),
        onError
    );
};

export const upsertClient = async (payload: Omit<ClientItem, 'id'>, id?: string) => {
    const ref = id ? doc(db, 'clients', id) : doc(clientsCollection);
    await setDoc(
        ref,
        {
            ...payload,
            updatedAt: Timestamp.now(),
            createdAt: payload.createdAt ?? Timestamp.now(),
        },
        { merge: true }
    );
};

export const deleteClient = async (id: string) => {
    await deleteDoc(doc(db, 'clients', id));
};

export const subscribeAppointments = (
    onData: (data: AppointmentItem[]) => void,
    onError: (err: unknown) => void
) => {
    return onSnapshot(
        query(appointmentsCollection, orderBy('time', 'asc')),
        (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AppointmentItem, 'id'>) }))),
        onError
    );
};

export const upsertAppointment = async (payload: Omit<AppointmentItem, 'id'>, id?: string) => {
    const ref = id ? doc(db, 'dashboard', 'appointments', 'items', id) : doc(appointmentsCollection);
    await setDoc(ref, { ...payload, createdAt: payload.createdAt ?? Timestamp.now() }, { merge: true });
};

export const deleteAppointment = async (id: string) => {
    await deleteDoc(doc(db, 'dashboard', 'appointments', 'items', id));
};

export const subscribeDocuments = (onData: (data: DocumentItem[]) => void, onError: (err: unknown) => void) => {
    return onSnapshot(
        query(documentsCollection, orderBy('createdAt', 'desc')),
        (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DocumentItem, 'id'>) }))),
        onError
    );
};

export const upsertDocument = async (payload: Omit<DocumentItem, 'id'>, id?: string) => {
    const ref = id ? doc(db, 'documents', id) : doc(documentsCollection);
    await setDoc(
        ref,
        {
            ...payload,
            updatedAt: Timestamp.now(),
            createdAt: payload.createdAt ?? Timestamp.now(),
        },
        { merge: true }
    );
};

export const deleteDocument = async (id: string) => {
    await deleteDoc(doc(db, 'documents', id));
};

export const subscribeChatbotConversations = (
    onData: (data: ChatbotConversationItem[]) => void,
    onError: (err: unknown) => void
) => {
    return onSnapshot(
        query(chatbotCollection, orderBy('createdAt', 'desc')),
        (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatbotConversationItem, 'id'>) }))),
        onError
    );
};

export const upsertChatbotConversation = async (payload: Omit<ChatbotConversationItem, 'id'>, id?: string) => {
    const ref = id ? doc(db, 'dashboard', 'chatbotConversations', 'items', id) : doc(chatbotCollection);
    await setDoc(ref, { ...payload, createdAt: payload.createdAt ?? Timestamp.now() }, { merge: true });
};

export const deleteChatbotConversation = async (id: string) => {
    await deleteDoc(doc(db, 'dashboard', 'chatbotConversations', 'items', id));
};

export const subscribeSeoSettings = (onData: (data: SeoSettings) => void, onError: (err: unknown) => void) => {
    return onSnapshot(
        seoDoc,
        (snap) => {
            if (snap.exists()) {
                onData({ id: snap.id, ...(snap.data() as Omit<SeoSettings, 'id'>) });
            } else {
                onData({
                    id: 'global',
                    siteTitle: 'Av. Mahmut Kaya',
                    siteDescription: 'Profesyonel Hukuk Danışmanlığı ve Çözüm Ortağınız',
                    defaultOgImage: '/images/og-default.png',
                    robotsIndex: true,
                });
            }
        },
        onError
    );
};

export const saveSeoSettings = async (payload: Omit<SeoSettings, 'id'>) => {
    await setDoc(seoDoc, { ...payload, updatedAt: Timestamp.now() }, { merge: true });
};

