import { connectDB } from "@/lib/mongodb";
import { Stock, DEFAULT_STOCK } from "@/models/Stock";

// Every product starts with the same default stock, tracked here rather than
// in Contentful (too many products to hand-add a field to each). A missing
// Stock doc just means nobody has ever affected that product's stock yet.

export async function getStock(beerId: string): Promise<number> {
  await connectDB();
  const doc = await Stock.findOne({ beerId }).lean();
  return doc ? doc.quantity : DEFAULT_STOCK;
}

export async function getStockMany(beerIds: string[]): Promise<Record<string, number>> {
  await connectDB();
  const docs = await Stock.find({ beerId: { $in: beerIds } }).lean();
  const byId = new Map(docs.map((doc) => [doc.beerId, doc.quantity]));

  const result: Record<string, number> = {};
  for (const beerId of beerIds) {
    result[beerId] = byId.get(beerId) ?? DEFAULT_STOCK;
  }
  return result;
}

// Atomically decrements stock only if enough remains, creating the doc with
// the default quantity first if it doesn't exist yet. Returns false (without
// changing anything) if there isn't enough stock.
export async function decrementStock(beerId: string, qty: number): Promise<boolean> {
  await connectDB();

  await Stock.updateOne(
    { beerId },
    { $setOnInsert: { quantity: DEFAULT_STOCK } },
    { upsert: true }
  );

  const result = await Stock.findOneAndUpdate(
    { beerId, quantity: { $gte: qty } },
    { $inc: { quantity: -qty } }
  );

  return result !== null;
}

export async function incrementStock(beerId: string, qty: number): Promise<void> {
  await connectDB();
  await Stock.updateOne({ beerId }, { $inc: { quantity: qty } }, { upsert: true });
}
