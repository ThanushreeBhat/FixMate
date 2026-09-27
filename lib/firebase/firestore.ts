import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  WithFieldValue,
  UpdateData,
} from "firebase/firestore";

import { db } from "./firebase";

export const createUserDocument = async (uid: string, userData: WithFieldValue<DocumentData>) => {
  await setDoc(doc(db, "users", uid), userData);
};

export const getUserDocument = async (uid: string) => {
  const docSnap = await getDoc(doc(db, "users", uid));

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
};

export const updateUserDocument = async (uid: string, updatedData: UpdateData<DocumentData>) => {
  await updateDoc(doc(db, "users", uid), updatedData);
};

export const deleteUserDocument = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};
