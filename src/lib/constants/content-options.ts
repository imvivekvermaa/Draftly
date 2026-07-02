/**
 * Central definition of the content types and tones the assistant supports.
 * Keeping these as `const` arrays lets us derive both the runtime validation
 * (Zod enums) and the UI option lists from a single source of truth.
 */

export const CONTENT_TYPES = [
  { value: "blog_post", label: "Blog Post" },
  { value: "social_caption", label: "Social Media Caption" },
  { value: "email", label: "Email" },
  { value: "product_description", label: "Product Description" },
  { value: "ad_copy", label: "Ad Copy" },
] as const;

export const CONTENT_TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "humorous", label: "Humorous" },
  { value: "formal", label: "Formal" },
] as const;

export type ContentTypeValue = (typeof CONTENT_TYPES)[number]["value"];
export type ContentToneValue = (typeof CONTENT_TONES)[number]["value"];

export const CONTENT_TYPE_VALUES = CONTENT_TYPES.map(
  (option) => option.value,
) as [ContentTypeValue, ...ContentTypeValue[]];

export const CONTENT_TONE_VALUES = CONTENT_TONES.map(
  (option) => option.value,
) as [ContentToneValue, ...ContentToneValue[]];

/** Human-readable label lookups for rendering stored records in history. */
export const CONTENT_TYPE_LABELS: Record<ContentTypeValue, string> =
  Object.fromEntries(
    CONTENT_TYPES.map((option) => [option.value, option.label]),
  ) as Record<ContentTypeValue, string>;

export const CONTENT_TONE_LABELS: Record<ContentToneValue, string> =
  Object.fromEntries(
    CONTENT_TONES.map((option) => [option.value, option.label]),
  ) as Record<ContentToneValue, string>;
