# DataTable Component

A powerful, flexible, and fully-featured data table component for React with built-in pagination, search, expandable rows, and seamless API integration.

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

## Features

- ✅ **Server-side Pagination** - Efficient data loading with customizable page sizes
- 🔍 **Debounced Search** - Real-time search with automatic debouncing
- 📂 **Expandable Rows** - Nested data with lazy loading support
- 🎨 **Customizable Styling** - Striped rows, alignment options, and custom renderers
- ⚡ **Built on TanStack Query** - Automatic caching, refetching, and loading states
- 🔄 **Auto Refetch** - Smart cache invalidation and data synchronization
- 🎯 **Type-safe** - Full TypeScript support with generics

## Installation

```bash
npm install @tanstack/react-query
```

Make sure you have shadcn/ui components installed:
```bash
npx shadcn-ui@latest add table select button
```

## Basic Usage

```typescript
import DataTable from '@/components/data-table';
import { TableColumn } from '@/types/table';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const columns: TableColumn<User>[] = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => (
      <span className={value === 'active' ? 'text-green-600' : 'text-gray-400'}>
        {value}
      </span>
    )
  },
];

export default function UsersPage() {
  return (
    <DataTable
      fetchUrl="/api/users"
      columns={columns}
      title="User Management"
      search={{ enabled: true, placeholder: "Search users..." }}
    />
  );
}
```

## Props Reference

### DataTableProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | `TableColumn[]` | ✅ Yes | - | Column definitions for the table |
| `fetchUrl` | `string` | ✅ Yes | - | **IMPORTANT:** API endpoint for fetching data |
| `title` | `string` | No | - | Table title displayed above the table |
| `expandable` | `ExpandableConfig` | No | - | Configuration for expandable rows |
| `pagination` | `PaginationConfig` | No | `{ enabled: true, pageSize: 15 }` | Pagination settings |
| `search` | `SearchConfig` | No | - | Search functionality configuration |
| `actions` | `(row) => ReactNode` | No | - | Render function for action buttons |
| `striped` | `boolean` | No | `false` | Enable alternating row colors |
| `defaultAlign` | `'left' \| 'center' \| 'right'` | No | `'left'` | Default text alignment for cells |
| `emptyMessage` | `string` | No | `"No data available"` | Message shown when no data |
| `loadingRows` | `number` | No | `5` | Number of skeleton rows during loading |

### TableColumn

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | ✅ Yes | Data property key to display |
| `label` | `string` | ✅ Yes | Column header text |
| `align` | `'left' \| 'center' \| 'right'` | No | Text alignment for this column |
| `width` | `string` | No | Fixed column width (e.g., '100px', '20%') |
| `sortable` | `boolean` | No | Enable sorting (future feature) |
| `render` | `(value, row) => ReactNode` | No | Custom cell renderer function |

### PaginationConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable pagination |
| `pageSize` | `number` | `15` | Default number of rows per page |
| `pageSizeOptions` | `number[]` | `[5, 10, 15, 25]` | Available page size options |

### SearchConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable/disable search functionality |
| `placeholder` | `string` | `"Search..."` | Search input placeholder text |
| `debounceMs` | `number` | `300` | Debounce delay in milliseconds |

### ExpandableConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `condition` | `(row) => boolean` | No | Determine if row can be expanded |
| `fetchUrl` | `(row) => string` | No | **IMPORTANT:** URL to fetch sub-data |
| `transform` | `(response) => T` | No | Transform API response before rendering |
| `render` | `(subData, row, loading, error) => ReactNode` | ✅ Yes | Render function for expanded content |
| `cacheKey` | `(row) => string` | No | Custom cache key for expanded data |

## API Structure Requirements

### ⚠️ IMPORTANT: Frontend Requirements

The DataTable expects a **specific API response format**. Your backend must follow this structure:

#### Request Parameters (Query String)

