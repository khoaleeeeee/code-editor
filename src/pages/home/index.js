import { React, useState } from "react";
import "./style.css";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, listAll } from "firebase/storage";
import firebaseConfig from "../../config";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function Home() {
  const [folderName, setFolderName] = useState("");

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleCreateFolder = () => {
    const folderRef = ref(storage, `folders/${folderName}`);
    listAll(folderRef)
      .then(() => {
        console.log("Folder already exists.");
      })
      .catch(() => {
        uploadBytes(folderRef, new Uint8Array())
          .then(() => {
            console.log("Folder created successfully.");
          })
          .catch((error) => {
            console.error(error);
          });
      });
  };

  return (
    <div className="home_container">
      <div className="home_content">
        <input
          type="text"
          value={folderName}
          onChange={handleFolderNameChange}
        />
        <button onClick={handleCreateFolder} className="create-project-btn">
          Create Project
        </button>
      </div>
    </div>
  );
}

export default Home;
