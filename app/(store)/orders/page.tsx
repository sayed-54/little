import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronLeft, Calendar, CreditCard, Banknote } from "lucide-react";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import AccountSidebar from "@/components/auth/AccountSidebar";

export const revalidate = 0; // Don't cache user-specific order history

async function getUserOrders(userId: string) {
  const query = `
    *[_type == "order" && user._ref == $userId] | order(createdAt desc) {
      _id,
      orderId,
      status,
      totalPrice,
      paymentMethod,
      createdAt,
      cartDetails[] {
        id,
        name,
        price,
        quantity,
        size,
        color,
        image
      },
      fees
    }
  `;
  try {
    return await client.fetch(query, { userId });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="min-h-screen bg-background py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="md:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="mb-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Package size={24} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">Order History</h1>
                <p className="text-muted-foreground mt-1">View and track your previous purchases</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
                <Package size={48} className="mx-auto text-muted-foreground/30 mb-6" />
                <h2 className="text-xl font-semibold mb-2 text-foreground">No orders found</h2>
                <p className="text-muted-foreground mb-8">You haven&apos;t placed any orders yet.</p>
                <Link href="/Products" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground h-12 px-8 font-medium hover:bg-primary/90 transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-muted/40 px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Placed</p>
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary"/>
                          {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy") : "Unknown Date"}
                        </p>
                      </div>
                      <div className="space-y-1 sm:text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</p>
                        <p className="text-sm font-semibold">EGP {order.totalPrice?.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1 sm:text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order #</p>
                        <p className="text-sm font-mono text-muted-foreground">{order.orderId || order._id.slice(-8)}</p>
                      </div>
                    </div>

                    {/* Order Status & Payment Info */}
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'processing' || order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          {order.paymentMethod === 'stripe' ? (
                            <><CreditCard size={14} className="text-blue-500" /> Paid via Stripe</>
                          ) : (
                            <><Banknote size={14} className="text-green-500" /> Cash on Delivery</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-6 divide-y divide-border">
                      {order.cartDetails?.map((item: any, i: number) => (
                        <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                          <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground"><Package size={24} /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${item.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                              {item.name}
                            </Link>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-medium">
                              {item.size && <span className="bg-muted px-2 py-0.5 rounded">Size: {item.size}</span>}
                              {item.color && <span className="bg-muted px-2 py-0.5 rounded">Color: {item.color}</span>}
                            </div>
                            <div className="mt-2 text-sm font-semibold flex justify-between items-center">
                              <span>Qty: {item.quantity}</span>
                              <span className="text-primary">EGP {((item.price || 0) * item.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Fees Breakdown */}
                      {order.fees && (
                        <div className="pt-4 mt-2 flex flex-col items-end text-sm text-muted-foreground space-y-1">
                          {order.fees.shipping > 0 && <p className="flex w-48 justify-between"><span>Shipping:</span> <span className="font-medium text-foreground">EGP {order.fees.shipping}</span></p>}
                          {order.fees.cod > 0 && <p className="flex w-48 justify-between"><span>COD Fee:</span> <span className="font-medium text-foreground">EGP {order.fees.cod}</span></p>}
                          {order.fees.discount > 0 && <p className="flex w-48 justify-between text-green-600"><span>Discount:</span> <span>- EGP {order.fees.discount}</span></p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

