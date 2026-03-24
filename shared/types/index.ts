export type UserRole = "farmer" | "buyer";

export type User = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  phoneNumber?: string;
  address?: string;
  photoURL?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Listing = {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation?: string;
  productName: string;
  category: string;
  description: string;
  imageUrl?: string;
  priceInKobo: number;
  quantity: number;
  unit: string;
  status: "active" | "sold" | "inactive" | "pending" | "paid";
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  listingId: string;
  buyerId: string;
  farmerId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  deliveryAddress: string;
  quantity: number;
  amountInKobo: number;
  status: "pending" | "paid" | "accepted" | "fulfilled" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "failed";
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  orderId: string;
  buyerId: string;
  farmerId: string;
  amountInKobo: number;
  currency: "NGN";
  paymentReference: string;
  paymentStatus: "pending" | "paid" | "failed";
  blockchainHash?: string;
  polygonTxHash?: string;
  createdAt: string;
};

export type CreditScore = {
  userId: string;
  score: number;
  factors: Record<string, number>;
  updatedAt: string;
};

export type CartItem = {
  listingId: string;
  farmerId: string;
  productName: string;
  unit: string;
  quantity: number;
  availableQuantity: number;
  priceInKobo: number;
  imageUrl?: string;
};

export type Cart = {
  farmerId: string | null;
  items: CartItem[];
};
