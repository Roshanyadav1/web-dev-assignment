import { collection, deleteDoc, getDocs, getDocsFromServer } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { deleteObject, getStorage } from "firebase/storage";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Avoid reinitializing on every hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

async function getProjects() {
  try {
    const projectsCol = collection(db, "projects");
    const projectsSnapshot = await getDocs(projectsCol);
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}


// Upload image and save metadata in subcollection `/projects/{projectId}/images`
async function uploadProjectImage(projectId: string, file: File) {
  try {
    const storageRef = ref(storage, `projects/${projectId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Add image metadata to Firestore
    const imagesCol = collection(db, "projects", projectId, "images");
    const docRef = await addDoc(imagesCol, {
      url: downloadURL,
      name: file.name,
      createdAt: new Date(),
    });

    return { id: docRef.id, url: downloadURL };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}


// async function getProjectImages(projectId: string) {
//   const imagesCol = collection(db, "projects", projectId, "images");
//   const snapshot = await getDocsFromServer(imagesCol);

//   return snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// }

// Modified get functions with better error handling and debugging

async function getProjectImages(projectId: string) {
  try {
    console.log("Getting images for project:", projectId);
    
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    
    const imagesCol = collection(db, "projects", projectId, "images");
    console.log("Collection path:", `projects/${projectId}/images`);
    
    const snapshot = await getDocsFromServer(imagesCol);
    console.log("Images snapshot size:", snapshot.size);
    
    if (snapshot.empty) {
      console.log("No images found for this project");
      return [];
    }
    
    const images = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Image document:", doc.id, data);
      return {
        id: doc.id,
        url: data.url || '',
        name: data.name || '',
        createdAt: data.createdAt,
        ...data,
      };
    });
    
    console.log("Final images array:", images);
    return images;
  } catch (error) {
    console.error("Error getting project images:", error);
    throw error;
  }
}


// Upload media (image or video)
async function uploadProjectMedia(projectId: string, file: File) {
  const filePath = `projects/${projectId}/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);

  const isVideo = file.type.startsWith("video");
  const mediaDoc = {
    url: downloadURL,
    type: isVideo ? "video" : "image",
    path: fileRef.fullPath,
    uploadedAt: new Date().toISOString(),
  };

  const mediaCol = collection(db, "projects", projectId, "media");
  const addedDoc = await addDoc(mediaCol, mediaDoc);

  return { id: addedDoc.id, ...mediaDoc };
}

// Fetch all media for a project
async function getProjectMedia(projectId: string) {
  const mediaCol = collection(db, "projects", projectId, "media");
  const mediaSnapshot = await getDocs(mediaCol);
  return mediaSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}


async function deleteProjectMedia(projectId: string, mediaId: string, storagePath: string) {
  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);

    const mediaDocRef = doc(db, "projects", projectId, "media", mediaId);
    await deleteDoc(mediaDocRef);
    console.log(`Deleted Firestore document with ID ${mediaId}`);
  } catch (error) {
    console.error("Error deleting project media:", error);
    throw error; // Re-throw or handle as needed
  }
}


async function deleteAllProjectImages(projectId: string) {
  const imagesCol = collection(db, "projects", projectId, "images");
  const snapshot = await getDocs(imagesCol);

  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "projects", projectId, "images", d.id)));
  await Promise.all(deletePromises);
}



export {
  auth, db, storage, getProjects, uploadProjectImage, getProjectImages, uploadProjectMedia,
  getProjectMedia,
  deleteProjectMedia,
  deleteAllProjectImages
};
