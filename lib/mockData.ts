
import { User, Group, Message, InscriptionTable, UserRole, MessageType } from '../types';

export const MOCK_USERS: User[] = [
  { 
    id: 'user-1', 
    name: 'Alice Dubois (Admin)', 
    avatarUrl: 'https://picsum.photos/seed/user1/100/100', 
    role: UserRole.GLOBAL_ADMIN, 
    isPremium: true, 
    optOutOfActivities: false, 
    emailNotifications: true, 
    notificationStartTime: '08:00', 
    notificationEndTime: '20:00', 
    children: [{ id: 'child-1', name: 'Léo', classGroupId: 'group-ce1' }], 
    groups: ['group-bureau', 'group-animation', 'group-travaux', 'group-ce1', 'group-jardinage'] 
  },
  { 
    id: 'user-2', 
    name: 'Bob Martin', 
    avatarUrl: 'https://picsum.photos/seed/user2/100/100', 
    role: UserRole.PARENT, 
    isPremium: true, 
    optOutOfActivities: false, 
    emailNotifications: true, 
    notificationStartTime: '09:00', 
    notificationEndTime: '18:00', 
    children: [{ id: 'child-2', name: 'Chloé', classGroupId: 'group-cm2' }], 
    groups: ['group-cm2'] 
  },
  { 
    id: 'user-3', 
    name: 'Claire Petit', 
    avatarUrl: 'https://picsum.photos/seed/user3/100/100', 
    role: UserRole.PARENT, 
    isPremium: false, 
    optOutOfActivities: false, 
    emailNotifications: false, 
    notificationStartTime: '18:00', 
    notificationEndTime: '21:00', 
    children: [{ id: 'child-3', name: 'Hugo', classGroupId: 'group-ce1' }, { id: 'child-4', name: 'Manon', classGroupId: 'group-cm2' }], 
    groups: ['group-ce1', 'group-cm2'] 
  },
  { 
    id: 'user-4', 
    name: 'David Roy (Admin Anim.)', 
    avatarUrl: 'https://picsum.photos/seed/user4/100/100', 
    role: UserRole.GROUP_ADMIN, 
    isPremium: false, 
    optOutOfActivities: false, 
    emailNotifications: true, 
    notificationStartTime: '08:00', 
    notificationEndTime: '22:00',
    children: [],
    groups: ['group-animation']
  },
  { 
    id: 'user-5', 
    name: 'Sophie Bernard', 
    avatarUrl: 'https://picsum.photos/seed/user5/100/100', 
    role: UserRole.PARENT, 
    isPremium: false, 
    optOutOfActivities: false, 
    emailNotifications: true, 
    notificationStartTime: '08:00', 
    notificationEndTime: '22:00',
    children: [{ id: 'child-5', name: 'Lucas', classGroupId: 'group-ce1' }],
    groups: ['group-ce1', 'group-jardinage']
  },
  { 
    id: 'user-6', 
    name: 'Marc Moreau', 
    avatarUrl: 'https://picsum.photos/seed/user6/100/100', 
    role: UserRole.PARENT, 
    isPremium: false, 
    optOutOfActivities: false, 
    emailNotifications: false, 
    notificationStartTime: '08:00', 
    notificationEndTime: '22:00',
    children: [{ id: 'child-6', name: 'Emma', classGroupId: 'group-cm2' }],
    groups: ['group-cm2', 'group-travaux']
  },
];

export const MOCK_GROUPS: Group[] = [
  { id: 'group-bureau', name: 'Bureau OGEC', description: 'Gestion administrative et financière', adminIds: ['user-1'] },
  { id: 'group-animation', name: 'Commission Animation', description: 'Organisation des fêtes et événements', adminIds: ['user-1', 'user-4'] },
  { id: 'group-travaux', name: 'Commission Travaux', description: 'Entretien et rénovation de l\'école', adminIds: ['user-1'] },
  { id: 'group-ce1', name: 'Classe CE1', description: 'Parents d\'élèves de la classe de CE1', adminIds: ['user-1'] },
  { id: 'group-cm2', name: 'Classe CM2', description: 'Parents d\'élèves de la classe de CM2', adminIds: ['user-1'] },
  { id: 'group-jardinage', name: 'Club Jardinage', description: 'Entretien du potager de l\'école', adminIds: ['user-1'] },
];

