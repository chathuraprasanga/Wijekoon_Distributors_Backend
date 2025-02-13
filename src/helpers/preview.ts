export const rolePreview = (role: string) => {
    return role
        .split("_") // Split the string by underscores
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" "); // Join the words with spaces
};

export const amountPreview = (amount: number): string => {
    if (isNaN(amount)) {
        return "Rs. 0.00";
    }
    return `Rs. ${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};