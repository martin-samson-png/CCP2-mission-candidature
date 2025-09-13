class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getUserByEmail(email) {
    const [row] = await this.pool.query(
      `
      SELECT * FROM users u WHERE u.email=?
      `,
      [email]
    );
    return row[0] || null;
  }

  async getUserById(id) {
    const [row] = await this.pool.query(
      `
      SELECT * FROM users u WHERE u.id=?
      `,
      [id]
    );
    return row[0];
  }

  async register({ username, email, password, role }) {
    const [result] = await this.pool.query(
      `INSERT INTO users(username, email, password, role) VALUES 
      (?,?,?,?)`,
      [username, email, password, role]
    );
    const userId = result.insertId;
    const [row] = await this.pool.query(
      `
      SELECT id, username, email, role
      FROM users u WHERE u.id=?
      `,
      [userId]
    );
    return row[0];
  }
}

export default UserRepository;
