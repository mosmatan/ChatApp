export interface ConnectionRequest{
    id: number,
    requesterId: number,
    recipientId: number,
    requesterUsername: string,
    requesterFullName: string,
    requestDate: Date
  }