
export type CreatePendingTransactionDto = {
  senderAddress: string;
  recipientAddress: string;
  amount: number;
};