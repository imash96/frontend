import { Gift, Lock, Minus, Plus, Shield, Trash2 } from "lucide-react";
import { li as Li } from "motion/react-client"
import Image from "next/image";
import Link from "next/link";
import { retrieveCart } from "@/lib/action/cart"
import { convertToLocale } from "@/lib/util/money";
import { QuantityButton, CompleteOrder, EmptyCart } from "../components/cart-buttons";
import CartDrawerClient from "../components/cart-drawer-client";

export default async function CartDrawer() {
    const cart = await retrieveCart();
    const sortedItems = cart?.items?.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());

    return (
        <CartDrawerClient>
            {cart && cart.items?.length ? (<>
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6">
                    <ul className="divide-y divide-divider">
                        {sortedItems?.map((item, index) => {
                            const adjustmentsSum = (item.adjustments || []).reduce(
                                (acc, adjustment) => adjustment.amount + acc,
                                0
                            );
                            const currentPrice = item.total! - adjustmentsSum;
                            return (
                                <Li
                                    key={item.id}
                                    className="flex gap-3 sm:gap-4 py-4 text-foreground"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 80, transition: { duration: 0.3 } }}
                                    transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    layout
                                >
                                    {/* Product Image */}
                                    <div className="relative w-16 h-20 overflow-hidden rounded-md border border-border shrink-0 bg-white group">
                                        <Image
                                            src={item.thumbnail || "/svg/placeholder.svg"}
                                            alt={item.title || "Product image"}
                                            sizes="(min-width: 640px) 6rem, 5rem"
                                            className="size-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                                            height={65}
                                            width={55}
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <Link href={`/products/${item.product_handle}`}>
                                            <h3 className="text-sm leading-tight line-clamp-2 text-pretty">{item.title}</h3>
                                        </Link>
                                        <div className="text-xs text-foreground-tertiary mt-1">
                                            {item.variant?.title && <span>Size: {item.variant?.title}</span>}<br />
                                            {item.variant_sku && <span>{item.variant_sku}</span>}<br />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-center w-20">
                                        <span className="text-sm font-semibold text-foreground tabular-nums">
                                            {convertToLocale({
                                                amount: currentPrice,
                                                currency_code: cart.currency_code,
                                            })}
                                        </span>
                                        {adjustmentsSum > 0 && (
                                            <span className="text-xs text-price-original line-through tabular-nums">
                                                {convertToLocale({
                                                    amount: item.total!,
                                                    currency_code: cart.currency_code,
                                                })}
                                            </span>
                                        )}
                                        <LineItemQuantity itemId={item.id} quantity={item.quantity} />
                                    </div>
                                </Li>
                            );
                        })}
                    </ul>
                </div>
                <CartFooter subtotal={cart.subtotal} currency_code={cart.currency_code} />
            </>) : <EmptyCart />}
        </CartDrawerClient>
    )

}
const LineItemQuantity = ({ itemId, quantity }: { itemId: string, quantity: number }) => (
    <div className="flex items-center gap-0 rounded-full overflow-hidden"
        style={{ border: '1px solid #e3d9cc', background: 'white' }}>
        <QuantityButton itemId={itemId} quantity={quantity - 1} ariaLabel={quantity === 1 ? 'Remove' : 'Decrease'}>
            {quantity === 1 ? <Trash2 size={11} style={{ color: '#7c4a21' }} /> : <Minus size={11} style={{ color: '#7c4a21' }} />}
        </QuantityButton>
        <span className="w-6 text-center text-xs font-semibold tabular-nums" style={{ color: '#3d2410' }}>
            {quantity}
        </span>
        <QuantityButton itemId={itemId} quantity={quantity + 1} ariaLabel="Increase">
            <Plus size={11} style={{ color: '#7c4a21' }} />
        </QuantityButton>
    </div>
)


const CartFooter = ({ subtotal, currency_code }: CartFooterProp) => (
    <div className="shrink-0 border-t border-divider bg-surface p-4 sm:p-5">
        {/* Subtotal */}
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs uppercase tracking-widest text-foreground-tertiary font-medium">
                Subtotal
            </span>
            <span className="text-xl font-bold text-foreground font-heading tabular-nums">
                {convertToLocale({
                    amount: subtotal,
                    currency_code: currency_code,
                })}
            </span>
        </div>
        <p className="text-[11px] text-foreground-tertiary mb-4">
            Shipping & taxes calculated at checkout
        </p>

        {/* CTA */}
        <CompleteOrder />

        {/* Trust badges */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-foreground-tertiary">
            <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> SSL Encrypted
            </span>
            <span className="w-px h-3 bg-divider" />
            <span className="flex items-center gap-1">
                <Gift className="w-3 h-3" /> Gift wrap
            </span>
            <span className="w-px h-3 bg-divider" />
            <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" /> Genuine Leather
            </span>
        </div>
    </div>
)

type CartFooterProp = {
    subtotal: number,
    currency_code: string,
}