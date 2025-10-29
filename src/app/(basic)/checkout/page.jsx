// pages/checkout.js or app/checkout/page.js

"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Package,
} from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import Loader from "../loading";
import { useSearchParams } from "next/navigation";

const CheckoutItemCard = ({ item }) => {
    const itemTotal = item.price * item.quantity;
    return (
        <div className="flex items-center space-x-4 p-4 border-b border-base-200">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-base-300">
                <Image
                    src={item.image || "/placeholder-image.svg"}
                    alt={item.partsName}
                    layout="fill"
                    objectFit="cover"
                    className="p-1"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-base-content line-clamp-1">{item.partsName}</h4>
                <p className="text-sm text-base-content/70">
                    Qty: {item.quantity} | Brand: {item.brand}
                </p>
            </div>
            <div className="text-right text-base font-semibold text-base-content whitespace-nowrap">
                <TbCurrencyTaka className="inline w-4 h-4 align-text-bottom mr-0.5" />
                {itemTotal.toLocaleString()}
            </div>
        </div>
    );
};

const InputField = ({ name, label, value, onChange, required, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-base-content/80 mb-1">
            {label} {required && <span className="text-error">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-3 border border-base-300 rounded-lg bg-base-100 text-base-content focus:ring-primary focus:border-primary transition-all duration-300 focus:outline-none"
        />
    </div>
);

const PaymentOption = ({ id, label, description, icon: Icon, selected, onSelect }) => (
    <div
        onClick={onSelect}
        className={`flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${selected
            ? 'bg-primary/10 border-2 border-primary shadow-lg'
            : 'bg-base-100 border border-base-300 hover:bg-base-200'
            }`}
    >
        <div className="flex-shrink-0">
            <input
                type="radio"
                id={id}
                name="paymentMethod"
                checked={selected}
                readOnly
                className="mt-1 w-5 h-5 accent-primary"
            />
        </div>
        <div className="flex-1">
            <label htmlFor={id} className="text-lg font-semibold text-base-content flex items-center space-x-2">
                <Icon className="w-5 h-5 text-primary" />
                <span>{label}</span>
            </label>
            <p className="text-sm text-base-content/70 mt-0.5">{description}</p>
        </div>
    </div>
);

const SummaryRow = ({ label, value, className = 'font-normal', isFree = false }) => (
    <div className={`flex justify-between items-center ${className}`}>
        <span className="text-base-content/90">{label}</span>
        {isFree ? (
            <span className="font-semibold text-success">FREE</span>
        ) : (
            <span className="font-semibold whitespace-nowrap">
                <TbCurrencyTaka className="inline w-4 h-4 align-text-bottom mr-0.5" />
                {value.toLocaleString()}
            </span>
        )}
    </div>
);

const decodeCheckoutData = (base64) => {
    if (typeof window === 'undefined') return [];
    try {
        const jsonString = atob(base64);
        const data = JSON.parse(jsonString);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Failed to decode checkout data:", e);
        return [];
    }
};

export default function CheckoutPage() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const itemsEncoded = searchParams.get('items');
    
    const singlePartId = searchParams.get('partId');
    const singleQuantity = parseInt(searchParams.get('qty')) || 1;

    const [loading, setLoading] = useState(true);
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        zip: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {

        if (!user) {
            setLoading(false);
            return;
        }

        const fetchPartDetails = async (partId, qty) => {
            try {
                const response = await axios.get(`/api/spareParts/${partId}`);
                const part = response.data;
                if (!part) throw new Error("Part not found.");
                
                return {
                    partId: part._id,
                    partsName: part.partsName,
                    price: part.price,
                    quantity: Math.min(qty, part.quantity),
                    image: Array.isArray(part.images) ? part.images[0] : part.images || "/placeholder-image.svg",
                    brand: part.brands,
                    category: part.category,
                };
            } catch (error) {
                console.error(`Failed to fetch part ${partId}:`, error);
                return null;
            }
        };

        const loadCheckoutData = async () => {
            setLoading(true);
            let itemRequests = [];
            let itemsToCheckout = [];

            if (itemsEncoded) {
                itemsToCheckout = decodeCheckoutData(itemsEncoded);
            } else if (singlePartId) {
                itemsToCheckout = [{ partId: singlePartId, qty: singleQuantity }];
            }

            if (itemsToCheckout.length > 0) {
                itemRequests = itemsToCheckout.map(item => fetchPartDetails(item.partId, item.qty));
            }
            
            const fetchedItems = (await Promise.all(itemRequests)).filter(item => item !== null);
            setCheckoutItems(fetchedItems);
            
            if (fetchedItems.length === 0 && (itemsEncoded || singlePartId)) {
                toast.error("No valid items to checkout were loaded. Check stock/IDs.");
            }

            setAddress(prev => ({
                ...prev,
                fullName: user.name || user.email,
                phone: user.phone || '',
            }));

            setLoading(false);
        };

        loadCheckoutData();

    }, [user, itemsEncoded, singlePartId, singleQuantity]);

    const { subtotal, shippingFee, total } = useMemo(() => {
        const itemSubtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const fee = itemSubtotal > 5000 ? 0 : 150;
        const grandTotal = itemSubtotal + fee;
        return {
            subtotal: itemSubtotal,
            shippingFee: fee,
            total: grandTotal,
        };
    }, [checkoutItems]);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (checkoutItems.length === 0) {
            toast.error("Cannot place order with an empty item list.");
            return;
        }

        if (!address.fullName || !address.phone || !address.street || !address.city || !address.zip) {
            toast.error("Please fill in all shipping address fields.");
            return;
        }

        try {
            setPlacingOrder(true);
            const orderData = {
                userEmail: user.email,
                items: checkoutItems.map(item => ({
                    partId: item.partId,
                    name: item.partsName,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                shippingAddress: address,
                paymentMethod: paymentMethod,
                subtotal,
                shippingFee,
                total,
            };

            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success(`Order placed successfully! Order Total: ৳${total.toLocaleString()}`);

        } catch (error) {
            const errorMessage = error.response?.data?.error || "An unexpected error occurred while placing the order.";
            toast.error(errorMessage);
        } finally {
            setPlacingOrder(false);
        }
    };


    if (loading || !user) {
        return <Loader />;
    }

    if (checkoutItems.length === 0 && !loading) {
         return (
             <div className="min-h-screen bg-base-100 flex items-center justify-center">
                 <div className="text-center max-w-md p-8 bg-base-200 rounded-xl shadow-lg border border-base-300">
                     <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-primary" />
                     <h1 className="text-2xl font-bold text-base-content mb-2">
                         No Items to Checkout
                     </h1>
                     <p className="text-base-content/80 mb-6">
                         Please select items from your cart or marketplace to proceed.
                     </p>
                     <Link
                         href="/market"
                         className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center space-x-2 font-semibold shadow-md"
                     >
                         <ArrowLeft />
                         <span>Back to Marketplace</span>
                     </Link>
                 </div>
             </div>
         );
    }


    return (
        <div className="min-h-screen bg-base-100 py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-base-content mb-8 border-b-2 border-base-200 pb-3 flex items-center space-x-3">
                    <Package className="w-8 h-8 text-primary" />
                    <span>Secure Checkout</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2 space-y-10">

                        <div className="p-6 bg-base-200 rounded-xl shadow-xl border border-base-300">
                            <h2 className="text-2xl font-bold text-base-content flex items-center space-x-3 mb-6 border-b border-base-300 pb-3">
                                <MapPin className="w-6 h-6 text-primary" />
                                <span>Shipping Address</span>
                            </h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField name="fullName" label="Full Name" value={address.fullName} onChange={handleAddressChange} required />
                                <InputField name="phone" label="Phone Number" value={address.phone} onChange={handleAddressChange} required type="tel" />
                                <div className="md:col-span-2">
                                    <InputField name="street" label="Street Address / House No." value={address.street} onChange={handleAddressChange} required />
                                </div>
                                <InputField name="city" label="City / District" value={address.city} onChange={handleAddressChange} required />
                                <InputField name="zip" label="ZIP / Postal Code" value={address.zip} onChange={handleAddressChange} required />
                            </form>
                        </div>

                        <div className="p-6 bg-base-200 rounded-xl shadow-xl border border-base-300">
                            <h2 className="text-2xl font-bold text-base-content flex items-center space-x-3 mb-6 border-b border-base-300 pb-3">
                                <CreditCard className="w-6 h-6 text-primary" />
                                <span>Payment Method</span>
                            </h2>
                            <div className="space-y-4">
                                <PaymentOption
                                    id="cod"
                                    label="Cash on Delivery (COD)"
                                    description="Pay with cash upon delivery of your order."
                                    icon={Truck}
                                    selected={paymentMethod === 'cod'}
                                    onSelect={() => setPaymentMethod('cod')}
                                />
                                <PaymentOption
                                    id="online"
                                    label="Online Payment (Card/Mobile Banking)"
                                    description="Pay securely using cards, bKash, or Nagad (Gateway integration required)."
                                    icon={CreditCard}
                                    selected={paymentMethod === 'online'}
                                    onSelect={() => setPaymentMethod('online')}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-20 space-y-8">
                            
                            <div className="p-6 bg-base-200 rounded-xl shadow-xl border border-base-300">
                                <h2 className="text-xl font-bold text-base-content mb-4 border-b border-base-300 pb-3">
                                    Order ({checkoutItems.length} {checkoutItems.length === 1 ? 'Item' : 'Items'})
                                </h2>
                                <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                                    {checkoutItems.map(item => (
                                        <CheckoutItemCard key={item.partId} item={item} />
                                    ))}
                                </div>
                                {(itemsEncoded || singlePartId) && (
                                    <Link
                                        href={itemsEncoded ? "/cart" : `/market/${singlePartId}`}
                                        className="block mt-4 text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        {itemsEncoded ? "Review / Edit Cart Selection" : "Change Quantity"}
                                    </Link>
                                )}
                            </div>

                            <div className="p-6 bg-primary/10 rounded-xl shadow-xl border-2 border-primary">
                                <h2 className="text-xl font-bold text-base-content mb-4 border-b border-base-300 pb-3">
                                    Price Details
                                </h2>
                                <div className="space-y-3 text-base">
                                    <SummaryRow label="Subtotal" value={subtotal} />
                                    <SummaryRow label="Shipping Fee" value={shippingFee} isFree={shippingFee === 0} />
                                    <div className="h-0.5 bg-base-300 my-3"></div>
                                    <SummaryRow label="Order Total" value={total} className="text-xl font-extrabold text-primary" />
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placingOrder}
                                    className="w-full mt-6 bg-primary text-white py-4 rounded-full font-extrabold uppercase tracking-wider transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                                >
                                    {placingOrder ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Place Order (৳{total.toLocaleString()})</span>
                                        </>
                                    )}
                                </button>

                                {paymentMethod === 'cod' && (
                                    <div className="mt-4 p-3 text-sm bg-info/10 border border-info text-base-content/90 rounded-lg flex items-center space-x-2">
                                        <AlertTriangle className="w-5 h-5 text-info flex-shrink-0" />
                                        <span>Payment will be collected upon delivery.</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}