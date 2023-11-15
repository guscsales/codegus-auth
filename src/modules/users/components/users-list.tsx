'use client';

import { User } from '@prisma/client';
import React from 'react';

export default function UsersList() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
      });
  }, []);

  return (
    <ul className="my-10">
      {users.map((user: User) => (
        <li key={user.id}>
          {user.name} / {user.email}
        </li>
      ))}
    </ul>
  );
}
