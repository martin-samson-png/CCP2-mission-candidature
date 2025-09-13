/**
 * @description Supprime le champ `password` d'un utilisateur avant de le renvoyer.
 *
 * @param {Object|null} user - Objet utilisateur complet (ou null)
 * @param {number} user.id - ID de l'utilisateur
 * @param {string} user.username - Nom d'utilisateur
 * @param {string} user.email - Email de l'utilisateur
 * @param {string} user.password - Mot de passe hashé (sera supprimé)
 * @param {string} user.role - Rôle de l'utilisateur
 * @returns {Object|null} Utilisateur sans mot de passe, ou null si `user` est null
 *
 * @example
 * const user = { id: 1, username: "Alice", email: "a@test.com", password: "xxx", role: "user" };
 * const safeUser = cleanUser(user);
 * // Résultat : { id: 1, username: "Alice", email: "a@test.com", role: "user" }
 */
const cleanUser = (user) => {
  if (!user) {
    return null;
  }
  const { password, ...safeUser } = user;
  return safeUser;
};

export default cleanUser;