export const MOCK_INSCRIPTION_TABLES: InscriptionTable[] = [
  {
    id: 'table-kermesse',
    title: 'Planning des Stands - Kermesse',
    activities: [
      { id: 'act-peche', name: 'Pêche à la ligne' },
      { id: 'act-bar', name: 'Buvette' },
      { id: 'act-ticket', name: 'Vente Tickets' }
    ],
    timeSlots: [
      { id: 'slot-10-12', label: '10h00 - 12h00' },
      { id: 'slot-12-14', label: '12h00 - 14h00' },
      { id: 'slot-14-16', label: '14h00 - 16h00' }
    ],
    slots: [
      { activityId: 'act-peche', timeSlotId: 'slot-10-12', capacity: 2, registeredUserIds: ['user-2'] },
      { activityId: 'act-peche', timeSlotId: 'slot-12-14', capacity: 2, registeredUserIds: [] },
      { activityId: 'act-peche', timeSlotId: 'slot-14-16', capacity: 2, registeredUserIds: [] },
      { activityId: 'act-bar', timeSlotId: 'slot-10-12', capacity: 3, registeredUserIds: ['user-3'] },
      { activityId: 'act-bar', timeSlotId: 'slot-12-14', capacity: 3, registeredUserIds: ['user-1'] },
      { activityId: 'act-bar', timeSlotId: 'slot-14-16', capacity: 3, registeredUserIds: [] },
      { activityId: 'act-ticket', timeSlotId: 'slot-10-12', capacity: 1, registeredUserIds: [] },
      { activityId: 'act-ticket', timeSlotId: 'slot-12-14', capacity: 1, registeredUserIds: [] },
      { activityId: 'act-ticket', timeSlotId: 'slot-14-16', capacity: 1, registeredUserIds: [] },
    ]
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    groupId: 'group-bureau',
    authorId: 'user-1',
    type: MessageType.ANNOUNCEMENT,
    title: 'Réunion de rentrée',
    content: 'Bonjour à tous,\n\nLa réunion de rentrée du bureau OGEC aura lieu le mardi 15 septembre à 20h dans la salle des maîtres.\n\nOrdre du jour :\n- Bilan financier\n- Projets de l\'année\n- Questions diverses\n\nMerci de votre présence.',
    timestamp: new Date('2023-09-01T09:00:00'),
    replies: [
        { id: 'r1', authorId: 'user-2', content: 'Je serai présent.', timestamp: new Date('2023-09-01T10:00:00'), isPrivate: false },
        { id: 'r2', authorId: 'user-3', content: 'Je ne pourrai malheureusement pas être là.', timestamp: new Date('2023-09-01T11:30:00'), isPrivate: false }
    ]
  },
  {
    id: 'msg-2',
    groupId: 'group-animation',
    authorId: 'user-4',
    type: MessageType.INSCRIPTION_FORM,
    title: 'Appel aux bénévoles - Kermesse',
    content: 'Chers parents,\n\nLa kermesse approche ! Nous avons besoin de vous pour tenir les stands. Merci de vous inscrire sur le tableau ci-dessous selon vos disponibilités.\n\nCordialement,\nLa commission animation',
    timestamp: new Date('2023-06-01T14:00:00'),
    inscriptionTableId: 'table-kermesse',
    replies: []
  },
  {
    id: 'msg-3',
    groupId: 'group-cm2',
    authorId: 'user-1',
    type: MessageType.SIMPLE_POLL,
    title: 'Sortie Scolaire - Musée des Beaux-Arts',
    content: 'Nous organisons une sortie au musée le 20 octobre. Nous avons besoin de 3 accompagnateurs.\n\nPouvez-vous nous indiquer votre disponibilité via le sondage ci-dessous ?',
    timestamp: new Date('2023-10-05T08:30:00'),
    attendees: ['user-2'],
    absentees: ['user-3'],
    replies: []
  },
  {
    id: 'msg-4',
    groupId: 'group-ce1',
    authorId: 'user-1',
    type: MessageType.ANNOUNCEMENT,
    title: 'Rappel : Cahiers de liaison',
    content: 'Bonjour,\n\nMerci de bien vouloir vérifier les cahiers de liaison ce soir, un mot important concernant la photo de classe y a été collé.\n\nLa maîtresse.',
    timestamp: new Date('2023-09-10T16:00:00'),
    replies: []
  },
  {
    id: 'msg-5',
    groupId: 'group-bureau',
    authorId: 'user-1',
    type: MessageType.ANNOUNCEMENT,
    title: 'Projet Travaux Été (Programmé)',
    content: 'Voici le récapitulatif des travaux prévus cet été.',
    timestamp: new Date('2023-06-20T10:00:00'),
    scheduledAt: new Date(new Date().getTime() + 86400000 * 2), // Programmé dans 2 jours
    replies: []
  },
  {
    id: 'msg-6',
    groupId: 'group-jardinage',
    authorId: 'user-1',
    type: MessageType.ANNOUNCEMENT,
    title: 'Plantation de printemps',
    content: 'Rendez-vous samedi matin pour les plantations ! N\'oubliez pas vos bottes.',
    timestamp: new Date(),
    replies: []
  },
  {
    id: 'msg-7',
    groupId: 'group-travaux',
    authorId: 'user-6',
    type: MessageType.SIMPLE_POLL,
    title: 'Montage des nouveaux bancs',
    content: 'Nous avons reçu les nouveaux bancs pour la cour. Qui est disponible samedi matin pour aider au montage ?',
    timestamp: new Date(),
    attendees: [],
    absentees: [],
    replies: []
  },
  {
    id: 'msg-8',
    groupId: 'group-cm2',
    authorId: 'user-1',
    type: MessageType.ANNOUNCEMENT,
    title: 'Exposition Arts Plastiques',
    content: 'Bravo aux élèves pour leurs créations !',
    imageUrl: 'https://picsum.photos/seed/art/800/400',
    timestamp: new Date(),
    replies: []
  }
];

// Export constant for potential default login usage, though now managed via UI
export const LOGGED_IN_USER_ID = 'user-1';
