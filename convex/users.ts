import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (existingUser.length === 0) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        picture: args.picture,
        email: args.email,
        uid: args.uid,
        token: 80000,
      });
      return result;
    }

    return existingUser[0];
  },
});

export const getuser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    return users[0] || null;
  },
});

export const updateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Validate token is not negative
    if (args.token < 0) {
      throw new Error("Token count cannot be negative");
    }

    const result = await ctx.db.patch(args.userId, {
      token: args.token,
    });

    return result;
  },
});
