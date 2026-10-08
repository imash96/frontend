"use client"

import {
    usePayPalCardFields,
    PayPalCardFieldsProvider,
    PayPalNameField,
    PayPalNumberField,
    PayPalExpiryField,
    PayPalCVVField,
    PayPalButtons,
} from "@paypal/react-paypal-js";
import type { StoreCart } from "@medusajs/types";
import { useState } from "react";
import { onApprove, createOrder, onError } from "./common";

export default function PayPalCard({ cart }: { cart: StoreCart }) {
    const [isPaying, setIsPaying] = useState(false);
    return (
        <PayPalCardFieldsProvider
            createOrder={() => createOrder(cart.id, true)}
            onApprove={(data) => onApprove(cart.id, data)}
            onError={(err) => {
                onError(err);
            }}

            style={{
                input: {
                    "font-size": "16px",
                    "font-family": "courier, monospace",
                    "font-weight": "lighter",
                    color: "#ccc",
                },
                ".invalid": { color: "purple" },
            }}
        >
            <PayPalButtons
                createOrder={() => createOrder(cart.id)}
                onApprove={async (data) => onApprove(cart.id, data)}
                onError={onError}
                style={{
                    shape: "rect",
                    layout: "vertical",
                    color: "gold",
                    label: "paypal",
                }}
            />
            <PayPalNameField
                style={{
                    input: { color: "blue" },
                    ".invalid": { color: "purple" },
                }}
            />
            <PayPalNumberField />
            <PayPalExpiryField />
            <PayPalCVVField />

            {/* Custom client component to handle card fields submission */}
            <SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
        </PayPalCardFieldsProvider>
    )
}

const SubmitPayment = ({ isPaying, setIsPaying }: {
    isPaying: boolean;
    setIsPaying: (v: boolean) => void;
}) => {
    const { cardFieldsForm } = usePayPalCardFields();

    const handleClick = async () => {
        if (!cardFieldsForm) {
            throw new Error(
                "Unable to find any child components in the <PayPalCardFieldsProvider />"
            );
        }
        const formState = await cardFieldsForm.getState();

        if (!formState.isFormValid) {
            return alert("The payment form is invalid");
        }
        setIsPaying(true);

        cardFieldsForm.submit().catch(() => {
            setIsPaying(false);
        });
    };

    return (
        <button
            className={isPaying ? "btn" : "btn btn-primary"}
            style={{ float: "right" }}
            onClick={handleClick}
        >
            {isPaying ? <div className="spinner tiny" /> : "Pay"}
        </button>
    );
};