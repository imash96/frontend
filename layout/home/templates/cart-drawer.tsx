import { retrieveCart } from "@/lib/action/cart"
import CartDrawerClient from "../components/cart-drawer-client-final";
import { convertToLocale } from "@/lib/util/money";
import { ArrowRight, Award, Gift, Lock, Minus, Plus, Shield, Trash2 } from "lucide-react";
import { QuntityButton } from "../components/cart-buttons-final";
import { li as Li } from "motion/react-client"
import Image from "next/image";
import Link from "next/link";
import Button from "@/ui/button";

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
                                        <Link href={`/product/${item.product_handle}`}>
                                            <h3 className="text-sm leading-tight line-clamp-2">{item.title}</h3>
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
        <QuntityButton itemId={itemId} quantity={quantity - 1} ariaLabel={quantity === 1 ? 'Remove' : 'Decrease'}>
            {quantity === 1 ? <Trash2 size={11} style={{ color: '#7c4a21' }} /> : <Minus size={11} style={{ color: '#7c4a21' }} />}
        </QuntityButton>
        <span className="w-6 text-center text-xs font-semibold tabular-nums" style={{ color: '#3d2410' }}>
            {quantity}
        </span>
        <QuntityButton itemId={itemId} quantity={quantity + 1} ariaLabel="Increase">
            <Plus size={11} style={{ color: '#7c4a21' }} />
        </QuntityButton>
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
        <Button
            href={'/cart'}
            className="w-full bg-button-primary text-button-primary-foreground py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-button-primary-hover transition-all duration-200 flex items-center justify-center gap-2 group shadow-primary active:scale-[0.98]"
        >
            <span>Complete Order</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>

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

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="space-y-6" >
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-accent/5 to-primary/5 rotate-6" />
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 to-accent/5 -rotate-3" />
                    <div className="relative w-full h-full rounded-3xl bg-surface-elevated flex items-center justify-center">
                        <Award className="w-12 h-12 text-accent/40" strokeWidth={1} />
                    </div>
                </div>
                <div>
                    <h3 className="font-serif text-2xl font-semibold text-foreground tracking-tight">
                        Begin Your Journey
                    </h3>
                    <p className="text-sm text-foreground-tertiary mt-2 max-w-60 mx-auto leading-relaxed">
                        Every great wardrobe starts with a single piece. Explore our genuine leather collection.
                    </p>
                </div>
                <button className="bg-button-primary text-button-primary-foreground px-10 py-3.5 rounded-2xl text-sm font-serif font-semibold tracking-wide hover:bg-button-primary-hover transition-all flex items-center gap-2 mx-auto group">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}