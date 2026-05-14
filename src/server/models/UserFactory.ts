/**
 * FACTORY PATTERN: UserFactory
 * Purpose: Used for creating different types of users (Admin vs Customer).
 * It abstracts the creation logic, allowing the system to handle different 
 * user types through a common interface while providing unique 
 * characteristics for each.
 */

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER"
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  // Common fields
  address?: string;
  phoneNumber?: string;
}

export interface AdminProfile extends UserProfile {
  role: UserRole.ADMIN;
  permissions: string[]; // e.g., ['manage_books', 'view_sales']
}

export interface CustomerProfile extends UserProfile {
  role: UserRole.CUSTOMER;
  cartId?: string;
  orderHistory: string[];
}

export class UserFactory {
  /**
   * Creates a user profile based on the provided role.
   */
  public static createUser(uid: string, email: string, displayName: string, role: UserRole): UserProfile {
    const baseProfile = {
      uid,
      email,
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    switch (role) {
      case UserRole.ADMIN:
        return {
          ...baseProfile,
          role: UserRole.ADMIN,
          permissions: ['all']
        } as AdminProfile;

      case UserRole.CUSTOMER:
        return {
          ...baseProfile,
          role: UserRole.CUSTOMER,
          orderHistory: []
        } as CustomerProfile;

      default:
        throw new Error("Invalid User Role provided to UserFactory.");
    }
  }
}
