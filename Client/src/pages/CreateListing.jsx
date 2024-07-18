import { TailSpin } from "react-loader-spinner";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { closeToast, openToast } from "../redux/toast/toastSlice";

export default function CreateListing() {
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleImageSubmit = () => {
    if (
      imageFiles.length > 0 &&
      imageFiles.length + formData.imageUrls.length < 9
    ) {
      dispatch(closeToast());
      setImageUploadLoading(true);
      setImageUploadError(false);
      const promises = [];
      let sizeError = false;
      for (let i = 0; i < imageFiles.length; i++) {
        if (imageFiles[i].size > 2 * 1024 * 1024) {
          sizeError = true;
          setImageUploadLoading(false);
          break;
        }
        promises.push(storeImage(imageFiles[i]));
      }

      if (sizeError) {
        setImageUploadError("Each image must be less than 2MB");
        dispatch(
          openToast({
            message: "Each image must be less than 2MB",
            severity: "error",
          })
        );
        return;
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadLoading(false);
          dispatch(
            openToast({
              message: "Images have been uploaded",
              severity: "success",
            })
          );
        })
        .catch((error) => {
          console.error(error);
          setImageUploadLoading(false);
          setImageUploadError("Image upload failed");
          dispatch(
            openToast({
              message: "Image upload failed",
              severity: "error",
            })
          );
        });
    } else {
      setImageUploadError("You can only upload 8 images!");
      dispatch(
        openToast({
          message: "You can only upload 8 images!",
          severity: "error",
        })
      );
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const deleteImageFromFirebase = async (imageUrl) => {
    const storage = getStorage(app);
    console.log("this is url: ", imageUrl);
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      console.log("Image deleted from Firebase storage");
    } catch (error) {
      console.error("Error deleting image from Firebase storage", error);
    }
  };

  const handleDeleteImage = async (index) => {
    const imageUrl = formData.imageUrls[index];
    await deleteImageFromFirebase(imageUrl);
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrls: prevFormData.imageUrls.filter((url, i) => i !== index),
    }));
  };

  useEffect(() => {
    setImageUploadError(false);
    dispatch(closeToast());
  }, []);

  return (
    <main className="mx-auto p-3 max-w-5xl">
      <h1 className="text-3xl font-bold uppercase my-6">About Your Place</h1>
      <form className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-medium">Add Details</h2>
          <input
            className="shadow-sm rounded-lg p-3 focus:outline-secondary"
            type="text"
            placeholder="Enter Title"
            maxLength={64}
            minLength={10}
            required
          />
          <textarea
            className="shadow-sm rounded-lg p-3 focus:outline-secondary"
            type="text"
            placeholder="Enter Description"
            required
          />
          <input
            className="shadow-sm rounded-lg p-3 focus:outline-secondary"
            type="text"
            placeholder="Enter Address"
            required
          />

          <h3 className="text-lg font-medium">Property Type</h3>
          <div className="flex gap-x-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Checkbox
                id="sell"
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="sell" className="text-md">
                Sell
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="rent"
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="rent" className="text-md">
                Rent
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="furnished"
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="furnished" className="text-md">
                Furnished
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="parking"
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="parking" className="text-md">
                Parking Area
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="discount"
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="discount" className="text-md">
                Discount
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="petsAllowed"
                className="w-4"
                sx={{
                  color: "#AF795D",
                  "&.Mui-checked": {
                    color: "#AF795D",
                  },
                }}
              />
              <label htmlFor="petsAllowed" className="text-md">
                Pets Allowed
              </label>
            </div>
          </div>

          <h3 className="text-lg">Rooms</h3>
          <div className="flex flex-wrap gap-6 mb-3">
            <div className="flex items-center gap-2">
              <label>Bedrooms</label>
              <input
                type="number"
                id="bedroom"
                min="1"
                max="10"
                defaultValue={0}
                required
                className="no-spinner p-1 text-center border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label>Bathrooms</label>
              <input
                type="number"
                id="bathroom"
                min="1"
                max="10"
                defaultValue={0}
                required
                className="no-spinner p-1 text-center border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <h2 className="text-lg font-medium">Add Images</h2>
          <div className="flex gap-4">
            <input
              onChange={(e) => setImageFiles(e.target.files)}
              type="file"
              multiple
              id="images"
              accept="image/*"
              className="block border border-secondary p-2 rounded w-full cursor-pointer text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-medium file:cursor-pointer
      file:bg-secondaryLight file:text-white
      hover:file:bg-secondary"
            />

            <button
              onClick={handleImageSubmit}
              disabled={imageUploadLoading}
              type="button"
              className="p-3 text-secondary border border-secondary rounded uppercase hover:shadow-lg  disabled:opacity-80"
            >
              {imageUploadLoading ? (
                <TailSpin
                  visible={true}
                  height="25"
                  width="61"
                  color="#AF795D"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                />
              ) : (
                "Upload"
              )}
            </button>
          </div>
          <span className="font-normal text-sm text-gray-600 ml-2">
            *The first image will be the cover (max 8)
          </span>

          {imageUploadLoading && (
            <div className="flex flex-wrap gap-y-5 gap-x-6 border border-dashed border-secondaryLight shadow rounded-md p-3">
              {formData.imageUrls.length + imageFiles.length > 0 && (
                <>
                  {[
                    ...Array(imageFiles.length + formData.imageUrls.length),
                  ].map((_, index) => (
                    <div key={index} className="animate-pulse flex space-x-4">
                      <div className="rounded-lg bg-secondaryLight w-24 h-24"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {!imageUploadLoading && formData.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-y-5 gap-x-6 border border-dashed border-secondaryLight shadow rounded-md p-3">
              {formData.imageUrls.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={image}
                    alt="image"
                    className="w-full h-full object-cover rounded-lg shadow-secondaryLight shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-lg font-medium mt-3">Pricing</h3>
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col items-center w-3.5/12">
              <p>Regular price</p>
              <span className="text-xs">($ / month)</span>
            </div>
            <input
              type="number"
              id="regularPrice"
              min="1"
              max="10"
              placeholder="Enter Regular Price"
              required
              className="no-spinner text-center border border-gray-300 w-7/12 rounded-lg p-2 focus:outline-secondary"
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-col items-center w-3.5/12">
              <p>Discounted price</p>
              <span className="text-xs">($ / month)</span>
            </div>
            <input
              type="number"
              id="discountPrice"
              min="1"
              max="10"
              placeholder="Enter Discounted Price"
              required
              className="no-spinner text-center border border-gray-300 w-7/12 rounded-lg p-2 focus:outline-secondary"
            />
          </div>
          <button className="p-3 my-4 sm:my-12 bg-secondary text-primary rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
