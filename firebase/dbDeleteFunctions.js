import { db } from './firebase-config';
import { doc, collection, getDocs, deleteDoc, query, where, writeBatch } from "firebase/firestore";
import { auth } from './firebase-config';

export const deleteCommentsByPostId = async postId => {
    const batch = writeBatch(db)
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    )
    const commentsQuerySnapshot = await getDocs(commentsQuery)
    commentsQuerySnapshot.forEach(doc => batch.delete(doc.ref))
    batch.commit()
  }

export async function deleteCurrentPost(postId){
    await deleteDoc(doc(db, "posts", postId))
  };

export const deleteCommentsByEventId = async eventId => {
    const batch = writeBatch(db)
    const commentsQuery = query(
      collection(db, "comments"),
      where("eventId", "==", eventId)
    )
    const commentsQuerySnapshot = await getDocs(commentsQuery)
    commentsQuerySnapshot.forEach(doc => batch.delete(doc.ref))
    batch.commit()
  }

export async function deletePostByEventId(eventId){
  const batch = writeBatch(db)
  const deletePostsQuery = query(
    collection(db, "posts"),
    where("eventId", "==", eventId)
  )
  const deletePostsQuerySnapshot = await getDocs(deletePostsQuery)
  deletePostsQuerySnapshot.forEach(doc => batch.delete(doc.ref))
  batch.commit()
  };

export const deleteEvent = async eventId => {
  await deleteDoc(doc(db, "events", eventId))
  }

export async function leaveEventbyEventId(eventId){
  const user = auth.currentUser;
  const uid = user.uid;
  const batch = writeBatch(db)
  const leaveEventQuery = query(
    collection(db, "participants"),
    where("eventId", "==", eventId),
    where("userId", "==", uid)
  )
  const leaveEventQuerySnapshot = await getDocs(leaveEventQuery)
  leaveEventQuerySnapshot.forEach(doc => batch.delete(doc.ref))
  batch.commit()
  };