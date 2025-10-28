"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import {
  Plus, Search, Edit, Trash, Tag, Percent, Package, MessageSquare, X, Check, Eye,
  Box,
  Calendar,
  Clock,
  Zap,
  Upload
} from "lucide-react";
import Swal from 'sweetalert2';
import { TbCurrencyTaka } from "react-icons/tb";

const StatCard = ({ icon: Icon, value, label, color = "primary" }) => {
  const colorClasses = {
    primary: { bg: "bg-primary/20", bgHover: "group-hover:bg-primary/30", text: "text-primary" },
    success: { bg: "bg-success/20", bgHover: "group-hover:bg-success/30", text: "text-success" },
    error: { bg: "bg-error/20", bgHover: "group-hover:bg-error/30", text: "text-error" },
    warning: { bg: "bg-warning/20", bgHover: "group-hover:bg-warning/30", text: "text-warning" },
  };
  const mappedColor = { orange: 'primary', green: 'success', red: 'error', yellow: 'warning'}[color] || 'primary';
  const classes = colorClasses[mappedColor];

  return (
    <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
          <Icon className={classes.text} size={20} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
      <p className="text-base-content/70 text-xs sm:text-sm font-medium">{label}</p>
    </div>
  );
};

const getStockBadge = (quantity) => {
  const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap border";
  if (quantity > 10) return <span className={`${base} bg-success/10 text-success border-success/30`}>In Stock</span>;
  if (quantity > 0) return <span className={`${base} bg-warning/10 text-warning border-warning/30`}>Low Stock</span>;
  return <span className={`${base} bg-error/10 text-error border-error/30`}>Out of Stock</span>;
};

