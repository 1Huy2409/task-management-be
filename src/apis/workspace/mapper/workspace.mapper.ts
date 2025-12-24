import { Workspace } from "@/common/entities/workspace.entity";
import { WorkspaceResponse } from "../schemas";
import { toWorkspaceMemberResponse } from "./workspace-member.mapper";

export const toWorkspaceResponse = (workspace: Workspace): WorkspaceResponse => ({
    id: workspace.id,
    title: workspace.title,
    description: workspace.description,
    visibility: workspace.visibility,
    status: workspace.status,
    ownerName: workspace.owner?.fullname,
    boards: workspace.boards?.map(board => ({
        id: board.id,
        title: board.title,
        description: board.description,
        coverUrl: board.coverUrl,
        visibility: board.visibility,
        ownerId: board.ownerId,
        status: board.status,
        workspaceId: board.workspaceId,
        created_at: board.created_at,
        updated_at: board.updated_at
    })),
    workspaceMembers: workspace.workspaceMembers?.map(member => toWorkspaceMemberResponse(member)),
    created_at: workspace.created_at,
    updated_at: workspace.updated_at,
})