import { ConversationDTO } from "./ConverstionDTO";
import { MessageDTO } from "./MessageDTO";
import { UserContact } from "./UserContact";

export interface Conversation{
    conversationId:number;
    name:string;
    participants: UserContact[];
    messages:MessageDTO[];
    startTime:Date;
    lastMessageTime:Date;
}