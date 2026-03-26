import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  index,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import type { OptionGroupMetadata, OptionMetadata, ProductMetadata } from "@/lib/types";

// ── Auth.js tables ──────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// ── Product / order tables ──────────────────────────────────────────────

export const selectionTypeEnum = pgEnum("selection_type", ["single", "multi"]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    basePriceCents: integer("base_price_cents").notNull(),
    imageUrl: text("image_url").notNull(),
    active: boolean("active").notNull().default(true),
    metadata: jsonb("metadata")
      .$type<ProductMetadata>()
      .notNull()
      .default(sql`'{"gallery":[]}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIndex: uniqueIndex("products_slug_idx").on(table.slug),
  }),
);

export const optionGroups = pgTable(
  "option_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    required: boolean("required").notNull().default(false),
    selectionType: selectionTypeEnum("selection_type").notNull(),
    metadata: jsonb("metadata")
      .$type<OptionGroupMetadata>()
      .notNull()
      .default(sql`'{}'::jsonb`),
  },
  (table) => ({
    productSlugIndex: uniqueIndex("option_groups_product_slug_idx").on(
      table.productId,
      table.slug,
    ),
  }),
);

export const options = pgTable(
  "options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => optionGroups.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    priceDeltaCents: integer("price_delta_cents").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
    isDefault: boolean("is_default").notNull().default(false),
    metadata: jsonb("metadata")
      .$type<OptionMetadata>()
      .notNull()
      .default(sql`'{}'::jsonb`),
  },
  (table) => ({
    groupSlugIndex: uniqueIndex("options_group_slug_idx").on(table.groupId, table.slug),
  }),
);

// ── Promo codes ─────────────────────────────────────────────────────────

export const promoCodes = pgTable(
  "promo_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(), // stored UPPERCASE
    discountType: text("discount_type").notNull(), // "fixed_amount" | "percentage"
    discountValue: integer("discount_value").notNull(), // cents for fixed_amount, 0-100 for percentage
    isActive: boolean("is_active").notNull().default(true),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validTo: timestamp("valid_to", { withTimezone: true }),
    maxUses: integer("max_uses"), // null = unlimited
    currentUses: integer("current_uses").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    codeIndex: uniqueIndex("promo_codes_code_idx").on(table.code),
  }),
);

export const configurations = pgTable("configurations", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  selections: jsonb("selections").notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    configurationId: uuid("configuration_id")
      .references(() => configurations.id, { onDelete: "restrict" }),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    stripeSessionId: text("stripe_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    status: text("status").notNull(),
    customerEmail: text("customer_email"),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),
    stripeCustomerId: text("stripe_customer_id"),
    promoCodeId: uuid("promo_code_id").references(() => promoCodes.id, {
      onDelete: "set null",
    }),
    promoCode: text("promo_code"),
    discountAmountCents: integer("discount_amount_cents"),
    shippingAddress: jsonb("shipping_address").$type<{
      street: string;
      apt?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    }>(),
    amountTotalCents: integer("amount_total_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    stripeSessionIndex: uniqueIndex("orders_stripe_session_id_idx").on(
      table.stripeSessionId,
    ),
    userIdIdx: index("orders_user_id_idx").on(table.userId),
  }),
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    configurationId: uuid("configuration_id").references(() => configurations.id, {
      onDelete: "restrict",
    }),
    itemType: text("item_type").notNull(), // "configured" | "accessory"
    label: text("label").notNull(),
    slug: text("slug").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull().default(1),
    totalCents: integer("total_cents").notNull(),
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
  }),
);

export const orderEvents = pgTable(
  "order_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    payload: jsonb("payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index("order_events_order_id_idx").on(table.orderId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  orders: many(orders),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  optionGroups: many(optionGroups),
  configurations: many(configurations),
}));

export const optionGroupsRelations = relations(optionGroups, ({ one, many }) => ({
  product: one(products, {
    fields: [optionGroups.productId],
    references: [products.id],
  }),
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  group: one(optionGroups, {
    fields: [options.groupId],
    references: [optionGroups.id],
  }),
}));

export const promoCodesRelations = relations(promoCodes, ({ many }) => ({
  orders: many(orders),
}));

export const configurationsRelations = relations(configurations, ({ one, many }) => ({
  product: one(products, {
    fields: [configurations.productId],
    references: [products.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  configuration: one(configurations, {
    fields: [orders.configurationId],
    references: [configurations.id],
  }),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  promoCodeRef: one(promoCodes, {
    fields: [orders.promoCodeId],
    references: [promoCodes.id],
  }),
  items: many(orderItems),
  events: many(orderEvents),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  configuration: one(configurations, {
    fields: [orderItems.configurationId],
    references: [configurations.id],
  }),
}));

export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, {
    fields: [orderEvents.orderId],
    references: [orders.id],
  }),
}));
