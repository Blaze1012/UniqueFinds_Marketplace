import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { Carousel, message } from "antd";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";
import moment from "moment";

function Home() {
  const [showFilters, setShowFilters] = useState(true);
  const [showCarousel, setShowCarousel] = useState(true);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "approved",
    category: [],
    age: [],
  });
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const SearchChange = async (text) => {
    // console.log(`Search:`, text);
    setFilters({ ...filters, search: text });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // if (filters) setShowCarousel(false);
    getData();
  }, [filters]);

  // const name = user.name;
  return (
    <>
      <Carousel autoplay className="mb-4 ml-16">
        <div>
          <img
            className=""
            src="https://res.cloudinary.com/dufl26uv9/image/upload/f_auto,q_auto/v1/carousel/gbqruucmyelcltmwyc8b"
          />
        </div>
        <div>
          <img
            className=""
            src="https://res.cloudinary.com/dufl26uv9/image/upload/f_auto,q_auto/v1/carousel/mxvk2kvzhywirkmgt1ck"
          />
        </div>

        <div>
          <img
            className=""
            src="https://res.cloudinary.com/dufl26uv9/image/upload/f_auto,q_auto/v1/carousel/ikvvbmenhjtiq6grllox"
          />
        </div>
      </Carousel>
      <div className="flex gap-5">
        {showFilters && (
          <Filters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        <div className="flex flex-col gap-5 w-full overflow-hidden">
          <div className="flex gap-5 items-center ">
            {!showFilters && (
              <i
                class="ri-equalizer-line text-xl cursor-pointer"
                onClick={() => {
                  setShowFilters(true);
                }}
              ></i>
            )}
            <input
              type="text"
              placeholder="Search Products here..."
              className="border rounded border-solid border-gray-300 w-full p-2"
              onChange={(e) => SearchChange(e.target.value)}
            ></input>
          </div>

          <div
            className={`grid gap-5 ${
              showFilters ? "grid-cols-4" : "grid-cols-5"
            }`}
          >
            {products?.map((product) => {
              return (
                <div
                  className="border border-gray-300 rounder border-solid flex flex-col gap-4 pb-2 cursor-pointer"
                  key={product._id}
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                  }}
                >
                  <img
                    src={product.images[0]}
                    className="w-full h-52 p-2 object-cover"
                    alt=""
                  ></img>
                  <div className="px-2 flex flex-col gap-2" key={product._id}>
                    <h1 className="text-lg font-semibold">{product.name}</h1>
                    <p className="text-sm text-gray-500">
                      {product.age}
                      {product.age == "1" ? " Year Old" : " Years Old"}
                    </p>
                    <Divider />

                    <span className="text-lg font-semibold text-green-700">
                      ${product.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
