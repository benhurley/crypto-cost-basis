import { createContext, Dispatch, SetStateAction } from 'react';

export type TAlphaVantageContext = {
    data: number | undefined;
    error: unknown;
    isFetching: boolean;
    isThrottled: boolean;
};

export const AlphaVantageContext = createContext<TAlphaVantageContext>({
    data: undefined,
    error: null,
    isFetching: false,
    isThrottled: false,
});

export type TPurchaseDataContext = {
    coin: string,
    firstAvailableDate: Date | null,
    purchaseDate: string | null,
    setAmount: Dispatch<SetStateAction<number | null>>,
    setCoin: Dispatch<SetStateAction<string>>,
    setLocalizedPurchaseDate: Dispatch<SetStateAction<string | null>>,
    setPurchaseDate: Dispatch<SetStateAction<string | null>>,
};

export const PurchaseDataContext = createContext<TPurchaseDataContext>({
    coin: "",
    firstAvailableDate: null,
    purchaseDate: null,
    setAmount: () => null,
    setCoin: () => null,
    setLocalizedPurchaseDate: () => null,
    setPurchaseDate: () => null,
});
