import { useEffect, useState } from "react";
import ListingCard from "../components/UI/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../redux/toast/toastSlice";
import { Link } from "react-router-dom";

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

      {userListings.length > 3 ? (
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
      ) : (
        //how to make this div vertically center
        <div className="flex flex-col gap-4 justify-center items-center h-[50vh]">
          <h2 className="text-3xl text-gray-600">No listings found.</h2>
          <Link to="/create-listing" className="w-72 p-1">
            <button className="bg-primary w-full outline outline-2 outline-dark hover:bg-dark hover:text-primary text-dark rounded-lg text-center p-3 transition duration-200 ease-in">
              Create New Listing
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserListings;
