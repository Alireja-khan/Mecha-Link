"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";

const AddSpareParts = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/partsCategory");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/api/brands");
      setBrands(response.data);
    } catch (error) {
      toast.error("Failed to fetch brands");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      const response = await axios.post("/api/partsCategory", {
        name: newCategory,
      });

      if (response.data.success) {
        toast.success("Category added successfully");
        setNewCategory("");
        setShowCategoryModal(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add category");
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim() || !selectedCategory) {
      toast.error("Please enter subcategory name and select a category");
      return;
    }

    try {
      const response = await axios.post("/api/partsCategory/subcategory", {
        categoryId: selectedCategory,
        subCategoryName: newSubCategory,
      });

      if (response.data.success) {
        toast.success("Subcategory added successfully");
        setNewSubCategory("");
        setShowSubCategoryModal(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add subcategory");
    }
  };

  const handleAddBrand = async () => {
    if (!newBrand.trim()) {
      toast.error("Please enter brand name");
      return;
    }

    try {
      const response = await axios.post("/api/brands", { name: newBrand });

      if (response.data.success) {
        toast.success("Brand added successfully");
        setNewBrand("");
        setShowBrandModal(false);
        fetchBrands();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add brand");
    }
  };

 
  const onSubmit = async (data) => {
  setLoading(true);
  try {
    // Find the category name from the selected category ID
    const selectedCategoryObj = categories.find(cat => cat._id === selectedCategory);
    
    // Prepare the data with category name instead of ID
    const formData = {
      ...data,
      category: selectedCategoryObj?.name, // Store category name instead of ID
      subCategory: selectedSubCategory,
      // brands is already stored as name from the brands select
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
      images: data.images || "",
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await axios.post('/api/spareParts', formData);

    if (response.data.success) {
      toast.success('Spare part added successfully');
      reset();
      setSelectedCategory('');
      setSelectedSubCategory('');
      setSelectedBrand('');
    }
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to add spare part');
  } finally {
    setLoading(false);
  }
};



  const selectedCategoryData = categories.find(
    (cat) => cat._id === selectedCategory
  );

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto px-4">
        <div className="rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">
            Add New Spare Part
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Parts Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Parts Name *
              </label>
              <input
                {...register("partsName", {
                  required: "Parts name is required",
                })}
                type="text"
                className="w-full px-3 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter parts name"
              />
              {errors.partsName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.partsName.message}
                </p>
              )}
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <div className="flex gap-2">
                  <select
                    {...register("category", { required: "Category is required" })}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setValue("category", e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-3 py-2 bg-primary rounded-md hover:bg-primary focus:outline-none focus:ring-2 text-white focus:ring-primary"
                  >
                    +
                  </button>
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory
                </label>
                <div className="flex gap-2">
                  <select
                    {...register("subCategory")}
                    value={selectedSubCategory}
                    onChange={(e) => {
                      setSelectedSubCategory(e.target.value);
                      setValue("subCategory", e.target.value);
                    }}
                    disabled={!selectedCategory}
                    className="flex-1 px-3 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed"
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategoryData?.subCategories?.map((subCat, index) => (
                      <option key={index} value={subCat.name}>
                        {subCat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowSubCategoryModal(true)}
                    disabled={!selectedCategory}
                    className="px-3 py-2 bg-primary text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Brands and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brands *
                </label>
                <div className="flex gap-2">
                  <select
                    {...register("brands", { required: "Brand is required" })}
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setValue("brands", e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowBrandModal(true)}
                    className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    +
                  </button>
                </div>
                {errors.brands && (
                  <p className="text-red-500 text-sm mt-1">{errors.brands.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Price *
                </label>
                <input
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Quantity and Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantity Field */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Quantity *
                </label>
                <div className="relative">
                  <input
                    {...register("quantity", { 
                      required: "Quantity is required",
                      min: { value: 1, message: "Quantity must be at least 1" }
                    })}
                    type="number"
                    className="w-full px-4 py-3 border border-primary rounded-lg  focus:border-primary focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Enter quantity"
                  />
                </div>
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const image = e.target.files[0];
                      if (!image) return;

                      // Validate image size and type
                      if (image.size > 5 * 1024 * 1024) {
                        toast.error("Image size should be less than 5MB");
                        return;
                      }

                      if (!image.type.startsWith("image/")) {
                        toast.error("Please upload a valid image file");
                        return;
                      }

                      try {
                        setImageLoading(true);
                        const imageUrl = await uploadImageToImgbb(image);
                        if (imageUrl) {
                          setValue("images", imageUrl);
                          toast.success("Image uploaded successfully");
                        }
                      } catch (error) {
                        console.error("Image upload failed:", error);
                        toast.error("Failed to upload image");
                      } finally {
                        setImageLoading(false);
                      }
                    }}
                    className="w-full px-4 py-1.5 border border-primary rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-600 hover:file:bg-blue-100"
                  />
                </div>
                
                <input
                  type="hidden"
                  {...register("images")}
                />
                
                {imageLoading && (
                  <div className="flex items-center space-x-2 text-blue-600 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm">Uploading image...</span>
                  </div>
                )}
                
                {watch("images") && !imageLoading && (
                  <p className="text-green-600 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Image ready!
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className="w-full px-3 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter detailed description of the spare part"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Spare Part..." : "Add Spare Part"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* All modals remain the same */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showSubCategoryModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add New Subcategory</h3>
            <p className="text-sm text-gray-600 mb-2">
              Category: {selectedCategoryData?.name}
            </p>
            <input
              type="text"
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              placeholder="Enter subcategory name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSubCategoryModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Subcategory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add New Brand</h3>
            <input
              type="text"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Enter brand name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBrandModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSpareParts;


{/* Add Category Modal */}
      