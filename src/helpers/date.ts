export const createDate = (value: Date) => {
  const currentDate = value;
  const date =
    currentDate.getFullYear() +
    "-" +
    (currentDate.getMonth() + 1) +
    "-" +
    currentDate.getDate();
  const time =
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

export const isDate = (data: string): boolean => {
  return data === "createdAt" || data === "updatedAt";
};
