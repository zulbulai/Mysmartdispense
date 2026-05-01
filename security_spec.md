# Security Specification - DealVault

## Data Invariants
1. A Product must have a name, original price, and final price.
2. Final price must be less than or equal to original price.
3. Discount percentage should be correctly calculated: ((original - final) / original) * 100.
4. Only admins can create, update, or delete products.
5. All users (authenticated or not) can read products.

## The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Attempt to create a product as a non-admin.
2. **Price Manipulation**: Set final price higher than original price.
3. **Ghost Fields**: Add an `isVerified: true` field to a product.
4. **ID Poisoning**: Use a 1.5KB string as a product ID.
5. **Unauthorized Delete**: Delete a product as a non-admin.
6. **Bypassing Category**: Create a product without a required category.
7. **Negative Price**: Set price to -100.
8. **Resource Exhaustion**: Send a 1MB string in the name field.
9. **Timestamp Spoofing**: Provide a client-side `createdAt` timestamp from the future.
10. **Admin Privilege Escalation**: Attempt to write to a hypothetical `admins` collection.
11. **Orphaned Writes**: Create a product with invalid/malicious purchase links.
12. **Batch Attack**: Attempt to delete multiple products in one batch as a non-admin.

## The Test Runner (firestore.rules.test.ts)
(To be implemented if needed for complex logic, but for now we focus on the rules)
