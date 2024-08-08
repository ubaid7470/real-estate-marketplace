import { useEffect, useState } from "react";
import ListingCard from "../components/UI/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../redux/toast/toastSlice";

const UserListings = () => {
  const [userListings, setUserListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchUserListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(
          openToast({
            message: data.message,
            severity: "error",
          })
        );
        return;
      }
      setUserListings(data);
    } catch (error) {
      dispatch(
        openToast({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, []);

  const handleDelete = async (listingID) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingID}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(
          openToast({
            message: data.message,
            severity: "error",
          })
        );
        return;
      }
      setUserListings(
        userListings.filter((listing) => listing._id !== listingID)
      );
    } catch (error) {
      dispatch(
        openToast({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  return (
    <div className="custom-container">
      <h1 className="primary-heading">Your Listings</h1>
      <div className="flex justify-center gap-x-5 md:gap-x-12 flex-wrap">
        {userListings.map((listing) => (
          <ListingCard
            key={listing._id}
            listingID={listing._id}
            image={listing.imageUrls[0]}
            title={listing.title}
            description={listing.description}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default UserListings;
