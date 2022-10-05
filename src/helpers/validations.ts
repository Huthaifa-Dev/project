export const userValidation = (value: string) => {
  return value.trim().length > 4;
};
export const passwordValidation = (value: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
  return value.trim().length > 4 && regex.test(value);
};
