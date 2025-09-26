// features/users/usersQuery.ts
import API from "@/lib/store/services/api";
import config from "@/config/config";
import { endpoints } from "@/constants/endpoints";

type Id = string | number;

export interface User {
  id: Id;
  name: string;
  email: string;
  phone?: string;
  status?: "active" | "inactive";
  roles?: { id: number; name: string }[];
  created_at?: string;
  updated_at?: string;
  full_name?: string;
  username?: string;
  country_id?: any
}

// Optional list params
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string; // name/email query
  status?: "active" | "inactive";
  role_id?: number;
}

type UserTag = { type: "User"; id: Id };
type UsersTag = { type: "Users" };
type Tags = UserTag | UsersTag;

// small helpers
const truthy = (v: unknown) =>
  v !== undefined && v !== null && !(typeof v === "string" && v.trim() === "");

const cleanParams = (obj: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (truthy(v)) out[k] = v;
  }
  return out;
};

const normalizeUserParams = (p?: any) => {
  const src = p ?? {};
  const mapped: Record<string, any> = {
    per_page: src.per_page,
    cursor: src.cursor ?? undefined,
    // prefer `phone`; if only `query` is provided, map it
    query: src.query ?? undefined,
    active: src.active,
    role_id: src.role_id,
  };
  return cleanParams(mapped);
};

const usersQuery = API.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /users
    getUsers: builder.query<
      { data: User[]; total?: number; per_page?: number } | User[],
      UserListParams | void
    >({
      query: (params) => {
        return {
          url: endpoints.users, // DON'T prefix config.apiUrl again
          method: "GET",
          params: params, // <- clean, normalized params
        };
      },
      providesTags: ["Users"],
    }),
    // GET /users/:id
    getUserDetails: builder.query<User, Id>({
      query: (id) => ({
        url: `${config.apiUrl + endpoints.users}/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    // GET
    getCountriers: builder.query({
      query: () => ({
        url: `${config.apiUrl + endpoints.countries}`,
        method: "GET",
      }),
    }),
    getAdminCountriers: builder.query({
      query: () => ({
        url: `${config.apiUrl + endpoints.admin_countries}`,
        method: "GET",
      }),
    }),

    // POST /users
    addUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: config.apiUrl + endpoints.users,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // PUT or PATCH /users/:id
    updateUser: builder.mutation<User, { id: Id; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `${config.apiUrl + endpoints.users}/${id}`,
        method: "PUT", // change to "PATCH" if your API prefers
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // DELETE /users/:id
    deleteUser: builder.mutation<{ success: boolean }, Id>({
      query: (id) => ({
        url: `${config.apiUrl + endpoints.users}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // POST /users/:id/roles  { role_ids: number[] }
    assignUserRoles: builder.mutation<
      { success?: boolean; message?: string },
      { userId: Id; role_ids: number[] }
    >({
      query: ({ userId, role_ids }) => ({
        url: `${config.apiUrl + endpoints.users}/${userId}/roles`,
        method: "POST",
        body: { role_ids },
      }),
      invalidatesTags: ["Users"],
    }),

    // PATCH /users/:id/status  { status: "active" | "inactive" }
    setUserStatus: builder.mutation<{ success?: boolean }, any>({
      query: (data) => ({
        url: `${config.apiUrl + endpoints.users_status}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignUserRolesMutation,
  useSetUserStatusMutation,
  useGetCountriersQuery,
  useGetAdminCountriersQuery
} = usersQuery;

export default usersQuery;
