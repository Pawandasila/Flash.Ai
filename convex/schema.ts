import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token : v.optional(v.number()),
  }),

  workSpace:defineTable({
    message : v.any(),
    fileData : v.optional(v.any()),
    user : v.id('users')
  }),

  payment: defineTable({
    user: v.id("users"), 
    razorpay_order_id: v.string(),
    razorpay_payment_id: v.string(),
    razorpay_signature: v.string(),
    amount: v.number(),
    currency: v.string(),
    payment_status: v.union(v.literal("pending"), v.literal("successful"), v.literal("failed")),
    payment_date: v.string(),
    payment_method: v.string(),
    receipt_url: v.optional(v.string()),
    payment_error_message: v.optional(v.string()),
  }),
});

