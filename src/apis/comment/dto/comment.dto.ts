export interface CreateCommentDto {
  content: string;
  cardId: string;
  userId: string;
}

export interface UpdateCommentDto {
  content?: string;
}