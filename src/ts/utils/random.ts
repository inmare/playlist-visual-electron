const getRandomId = (digit = 4): string => {
  const num = Math.trunc(Math.random() * (Math.pow(10, digit) - 1));
  return String(num).padStart(digit, "0");
};

export { getRandomId };
