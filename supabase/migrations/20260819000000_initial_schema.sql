create type "OrderStatus" as enum ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
create type "PaymentMethod" as enum ('CASH_ON_DELIVERY', 'CARD');

create table "Category" (
  "id" text primary key,
  "name" text not null,
  "slug" text not null unique,
  "description" text,
  "image" text,
  "parentId" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null,
  constraint "Category_parentId_fkey" foreign key ("parentId") references "Category"("id") on delete set null on update cascade
);

create table "Product" (
  "id" text primary key,
  "name" text not null,
  "slug" text not null unique,
  "description" text not null,
  "shortDescription" text not null,
  "sku" text not null unique,
  "price" decimal(10,2) not null,
  "compareAtPrice" decimal(10,2),
  "costPrice" decimal(10,2),
  "stock" integer not null default 0,
  "brand" text not null,
  "categoryId" text not null,
  "featured" boolean not null default false,
  "isNew" boolean not null default false,
  "isFlashDeal" boolean not null default false,
  "rating" decimal(2,1) not null default 0,
  "reviewCount" integer not null default 0,
  "soldCount" integer not null default 0,
  "tags" text[] not null default '{}',
  "specifications" jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null,
  constraint "Product_categoryId_fkey" foreign key ("categoryId") references "Category"("id") on delete restrict on update cascade
);

create table "ProductImage" (
  "id" text primary key,
  "productId" text not null,
  "url" text not null,
  "alt" text not null,
  "sortOrder" integer not null default 0,
  constraint "ProductImage_productId_fkey" foreign key ("productId") references "Product"("id") on delete cascade on update cascade
);

create table "ProductVariant" (
  "id" text primary key,
  "productId" text not null,
  "optionName" text,
  "optionValue" text,
  "color" text,
  "stock" integer not null default 0,
  "sku" text not null unique,
  constraint "ProductVariant_productId_fkey" foreign key ("productId") references "Product"("id") on delete cascade on update cascade
);

create table "Review" (
  "id" text primary key,
  "productId" text not null,
  "userName" text not null,
  "rating" integer not null,
  "title" text,
  "comment" text not null,
  "verified" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  constraint "Review_productId_fkey" foreign key ("productId") references "Product"("id") on delete cascade on update cascade
);

create table "User" (
  "id" text primary key,
  "name" text not null,
  "email" text not null unique,
  "phone" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null
);

create table "Address" (
  "id" text primary key,
  "userId" text not null,
  "label" text not null,
  "address" text not null,
  "city" text not null,
  "governorate" text not null,
  "postalCode" text not null,
  "country" text not null default 'Tunisie',
  "isDefault" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  constraint "Address_userId_fkey" foreign key ("userId") references "User"("id") on delete cascade on update cascade
);

create table "Order" (
  "id" text primary key,
  "orderNumber" text not null unique,
  "userId" text,
  "customerName" text not null,
  "email" text not null,
  "phone" text not null,
  "address" text not null,
  "city" text not null,
  "governorate" text not null,
  "postalCode" text not null,
  "country" text not null default 'Tunisie',
  "subtotal" decimal(10,2) not null,
  "shipping" decimal(10,2) not null,
  "discount" decimal(10,2) not null default 0,
  "total" decimal(10,2) not null,
  "paymentMethod" "PaymentMethod" not null default 'CASH_ON_DELIVERY',
  "status" "OrderStatus" not null default 'PENDING',
  "deliveryNote" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null,
  constraint "Order_userId_fkey" foreign key ("userId") references "User"("id") on delete set null on update cascade
);

create table "OrderItem" (
  "id" text primary key,
  "orderId" text not null,
  "productId" text not null,
  "productName" text not null,
  "productSlug" text not null,
  "image" text not null,
  "quantity" integer not null,
  "unitPrice" decimal(10,2) not null,
  "variant" text,
  constraint "OrderItem_orderId_fkey" foreign key ("orderId") references "Order"("id") on delete cascade on update cascade,
  constraint "OrderItem_productId_fkey" foreign key ("productId") references "Product"("id") on delete restrict on update cascade
);

create index "Category_parentId_idx" on "Category"("parentId");
create index "Product_categoryId_idx" on "Product"("categoryId");
create index "Product_featured_createdAt_idx" on "Product"("featured", "createdAt");
create index "Product_isFlashDeal_idx" on "Product"("isFlashDeal");
create index "Product_rating_idx" on "Product"("rating");
create index "Product_price_idx" on "Product"("price");
create index "ProductImage_productId_sortOrder_idx" on "ProductImage"("productId", "sortOrder");
create index "ProductVariant_productId_idx" on "ProductVariant"("productId");
create index "ProductVariant_color_optionValue_idx" on "ProductVariant"("color", "optionValue");
create index "Review_productId_createdAt_idx" on "Review"("productId", "createdAt");
create index "Address_userId_idx" on "Address"("userId");
create index "Order_email_idx" on "Order"("email");
create index "Order_status_createdAt_idx" on "Order"("status", "createdAt");
create index "Order_userId_idx" on "Order"("userId");
create index "OrderItem_orderId_idx" on "OrderItem"("orderId");
create index "OrderItem_productId_idx" on "OrderItem"("productId");

alter table "Category" enable row level security;
alter table "Product" enable row level security;
alter table "ProductImage" enable row level security;
alter table "ProductVariant" enable row level security;
alter table "Review" enable row level security;
alter table "User" enable row level security;
alter table "Address" enable row level security;
alter table "Order" enable row level security;
alter table "OrderItem" enable row level security;

grant all on table "Category", "Product", "ProductImage", "ProductVariant", "Review", "User", "Address", "Order", "OrderItem" to service_role;
