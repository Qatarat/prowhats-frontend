export const endpoints = {
  /**
   * @module Global
   */
  countries: "/app/countries",
  admin_countries: "/admin/countries",
  countries_by_id: "/app/countries",

  /**
   * @module Auth
   */
  admin_sentOtp: "/admin/auth/sent-otp",
  admin_verifyOtp: "/admin/auth/verify-otp",
  admin_refreshToken: "/admin/auth/refresh-token",
  user_sentOtp: "/app/auth/sent-otp",
  user_verifyOtp: "/app/auth/verify-otp",
  user_refreshToken: "/app/auth/refresh-token",

  /**
   * @module Profile
   */
  profile: "/app/auth/user",
  admin_profile: "/admin/auth/user",
  profile_update: "/app/profiles",

  /**
   * @module Permissions
   */
  permissions: "/admin/permissions",

  /**
   * @module BookOrTopics
   */
  books: "/admin/book-or-topics",
  get_books: "/admin/book-or-topics",
  user_get_books: "/app/book-or-topics",
  update_topic_status: "/admin/book-or-topic/update-status",

  /**
   * @module Reviews
   */
  reviews: "/admin/reviews",
  reviews_count: "/admin/reviews-stats",
  user_reviews: "/app/review",

  /**
   * @module Roles
   */
  roles: "/admin/roles",
  roles_by_id: "/admin/roles/:id",

  /**
   * @module Chat (Admin)
   */
  chat: "/admin/chat",
  get_chat: "/admin/get-chat",
  threadCreate: "/admin/thread",
  get_thred: "/admin/thread-chat",
  /**
   * @module AdminUsers (Admin)
   */
  admin_users: "/admin/admin-user",
  user_update_role: "/admin/admin-user/update-role",

  /**
   * @module Users (Admin)
   */
  users: "/admin/users",
  users_status: "/admin/update-status",

  /**
   * @module FileUpload (Admin)
   */
  file_upload: "/admin/upload",
  thread: "/admin/thread",

  /**
   * @module ChatHistory (Admin)
   */
  admin_chat: "/admin/chat",
  admin_feedback: "/admin/chat-review",
  ai_feedback: "/admin/ai-expert-review",
  admin_rating: "/admin/chat-review",
  user_feedback: "/app/rating-review",
  user_chat: "/app/chat",
  chat_history: "/app/chat-history",
  user_history: "/app/thread-chat",
  user_feedbacked: "/app/feed-back",

  /**
   * @module Rating
   */
  ratings: "/app/rating",
};
