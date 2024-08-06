export interface ConversationDTO{
    conversationId: number;
    name: string;
    participantIds: number[];
    messageIds: number[]; 
    startTime: Date;
    lastMessageTime: Date;
}