```typescript
GET /api/users?page=1&limit=15&search=john
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | `number` | ✅ Yes | Current page number (1-indexed) |
| `limit` | `number` | ✅ Yes | Number of items per page |
| `search` | `string` | No | Search query string |

#### Response Structure (JSON)

```typescript
{
  "success": boolean,        // ✅ REQUIRED
  "data": T[],              // ✅ REQUIRED: Array of items
  "meta": {                 // ✅ REQUIRED for pagination
    "total": number,        // ✅ REQUIRED: Total items count
    "page": number,         // ✅ REQUIRED: Current page
    "limit": number,        // ✅ REQUIRED: Items per page
    "totalPages": number,   // ✅ REQUIRED: Total pages
    "hasNextPage": boolean, // ✅ REQUIRED: Has next page
    "hasPrevPage": boolean  // ✅ REQUIRED: Has previous page
  },
  "error": string | null    // Optional: Error message
}
```

### Backend Implementation Examples

#### ✅ Correct Response Example

```typescript
// GET /api/users?page=1&limit=10&search=john

{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### ❌ Incorrect Response Example

```typescript
// Missing required fields
{
  "users": [...],  // ❌ Should be "data"
  "count": 100     // ❌ Missing "meta" object
}
```

### Backend Pagination Logic

```typescript
// Next.js API Route Example
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");
  const search = searchParams.get("search") || "";

  let data = getAllData(); // Your data fetching logic

  // Apply search filter
  if (search) {
    data = data.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return Response.json({
    success: true,
    data: paginatedData,
    meta: {
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
      hasNextPage: endIndex < data.length,
      hasPrevPage: page > 1,
    },
  });
}
```

### ⚠️ Common Mistakes

1. **Wrong pagination calculation:**
   ```typescript
   ❌ const startIndex = (page - 1) % limit;  // Incorrect
   ✅ const startIndex = (page - 1) * limit;  // Correct
   ```

2. **Missing meta fields:**
   ```typescript
   ❌ { data: [], total: 100 }               // Missing meta object
   ✅ { success: true, data: [], meta: {...} } // Correct structure
   ```

3. **Case sensitivity in search:**
   ```typescript
   ❌ item.name.includes(search)                    // Case-sensitive
   ✅ item.name.toLowerCase().includes(search.toLowerCase()) // Case-insensitive
   ```

## Expandable Rows (Nested Data)

The DataTable component supports expandable rows for displaying nested or related data. This is useful when you have parent-child relationships or additional details that don't fit in the main table.

### When to Use Expandable Rows

**Use expandable rows when:**
- You have nested data structures (users with tasks, orders with items, etc.)
- Additional details would make the table too wide
- Related data is optional or rarely needed
- You want to reduce initial load time

### Example: Nested Data Structure

When your API returns data with nested relationships:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "totalTasks": 5,
      "tasks": [
        {
          "id": 101,
          "title": "Implement authentication",
          "description": "Add JWT-based authentication",
          "status": "in-progress",
          "createdAt": "2024-01-15"
        },
        {
          "id": 102,
          "title": "Fix navbar responsive issue",
          "description": "Mobile menu not working properly",
          "status": "pending",
          "createdAt": "2024-01-16"
        }
      ]
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 15,
    "totalPages": 7,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Approach 1: Inline Data (Pre-loaded)

**Best for:** Small to medium datasets where nested data is **already included** in the API response.

### Advantages
✅ **Instant expansion** - No loading delay when user expands row  
✅ **Single API call** - All data fetched at once  
✅ **Simpler implementation** - No additional endpoints needed  
✅ **Better for small datasets** - When total data size is manageable  

### Example Usage

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  totalTasks: number;
  tasks: Task[]; // ✅ Nested data already in response
}

