import React, { createContext, useCallback, useContext, useState } from "react";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface ConversationRating {
  stars: number;
  comment: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantVerified: boolean;
  subject: string;
  subjectCategory: string;
  messages: Message[];
  createdAt: string;
  rating?: ConversationRating;
}

interface MessagesContextValue {
  conversations: Conversation[];
  totalUnread: number;
  sendMessage: (conversationId: string, text: string, fromMe?: boolean) => void;
  startConversation: (
    participant: { id: string; name: string; role: string; verified: boolean },
    subject: string,
    subjectCategory: string,
    initialMessage?: string
  ) => string;
  markAsRead: (conversationId: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  rateConversation: (conversationId: string, stars: number, comment: string) => void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

const ME = "me";

function ago(ms: number) {
  return new Date(Date.now() - ms).toISOString();
}
const M = 60 * 1000;
const H = 60 * M;
const D = 24 * H;

const AUTO_REPLIES: Record<string, string[]> = {
  default: [
    "Bonjour ! Oui, le produit est toujours disponible.",
    "Merci pour votre intérêt ! Je peux livrer dans les 24h.",
    "Oui, nous pouvons négocier pour les grandes quantités.",
    "D'accord, je vous envoie les détails par ici.",
    "Parfait ! Quel est le meilleur moment pour vous ?",
  ],
  agriculture: [
    "Bonjour ! La récolte est fraîche, livrée ce matin.",
    "Oui, disponible en quantité. Prix négociable pour plus de 10 kg.",
    "Je peux passer au marché de Madina demain matin.",
    "La qualité est garantie, certifié NAFA ✓",
    "D'accord pour la livraison. Votre adresse exacte ?",
  ],
  "real-estate": [
    "Bonjour ! La propriété est toujours disponible.",
    "Une visite peut être organisée ce weekend.",
    "Oui, le prix est négociable pour une décision rapide.",
    "Je peux vous envoyer plus de photos si vous le souhaitez.",
    "Parfait ! Je vous attends pour la visite.",
  ],
  services: [
    "Bonjour ! Je suis disponible cette semaine.",
    "Mon tarif inclut les matériaux et la main d'œuvre.",
    "Je peux passer faire un devis gratuit.",
    "J'ai plus de 5 ans d'expérience dans ce domaine.",
    "D'accord, confirmé pour votre créneau.",
  ],
};

function getAutoReply(category: string): string {
  const pool = AUTO_REPLIES[category] ?? AUTO_REPLIES.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "cv1",
    participantId: "u1",
    participantName: "Mamadou Diallo",
    participantRole: "farmer",
    participantVerified: true,
    subject: "Tomates fraîches — 5 kg",
    subjectCategory: "agriculture",
    createdAt: ago(3 * D),
    messages: [
      {
        id: "m1",
        senderId: ME,
        text: "Bonjour Mamadou, est-ce que vos tomates sont encore disponibles ? Je voudrais commander 5 kg.",
        createdAt: ago(2 * D + 4 * H),
        read: true,
      },
      {
        id: "m2",
        senderId: "u1",
        text: "Bonjour ! Oui, j'ai encore du stock. La récolte de cette semaine est excellente. Prix : 5 000 GNF/kg.",
        createdAt: ago(2 * D + 3 * H + 45 * M),
        read: true,
      },
      {
        id: "m3",
        senderId: ME,
        text: "Parfait ! Est-ce que vous pouvez livrer à Kipé ?",
        createdAt: ago(2 * D + 3 * H + 20 * M),
        read: true,
      },
      {
        id: "m4",
        senderId: "u1",
        text: "Oui, je livre à Kipé le mardi et le jeudi. Pour 5 kg je prends 5 000 GNF de frais de livraison. Total : 30 000 GNF.",
        createdAt: ago(2 * D + 3 * H),
        read: true,
      },
      {
        id: "m5",
        senderId: ME,
        text: "C'est d'accord ! Jeudi prochain ça me convient.",
        createdAt: ago(2 * D + 2 * H + 30 * M),
        read: true,
      },
      {
        id: "m6",
        senderId: "u1",
        text: "Noté ! Je vous confirme jeudi. Votre adresse exacte à Kipé ?",
        createdAt: ago(45 * M),
        read: false,
      },
    ],
  },
  {
    id: "cv2",
    participantId: "u2",
    participantName: "Fatoumata Bah",
    participantRole: "trader",
    participantVerified: true,
    subject: "Appartement F3 — Kaloum",
    subjectCategory: "real-estate",
    createdAt: ago(5 * D),
    messages: [
      {
        id: "m10",
        senderId: "u2",
        text: "Bonjour ! J'ai vu votre annonce pour l'appartement F3 à Kaloum. Est-il encore disponible ?",
        createdAt: ago(4 * D + 2 * H),
        read: true,
      },
      {
        id: "m11",
        senderId: ME,
        text: "Oui, toujours disponible ! Vous souhaitez visiter ?",
        createdAt: ago(4 * D + 1 * H + 30 * M),
        read: true,
      },
      {
        id: "m12",
        senderId: "u2",
        text: "Oui avec plaisir. Samedi matin c'est possible pour vous ?",
        createdAt: ago(3 * D + 8 * H),
        read: true,
      },
      {
        id: "m13",
        senderId: ME,
        text: "Samedi à 10h c'est parfait. Je vous envoie l'adresse exacte.",
        createdAt: ago(3 * D + 7 * H),
        read: true,
      },
      {
        id: "m14",
        senderId: "u2",
        text: "Merci ! À samedi 👍",
        createdAt: ago(3 * D + 6 * H + 50 * M),
        read: true,
      },
    ],
  },
  {
    id: "cv3",
    participantId: "u3",
    participantName: "Alpha Barry",
    participantRole: "warehouse",
    participantVerified: false,
    subject: "Entrepôt 200m² — Matoto",
    subjectCategory: "logistics",
    createdAt: ago(1 * D),
    messages: [
      {
        id: "m20",
        senderId: ME,
        text: "Bonjour Alpha, je cherche un entrepôt pour stocker des céréales. Votre entrepôt de Matoto est disponible à partir de quand ?",
        createdAt: ago(22 * H),
        read: true,
      },
      {
        id: "m21",
        senderId: "u3",
        text: "Bonjour ! Disponible dès maintenant. Capacité 200 m², température contrôlée. 850 000 GNF/mois.",
        createdAt: ago(20 * H),
        read: true,
      },
      {
        id: "m22",
        senderId: "u3",
        text: "Je peux vous faire visiter demain matin si vous voulez.",
        createdAt: ago(30 * M),
        read: false,
      },
    ],
  },
];

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

