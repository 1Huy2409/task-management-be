export interface CreateBoardRoleDto {
    name: string;
    description?: string | undefined;
    permissions: string[];
}

export interface UpdateBoardRoleDto {
    name?: string | undefined;
    description?: string | undefined;
    permissions?: string[] | undefined;
}
