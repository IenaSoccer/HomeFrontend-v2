type Visibility = string & { __brand: 'visibility' };
type HexColor = string & { __brand: 'hexcolor' };
type ResourceData<D> = {
  data: D;
  type: 0 | 1;
};
type ResourceAttributes = {
  preview: boolean;
  tags: string[];
  custom: Record<string, string>;
};
type AttachmentData = {
  name: string;
  path: string;
  description: string;
} & { __brand: 'attachmentdata' };

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

function asAttachmentData(value: {
  name: string;
  path: string;
  description: string;
}): AttachmentData {
  return value as AttachmentData;
}

function asVisibility(value: string): Visibility {
  if (!/^(\w){8}$/.test(value)) {
    throw new Error('Invalid Visibility');
  }
  return value as Visibility;
}

function asHexColor(value: string): HexColor {
  if (!/^#[0-9A-F]{6}$/i.test(value)) {
    throw new Error('Invalid HexColor');
  }
  return value as HexColor;
}

export type { Visibility, HexColor, ResourceData, ResourceAttributes, AttachmentData, CacheEntry };
export { asAttachmentData, asVisibility, asHexColor };
