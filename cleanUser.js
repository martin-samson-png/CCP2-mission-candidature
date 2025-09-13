const cleanUser = (user) => {
  if (!user) {
    return null;
  }
  const { password, ...safeUser } = user;
  return safeUser;
};

export default cleanUser;
