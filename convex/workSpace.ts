import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWorkSpace = mutation({
  args: {
    message: v.any(),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workSpaceID = await ctx.db.insert("workSpace", {
      message: args.message,
      user: args.user,
    });

    return workSpaceID;
  },
});

export const getWorkSpace = query({
  args: {
    workSpaceId: v.id("workSpace"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workSpaceId);
    return result;
  },
});

export const updateMessage = mutation({
  args: {
    workSpaceId: v.id("workSpace"),
    message: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workSpaceId, {
      message: args.message,
    });
    return result;
  },
});

export const UpdateFile = mutation({
  args: {
    workSpaceId: v.id("workSpace"),
    files: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workSpaceId, {
      fileData: args.files,
    });
    return result;
  },
});

export const GetAllWorkspace = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("workSpace")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .collect();

      return result;
  },
});
