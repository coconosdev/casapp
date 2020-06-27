import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCSv0oSauxM_CO6pFV-37ifOxyTCcbkmok',
  authDomain: 'casapp-d6e85.firebaseapp.com',
  projectId: 'casapp-d6e85',
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

////////////////MANDADO START
export const getTodoList = async () => {
  const snapshot = await db.collection('todos').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const id = doc.id;
    return { id, ...data };
  });
};

export const addTodo = async (nombre) => {
  const snapshot = await db.collection('todos').add({
    nombre,
  });
  return snapshot;
};

export const updateTodo = async (id, nombre) => {
  const snapshot = await db.collection('todos').doc(id).update({
    nombre,
  });
  return snapshot;
};
export const deleteTodo = async (id) => {
  const snapshot = await db.collection('todos').doc(id).delete();
  return snapshot;
};

export const streamTodoList = (observer) => {
  return db.collection('todos').onSnapshot(observer);
};

////////////////MANDADO END

////////////////PENDIENTES START
export const getPendientesList = async () => {
  const snapshot = await db.collection('pendientes').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const id = doc.id;
    return { id, ...data };
  });
};

export const addPendientes = async (name) => {
  const snapshot = await db.collection('pendientes').add({
    name,
  });
  return snapshot;
};

export const updatePendientes = async (id, name) => {
  const snapshot = await db.collection('pendientes').doc(id).update({
    name,
  });
  return snapshot;
};
export const deletePendientes = async (id) => {
  const snapshot = await db.collection('pendientes').doc(id).delete();
  return snapshot;
};

export const streamPendientesList = (observer) => {
  return db.collection('pendientes').onSnapshot(observer);
};

////////////////PENDIENTES END
