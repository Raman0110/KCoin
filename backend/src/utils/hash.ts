import crypto from "crypto";
import { blockToHash } from "../modules/block/block.types";

export const calculateHash = (block: blockToHash): string => {
  const { index, previousHash, timestamp, transactions, nonce } = block;
  const data = `${index}${previousHash}${timestamp.toISOString()}${JSON.stringify(transactions)}${nonce}`;
  return crypto.createHash("sha256").update(data).digest("hex");
};
