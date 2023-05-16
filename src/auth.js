import { getAuth, onAuthStateChanged } from "firebase/auth";

export const auth = getAuth();

export const onAuthStateChangeCallback = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
