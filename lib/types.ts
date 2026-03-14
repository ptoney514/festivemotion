export type SelectionType = "single" | "multi";

export type SelectionMap = Record<string, string | string[]>;

export type CatalogMedia = {
  alt: string;
  poster?: string;
  src: string;
  type: "image" | "video";
};

export type CatalogFeatureCard = {
  description: string;
  eyebrow?: string;
  title: string;
};

export type CatalogSupportItem = {
  subtitle: string;
  title: string;
};

export type ProductVariantRule = {
  imageUrl?: string;
  label?: string;
  match: Record<string, string>;
  priceCents: number;
};

export type ProductPricingMetadata = {
  variantGroups?: string[];
  variants?: ProductVariantRule[];
};

export type ProductCapability = {
  included: boolean;
  label: string;
};

export type ProductMetadata = {
  audience?: string;
  capabilities?: ProductCapability[];
  category?: string;
  family?: string;
  gallery: CatalogMedia[];
  heroCtaLabel?: string;
  heroEyebrow?: string;
  heroHighlights?: string[];
  heroImageUrl?: string;
  heroSummary?: string;
  heroTagline?: string;
  inTheBox?: string[];
  leadTime?: string;
  note?: string;
  pricing?: ProductPricingMetadata;
  relatedProductSlugs?: string[];
  shippingNote?: string;
  specs?: string[];
  supportItems?: CatalogSupportItem[];
  featureCards?: CatalogFeatureCard[];
  tier?: string;
  tierRank?: number;
};

export type OptionMetadata = {
  badge?: string;
  imageUrl?: string;
};

export type OptionGroupMetadata = {
  display?: "cards" | "included-list";
  helperText?: string;
  whyItMatters?: string;
};

export type CatalogOption = {
  description?: string;
  groupId?: string;
  id?: string;
  isDefault?: boolean;
  label: string;
  metadata?: OptionMetadata;
  priceDeltaCents: number;
  slug: string;
  sortOrder: number;
};

export type CatalogOptionGroup = {
  description?: string;
  id?: string;
  metadata?: OptionGroupMetadata;
  name: string;
  options: CatalogOption[];
  productId?: string;
  required: boolean;
  selectionType: SelectionType;
  slug: string;
  sortOrder: number;
};

export type CatalogProduct = {
  active: boolean;
  basePriceCents: number;
  description: string;
  id?: string;
  imageUrl: string;
  metadata: ProductMetadata;
  name: string;
  optionGroups: CatalogOptionGroup[];
  shortDescription: string;
  slug: string;
};

export type PricedLineItem = {
  amountCents: number;
  label: string;
};

export type SelectedOptionSummary = {
  groupName: string;
  groupSlug: string;
  labels: string[];
};

export type ConfigurationSnapshot = {
  lineItems: PricedLineItem[];
  normalizedSelections: Record<string, string[]>;
  productImageUrl: string;
  productName: string;
  productSlug: string;
  selectedOptions: SelectedOptionSummary[];
  submittedSelections: SelectionMap;
};

export type PricedConfiguration = {
  errors: string[];
  lineItems: PricedLineItem[];
  normalizedSelections: Record<string, string[]>;
  selectedOptions: SelectedOptionSummary[];
  subtotalCents: number;
  totalCents: number;
  valid: boolean;
};
