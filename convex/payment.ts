import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const Payment = mutation({
  args: {
    userId: v.id("users"),
    razorpay_order_id: v.string(),
    razorpay_payment_id: v.string(),
    razorpay_signature: v.string(),
    amount: v.number(),
    currency: v.string(),
    payment_status: v.union(
      v.literal("pending"),
      v.literal("successful"),
      v.literal("failed")
    ),
    payment_method: v.string(),
  },
  handler: async (ctx, args) => {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      payment_status,
      payment_method,
    } = args;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .collect();
    if (!user) {
      throw new Error("User not found");
    }

    const isVerified = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isVerified) {
      throw new Error("Invalid Razorpay signature");
    }

    const payment = await ctx.db.insert("payment", {
      user: userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      payment_status,
      payment_date: new Date().toISOString(),
      payment_method,
    });

    if (payment_status === "successful") {
      await ctx.db.users.update(userId, {
        data: {
          token: user.token + amount,
        },
      });
    }

    return payment;
  },
});

// Helper function for verifying Razorpay signature (implement your own signature verification logic)
function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  return true;
}
