import { useMemo } from "react";

interface AddressData {
    address?: string;
    neighborhood?: string;
    city?: string;
}

export function useFormattedAddress(addressData: AddressData) {
    return useMemo(() => {
        const { address, neighborhood, city } = addressData;
        
        const addressParts = [address, neighborhood, city],
            filteredParts = addressParts.filter(Boolean);
        
        return filteredParts.join(', ');
    }, [addressData.address, addressData.neighborhood, addressData.city]);
}