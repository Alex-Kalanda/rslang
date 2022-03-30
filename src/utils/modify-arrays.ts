export const shuffledArray = <T>(arr: T[]): T[] => arr.sort(() => 0.5 - Math.random());
