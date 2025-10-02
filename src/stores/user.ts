import { User } from "@/generated/prisma";
import { proxy } from "valtio";

export const useUser = proxy({
  user: null as User | null,
  all_users: [] as User[]
});
