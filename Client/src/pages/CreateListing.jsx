import Checkbox from "@mui/material/Checkbox";

export default function CreateListing() {
  return (
    <main className="mx-auto p-3 max-w-5xl">
      <h1 className="text-3xl font-bold uppercase my-6">Create Listing</h1>
      <form className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-3 flex-1">
          <h2 className="text-xl">Add Details</h2>
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
              {/* <input type="checkbox" id="sell" className="w-4" /> */}
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
          <div className="flex flex-wrap gap-6 mb-3">
            <div className="flex items-center gap-2">
              <label>Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
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
                id="bathrooms"
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
          <h2 className="text-xl">Add Images</h2>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-secondary border border-secondary rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <span className="font-normal text-sm text-gray-600 ml-2">
            *The first image will be the cover (max 6)
          </span>
          <div className="flex justify-between items-center gap-2 mt-3">
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
          <button className="p-3 my-4 sm:my-12 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
