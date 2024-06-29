
export const generateRandomNumber = async (): Promise<string> => `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
