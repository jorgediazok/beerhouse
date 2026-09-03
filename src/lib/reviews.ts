import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export type ReviewWithAuthor = {
  id: string;
  userId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export async function getRatingSummary(beerId: string): Promise<{ average: number; count: number }> {
  await connectDB();
  const [result] = await Review.aggregate([
    { $match: { beerId } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  return result ? { average: result.average, count: result.count } : { average: 0, count: 0 };
}

export async function getReviews(beerId: string): Promise<ReviewWithAuthor[]> {
  await connectDB();
  const docs = await Review.find({ beerId }).sort({ createdAt: -1 }).lean();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    rating: doc.rating,
    comment: doc.comment,
    createdAt: doc.createdAt,
  }));
}

export async function upsertReview({
  userId,
  beerId,
  name,
  rating,
  comment,
}: {
  userId: string;
  beerId: string;
  name: string;
  rating: number;
  comment: string;
}): Promise<void> {
  await connectDB();
  await Review.findOneAndUpdate(
    { beerId, userId },
    { name, rating, comment },
    { upsert: true, setDefaultsOnInsert: true }
  );
}
