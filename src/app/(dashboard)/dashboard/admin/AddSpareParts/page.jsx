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
    setSelectedSubCategory('');
    setValue("subCategory", '');
  }, [selectedCategory, setValue]);

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
      const selectedCategoryObj = categories.find(cat => cat._id === selectedCategory);
      
      const formData = {
        ...data,
        category: selectedCategoryObj?.name,
        subCategory: selectedSubCategory || null,
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
        setValue("images", "");
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
    <div className="min-h-screen bg-base-100 py-10">
      <div className="mx-auto px-4 w-full">
        <div className="bg-base-100 rounded-xl shadow-2xl p-8 lg:p-10 border border-base-300">
          <h1 className="sm:text-3xl text-2xl font-extrabold text-base-content mb-8 border-b border-base-300 pb-4">
            Add New Spare Part
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Parts Name <span className="text-error">*</span>
              </label>
              <input
                {...register("partsName", {
                  required: "Parts name is required",
                })}
                type="text"
                className="w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out bg-base-100 text-base-content"
                placeholder="Enter parts name, e.g., Oil Filter XYZ"
              />
              {errors.partsName && (
                <p className="text-error text-sm mt-1">
                  {errors.partsName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Category <span className="text-error">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    {...register("category", { required: "Category is required" })}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setValue("category", e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out bg-base-100 text-base-content"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="flex-shrink-0 h-11 w-11 bg-primary text-info-content rounded-lg hover:bg-primary/90 transition duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-info/50"
                    title="Add New Category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                {errors.category && (
                  <p className="text-error text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
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
                    disabled={!selectedCategory || selectedCategoryData?.subCategories?.length === 0}
                    className={`w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out bg-base-100 text-base-content disabled:bg-base-200 disabled:text-base-content/60 disabled:cursor-not-allowed`}
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
                    className="flex-shrink-0 h-11 w-11 bg-primary text-info-content rounded-lg hover:bg-primary/90 transition duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-info/50 disabled:bg-base-300 disabled:text-base-content/60 disabled:cursor-not-allowed"
                    title="Add New Subcategory"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Brand <span className="text-error">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    {...register("brands", { required: "Brand is required" })}
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setValue("brands", e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out bg-base-100 text-base-content"
                  >
                    <option value="" disabled>Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowBrandModal(true)}
                    className="flex-shrink-0 h-11 w-11 bg-primary text-info-content rounded-lg hover:bg-primary/90 transition duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-info/50"
                    title="Add New Brand"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                {errors.brands && (
                  <p className="text-error text-sm mt-1">{errors.brands.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Price ($) <span className="text-error">*</span>
                </label>
                <input
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 0.01, message: "Price must be positive" },
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out bg-base-100 text-base-content"
                  placeholder="e.g., 49.99"
                />
                {errors.price && (
                  <p className="text-error text-sm mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Quantity <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("quantity", { 
                      required: "Quantity is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Quantity must be at least 1" }
                    })}
                    type="number"
                    className="w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out bg-base-100 text-base-content"
                    placeholder="Enter stock quantity"
                  />
                </div>
                {errors.quantity && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Product Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const image = e.target.files[0];
                      if (!image) return;

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
                          toast.success("Image uploaded successfully!");
                        }
                      } catch (error) {
                        console.error("Image upload failed:", error);
                        toast.error("Failed to upload image");
                        setValue("images", "");
                      } finally {
                        setImageLoading(false);
                      }
                    }}
                    className="w-full text-sm text-base-content/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent/80 transition duration-150 border-base-300 rounded-lg"
                  />
                </div>
                
                <input
                  type="hidden"
                  {...register("images")}
                />
                
                {imageLoading && (
                  <div className="flex items-center space-x-2 text-primary mt-2">
                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span className="text-sm">Uploading image...</span>
                  </div>
                )}
                
                {watch("images") && !imageLoading && (
                  <p className="text-success text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Image Ready!
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={5}
                className="w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out bg-base-100 text-base-content"
                placeholder="Enter a detailed description of the spare part, its compatibility, and key features."
              />
              {errors.description && (
                <p className="text-error text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-primary-content py-3 px-4 rounded-lg font-semibold transition duration-200 ease-in-out ${
                    loading
                      ? "bg-primary/70 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary/50"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-primary-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Adding Spare Part...
                  </div>
                ) : (
                  "Add Spare Part"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCategoryModal && (
        <Modal
          title="Add New Category"
          value={newCategory}
          onChange={setNewCategory}
          onClose={() => setShowCategoryModal(false)}
          onConfirm={handleAddCategory}
          placeholder="Enter category name (e.g., Engine Parts)"
          confirmText="Add Category"
        />
      )}

      {showSubCategoryModal && (
        <Modal
          title="Add New Subcategory"
          value={newSubCategory}
          onChange={setNewSubCategory}
          onClose={() => setShowSubCategoryModal(false)}
          onConfirm={handleAddSubCategory}
          placeholder="Enter subcategory name (e.g., Oil Filter)"
          confirmText="Add Subcategory"
          info={`Category: ${selectedCategoryData?.name}`}
        />
      )}

      {showBrandModal && (
        <Modal
          title="Add New Brand"
          value={newBrand}
          onChange={setNewBrand}
          onClose={() => setShowBrandModal(false)}
          onConfirm={handleAddBrand}
          placeholder="Enter brand name (e.g., Bosch)"
          confirmText="Add Brand"
        />
      )}
    </div>
  );
};

const Modal = ({ title, value, onChange, onClose, onConfirm, placeholder, confirmText, info }) => (
  <div className="fixed inset-0 bg-base-content bg-opacity-50 flex items-center justify-center p-4 z-[9999]" onClick={onClose}>
    <div className="bg-base-100 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center border-b border-base-300 pb-3 mb-4">
        <h3 className="text-xl font-bold text-base-content">{title}</h3>
        <button onClick={onClose} className="text-base-content/50 hover:text-base-content transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      {info && (
        <p className="text-sm text-base-content/80 mb-3 p-2 bg-base-200 rounded-lg border border-base-300">
          {info}
        </p>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-info focus:border-info transition duration-150 ease-in-out bg-base-100 text-base-content mb-6"
      />
      
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-base-content bg-base-200 rounded-lg hover:bg-base-300 font-semibold transition duration-150"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 bg-primary text-info-content rounded-lg hover:bg-primary/90 font-semibold transition duration-150 focus:ring-4 focus:ring-info/50"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);


export default AddSpareParts;