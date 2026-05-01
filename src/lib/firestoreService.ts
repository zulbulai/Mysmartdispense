import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Product, OperationType, FirestoreErrorInfo } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  const jsonError = JSON.stringify(errInfo);
  console.error('Firestore Error: ', jsonError);
  throw new Error(jsonError);
}

const PRODUCTS_COLLECTION = 'products';

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'discountPercentage'>) {
  try {
    const discountPercentage = Math.round(((product.originalPrice - product.finalPrice) / product.originalPrice) * 100);
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      discountPercentage,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'write', PRODUCTS_COLLECTION);
  }
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    let finalUpdates = { ...updates, updatedAt: serverTimestamp() };
    
    if (updates.originalPrice !== undefined || updates.finalPrice !== undefined) {
      // Need original values if only one is updated
      const currentDoc = await getDoc(docRef);
      const data = currentDoc.data();
      if (data) {
        const op = updates.originalPrice ?? data.originalPrice;
        const fp = updates.finalPrice ?? data.finalPrice;
        finalUpdates.discountPercentage = Math.round(((op - fp) / op) * 100);
      }
    }

    await updateDoc(docRef, finalUpdates);
  } catch (error) {
    handleFirestoreError(error, 'write', `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function deleteProduct(id: string) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, 'delete', `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function getAllProducts() {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, 'list', PRODUCTS_COLLECTION);
    return [];
  }
}

export async function getFilteredProducts(category?: string, brand?: string, minDiscount?: number) {
  try {
    const constraints: QueryConstraint[] = [];
    if (category) constraints.push(where('category', '==', category));
    if (brand) constraints.push(where('brand', '==', brand));
    if (minDiscount) constraints.push(where('discountPercentage', '>=', minDiscount));
    
    // Always order by createdAt desc unless we need range filters on other fields (Firestore limit)
    // For simplicity with minDiscount (range), we might need an index
    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, 'list', PRODUCTS_COLLECTION);
    return [];
  }
}
