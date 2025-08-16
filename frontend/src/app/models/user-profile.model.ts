export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  defaultCurrency: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  expenseNotifications: boolean;
  settlementNotifications: boolean;
  isActive: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
  displayName: string;
  fullName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  defaultCurrency?: string;
  timezone?: string;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  expenseNotifications?: boolean;
  settlementNotifications?: boolean;
}

export interface UpdateAvatarRequest {
  avatarUrl: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  expenseNotifications: boolean;
  settlementNotifications: boolean;
}

export interface AccountSettings {
  defaultCurrency: string;
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
}
