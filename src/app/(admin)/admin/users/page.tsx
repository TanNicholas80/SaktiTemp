"use client";

import * as React from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";
import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";
import { createUserColumns, type User } from "./columns";
import { createUserSchema, updateUserSchema } from "@/lib/validations/user";

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [deleteUser, setDeleteUser] = React.useState<User | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [createPassword, setCreatePassword] = React.useState("");
  const [editPassword, setEditPassword] = React.useState("");

  const createFormRef = React.useRef<HTMLFormElement>(null);
  const editFormRef = React.useRef<HTMLFormElement>(null);

  const columns = React.useMemo(
    () =>
      createUserColumns({
        onEdit: (user) => {
          setEditUser(user);
          setEditPassword("");
          setFormErrors({});
        },
        onDelete: setDeleteUser,
      }),
    []
  );

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Gagal memuat daftar user");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrors({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: createPassword,
      role: (formData.get("role") as string) || "admin",
    };

    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat user");
        if (json.details?.fieldErrors) {
          setFormErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).map(([k, v]) => [
                k,
                Array.isArray(v) ? v[0] : String(v),
              ])
            )
          );
        }
        return;
      }

      toast.success("User berhasil dibuat");
      setCreateOpen(false);
      setCreatePassword("");
      form.reset();
      fetchUsers();
    } catch {
      toast.error("Gagal membuat user");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editUser) return;
    setFormErrors({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: editPassword || undefined,
      role: (formData.get("role") as string) || "admin",
    };

    const parsed = updateUserSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);
      return;
    }

    const payload = { ...parsed.data };
    if (!payload.password) delete payload.password;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui user");
        if (json.details?.fieldErrors) {
          setFormErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).map(([k, v]) => [
                k,
                Array.isArray(v) ? v[0] : String(v),
              ])
            )
          );
        }
        return;
      }

      toast.success("User berhasil diperbarui");
      setEditUser(null);
      setEditPassword("");
      fetchUsers();
    } catch {
      toast.error("Gagal memperbarui user");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteUser) return;
    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus user");
        return;
      }

      toast.success("User berhasil dihapus");
      setDeleteUser(null);
      fetchUsers();
    } catch {
      toast.error("Gagal menghapus user");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen User</h1>
          <p className="text-muted-foreground text-sm">
            Kelola user dan akses aplikasi
          </p>
        </div>
        <Button
          onClick={() => {
            setCreateOpen(true);
            setCreatePassword("");
            setFormErrors({});
          }}
        >
          <Plus className="size-4" />
          Tambah User
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-lg border py-12">
          <p className="text-muted-foreground text-sm">Memuat...</p>
        </div>
      ) : users.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada user</EmptyTitle>
            <EmptyDescription>Tambahkan user pertama untuk memulai</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={() => {
                setCreateOpen(true);
                setCreatePassword("");
                setFormErrors({});
              }}
            >
              <Plus className="size-4" />
              Tambah User
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          renderToolbar={(table) => (
            <DataTableToolbar
              table={table}
              searchKey="email"
              searchPlaceholder="Cari email..."
            />
          )}
          renderPagination={(table) => (
            <div className="py-4">
              <DataTablePagination table={table} />
            </div>
          )}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
          </DialogHeader>
          <form ref={createFormRef} onSubmit={handleCreate} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="create-name">Nama</FieldLabel>
                <Input
                  id="create-name"
                  name="name"
                  defaultValue=""
                  placeholder="Nama lengkap"
                  aria-invalid={!!formErrors.name}
                />
                <FieldError errors={formErrors.name ? [{ message: formErrors.name }] : []} />
              </Field>
              <Field>
                <FieldLabel htmlFor="create-email">Email</FieldLabel>
                <Input
                  id="create-email"
                  name="email"
                  type="email"
                  defaultValue=""
                  placeholder="email@contoh.com"
                  aria-invalid={!!formErrors.email}
                />
                <FieldError errors={formErrors.email ? [{ message: formErrors.email }] : []} />
              </Field>
              <Field>
                <FieldLabel htmlFor="create-password">Password</FieldLabel>
                <PasswordInput
                  id="create-password"
                  name="password"
                  value={createPassword}
                  onChange={setCreatePassword}
                  placeholder="Min. 8 karakter, huruf besar, kecil, angka"
                />
                <FieldError errors={formErrors.password ? [{ message: formErrors.password }] : []} />
              </Field>
              <Field>
                <FieldLabel htmlFor="create-role">Role</FieldLabel>
                <select
                  id="create-role"
                  name="role"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 py-1 text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </Field>
            </FieldGroup>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <form ref={editFormRef} onSubmit={handleUpdate} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-name">Nama</FieldLabel>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editUser.name}
                    placeholder="Nama lengkap"
                    aria-invalid={!!formErrors.name}
                  />
                  <FieldError errors={formErrors.name ? [{ message: formErrors.name }] : []} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-email">Email</FieldLabel>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editUser.email}
                    placeholder="email@contoh.com"
                    aria-invalid={!!formErrors.email}
                  />
                  <FieldError errors={formErrors.email ? [{ message: formErrors.email }] : []} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-password">Password (kosongkan jika tidak diubah)</FieldLabel>
                  <PasswordInput
                    id="edit-password"
                    name="password"
                    value={editPassword}
                    onChange={setEditPassword}
                    placeholder="Password baru (opsional)"
                  />
                  <FieldError errors={formErrors.password ? [{ message: formErrors.password }] : []} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-role">Role</FieldLabel>
                  <select
                    id="edit-role"
                    name="role"
                    defaultValue={editUser.role}
                    className="border-input bg-background h-9 w-full rounded-md border px-3 py-1 text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </Field>
              </FieldGroup>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteUser} onOpenChange={(o) => !o && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user {deleteUser?.name}? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteUser(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
