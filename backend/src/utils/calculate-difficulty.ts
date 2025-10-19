export const calculateDifficulty = (chainLength: number): number => {
  const baseDifficulty = 2;
  const difficultyIncreaseInterval = 10;

  return baseDifficulty + Math.floor(chainLength / difficultyIncreaseInterval);
};

export const getDifficultyTarget = (difficulty: number): string => {
  return "0".repeat(difficulty);
};