import React, { ElementType } from "react";

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type PendingCustomer = {
    email: string
    first_name?: string
    last_name?: string
    phone?: string
}

export type Locale = {
    code: string
    name: string
}