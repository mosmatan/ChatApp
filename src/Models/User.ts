import { ConversationDTO } from "./ConverstionDTO";
import { UserContact } from "./UserContact";

export interface User{
    userId: number;
    username: string;
    passwordHash: string;
    fullName: string;
    contacts: UserContact[];
    conversations : ConversationDTO[];
}