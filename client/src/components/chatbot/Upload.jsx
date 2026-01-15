import axios from "axios";
import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import { FaPaperclip, FaSpinner } from "react-icons/fa";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/upload");
    const { signature, expire, token } = response.data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(
      `Authentication request failed: ${error.response?.status || ""} ${
        error.message
      }`
    );
  }
};

const Upload = ({ setImg }) => {
  const ikUploadRef = useRef(null);

  const onError = (err) => {
    console.log("Error", err);
    setImg((prev) => ({ ...prev, isLoading: false, error: "Upload failed" }));
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((prev) => ({ 
      ...prev, 
      isLoading: false, 
      dbData: res,
      error: "" 
    }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];

    setImg((prev) => ({
      ...prev,
      isLoading: true,
      error: ""
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="chat-image.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
        accept="image/*"
      />
      <button
        type="button"
        className="cursor-pointer hover:opacity-70 transition-opacity p-2"
        onClick={() => ikUploadRef.current.click()}
        disabled={setImg.isLoading}
      >
        {setImg.isLoading ? (
          <FaSpinner className="w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <FaPaperclip className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </IKContext>
  );
};

export default Upload;
