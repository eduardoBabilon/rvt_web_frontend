import { User, userRole } from "@/@types/entities";

export type GetUserData = User & {
  createdAt: string;
  updatedAt: string;
};


export type GetAllUsersData = DefaultResponse<User[]>;
