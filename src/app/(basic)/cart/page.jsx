"use client";
import useUser from "@/hooks/useUser";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FaShoppingCart, FaArrowRight, FaTimes, FaBox, FaTag, FaTicketAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loader from "../loading";
import { io } from "socket.io-client";
import { TbCurrencyTaka } from "react-icons/tb";
import { useRouter } from "next/navigation";

const SOCKET_URL = 'https://socket-server-0r34.onrender.com/';
let socket;

const QuantitySelector = ({ quantity, onUpdate, max = 10 }) => (
  <div className="flex items-stretch border border-neutral rounded-xl overflow-hidden shadow-sm">
    <button
      className="px-2 py-1.5 text-lg font-bold min-w-10 text-center text-base-content/70 hover:bg-base-300 transition-colors"
      onClick={() => onUpdate(quantity - 1)}
      disabled={quantity <= 1}
      aria-label="Decrease quantity"
    >
      -
    </button>
    <span className="flex-grow px-2 py-1.5 text-lg font-bold min-w-10 text-center bg-base-100 border-x border-base-300">
      {quantity}
    </span>
    <button
      className="px-2 py-1.5 text-lg font-bold min-w-10 text-center text-base-content/70 hover:bg-base-300 transition-colors"
      onClick={() => onUpdate(quantity + 1)}
      disabled={quantity >= max}
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

export default function CartPage() {
  const { user } = useUser();
  const userEmail = user?.email;
  const router = useRouter();

  const [cartItems, setCartItems] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const [isCartLoading, setIsCartLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const isLoading = isCartLoading || cartItems === null;

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    }
  }, []);

  // Removed useEffect for default selection: selectedItems remains [] initially.

  const handleApplyCoupon = async () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }
    if (subtotal <= 0) {
      toast.error("Add items to your cart before applying a coupon.");
      return;
    }

    setIsApplyingCoupon(true);
    setActiveCoupon(null);

    try {
      const response = await fetch('/api/coupons');
      if (!response.ok) throw new Error("Failed to fetch coupons.");
      const coupons = await response.json();

      const coupon = coupons.find(c => c.code === code);

      if (!coupon) {
        toast.error(`Coupon code "${code}" is invalid.`);
        return;
      }

      const now = new Date();
      const expiry = new Date(coupon.expiryDate);

      if (coupon.status !== "active") {
        toast.error(`Coupon code "${code}" is not active.`);
        return;
      }

      if (expiry < now) {
        toast.error(`Coupon code "${code}" has expired.`);
        return;
      }

      setActiveCoupon(coupon);
      toast.success(`Coupon **${code}** applied! You received ${coupon.discount}% off the subtotal.`);

    } catch (error) {
      console.error("Coupon error:", error);
      toast.error("An error occurred while applying the coupon.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed.");
  };

  const handleRemoveItem = useCallback(
    async (itemId) => {
      if (!userEmail) return;

      const originalItems = cartItems;
      const newItems = originalItems.filter((item) => item._id !== itemId);
      setCartItems(newItems);
      setSelectedItems(prev => prev.filter(id => id !== itemId));
      toast.loading("Removing item...", { id: "removeItemToast" });

      try {
        const res = await fetch(`/api/cart?_id=${itemId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to remove item from server.");
        }

        if (socket && socket.connected) {
          socket.emit('cartUpdate', { userEmail: userEmail, action: 'remove' });
        }

        toast.success("Item removed from cart!", { id: "removeItemToast" });
      } catch (error) {
        console.error("Error removing item:", error);
        setCartItems(originalItems);
        toast.error("Failed to remove item. Please try again.", {
          id: "removeItemToast",
        });
      }
    },
    [cartItems, userEmail]
  );

  const handleUpdateQuantity = useCallback(
    async (itemId, newQuantity) => {
      if (!userEmail) return;

      const item = cartItems.find((i) => i._id === itemId);
      if (!item || newQuantity < 1) return;

      const originalItems = cartItems;
      const newItems = cartItems.map((i) =>
        i._id === itemId ? { ...i, quantity: newQuantity } : i
      );
      setCartItems(newItems);

      try {
        const res = await fetch(`/api/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: itemId,
            quantity: newQuantity,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update quantity on server.");
        }

        if (socket && socket.connected) {
          socket.emit('cartUpdate', { userEmail: userEmail, action: 'update' });
        }

      } catch (error) {
        console.error("Error updating quantity:", error);
        setCartItems(originalItems);
        toast.error("Failed to update quantity.", { id: "updateQuantityToast" });
      }
    },
    [cartItems, userEmail]
  );

  const handleToggleSelectItem = useCallback((itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleToggleAllItems = useCallback(() => {
    const allIds = cartItems.map(item => item._id);
    if (selectedItems.length === allIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allIds);
    }
  }, [cartItems, selectedItems.length]);


  useEffect(() => {
    if (!userEmail) {
      setCartItems([]);
      return;
    }

    const fetchCartData = async () => {
      setIsCartLoading(true);

      try {
        const res = await fetch(`/api/cart?userEmail=${userEmail}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching cart:", data.error);
          setCartItems([]);
          return;
        }

        setCartItems(data);
      } catch (error) {
        console.error("Error:", error);
        setCartItems([]);
      } finally {
        setIsCartLoading(false);
      }
    };

    fetchCartData();
  }, [userEmail]);

  const selectedCartItems = useMemo(() => {
    return cartItems?.filter(item => selectedItems.includes(item._id)) || [];
  }, [cartItems, selectedItems]);

  const subtotal = useMemo(() => {
    return selectedCartItems.reduce((t, i) => t + i.price * i.quantity, 0) || 0;
  }, [selectedCartItems]);

  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    return subtotal * (activeCoupon.discount / 100);
  }, [subtotal, activeCoupon]);

  const discountedSubtotal = subtotal - discountAmount;

  const shipping = discountedSubtotal > 100 ? 0 : 0; // Use a reasonable Taka value
  const tax = discountedSubtotal * 0.05;
  const cartTotal = discountedSubtotal + shipping + tax;

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to proceed to checkout.");
      return;
    }

    const checkoutData = selectedCartItems.map(item => ({
      partId: item.partId,
      qty: item.quantity,
    }));

    const jsonString = JSON.stringify(checkoutData);
    const base64Encoded = btoa(jsonString);

    router.push(`/checkout?items=${base64Encoded}`);

    toast.success(`${selectedItems.length} item(s) selected for checkout.`);
  };

  if (isLoading || !user) {
    return <Loader />;
  }

  if (Array.isArray(cartItems) && cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-8">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <FaShoppingCart className="text-primary text-4xl" />
        </div>
        <h1 className="text-3xl font-bold text-base-content mb-3 font-urbanist">
          Your Cart is Empty!
        </h1>
        <p className="text-base-content/70 mb-6 max-w-md text-center">
          Looks like you haven't added any spare parts yet. Explore our
          marketplace to find what you need.
        </p>
        <Link
          href="/market"
          className="bg-primary text-primary-content px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg"
        >
          <FaArrowRight />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-6 px-4 md:py-12 md:px-6 lg:px-8">
      <div className="lg:container px-0 md:px-6 mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-base-content mb-8 md:mb-10 text-center font-urbanist">
          <FaShoppingCart className="inline-block mr-3 text-primary align-text-top" />
          Your Shopping Cart ({cartItems.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl shadow-lg border border-base-300">
              <label className="flex items-center space-x-3 text-lg font-bold text-base-content cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary w-5 h-5"
                  checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                  onChange={handleToggleAllItems}
                />
                <span>Select All Items ({selectedItems.length} selected)</span>
              </label>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className={`flex flex-col md:flex-row items-start md:items-center p-4 md:p-5 rounded-xl shadow-lg border transition-all ${selectedItems.includes(item._id) ? 'bg-primary/10 border-primary shadow-2xl' : 'bg-base-200 border-base-300 hover:shadow-xl'}`}
              >

                <div className="flex items-start w-full md:w-auto">
                  <div className="flex-shrink-0 mr-4 mt-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary w-5 h-5"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleToggleSelectItem(item._id)}
                    />
                  </div>

                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-lg mr-4 bg-base-100">
                    <Image
                      src={item.image || "/placeholder-image.svg"}
                      alt={item.partsName}
                      layout="fill"
                      objectFit="contain"
                      className="p-1"
                      unoptimized
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg md:text-xl font-bold text-base-content mb-1 leading-snug font-urbanist">
                      {item.partsName}
                    </h3>
                    <div className="text-xs md:text-sm text-base-content/60 space-x-2 md:space-x-4">
                      <span className="inline-flex items-center gap-1">
                        <FaBox className="w-3 h-3 text-secondary" /> {item.brand}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaTag className="w-3 h-3 text-secondary" />{" "}
                        {item.category}
                      </span>
                    </div>
                    <p className="md:hidden text-xl font-extrabold text-primary mt-2 flex items-center">
                      <TbCurrencyTaka />{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="md:hidden text-base-content/40 hover:text-error transition-colors p-2 -mr-2 -mt-2 rounded-full"
                    aria-label={`Remove ${item.partsName}`}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>


                <div className="flex justify-between items-center w-full md:w-auto mt-4 pt-4 border-t border-base-300 md:border-t-0 md:mt-0 md:pt-0 md:ml-auto md:gap-4">
                  <div className="text-left md:text-center flex-shrink-0">
                    <p className="text-sm text-base-content/60 mb-1">Qty</p>
                    <QuantitySelector
                      quantity={item.quantity}
                      max={item.maxQuantity || 10}
                      onUpdate={(newQuantity) =>
                        handleUpdateQuantity(item._id, newQuantity)
                      }
                    />
                  </div>

                  <div className="w-24 text-right hidden md:block">
                    <p className="text-sm text-base-content/60 mb-1">
                      Total
                    </p>
                    <p className="text-2xl flex items-center justify-center font-extrabold text-primary">
                      <TbCurrencyTaka size={26} />{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="hidden md:block text-base-content/40 hover:text-error transition-colors p-2 rounded-full flex-shrink-0"
                    aria-label={`Remove ${item.partsName}`}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 bg-base-200 p-6 rounded-xl shadow-2xl border border-base-300">
              <h2 className="text-2xl font-bold text-base-content mb-5 border-b border-base-300 pb-3 font-urbanist">
                Order Summary
              </h2>

              <div className="mb-6 p-4 bg-base-100 rounded-xl border border-base-300">
                <h3 className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
                  <FaTicketAlt className="text-primary" /> Apply Coupon
                </h3>

                {activeCoupon ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between bg-success/10 p-3 rounded-xl border border-success/30">
                    <p className="text-success font-bold text-sm flex items-center gap-2 mb-2 md:mb-0">
                      <FaCheckCircle className="w-4 h-4" />
                      **{activeCoupon.code}** applied!
                    </p>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-error hover:text-error/80 transition-colors text-sm p-1 rounded-full text-left md:text-right"
                    >
                      <FaTimesCircle className="inline-block mr-1 w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code (e.g., SAVE15)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow p-3 border border-base-300 rounded-l-xl focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 bg-base-200 text-base-content text-sm"
                      disabled={isApplyingCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="bg-primary text-primary-content px-4 md:px-5 py-3 rounded-r-xl font-semibold hover:bg-primary/90 transition-colors duration-150 disabled:opacity-50 text-sm"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>


              <div className="space-y-3 mb-6 text-base-content/60">
                <div className="flex justify-between pb-3 border-b border-base-300 ">
                  <span>Subtotal ({selectedItems.length} selected items)</span>
                  <span className="flex items-center justify-center font-semibold text-base-content">
                    <TbCurrencyTaka size={20} />{subtotal.toLocaleString()}
                  </span>
                </div>

                {activeCoupon && (
                  <div className="flex justify-between text-success font-semibold pt-3">
                    <span className="flex items-center gap-1">
                      <FaTicketAlt className="w-4 h-4" /> Discount ({activeCoupon.discount}%)
                    </span>
                    <span className="flex items-center justify-center">
                      -<TbCurrencyTaka size={20} />{discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>New Subtotal</span>
                  <span className="font-semibold flex items-center justify-center text-base-content">
                    <TbCurrencyTaka size={20} /> {discountedSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span
                    className={`font-semibold ${shipping === 0 ? "text-success" : "text-base-content"
                      }`}
                  >
                    {shipping === 0 ? "FREE" : <span className="flex items-center justify-center"><TbCurrencyTaka size={20} />{shipping.toLocaleString()}</span>}
                  </span>
                </div>

                <div className="flex justify-between border-b border-base-300 pb-3">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold flex items-center justify-center text-base-content">
                    <TbCurrencyTaka size={20} /> {tax.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-2xl md:text-3xl font-extrabold mb-6">
                <span>Order Total:</span>
                <span className="flex items-center justify-center text-primary"><TbCurrencyTaka size={42} />{cartTotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0}
                className="w-full py-4 bg-primary text-primary-content font-extrabold text-lg md:text-xl rounded-full hover:bg-primary/90 transition duration-300 shadow-xl flex items-center justify-center gap-3 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
                <FaArrowRight className="w-5 h-5" />
              </button>

              <p className="text-sm text-center text-base-content/60 mt-4">
                Taxes and shipping calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}