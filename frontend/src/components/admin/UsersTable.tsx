import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBalance } from "@/lib/format";
import { CURRENCY } from "@/lib/constants";
import type { AdminUser } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";

interface UsersTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  search: string;
}

export function UsersTable({ users, onEdit, onDelete, search }: UsersTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-3 px-4 font-medium w-8"></th>
              <th className="py-3 px-4 font-medium">ID</th>
              <th className="py-3 px-4 font-medium">Email</th>
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Accounts</th>
              <th className="py-3 px-4 font-medium">Balance</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const totalBalance = user.accounts.reduce(
                (s, a) => s + parseFloat(a.balance),
                0,
              );
              const expanded = expandedId === user.id;
              return (
                <motion.tr
                  key={user.id}
                  layout
                  className="border-b border-border hover:bg-surface/50 transition-colors"
                >
                  <td className="py-3 px-4" colSpan={7}>
                    <div className="flex items-center">
                      <button
                        onClick={() => setExpandedId(expanded ? null : user.id)}
                        className="mr-3 text-muted hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label={expanded ? "Collapse" : "Expand"}
                      >
                        {expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <div className="grid grid-cols-[3rem_1fr_1fr_4rem_6rem_auto] gap-4 flex-1 items-center">
                        <span className="text-muted">{user.id}</span>
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="text-accent hover:underline"
                        >
                          {user.email}
                        </Link>
                        <span>{user.full_name}</span>
                        <span className="text-muted">{user.accounts.length}</span>
                        <span className="font-mono">
                          {formatBalance(totalBalance.toFixed(2))} {CURRENCY}
                        </span>
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(user)}
                            aria-label="Edit user"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(user)}
                            aria-label="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expanded && user.accounts.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-12 mt-2 space-y-1 overflow-hidden"
                        >
                          {user.accounts.map((a) => (
                            <div
                              key={a.id}
                              className="flex justify-between py-1 px-3 rounded bg-background text-sm"
                            >
                              <span className="text-muted">Account #{a.id}</span>
                              <span className="font-mono">
                                {formatBalance(a.balance)} {CURRENCY}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((user) => {
          const totalBalance = user.accounts.reduce((s, a) => s + parseFloat(a.balance), 0);
          return (
            <div key={user.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    {user.email}
                  </Link>
                  <p className="text-xs text-muted">{user.full_name}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(user)} aria-label="Edit">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{user.accounts.length} accounts</span>
                <span className="font-mono">
                  {formatBalance(totalBalance.toFixed(2))} {CURRENCY}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