  const totalUnread = conversations.reduce(
    (acc, cv) => acc + cv.messages.filter((m) => m.senderId !== ME && !m.read).length,
    0
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string, fromMe = true) => {
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        senderId: fromMe ? ME : conversationId,
        text,
        createdAt: new Date().toISOString(),
        read: !fromMe,
      };
      setConversations((prev) =>
        prev.map((cv) =>
          cv.id === conversationId ? { ...cv, messages: [...cv.messages, newMsg] } : cv
        )
      );

      if (fromMe) {
        const cv = conversations.find((c) => c.id === conversationId);
        if (!cv) return;
        const delay = 1200 + Math.random() * 1000;
        setTimeout(() => {
          const reply: Message = {
            id: `msg_${Date.now()}_r`,
            senderId: cv.participantId,
            text: getAutoReply(cv.subjectCategory),
            createdAt: new Date().toISOString(),
            read: false,
          };
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId ? { ...c, messages: [...c.messages, reply] } : c
            )
          );
        }, delay);
      }
    },
    [conversations]
  );

  const startConversation = useCallback(
    (
      participant: { id: string; name: string; role: string; verified: boolean },
      subject: string,
      subjectCategory: string,
      initialMessage?: string
    ): string => {
      const existing = conversations.find((c) => c.participantId === participant.id);
      if (existing) return existing.id;

      const newId = `cv_${Date.now()}`;
      const newConv: Conversation = {
        id: newId,
        participantId: participant.id,
        participantName: participant.name,
        participantRole: participant.role,
        participantVerified: participant.verified,
        subject,
        subjectCategory,
        createdAt: new Date().toISOString(),
        messages: initialMessage
          ? [
              {
                id: `msg_${Date.now()}`,
                senderId: ME,
                text: initialMessage,
                createdAt: new Date().toISOString(),
                read: true,
              },
            ]
          : [],
      };
      setConversations((prev) => [newConv, ...prev]);
      return newId;
    },
    [conversations]
  );

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((cv) =>
        cv.id === conversationId
          ? { ...cv, messages: cv.messages.map((m) => ({ ...m, read: true })) }
          : cv
      )
    );
  }, []);

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  const rateConversation = useCallback(
    (conversationId: string, stars: number, comment: string) => {
      setConversations((prev) =>
        prev.map((cv) =>
          cv.id === conversationId
            ? { ...cv, rating: { stars, comment, createdAt: new Date().toISOString() } }
            : cv
        )
      );
    },
    []
  );

  return (
    <MessagesContext.Provider
      value={{ conversations, totalUnread, sendMessage, startConversation, markAsRead, getConversation, rateConversation }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider");
  return ctx;
}