<DataTable<User, Task[]>
  title="Users with Tasks (Pre-loaded)"
  fetchUrl="/api/users/with-tasks"
  columns={userColumns}
  expandable={{
    // Optional: Control which rows can expand
    condition: (row) => row.totalTasks > 0,
    
    // Render your expandable content component
    render: (_, row) => <TasksList tasks={row.tasks} />,
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
```

### Backend Implementation (Inline)

```typescript
// GET /api/users/with-tasks?page=1&limit=10
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  // Fetch users with their tasks included
  const users = await getUsersWithTasks();
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return Response.json({
    success: true,
    data: paginatedUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      totalTasks: user.tasks.length,
      tasks: user.tasks, // ✅ Include nested data
    })),
    meta: {
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit),
      hasNextPage: endIndex < users.length,
      hasPrevPage: page > 1,
    },
  });
}
```

---

## Approach 2: On-Demand (Lazy Loading)

**Best for:** Large datasets, expensive queries, or when nested data is **rarely accessed**.

### When to Use On-Demand

**Use on-demand loading when:**
- 📊 You have **thousands of parent records** with nested data
- 💰 Fetching nested data is **expensive** (complex queries, external APIs)
- 🎯 Users **rarely expand** rows (< 20% expand rate)
- 🚀 You want to **optimize initial load time**
- 💾 Nested data is **large** (images, documents, detailed logs)

### Advantages Over Inline
✅ **Faster initial load** - Only fetch what's needed  
✅ **Lower memory usage** - Don't load unused data  
✅ **Reduced API response size** - Smaller payload  
✅ **Better scalability** - Handles large datasets efficiently  
✅ **Distributed server load** - Spread queries over time  

### Example Usage

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  totalTasks: number;
  // ❌ No tasks property - fetched on-demand
}

<DataTable<User, Task[]>
  title="Users (On-Demand Tasks)"
  fetchUrl="/api/users"
  columns={userColumns}
  expandable={{
    // ✅ IMPORTANT: fetchUrl triggers lazy loading
    fetchUrl: (row) => `/api/users/${row.id}/tasks`,
    
    // Optional: Control which rows can expand
    condition: (row) => row.totalTasks > 0,
    
    // Optional: Transform API response if needed
    transform: (response) => response.data,
    
    // Render your expandable content component
    render: (tasks, row, loading, error) => (
      <TasksList tasks={tasks} loading={loading} error={error} />
    ),
    
    // Optional: Custom cache key for better performance
    cacheKey: (row) => `user-${row.id}-tasks`,
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
```

### Backend Implementation (On-Demand)

**Main endpoint (without nested data):**
```typescript
// GET /api/users?page=1&limit=10
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  const users = await getUsers();
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return Response.json({
    success: true,
    data: paginatedUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      totalTasks: user.tasks.length,
      // ❌ Don't include tasks - loaded on-demand
    })),
    meta: {
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit),
      hasNextPage: endIndex < users.length,
      hasPrevPage: page > 1,
    },
  });
}
```

**On-demand endpoint (fetch tasks when expanded):**
```typescript
// GET /api/users/[id]/tasks
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id);
  
  // This is only called when user expands the row
  const tasks = await getTasksByUserId(userId);
  
  return Response.json({
    success: true,
    data: tasks,
    meta: {
      userId,
      total: tasks.length,
    },
  });
}
```

---

## Expandable Content Component

Create a reusable component for your nested data. This component works with **both approaches** (inline and on-demand).

```typescript
// components/TasksList.tsx
import { Task } from "@/types/users";

interface TasksListProps {
  tasks?: Task[];
  loading?: boolean;
  error?: string | null;
}

const TasksList = ({ tasks, loading, error }: TasksListProps) => {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-4">
        Failed to load tasks: {error}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4">
        No tasks available
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      <h4 className="text-sm font-semibold mb-2">
        Tasks ({tasks.length})
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border-l-2 p-3 shadow-lg bg-zinc-50 border-primary"
          >
            <div className="font-medium text-sm">{task.title}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {task.description}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded ${
                task.status === 'completed' ? 'bg-green-100 text-green-700' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksList;
```

## Advanced Examples

```typescript
<DataTable
  fetchUrl="/api/users"
  columns={columns}
  actions={(row) => (
    <>
      <Button size="sm" onClick={() => handleEdit(row)}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleDelete(row)}>
        Delete
      </Button>
    </>
  )}
/>
```

### With Custom Cell Rendering

```typescript
const columns: TableColumn<User>[] = [
  {
    key: 'avatar',
    label: 'Avatar',
    render: (value, row) => (
      <img 
        src={value} 
        alt={row.name} 
        className="w-10 h-10 rounded-full"
      />
    ),
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (value) => new Date(value).toLocaleDateString(),
  },
];
```

## Hooks Usage

### useTableData

Automatically handles data fetching with TanStack Query:

```typescript
const { data, isLoading, error, meta, refetch } = useTableData({
  fetchUrl: '/api/users',
  page: 1,
  pageSize: 15,
  search: 'john',
});
```

### useExpandable

Manages expanded row states and sub-data fetching:

```typescript
const { 
  expandedRows, 
  toggleRow, 
  fetchSubData,
  subDataCache 
} = useExpandable();
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Note:** This component requires proper backend API implementation following the specified structure. Make sure your API endpoints return data in the correct format for optimal functionality.
