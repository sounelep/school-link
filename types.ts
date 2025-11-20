
export enum UserRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  GROUP_ADMIN = 'GROUP_ADMIN',
  PARENT = 'PARENT',
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  isPremium: boolean;
  optOutOfActivities: boolean;
  emailNotifications: boolean; // Nouvelle préférence
  notificationStartTime: string;
  notificationEndTime: string;
  children: Child[];
  groups: string[];
}

export interface Child {
  id: string;
  name: string;
  classGroupId: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  adminIds: string[];
}

export interface Reply {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
  isPrivate: boolean;
}

export enum MessageType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  SIMPLE_POLL = 'SIMPLE_POLL',
  INSCRIPTION_FORM = 'INSCRIPTION_FORM',
}

export interface Message {
  id: string;
  groupId: string;
  authorId: string;
  type: MessageType;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  
  // New Attachment fields
  attachmentName?: string;
  attachmentUrl?: string;

  timestamp: Date; // Date de création
  replies: Reply[];
  attendees?: string[];
  absentees?: string[];
  inscriptionTableId?: string;
  
  // New fields for scheduling
  scheduledAt?: Date; // Date de publication effective
  eventDate?: Date;   // Date de l'événement (pour référence et rappels)
  autoReminders?: boolean; // J-7 et J-3
}

export interface TimeSlot {
  id: string;
  label: string;
}

export interface Activity {
  id: string;
  name: string;
}

export interface InscriptionSlot {
  activityId: string;
  timeSlotId: string;
  capacity: number;
  registeredUserIds: string[];
}

export interface InscriptionTable {
  id:string;
  title: string;
  activities: Activity[];
  timeSlots: TimeSlot[];
  slots: InscriptionSlot[];
}
