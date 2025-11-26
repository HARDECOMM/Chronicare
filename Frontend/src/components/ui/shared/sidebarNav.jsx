// src/components/ui/shared/SidebarNav.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export function SidebarNav({ title, links = [], actions = [] }) {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <h2 className="font-bold text-lg mb-4">{title}</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <SidebarItem key={link.to} {...link} />
        ))}
      </nav>
      <div className="mt-6 space-y-2">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
          >
            {action.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function SidebarItem({ to, label, icon, children }) {
  const [open, setOpen] = useState(false);

  if (children && children.length > 0) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-200"
        >
          {icon} <span>{label}</span>
        </button>
        {open && (
          <div className="ml-6 mt-2 space-y-1">
            {children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className="block px-3 py-1 rounded hover:bg-gray-200"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200"
    >
      {icon} <span>{label}</span>
    </Link>
  );
}
