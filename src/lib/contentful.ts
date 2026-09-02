import {
  createClient,
  type Entry,
  type EntrySkeletonType,
  type EntryFieldTypes,
} from "contentful";
import type { Beer } from "@/types/beer";

type BeerSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    price: EntryFieldTypes.Number;
    description: EntryFieldTypes.Text;
    descriptionExtended: EntryFieldTypes.Text;
    image: EntryFieldTypes.AssetLink;
  },
  "beerHouseProject"
>;

type BeerEntry = Entry<BeerSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">;

function getClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error(
      "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN env vars"
    );
  }

  return createClient({ space: spaceId, accessToken });
}

function toBeer(entry: BeerEntry): Beer {
  const fields = entry.fields;
  const rawUrl = fields.image?.fields?.file?.url ?? "";

  return {
    id: entry.sys.id,
    name: fields.name,
    price: fields.price,
    description: fields.description,
    descriptionExtended: fields.descriptionExtended,
    imageUrl: rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl,
  };
}

export async function getAllBeers(): Promise<Beer[]> {
  const client = getClient();
  const entries = await client.withoutUnresolvableLinks.getEntries<BeerSkeleton>({
    content_type: "beerHouseProject",
  });

  return entries.items.map(toBeer);
}

export async function getBeerById(id: string): Promise<Beer | null> {
  const client = getClient();

  try {
    const entry = await client.withoutUnresolvableLinks.getEntry<BeerSkeleton>(id);
    return toBeer(entry);
  } catch {
    return null;
  }
}