const CustomModal = ({ title, value, onChange, onClose, onConfirm, placeholder, confirmText, info, type = 'text' }) => (
  <div className="fixed inset-0 bg-base-content/50 backdrop-blur-lg flex items-center justify-center p-4 z-50" onClick={onClose}>
    <div className="bg-base-100 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center border-b border-base-300 pb-3 mb-4">
        <h3 className="text-xl font-bold text-base-content">{title}</h3>
        <button onClick={onClose} className="p-2 bg-base-300/50 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200">
          <X size={20} />
        </button>
      </div>

      {info && (
        <p className="text-sm text-base-content/80 mb-3 p-2 bg-base-200 rounded-lg border border-base-300">
          {info}
        </p>
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content mb-6"
      />

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-content rounded-xl font-semibold border border-base-300 hover:bg-base-300 transition-all duration-300 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary shadow-lg text-sm"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

const ItemDetail = ({ label, value, icon: Icon, iconColorClass }) => (
  <div className="flex justify-between items-start text-sm">
    <div className="flex items-center gap-2 font-medium text-base-content/80">
      {Icon && <Icon size={16} className={iconColorClass} />}
      {label}
    </div>
    <span className="font-semibold text-right text-base-content/90 max-w-[50%] break-words">{value}</span>
  </div>
);


const ViewDetailsModal = ({ part, onClose, onEdit }) => {
  if (!part) return null;

  const getStatusBadge = (quantity) => {
    const base =
      "flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-full transition-all duration-300 shadow-sm";

    if (quantity > 10)
      return (
        <span className={`${base} bg-success/20 text-success`}>
          <Box size={16} /> In Stock
        </span>
      );
    if (quantity > 0)
      return (
        <span className={`${base} bg-primary/20 text-primary`}>
          <Box size={16} /> Low Stock
        </span>
      );
    return (
      <span className={`${base} bg-error/20 text-error`}>
        <Box size={16} /> Out of Stock
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-neutral/30 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-2xl font-semibold text-base-content">Part Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-base-content/60 bg-base-300 rounded-xl border border-neutral hover:bg-base-content/10 transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="w-full  bg-base-200 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
              {part.images ? (
                <img
                  src={part.images}
                  alt={part.partsName}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <Package size={150} className="text-base-content" />
              )}
            </div>

            <div className="p-5 rounded-xl shadow-md bg-info/20 border border-info text-info">
              <p className="text-sm font-bold uppercase tracking-wider mb-2">
                Unit Price
              </p>
              <div className="flex items-center gap-3">
                <TbCurrencyTaka size={28} className="text-info" />
                <span className="text-4xl font-black">
                  ${part.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-5 rounded-xl border border-primary shadow-sm bg-primary/20 text-primary flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-extrabold mb-1">
                  {part.partsName}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(part.quantity)}
                  <span className="text-sm font-semibold text-secondary/80 flex items-center gap-1">
                    <Tag size={16} /> {part.category}
                  </span>
                </div>
              </div>
              <div className="text-sm text-secondary/80 flex items-center gap-1">
                <Calendar size={16} /> Added:{" "}
                {new Date(part.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl p-5 shadow-sm space-y-4 bg-info/20 border border-info text-info">
                <p className="text-lg font-bold mb-3 flex items-center gap-2 text-info border-b border-info pb-2">
                  <Tag size={20} /> Product Classification
                </p>
                <div className="space-y-3">
                  <ItemDetail
                    label="Category"
                    value={part.category}
                    icon={Tag}
                    iconColorClass="text-info"
                  />
                  <ItemDetail
                    label="Subcategory"
                    value={part.subCategory || "N/A"}
                    icon={Tag}
                    iconColorClass="text-info"
                  />
                  <ItemDetail
                    label="Brand"
                    value={part.brands}
                    icon={Percent}
                    iconColorClass="text-info"
                  />
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-sm space-y-4 bg-success/20 border border-success text-success">
                <p className="text-lg font-bold mb-3 flex items-center gap-2 border-b border-success pb-2">
                  <Package size={20} /> Inventory & Management
                </p>
                <div className="space-y-3">
                  <ItemDetail
                    label="Stock Quantity"
                    value={`${part.quantity} items`}
                    icon={Box}
                    iconColorClass="text-success"
                  />
                  <ItemDetail
                    label="Last Updated"
                    value={new Date(part.updatedAt).toLocaleDateString()}
                    icon={Clock}
                    iconColorClass="text-success"
                  />
                  <ItemDetail
                    label="Management Status"
                    value={"Active"}
                    icon={Zap}
                    iconColorClass="text-success"
                  />
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-xl p-5 border border-neutral shadow-inner flex-1">
              <p className="text-lg font-bold mb-3 flex items-center gap-2 text-base-content border-b border-neutral pb-2">
                <MessageSquare size={20} /> Full Description
              </p>
              <p className="text-base text-base-content/60 whitespace-pre-wrap leading-relaxed pt-2">
                {part.description ||
                  "No detailed description provided for this part."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-neutral mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-base-200 text-base-content rounded-lg font-semibold border border-neutral hover:bg-base-300 transition-colors shadow-sm text-base"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(part)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold transition-colors hover:bg-[#ea580c] shadow-md text-base"
          >
            <Edit size={16} />
            Edit Part
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageInput = ({ watchImages, editingPart, setValue, imageLoading, setImageLoading }) => {
  const fileInputRef = useRef(null);
  const isEditing = !!editingPart;
  const currentImageUrl = watchImages || editingPart?.images;

  const handleFileChange = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    if (image.size > 5 * 1024 * 1024) { toast.error("Image size should be less than 5MB"); return; }
    if (!image.type.startsWith("image/")) { toast.error("Please upload a valid image file"); return; }

    try {
      setImageLoading(true);
      const imageUrl = await uploadImageToImgbb(image);
      if (imageUrl) { setValue("images", imageUrl); toast.success("Image uploaded successfully!"); }
    } catch (error) {
      toast.error("Failed to upload image");
      setValue("images", isEditing ? editingPart.images : "");
    } finally { setImageLoading(false); }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-base-content mb-2">Product Image {isEditing && !watchImages && <span className="text-base-content/60">(Current image retained)</span>}</label>

      <div className="w-full border-2 border-dashed border-base-300 rounded-xl bg-base-200 flex flex-col items-center justify-center cursor-pointer p-4 group" onClick={handleImageClick}>
        {imageLoading ? (
          <div className="flex flex-col items-center space-y-2 text-primary">
            <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span className="text-sm">Uploading image...</span>
          </div>
        ) : currentImageUrl ? (
          <div className="relative w-full h-full">
            <img src={currentImageUrl} alt="Product Preview" className="w-full h-full object-contain rounded-xl" />
            <div className="absolute inset-0 bg-base-content/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <Upload size={36} className="text-primary-content" />
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center text-base-content/60 space-y-2">
            <Upload size={36} />
            <p className="text-sm font-medium">Click to upload an image</p>
            <p className="text-xs">PNG, JPG, up to 5MB</p>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {watchImages && !imageLoading && (
        <p className={`text-xs mt-2 flex items-center font-medium ${watchImages === editingPart?.images ? 'text-base-content/70' : 'text-success'}`}>
          <Check size={14} className="mr-1" />
          {watchImages === editingPart?.images ? 'Current image selected' : 'New image ready!'}
        </p>
      )}
    </div>
  );
};


const ManageSpareParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [imageLoading, setImageLoading] = useState(false);
  const [viewingPart, setViewingPart] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const swalOptions = {
    confirmButtonColor: 'var(--color-success)',
    background: 'var(--color-base-100,)',
    color: 'var(--color-base-content)',
    cancelButtonColor: 'var(--color-error)',
  };

  const showSuccessAlert = (title, message) => {
    Swal.fire({ ...swalOptions, title, text: message, icon: 'success', iconColor: 'var(--color-success)' });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({ ...swalOptions, title, text: message, icon: 'error', iconColor: 'var(--color-error)' });
  };

  const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
    return Swal.fire({
      ...swalOptions, title, text, icon: 'warning', showCancelButton: true,
      confirmButtonText: confirmButtonText, cancelButtonText: 'Cancel', reverseButtons: true,
      iconColor: 'var(--color-warning)'
    });
  };

  const showLoadingAlert = (title, text) => {
    Swal.fire({
      ...swalOptions, title, text, allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  const fetchParts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/spareParts");
      setParts(response.data.spareParts || []);
    } catch (error) {
      showErrorAlert('Error', 'Failed to load spare parts');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchParts();
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    setSelectedSubCategory('');
    setValue("subCategory", '');
  }, [selectedCategory, setValue]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error("Please enter category name");
    try {
      const response = await axios.post("/api/partsCategory", { name: newCategory });
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
    if (!newSubCategory.trim() || !selectedCategory) return toast.error("Please enter subcategory name and select a category");
    try {
      const response = await axios.post("/api/partsCategory/subcategory", {
        categoryId: selectedCategory, subCategoryName: newSubCategory,
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
    if (!newBrand.trim()) return toast.error("Please enter brand name");
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

  const handleFormSubmit = async (data) => {
    const action = editingPart ? 'Updating' : 'Creating';
    showLoadingAlert(`${action}...`, `Please wait while we ${action.toLowerCase()} the spare part`);

    try {
      const selectedCategoryObj = categories.find(cat => cat._id === selectedCategory);
      const formData = {
        ...data,
        category: selectedCategoryObj?.name,
        subCategory: selectedSubCategory || null,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        images: data.images || editingPart?.images || "",
        updatedAt: new Date(),
      };

      let response;
      if (editingPart) {
        response = await axios.patch(`/api/spareParts/${editingPart._id}`, formData);
      } else {
        response = await axios.post('/api/spareParts', { ...formData, createdAt: new Date() });
      }

      Swal.close();
      if (response.data.success) {
        showSuccessAlert(`${action} Successful!`, `Spare part has been ${action.toLowerCase()} successfully.`);
        handleModalClose();
        fetchParts();
      }
    } catch (error) {
      Swal.close();
      showErrorAlert('Error', error.response?.data?.error || `Failed to ${action.toLowerCase()} spare part`);
    }
  };

  const handleDelete = async (partId, partName) => {
    const result = await showConfirmDialog(
      'Are you sure?',
      `You are about to delete the part: "${partName}". This action cannot be undone.`,
      'Yes, delete it!'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deleting...', 'Please wait while we delete the spare part');
        const response = await axios.delete(`/api/spareParts/${partId}`);

        Swal.close();
        if (response.status === 200) {
          showSuccessAlert('Deleted!', 'The spare part has been deleted successfully');
          fetchParts();
        } else {
          throw new Error('Deletion failed');
        }
      } catch (error) {
        Swal.close();
        showErrorAlert('Error', 'Failed to delete spare part');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPart(null);
    reset();
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedBrand('');
    setValue("images", "");
  };

  const openViewModal = (part) => {
    setViewingPart(part);
  };

  const closeViewModal = () => {
    setViewingPart(null);
  };

  const handleEditFromViewModal = (part) => {
    closeViewModal();
    openEditModal(part);
  };

  const openAddModal = () => {
    setEditingPart(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (part) => {
    setEditingPart(part);

    const categoryObj = categories.find(c => c.name === part.category);
    const categoryId = categoryObj?._id || '';

    setValue("partsName", part.partsName);
    setValue("description", part.description);
    setValue("price", part.price);
    setValue("quantity", part.quantity);
    setValue("images", part.images);
    setValue("category", categoryId);
    setValue("subCategory", part.subCategory || '');
    setValue("brands", part.brands);

    setSelectedCategory(categoryId);
    setSelectedSubCategory(part.subCategory || '');
    setSelectedBrand(part.brands);

    setIsModalOpen(true);
  };

  const filteredParts = parts.filter((part) =>
    part.partsName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.brands?.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const stats = {
    total: parts.length,
    inStock: parts.filter(p => p.quantity > 0).length,
    lowStock: parts.filter(p => p.quantity > 0 && p.quantity <= 10).length,
    outOfStock: parts.filter(p => p.quantity === 0).length,
  };

  const selectedCategoryData = categories.find(
    (cat) => cat._id === selectedCategory
  );

  const watchImages = watch("images");

  const SparePartsForm = ({ onSubmit, register, errors, watch, setValue, imageLoading, setImageLoading, editingPart, selectedCategoryData }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-base-content mb-2">Parts Name <span className="text-error">*</span></label>
          <input
            {...register("partsName", { required: "Parts name is required" })}
            type="text"
            className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
            placeholder="e.g., Oil Filter XYZ"
          />
          {errors.partsName && (<p className="text-error text-xs mt-1">{errors.partsName.message}</p>)}
        </div>

        <div>
          <label className="text-sm font-semibold text-base-content mb-2 flex items-center">Price (<TbCurrencyTaka size={20}/>) <span className="text-error">*</span></label>
          <input
            {...register("price", { required: "Price is required", valueAsNumber: true, min: { value: 0.01, message: "Price must be positive" } })}
            type="number" step="0.01"
            className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
            placeholder="e.g., 49.99"
          />
          {errors.price && (<p className="text-error text-xs mt-1">{errors.price.message}</p>)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* RIGHT COLUMN: Category, Subcategory, Brand, Quantity */}
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-base-content mb-2">Quantity <span className="text-error">*</span></label>
              <input
                {...register("quantity", { required: "Quantity is required", valueAsNumber: true, min: { value: 1, message: "Quantity must be at least 1" } })}
                type="number"
                className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                placeholder="Enter stock quantity"
              />
              {errors.quantity && (<p className="text-error text-xs mt-1">{errors.quantity.message}</p>)}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-base-content mb-2">Brand <span className="text-error">*</span></label>
              <div className="flex gap-2">
                <select
                  {...register("brands", { required: "Brand is required" })}
                  value={selectedBrand}
                  onChange={(e) => { setSelectedBrand(e.target.value); setValue("brands", e.target.value); }}
                  className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                >
                  <option value="" disabled>Select Brand</option>
                  {brands.map((brand) => (<option key={brand._id} value={brand.name}>{brand.name}</option>))}
                </select>
                <button type="button" onClick={() => setShowBrandModal(true)} className="flex-shrink-0 h-[46px] w-[46px] bg-primary text-primary-content rounded-xl hover:bg-primary/90 transition duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50" title="Add New Brand"><Plus size={20} /></button>
              </div>
              {errors.brands && (<p className="text-error text-xs mt-1">{errors.brands.message}</p>)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-base-content mb-2">Category <span className="text-error">*</span></label>
              <div className="flex gap-2">
                <select
                  {...register("category", { required: "Category is required" })}
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setValue("category", e.target.value); }}
                  className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((category) => (<option key={category._id} value={category._id}>{category.name}</option>))}
                </select>
                <button type="button" onClick={() => setShowCategoryModal(true)} className="flex-shrink-0 h-[46px] w-[46px] bg-primary text-primary-content rounded-xl hover:bg-primary/90 transition duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50" title="Add New Category"><Plus size={20} /></button>
              </div>
              {errors.category && (<p className="text-error text-xs mt-1">{errors.category.message}</p>)}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-semibold text-base-content mb-2">Subcategory</label>
              <div className="flex gap-2">
                <select
                  {...register("subCategory")}
                  value={selectedSubCategory}
                  onChange={(e) => { setSelectedSubCategory(e.target.value); setValue("subCategory", e.target.value); }}
                  disabled={!selectedCategory || selectedCategoryData?.subCategories?.length === 0}
                  className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content disabled:bg-base-300/50 disabled:text-base-content/60 disabled:cursor-not-allowed"
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategoryData?.subCategories?.map((subCat, index) => (<option key={index} value={subCat.name}>{subCat.name}</option>))}
                </select>
                <button type="button" onClick={() => setShowSubCategoryModal(true)} disabled={!selectedCategory} className="flex-shrink-0 h-[46px] w-[46px] bg-primary text-primary-content rounded-xl hover:bg-primary/90 transition duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-base-300 disabled:text-base-content/60 disabled:cursor-not-allowed" title="Add New Subcategory"><Plus size={20} /></button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ImageInput
            watchImages={watchImages}
            editingPart={editingPart}
            setValue={setValue}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
          />
          <input type="hidden" {...register("images")} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-base-content mb-2">Description <span className="text-error">*</span></label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={4}
          className="w-full p-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
          placeholder="Enter a detailed description of the spare part, its compatibility, and key features."
        />
        {errors.description && (<p className="text-error text-xs mt-1">{errors.description.message}</p>)}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleModalClose}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-content rounded-xl font-semibold border border-base-300 hover:bg-base-300 transition-all duration-300 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || imageLoading}
          className={`px-4 sm:px-6 py-2 sm:py-3 text-primary-content rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg text-sm ${loading || imageLoading
            ? "bg-primary/70 cursor-not-allowed"
            : "bg-primary hover:bg-secondary hover:shadow-xl"
            }`}
        >
          {loading || imageLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {editingPart ? "Updating..." : "Adding..."}
            </div>
          ) : (
            editingPart ? "Update Part" : "Add Part"
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Spare Parts Management</h1>
          <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">View, add, and manage all available spare parts.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 lg:py-4 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-[1.02] shadow-lg hover:shadow-xl mt-4 lg:mt-0 text-sm sm:text-base"
        >
          <Plus size={20} />
          <span>Add New Part</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard icon={Tag} value={stats.total} label="Total Parts" color="orange" />
        <StatCard icon={Check} value={stats.inStock} label="In Stock" color="green" />
        <StatCard icon={Package} value={stats.lowStock} label="Low Stock" color="yellow" />
        <StatCard icon={X} value={stats.outOfStock} label="Out of Stock Products" color="red" />
      </div>

      <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-base-300 shadow-xl">

        <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={18} />
            <input
              type="text"
              placeholder="Search by name, category, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 w-full text-sm text-base-content focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="loading loading-bars loading-xl text-primary"></span>
          </div>
        ) : (
          <>
            <div className="block xl:hidden space-y-4">
              {filteredParts.length > 0 ? filteredParts.map(part => (
                <div key={part._id} className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
                  <div className="flex justify-between items-start mb-3 border-b border-base-300 pb-3">
                    <p className="font-semibold text-base-content truncate">{part.partsName}</p>
                    <span className="text-lg font-bold text-primary">${part.price}</span>
                  </div>
                  <div className="text-sm space-y-1 mb-3">
                    <p className="text-base-content/80 flex items-center gap-1"><Tag size={12} className="text-info" />Category: {part.category} ({part.subCategory})</p>
                    <p className="text-base-content/80 flex items-center gap-1"><Percent size={12} className="text-info" />Brand: {part.brands}</p>
                    <p className="text-base-content/80 flex items-center gap-1"><Package size={12} className="text-info" />Stock: {part.quantity}</p>
                    {getStockBadge(part.quantity)}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openViewModal(part)} className="p-2 bg-info/10 text-info rounded-lg border border-info/30 hover:bg-info/20 transition-colors" title="Edit"><Eye size={16} /></button>
                    <button onClick={() => openEditModal(part)} className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(part._id, part.partsName)} className="p-2 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors" title="Delete"><Trash size={16} /></button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-base-content/30" /><p className="text-base-content/70">No spare parts found</p></div>
              )}
            </div>

            <div className="hidden xl:block rounded-2xl border border-base-300 overflow-x-auto">
              <table className="min-w-full divide-y divide-base-300">
                <thead className="bg-base-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Part Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Category/Brand</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-base-content">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-base-100 divide-y divide-base-300">
                  {filteredParts.length > 0 ? (
                    filteredParts.map((part) => (
                      <tr key={part._id} className="hover:bg-base-200 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-base-300 rounded-xl flex items-center justify-center text-base-content/80 font-bold text-sm flex-shrink-0 overflow-hidden">
                              {part.images ? (
                                <img src={part.images} alt={part.partsName} className="w-full h-full object-cover" />
                              ) : (
                                <Package size={18} />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-base-content text-sm">{part.partsName}</p>
                              <button
                                onClick={() => openViewModal(part)}
                                className="text-primary hover:text-secondary text-xs font-medium flex items-center gap-1 transition-colors duration-200 mt-1 focus:outline-none"
                              >
                                <Eye size={12} /> View details
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-base-content">{part.category}</p>
                          <p className="text-xs text-base-content/70">Brand: {part.brands}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <TbCurrencyTaka size={24} className="text-success" />
                            <span className="text-sm sm:text-lg font-bold text-base-content">{part.price}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-base-content/90">{part.quantity} items</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStockBadge(part.quantity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openViewModal(part)}
                              className="p-2 bg-info/10 text-info rounded-xl border border-info/30 hover:bg-info/20 hover:scale-105 transition-all duration-200"
                              title="Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openEditModal(part)}
                              className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/30 hover:bg-primary/20 hover:scale-105 transition-all duration-200"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(part._id, part.partsName)}
                              className="p-2 bg-error/10 text-error rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
                              title="Delete"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <Tag className="text-base-content/30" size={48} />
                          <p className="text-base-content/70 text-lg">No spare parts match your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-5xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                {editingPart ? "Edit Spare Part" : "Add New Spare Part"}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 bg-base-300/50 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <SparePartsForm
              onSubmit={handleFormSubmit}
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              editingPart={editingPart}
              selectedCategoryData={selectedCategoryData}
            />

          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingPart && (
        <ViewDetailsModal
          part={viewingPart}
          onClose={closeViewModal}
          onEdit={handleEditFromViewModal}
        />
      )}

      {/* Category/Subcategory/Brand Modals */}
      {showCategoryModal && (
        <CustomModal
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
        <CustomModal
          title="Add New Subcategory"
          value={newSubCategory}
          onChange={setNewSubCategory}
          onClose={() => setShowSubCategoryModal(false)}
          onConfirm={handleAddSubCategory}
          placeholder="Enter subcategory name (e.g., Oil Filter)"
          confirmText="Add Subcategory"
          info={`Adding to Category: ${selectedCategoryData?.name}`}
        />
      )}
      {showBrandModal && (
        <CustomModal
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

export default ManageSpareParts;