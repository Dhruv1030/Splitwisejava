export interface Contact {
  id: number;
  userId: number;
  contactId: number;
  contactName?: string;
  contactEmail?: string;
  relationshipType: 'FRIEND' | 'FAMILY' | 'COLLEAGUE' | 'OTHER';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface ContactInvitation {
  id: number;
  fromUserId: number;
  toUserId: number;
  fromUserName: string;
  fromUserEmail: string;
  relationshipType: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  updatedAt: string;
}

export interface AddContactRequest {
  email?: string;
  userId?: number;
  relationshipType: string;
}
