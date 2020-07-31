import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
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

export const addTodo = async (nombre, order) => {
  const snapshot = await db.collection('todos').add({
    nombre,
    order,
  });
  return snapshot;
};

export const updateTodo = async (id, nombre, order) => {
  const snapshot = await db.collection('todos').doc(id).update({
    nombre,
    order,
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

////////////////AGUA START
export const getAguaList = async () => {
  const snapshot = await db.collection('agua').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const id = doc.id;
    return { id, ...data };
  });
};

export const addAgua = async (date) => {
  const snapshot = await db.collection('agua').add({
    date,
  });
  return snapshot;
};

export const updateAgua = async (id, date) => {
  const snapshot = await db.collection('agua').doc(id).update({
    date,
  });
  return snapshot;
};
export const deleteAgua = async (id) => {
  const snapshot = await db.collection('agua').doc(id).delete();
  return snapshot;
};

export const streamAguaList = (observer) => {
  return db.collection('agua').onSnapshot(observer);
};

////////////////AGUA END
