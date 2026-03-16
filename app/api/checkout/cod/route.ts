import { NextResponse } from "next/server";
import { adminClient } from "@/lib/sanityAdmin";
import { CartItem } from "@/types/order";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { items, customerDetails, userId, discount, fees } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate subtotal from cart items
    const subtotal = items.reduce((acc: number, item: CartItem) => {
      const price = item.sale_price || item.price;
      return acc + (price * item.quantity);
    }, 0);

    // Apply discount
    let totalDiscount = 0;
    if (discount) {
       if (discount.type === 'percentage') {
         totalDiscount = subtotal * (discount.value / 100);
       } else if (discount.type === 'fixed') {
         totalDiscount = discount.value;
       }
    }

    const shipping = fees?.shipping || 0;
    const cod = fees?.cod || 0;

    // Calculate final total price
    const totalPrice = Math.max(0, subtotal - totalDiscount) + shipping + cod;

    // Create the order in Sanity
    const orderDoc = {
      _type: 'order',
      name: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
      status: 'pending',
      totalPrice: totalPrice,
      paymentMethod: 'cod',
      fees: {
        shipping: shipping,
        cod: cod,
        discount: totalDiscount
      },
      cartDetails: items.map((item: CartItem) => ({
        _key: uuidv4(),
        id: item.productId || item.id,
        name: item.name,
        price: item.sale_price || item.price,
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        image: item.image
      })),
      createdAt: new Date().toISOString()
    };

    // If a logged in user placed the order, link it to their profile
    if (userId && userId !== "guest") {
      (orderDoc as any).user = {
        _type: 'reference',
        _ref: userId
      };
    }

    const result = await adminClient.create(orderDoc);

    return NextResponse.json({ 
       success: true, 
       orderId: result._id 
    });

  } catch (error: any) {
    console.error("COD Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
