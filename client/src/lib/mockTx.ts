const BASE58_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function generateMockPubkey(): string {
  let key = "";
  for (let i = 0; i < 44; i++) {
    key += BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)];
  }
  return key;
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function generateMockTxSignature(): string {
  let sig = "";
  for (let i = 0; i < 88; i++) {
    sig += BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)];
  }
  return sig;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateSigning(): Promise<string> {
  await delay(1000 + Math.random() * 500);
  return generateMockTxSignature();
}

export async function pollUntilConfirmed<T extends { status: string }>(
  fetchFn: () => Promise<T>,
  maxAttempts = 10,
  intervalMs = 500
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fetchFn();
    if (result.status === "confirmed" || result.status === "failed") {
      return result;
    }
    await delay(intervalMs);
  }
  throw new Error("Confirmation timeout");
}
