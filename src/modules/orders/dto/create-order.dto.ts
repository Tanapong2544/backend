export class CreateOrderDto {
  buyerId: string;
  buyerName: string;
  sellerId: string;
  
  recipientName: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
}
