import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        params: user.role === 'ceo' ? {} : { branch: user.branch },
      });
      setUsers(response.data);
      console.log('UserManagement - fetched users:', response.data);
    } catch (err) {
      console.error('UserManagement fetch error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (newUser) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, newUser);
      fetchUsers();
    } catch (err) {
      console.error('Add user error:', err);
    }
  };

  return (
    <div className="user-management">
      <h3>User Management</h3>
      {user.role === 'ceo' || user.role === 'manager' ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUser({
                username: e.target.username.value,
                password: e.target.password.value,
                role: e.target.role.value,
                branch: e.target.branch.value,
              });
            }}
          >
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <select name="role" required>
              <option value="sales_agent">Sales Agent</option>
              <option value="manager">Manager</option>
              {user.role === 'ceo' && <option value="ceo">CEO</option>}
            </select>
            <input type="text" name="branch" placeholder="Branch" required />
            <button type="submit">Add User</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>{u.branch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Unauthorized to manage users</p>
      )}
    </div>
  );
}

export default UserManagement;