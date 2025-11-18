import { NavLink } from "react-router-dom";
import { ActionButton } from "@/components/ui/shared/ActionButton";

export function SidebarNav({ title, links, actions }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-purple-700 mb-6">{title}</h2>
        <nav className="space-y-2">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {actions && (
        <div className="mt-6 space-y-2">
          {actions.map((action, idx) => (
            <ActionButton
              key={idx}
              label={action.label}
              onClick={action.onClick}
              variant={action.variant}
              className={action.className}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
