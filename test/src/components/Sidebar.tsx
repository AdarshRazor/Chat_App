// components/Chat/Sidebar.tsx
import React from 'react';

const Sidebar = () => {
  // Example static list; in production, fetch active users
  const users = ['Alice', 'Bob', 'Charlie'];

  return (
    <aside className="w-64 p-4 border-r bg-gray-50">
      <h2 className="font-semibold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user} className="mb-2 p-2 hover:bg-gray-200 rounded">
            {user}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
