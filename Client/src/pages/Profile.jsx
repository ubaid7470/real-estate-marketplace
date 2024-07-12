import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaCamera } from "react-icons/fa";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import {
  updateUserExecute,
  updateUserFailed,
  updateUserSuccess,
  deleteUserExecute,
  deleteUserSuccess,
  deleteUserFailed,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(undefined);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  // const {error, isLoading, currentUser} = useSelector((state)=>state.user);

  const dispatch = useDispatch();

  const profileRef = useRef(null);
  const inputHandler = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (imageFile) handleProfileUpload(imageFile);
  }, [imageFile]);

  //Firebase profile image upload
  const handleProfileUpload = (imageFile) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "ProfileImage";
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(Math.round(uploadProgress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profileImage: downloadURL });
        });
      }
    );
  };

  const handleProfileDeletion = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserExecute());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailed(error.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailed(error.message));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFileUploadError(false);
      dispatch(updateUserExecute());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailed(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setProfileUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailed(error.message));
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-3xl text-center font-medium uppercase my-6 cursor-pointer">
        My Profile
      </h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setImageFile(e.target.files[0])}
          type="file"
          accept="image/*"
          ref={profileRef}
          hidden
        />
        <div className="cursor-pointer relative self-center">
          <img
            className="rounded-full h-28 w-28 object-cover self-center border-2 border-secondary transition-opacity duration-300 ease-in-out hover:opacity-50"
            src={formData.profileImage || currentUser.profileImage}
            alt="Profile Image"
          />
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-dark bg-opacity-30 rounded-full"
            onClick={() => profileRef.current.click()}
          >
            <FaCamera className="text-light h-8 w-8" />
          </div>
        </div>
        <p className="text-green-700 text-center">
          {profileUpdateSuccess ? "Profile Updated Successfully" : ""}
        </p>
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Image should be of less than 2MB
            </span>
          ) : imageUploadProgress >= 1 && imageUploadProgress < 100 ? (
            <span className="text-secondary">
              Uploading profile image {imageUploadProgress}%
            </span>
          ) : imageUploadProgress === 100 ? (
            <span className="text-green-700">Profile Image Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="shadow-sm rounded-lg p-3 focus:outline-secondary"
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          onChange={inputHandler}
        />
        <input
          className="rounded-lg p-3 shadow-sm focus:outline-secondary"
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          onChange={inputHandler}
        />
        <input
          className="rounded-lg p-3 shadow-sm focus:outline-secondary"
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          onChange={inputHandler}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-secondary text-white mt-3 rounded-lg text-center p-3 disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Update Profile"}
        </button>
        <button className="bg-dark text-white rounded-lg text-center p-3">
          Create Listing
        </button>
      </form>
      <div className="flex flex-row justify-between px-2 mt-4">
        <a onClick={handleProfileDeletion} className="text-red-500 font-medium">
          Delete Account
        </a>
        <a className="text-dark font-medium" href="">
          Sign Out
        </a>
      </div>
      <p className="text-red-600">{error ? error : ""}</p>
    </div>
  );
}
