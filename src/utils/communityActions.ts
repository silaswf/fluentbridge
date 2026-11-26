import type { CommunityPost } from '../types/learning';

export function togglePostReaction(
  posts: CommunityPost[],
  postId: string,
  emoji: string,
  userId: string,
): CommunityPost[] {
  return posts.map((post) => {
    if (post.id !== postId) return post;
    const currentReactions = { ...(post.reactions ?? {}) };
    const existingUsers = currentReactions[emoji] ?? [];
    const hasReacted = existingUsers.includes(userId);
    const nextUsers = hasReacted
      ? existingUsers.filter((id) => id !== userId)
      : [...existingUsers, userId];
    if (nextUsers.length === 0) {
      delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = nextUsers;
    }
    return {
      ...post,
      reactions: currentReactions,
    };
  });
}

export function acceptCorrectionReply(
  posts: CommunityPost[],
  postId: string,
  replyId: string,
): CommunityPost[] {
  return posts.map((post) => {
    if (post.id !== postId) return post;
    const replyExists = post.replies.some((r) => r.id === replyId);
    if (!replyExists) return post;
    return {
      ...post,
      acceptedReplyId: replyId,
    };
  });
}
