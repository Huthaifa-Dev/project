const data = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "Admin2000",
      role: "admin",
      fullName: "Admin Account",
    },
  ],
};

export const validate = (userName: string, password: string) => {
  const user = getUser(userName);
  if (!user) {
    return false;
  }
  return user.password === password;
};

export const getUser = (userName: string) => {
  return data.users.find((u) => u.username === userName);
};
