export const PERMISSIONS = {
    // Workspace permissions
    WORKSPACE_VIEW: 'workspace:view',
    WORKSPACE_CREATE: 'workspace:create',
    WORKSPACE_UPDATE: 'workspace:update',
    WORKSPACE_DELETE: 'workspace:delete',
    WORKSPACE_MANAGE_MEMBERS: 'workspace:manage_members',
    WORKSPACE_VIEW_MEMBERS: 'workspace:view_members',
    WORKSPACE_MANAGE_ROLES: 'workspace:manage_roles',

    // Board permissions
    BOARD_VIEW: 'board:view',
    BOARD_CREATE: 'board:create',
    BOARD_UPDATE: 'board:update',
    BOARD_DELETE: 'board:delete',
    BOARD_MANAGE_MEMBERS: 'board:manage_members',
    BOARD_VIEW_MEMBERS: 'board:view_members',
    BOARD_MANAGE_ROLES: 'board:manage_roles',

    // List permissions
    LIST_VIEW: 'list:view',
    LIST_CREATE: 'list:create',
    LIST_UPDATE: 'list:update',
    LIST_DELETE: 'list:delete',

    // Card permissions
    CARD_VIEW: 'card:view',
    CARD_CREATE: 'card:create',
    CARD_UPDATE: 'card:update',
    CARD_DELETE: 'card:delete',
    CARD_ASSIGN: 'card:assign',

    // Comment permissions
    COMMENT_VIEW: 'comment:view',
    COMMENT_CREATE: 'comment:create',
    COMMENT_UPDATE: 'comment:update',
    COMMENT_DELETE: 'comment:delete',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];