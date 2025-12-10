"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Task, User } from "@/types/users";
import DataTable from "@/components/data-table";
import TasksList from "@/components/task-list";

export default function Home() {
  const userColumns = [
    { key: "username", label: "Username" },
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    {
      key: "totalTasks",
      label: "Total Tasks",
      align: "center" as const,
      render: (value: number) => (
        <Badge variant={value > 0 ? "default" : "secondary"}>
          {value} tasks
        </Badge>
      ),
    },
  ];

  // Actions
  const userActions = (row: User) => (
    <>
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Custom
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 font-sans dark:bg-black">
      <main className="w-full max-w-6xl p-4">
        <Tabs defaultValue="parent-only">
          <TabsList className="mb-4">
            <TabsTrigger value="parent-only">Parent Only</TabsTrigger>
            <TabsTrigger value="parent-with-children">
              Parent With Children
            </TabsTrigger>
            <TabsTrigger value="parent-on-demand">Parent On Demand</TabsTrigger>
          </TabsList>

          <TabsContent value="parent-only">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
              <DataTable
                title="Users Data (With Actions)"
                fetchUrl="/api/users"
                columns={userColumns}
                actions={userActions}
                pagination={{
                  enabled: true,
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 15, 20],
                }}
                search={{
                  enabled: true,
                  placeholder: "Search users...",
                  debounceMs: 300,
                }}
                striped
              />
            </div>
          </TabsContent>

          <TabsContent value="parent-with-children">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
              <DataTable<User & { tasks: Task[] }, Task[]>
                title="Users with Tasks (Pre-loaded)"
                fetchUrl="/api/users/with-tasks"
                columns={userColumns}
                expandable={{
                  condition: (row) => row.totalTasks > 0,
                  render: (tasks, row, loading, error) => (
                    <TasksList
                      tasks={row.tasks}
                      loading={loading}
                      error={error}
                    />
                  ),
                }}
                actions={userActions}
                pagination={{
                  enabled: true,
                  pageSize: 10,
                }}
                search={{
                  enabled: true,
                  placeholder: "Search users with tasks...",
                }}
                striped
              />
            </div>
          </TabsContent>

          <TabsContent value="parent-on-demand">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
              <DataTable<User, Task[]>
                title="Users (On-Demand Tasks)"
                columns={userColumns}
                fetchUrl="/api/users"
                expandable={{
                  condition: (row) => row.totalTasks > 0,
                  fetchUrl: (row) => `/api/users/${row.id}/tasks`,
                  transform: (response: Task[]) => response,
                  render: (tasks, row, loading, error) => (
                    <TasksList tasks={tasks} loading={loading} error={error} />
                  ),
                  cacheKey: (row: User) => `user-${row.id}-tasks`,
                }}
                actions={userActions}
                pagination={{
                  enabled: true,
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 15, 20],
                }}
                search={{
                  enabled: true,
                  placeholder: "Search users...",
                  debounceMs: 300,
                }}
                striped
                loadingRows={8}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
