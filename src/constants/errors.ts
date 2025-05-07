const ERROR_MESSAGES = {
    USER_IS_ALREADY_EXIST:
        "User already exists. Please check the phone number or email.",
    INVALID_EMAIL_FORMAT: "The email format is invalid.",
    MISSING_REQUIRED_FIELDS: "Required fields are missing.",
    USER_NOT_FOUND: "User not found.",
    UNAUTHORIZED_ACCESS: "Unauthorized access.",
    INTERNAL_SERVER_ERROR:
        "An internal server error occurred. Please try again later.",
    CUSTOMER_ALREADY_EXIST:
        "Customer already exists. Please check the phone number.",
    PRODUCT_ALREADY_EXIST:
        "Product already exists. Please check the product code.",
    SUPPLIER_ALREADY_EXIST:
        "Supplier already exists. Please check the phone number.",
    CHEQUE_ALREADY_EXIST:
        "Cheque already exists by this customer. Please check the cheque number.",
    INVOICE_ALREADY_EXIST:
        "Invoice already exists by this invoice number. Please check the invoice number.",
    SALES_RECORD_ALREADY_EXIST:
        "Sales record already exists by this invoice number. Please check the invoice number.",
    INVALID_CUSTOMER: "Invalid customer. Please check again.",
    INVALID_WAREHOUSE: "Invalid warehouse. Please check again.",
    INVALID_PRODUCT: "Invalid product. Please check again.",
    INVALID_SUPPLIER: "Invalid supplier. Please check again.",
    INVALID_BANK_ACCOUNT: "Invalid bank account. Please check again.",
    EMAIL_IS_ALREADY_AVAILABLE:
        "Email is already available. Please check email again.",
    INVALID_INVOICE: "Invalid Invoice. Please check again",
    INVALID_CHEQUE_PAYMENT: "Invalid Cheque payment. Please check again",
    INVALID_CHEQUE: "Invalid Cheque, Please check again",
    USER_DEACTIVATED: "User is deactivated. Please contact the authorities",
    SALES_RECORD_NOT_FOUND: "Sales record is not found",
    ORDER_NOT_FOUND: "Order is not found",
    CUSTOMER_CANNOT_BE_DELETED_BCZ_PO:
        "Customer cannot be deleted, because of uncompleted purchase orders",
    CUSTOMER_CANNOT_BE_DELETED_BCZ_SR:
        "Customer cannot be deleted, because of uncompleted sales records",
    CUSTOMER_CANNOT_BE_DELETED_BCZ_CHQ:
        "Customer cannot be deleted, because of uncompleted cheques",
    CUSTOMER_CANNOT_BE_DELETED_BCZ_CREDIT:
        "Customer cannot be deleted, because of credit",
    VEHICLE_ALREADY_EXISTS: "Vehicle is already exists",
};

export default ERROR_MESSAGES;
