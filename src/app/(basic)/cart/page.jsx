"use client";
import useUser from "@/hooks/useUser";
import { useEffect, useState, useCallback } from "react";
import { FaShoppingCart, FaArrowRight, FaTimes, FaBox, FaTag } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loader from "../loading";

const QuantitySelector = ({ quantity }) => (
  <div className="flex items-stretch border border-neutral rounded-xl overflow-hidden max-w-28 shadow-sm">
    <span className="flex-grow px-2 py-1.5 text-lg font-bold min-w-10 text-center bg-base-100 border-x border-base-300">
      {quantity}
    </span>
  </div>
);

export default function CartPage() {
  const { user } = useUser();
  const userEmail = user?.email;

  const [cartItems, setCartItems] = useState(null);

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const isLoading = isUserLoading || isCartLoading || cartItems === null;

  const handleRemoveItem = useCallback(
    (itemId) => {
      const newItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(newItems);
      toast.success("Item removed from cart!");
    },
    [cartItems]
  );

  const handleUpdateQuantity = useCallback(
    (itemId, newQuantity) => {
      const item = cartItems.find((i) => i._id === itemId);
      if (!item || newQuantity < 1) return;
      const newItems = cartItems.map((i) =>
        i._id === itemId ? { ...i, quantity: newQuantity } : i
      );
      setCartItems(newItems);
    },
    [cartItems]
  );

  useEffect(() => {
    if (user !== undefined) {
      setIsUserLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isUserLoading) return;

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
  }, [userEmail, isUserLoading]);

  const subtotal = cartItems?.reduce((t, i) => t + i.price * i.quantity, 0) || 0;
  const shipping = subtotal > 100 ? 0 : 15.0;
  const tax = subtotal * 0.05;
  const cartTotal = subtotal + shipping + tax;

  if (isLoading) {
    return <Loader />;
  }

  if (cartItems.length === 0 && !isCartLoading && userEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <FaShoppingCart className="text-primary text-4xl" />
        </div>
        <h1 className="text-3xl font-bold text-base-content mb-3 font-urbanist">
          Your Cart is Empty!
        </h1>
        <p className="text-gray-600 mb-6 max-w-md text-center">
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
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="lg:container px-6 mx-auto">
        <h1 className="text-4xl font-extrabold text-base-content mb-10 text-center font-urbanist">
          <FaShoppingCart className="inline-block mr-3 text-primary align-text-top" />
          Your Shopping Cart ({cartItems.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center bg-base-200 p-5 rounded-xl shadow-lg border border-neutral transition-all hover:shadow-xl"
              >
                <div className="flex-shrink-0 w-24 h-24 relative overflow-hidden rounded-lg mr-4 bg-base-100">
                  <Image
                    src={item.image || "/placeholder-image.svg"}
                    alt={item.partsName}
                    layout="fill"
                    objectFit="contain"
                    className="p-1"
                    unoptimized
                  />
                </div>

                <div className="flex-grow my-3 sm:my-0">
                  <h3 className="text-xl font-bold text-base-content mb-1 leading-snug font-urbanist">
                    {item.partsName}
                  </h3>
                  <div className="text-sm text-base-content/60 space-x-4">
                    <span className="inline-flex items-center gap-1">
                      <FaBox className="w-3 h-3 text-secondary" /> {item.brand}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FaTag className="w-3 h-3 text-secondary" />{" "}
                      {item.category}
                    </span>
                  </div>
                  {item.couponApplied && (
                    <p className="text-xs font-semibold text-success mt-1">
                      Coupon Applied: {item.couponApplied}
                      <span className="ml-1 text-xs text-success/80">
                        ({item.couponDiscount || 0}%)
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:ml-auto gap-4 mt-4 sm:mt-0">
                  <div className="text-center">
                    <p className="text-sm text-base-content/60 mb-1">Qty</p>
                    <QuantitySelector
                      quantity={item.quantity}
                      max={item.maxQuantity || 10}
                    />
                  </div>

                  <div className="w-24 text-center sm:text-right">
                    <p className="text-sm text-base-content/60 mb-1 hidden sm:block">
                      Total
                    </p>
                    <p className="text-2xl font-extrabold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-gray-400 hover:text-error transition-colors p-2 rounded-full"
                    aria-label={`Remove ${item.partsName}`}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 bg-base-200 p-6 rounded-xl shadow-2xl border border-neutral">
              <h2 className="text-2xl font-bold text-base-content mb-5 border-b border-neutral pb-3 font-urbanist">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-base-content/60">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-base-content">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span
                    className={`font-semibold ${
                      shipping === 0 ? "text-success" : "text-base-content"
                    }`}
                  >
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-base-300 pb-3">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-base-content">
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-3xl font-extrabold mb-6">
                <span>Order Total:</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() =>
                  toast.success("Proceeding to secure checkout...")
                }
                className="w-full py-4 bg-primary text-primary-content font-extrabold text-xl rounded-full hover:bg-primary/90 transition duration-300 shadow-xl flex items-center justify-center gap-3 uppercase tracking-wider"
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