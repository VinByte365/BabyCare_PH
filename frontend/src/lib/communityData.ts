/**
 * BabyGuide PH — Community Mock Data
 *
 * Local-first community posts, comments, and user profiles
 * for the Community Support Module.
 */

export interface CommunityUser {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'parent' | 'professional' | 'moderator';
  verified: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  user: CommunityUser;
  body: string;
  createdAt: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  user: CommunityUser;
  title: string;
  body: string;
  category: 'general' | 'feeding' | 'sleep' | 'health' | 'development' | 'vaccination';
  createdAt: string;
  commentCount: number;
  comments: CommunityComment[];
  likes: number;
  isPinned: boolean;
  isReviewed: boolean;
}

export const COMMUNITY_USERS: CommunityUser[] = [
  { id: 'dr_santos', name: 'Dr. Maria Santos', role: 'professional', verified: true },
  { id: 'user1', name: 'Anna Reyes', role: 'parent', verified: false },
  { id: 'user2', name: 'Carlo Dimagiba', role: 'parent', verified: false },
  { id: 'user3', name: 'Jenny Cruz', role: 'parent', verified: false },
  { id: 'mod1', name: 'BabyGuide Team', role: 'moderator', verified: true },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    userId: 'dr_santos',
    user: COMMUNITY_USERS[0],
    title: 'When to Worry About Newborn Jaundice',
    body: 'Many parents ask me about jaundice. Here\'s a simple guide: mild jaundice (face and upper chest) is common and usually resolves with frequent feeding. But if the yellow color reaches the belly or legs, or if your baby is very sleepy and not feeding well, please see a pediatrician immediately.',
    category: 'health',
    createdAt: '2026-07-02T10:30:00Z',
    commentCount: 5,
    comments: [
      { id: 'c1', postId: 'post_1', userId: 'user1', user: COMMUNITY_USERS[1], body: 'Thank you, Doc! Our baby had jaundice and this information really helped us know when to go to the hospital.', createdAt: '2026-07-02T14:00:00Z', likes: 3 },
      { id: 'c2', postId: 'post_1', userId: 'mod1', user: COMMUNITY_USERS[4], body: 'Great advice! We have a detailed jaundice care guide in the app under Care Guidance.', createdAt: '2026-07-02T15:30:00Z', likes: 5 },
      { id: 'c3', postId: 'post_1', userId: 'user2', user: COMMUNITY_USERS[2], body: 'How long does phototherapy usually take?', createdAt: '2026-07-03T08:00:00Z', likes: 1 },
      { id: 'c4', postId: 'post_1', userId: 'dr_santos', user: COMMUNITY_USERS[0], body: 'Typically 24-48 hours depending on bilirubin levels. Your pediatrician will monitor daily.', createdAt: '2026-07-03T09:00:00Z', likes: 4 },
      { id: 'c5', postId: 'post_1', userId: 'user3', user: COMMUNITY_USERS[3], body: 'Our baby needed 3 days of phototherapy. It felt scary but the doctors were very reassuring.', createdAt: '2026-07-03T11:00:00Z', likes: 2 },
    ],
    likes: 12,
    isPinned: true,
    isReviewed: true,
  },
  {
    id: 'post_2',
    userId: 'user1',
    user: COMMUNITY_USERS[1],
    title: 'Tips for Breastfeeding at Night?',
    body: 'Hi mommies! Our 3-week-old wants to nurse every hour at night. I\'m exhausted! Any tips for making night feeds easier? I want to make sure she\'s getting enough milk but I also need to sleep.',
    category: 'feeding',
    createdAt: '2026-07-01T21:00:00Z',
    commentCount: 3,
    comments: [
      { id: 'c6', postId: 'post_2', userId: 'user2', user: COMMUNITY_USERS[2], body: 'Side-lying position saved me! You can rest while baby feeds. Make sure your sleep space is safe.', createdAt: '2026-07-01T23:00:00Z', likes: 6 },
      { id: 'c7', postId: 'post_2', userId: 'user3', user: COMMUNITY_USERS[3], body: 'Cluster feeding is normal at this age! It passes. Stay hydrated and keep snacks near your nursing spot.', createdAt: '2026-07-02T06:00:00Z', likes: 4 },
      { id: 'c8', postId: 'post_2', userId: 'dr_santos', user: COMMUNITY_USERS[0], body: 'Cluster feeding is common during growth spurts (around 3 weeks and 6 weeks). It helps increase your milk supply. It will pass! Make sure baby is having enough wet diapers (6+ per day).', createdAt: '2026-07-02T08:00:00Z', likes: 8 },
    ],
    likes: 15,
    isPinned: false,
    isReviewed: false,
  },
  {
    id: 'post_3',
    userId: 'user2',
    user: COMMUNITY_USERS[2],
    title: 'Baby\'s First Vaccination — What to Expect?',
    body: 'Our 2-month-old has her first set of vaccines next week. I\'m a bit nervous. What should I expect? Any tips for soothing her afterward?',
    category: 'vaccination',
    createdAt: '2026-06-30T14:00:00Z',
    commentCount: 2,
    comments: [
      { id: 'c9', postId: 'post_3', userId: 'user1', user: COMMUNITY_USERS[1], body: 'Our baby had a mild fever after. Pediatrician said it\'s normal. Just monitor and offer extra feeds. Paracetamol helped.', createdAt: '2026-06-30T16:00:00Z', likes: 3 },
      { id: 'c10', postId: 'post_3', userId: 'dr_santos', user: COMMUNITY_USERS[0], body: 'Normal side effects include mild fever, fussiness, and soreness at the injection site. These usually resolve within 24-48 hours. Breastfeed or offer extra comfort. Call your doctor if fever exceeds 40°C.', createdAt: '2026-06-30T17:00:00Z', likes: 7 },
    ],
    likes: 9,
    isPinned: false,
    isReviewed: false,
  },
  {
    id: 'post_4',
    userId: 'user3',
    user: COMMUNITY_USERS[3],
    title: 'How Much Should a 1-Month-Old Sleep?',
    body: 'Our baby sleeps 16-18 hours a day but sometimes I worry she sleeps too much. She wakes up to feed every 3 hours and has enough wet diapers. Is this normal?',
    category: 'sleep',
    createdAt: '2026-06-28T09:00:00Z',
    commentCount: 2,
    comments: [
      { id: 'c11', postId: 'post_4', userId: 'user1', user: COMMUNITY_USERS[1], body: 'Totally normal! Newborns sleep A LOT. As long as she\'s waking to feed and has wet diapers, you\'re fine.', createdAt: '2026-06-28T11:00:00Z', likes: 2 },
      { id: 'c12', postId: 'post_4', userId: 'mod1', user: COMMUNITY_USERS[4], body: 'That sounds perfectly healthy. Newborns need 14-17 hours of sleep per day. As long as baby is feeding well and gaining weight, there\'s no cause for concern.', createdAt: '2026-06-28T13:00:00Z', likes: 4 },
    ],
    likes: 7,
    isPinned: false,
    isReviewed: false,
  },
  {
    id: 'post_5',
    userId: 'user1',
    user: COMMUNITY_USERS[1],
    title: 'Dealing with Baby Acne',
    body: 'Our 3-week-old has red bumps on her cheeks. Is this baby acne or something else? It doesn\'t seem to bother her but I want to make sure.',
    category: 'health',
    createdAt: '2026-06-25T16:00:00Z',
    commentCount: 1,
    comments: [
      { id: 'c13', postId: 'post_5', userId: 'dr_santos', user: COMMUNITY_USERS[0], body: 'Baby acne is very common and harmless. It usually appears around 2-4 weeks and clears up on its own within a few weeks. Just wash baby\'s face with plain water and pat dry. No creams or lotions needed unless advised by your doctor.', createdAt: '2026-06-25T18:00:00Z', likes: 5 },
    ],
    likes: 6,
    isPinned: false,
    isReviewed: false,
  },
];

export function getCommunityPost(id: string): CommunityPost | undefined {
  return COMMUNITY_POSTS.find((p) => p.id === id);
}

export function getCategoryLabel(category: CommunityPost['category']): string {
  const labels: Record<string, string> = {
    general: 'General',
    feeding: 'Feeding',
    sleep: 'Sleep',
    health: 'Health',
    development: 'Development',
    vaccination: 'Vaccination',
  };
  return labels[category] ?? category;
}
