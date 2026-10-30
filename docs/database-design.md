# Production Database Recommendation

## Recommendation

Use **PostgreSQL** as the system of record. Ecommerce needs relational integrity between customers, variants, carts, orders, payments, and stock, plus transactions that prevent checkout from creating an order without reserving inventory. PostgreSQL is mature, widely supported, and scales from a managed single instance to read replicas and partitioning as the shop grows.

For a small team, a managed PostgreSQL service such as **Supabase** is a convenient start. Keep business operations behind a server-side API (for example, a Node.js service); do not let the browser write prices, payment state, or inventory directly. For a custom auth/API stack, use managed PostgreSQL from a cloud provider and an OIDC-compatible identity provider. Store product images in S3-compatible object storage and keep only their keys/URLs and metadata in PostgreSQL. Use Razorpay or another payment gateway for payment collection; never store PAN, CVV, or raw card data.

The image [database-erd.svg](database-erd.svg) is a standalone diagram and can be opened directly in a browser or editor.

## Tables

### Identity

- `users`: UUID primary key, normalized unique email, phone, display name, account status, timestamps. If using managed auth, map its immutable subject ID rather than duplicating password storage.
- `auth_identities`: user foreign key plus provider and provider subject, unique on `(provider, provider_user_id)` for social login.
- `user_addresses`: user foreign key, recipient, phone, structured address fields, postal code, country, default flag, and verification/timestamps. Snapshot the selected address onto the order at placement so edits do not rewrite history.

### Catalog and inventory

- `categories`: one-level jewelry category, unique slug, name, image URL/path, sort order, and active flag. Example categories include Earrings, Necklaces, Rings, Bracelets, Hair Jewels, and Anklets.
- `products`: category foreign key, unique slug, name, description, material, flexible product-level attributes (such as care instructions and occasions), publication status, and timestamps. Product records do not own SKU, price, or stock.
- `product_variants`: product foreign key, unique SKU, flexible option values (for example `{ "finish": "Rose Gold", "ringSize": "6" }`), selling price, compare-at price, on-hand stock, and active flag. Each purchasable option combination has its own row.
- `product_images`: product foreign key and image path. Actual image bytes stay in upload storage or object storage.
- `tags` and `product_tags`: normalized many-to-many product merchandising tags.
- Inventory is tracked on each `product_variants` row; a future inventory ledger can record adjustments and sales without changing the product/variant contract.

### Shopping

- `carts`: owner user foreign key (nullable for a guest cart), status, currency, expiry, timestamps.
- `cart_items`: cart and variant foreign keys, quantity, unique `(cart_id, variant_id)`. Price and availability are recalculated server-side during checkout.
- `wishlists` and `wishlist_items`: user-owned lists and product/optional variant links, unique per wishlist/product.

### Orders and fulfillment

- `orders`: user foreign key, unique public order number, status, currency, subtotal/discount/shipping/tax/total, address snapshot, and placed/updated timestamps.
- `order_items`: order foreign key, optional product/variant reference, quantity, and immutable product name/SKU/unit-price/tax snapshots. Preserve snapshots even if the catalog item changes or is deleted.
- `payments`: order foreign key, provider, unique provider reference, amount, currency, method, and payment state. Keep gateway tokens/references only; no card credentials.
- `payment_events`: verified provider webhook/event ID (unique for idempotency), payment foreign key, event type, received time, and minimal sanitized payload.
- `shipments`: order foreign key, carrier, tracking reference, status, and shipped/delivered timestamps.
- `returns` and `refunds`: return/order-item references, reason and state; refund references the payment and provider refund ID. Keep the original order and payment records immutable.
- `coupons` and `coupon_redemptions`: code/rule/validity/limits, and redemption references to user and order. Enforce usage limits in a transaction.

### Engagement

- `reviews`: user/product/order-item references, rating, text, moderation status, and timestamps. A verified-purchase uniqueness rule can use `(user_id, order_item_id)`.
- `contact_messages`: optional user reference, sender details, subject/body, status, and timestamps.
- `newsletter_subscriptions`: normalized unique email, explicit consent timestamp/source, unsubscribe timestamp, and timestamps.
- `notifications`: user foreign key, type, payload, read/delivery state, and timestamps. Queue email/SMS delivery outside the request transaction.

## Main Relationships

- `users 1:N user_addresses`, `auth_identities`, `carts`, `wishlists`, `orders`, and `reviews`.
- `categories 1:N products` (single-level category list).
- `products 1:N product_variants` and `product_images`; `products M:N tags` through `product_tags`.
- `product_variants 1:1 inventory`; `product_variants 1:N inventory_movements` and `cart_items`.
- `carts 1:N cart_items`; `wishlists 1:N wishlist_items`.
- `orders 1:N order_items`, `payments`, and `shipments`; `payments 1:N payment_events` and `refunds`.
- `coupons 1:N coupon_redemptions`; each redemption references the user and order that consumed it.
- `order_items 1:N returns`; reviews reference a product and, when verified, the purchased order item.

## Production Rules

- Generate UUIDs server-side; add foreign keys, check constraints, unique constraints, and indexes for foreign keys and common filters (slug/SKU, user order history, order status, and webhook IDs).
- Use a database transaction for price validation, coupon validation, stock reservation, order/item creation, and cart completion. Do not hold a transaction open while waiting on a payment provider; use a pending order and idempotent provider/webhook flow.
- Keep stock changes in an auditable movement ledger. Reserve stock during checkout and release it when payment/order fails or the reservation expires.
- Store all money as integer minor units (for INR, paise) or carefully constrained `NUMERIC`; include a currency code and use one convention consistently. Never use JavaScript floating-point values as the authoritative total.
- Enforce authorization on the server for every user-owned row. If Supabase is used directly, write explicit Row Level Security policies and still keep payment, price, inventory, and order-state transitions server-controlled.
- Add migrations, automated backups with restore tests, TLS, encryption at rest, secrets management, structured audit logs, and retention/deletion policies for personal data.