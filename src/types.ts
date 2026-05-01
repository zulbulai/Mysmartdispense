export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
  category: string;
  subCategory?: string;
  brand?: string;
  imageUrl: string;
  purchaseLink: string;
  availability: boolean;
  tags: string[];
  createdAt: any;
  updatedAt: any;
}

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
