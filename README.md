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
import DataTable from "@/components/data-table";
import { TableColumn } from "@/types/table";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const columns: TableColumn<User>[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span className={value === "active" ? "text-green-600" : "text-gray-400"}>
        {value}
      </span>
    ),
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

| Prop           | Type                            | Required | Default                           | Description                                   |
| -------------- | ------------------------------- | -------- | --------------------------------- | --------------------------------------------- |
| `columns`      | `TableColumn[]`                 | ✅ Yes   | -                                 | Column definitions for the table              |
| `fetchUrl`     | `string`                        | ✅ Yes   | -                                 | **IMPORTANT:** API endpoint for fetching data |
| `title`        | `string`                        | No       | -                                 | Table title displayed above the table         |
| `expandable`   | `ExpandableConfig`              | No       | -                                 | Configuration for expandable rows             |
| `pagination`   | `PaginationConfig`              | No       | `{ enabled: true, pageSize: 15 }` | Pagination settings                           |
| `search`       | `SearchConfig`                  | No       | -                                 | Search functionality configuration            |
| `actions`      | `(row) => ReactNode`            | No       | -                                 | Render function for action buttons            |
| `striped`      | `boolean`                       | No       | `false`                           | Enable alternating row colors                 |
| `defaultAlign` | `'left' \| 'center' \| 'right'` | No       | `'left'`                          | Default text alignment for cells              |
| `emptyMessage` | `string`                        | No       | `"No data available"`             | Message shown when no data                    |
| `loadingRows`  | `number`                        | No       | `5`                               | Number of skeleton rows during loading        |

### TableColumn

| Property   | Type                            | Required | Description                               |
| ---------- | ------------------------------- | -------- | ----------------------------------------- |
| `key`      | `string`                        | ✅ Yes   | Data property key to display              |
| `label`    | `string`                        | ✅ Yes   | Column header text                        |
| `align`    | `'left' \| 'center' \| 'right'` | No       | Text alignment for this column            |
| `width`    | `string`                        | No       | Fixed column width (e.g., '100px', '20%') |
| `sortable` | `boolean`                       | No       | Enable sorting (future feature)           |
| `render`   | `(value, row) => ReactNode`     | No       | Custom cell renderer function             |

### PaginationConfig

| Property          | Type       | Default           | Description                     |
| ----------------- | ---------- | ----------------- | ------------------------------- |
| `enabled`         | `boolean`  | `true`            | Enable/disable pagination       |
| `pageSize`        | `number`   | `15`              | Default number of rows per page |
| `pageSizeOptions` | `number[]` | `[5, 10, 15, 25]` | Available page size options     |

### SearchConfig

| Property      | Type      | Default       | Description                         |
| ------------- | --------- | ------------- | ----------------------------------- |
| `enabled`     | `boolean` | `false`       | Enable/disable search functionality |
| `placeholder` | `string`  | `"Search..."` | Search input placeholder text       |
| `debounceMs`  | `number`  | `300`         | Debounce delay in milliseconds      |

### ExpandableConfig

| Property    | Type                                          | Required | Description                             |
| ----------- | --------------------------------------------- | -------- | --------------------------------------- |
| `condition` | `(row) => boolean`                            | No       | Determine if row can be expanded        |
| `fetchUrl`  | `(row) => string`                             | No       | **IMPORTANT:** URL to fetch sub-data    |
| `transform` | `(response) => T`                             | No       | Transform API response before rendering |
| `render`    | `(subData, row, loading, error) => ReactNode` | ✅ Yes   | Render function for expanded content    |
| `cacheKey`  | `(row) => string`                             | No       | Custom cache key for expanded data      |

## API Structure Requirements

### ⚠️ IMPORTANT: Frontend Requirements

The DataTable expects a **specific API response format**. Your backend must follow this structure:

#### Request Parameters (Query String)

```typescript
GET /api/users?page=1&limit=15&search=john
```

| Parameter | Type     | Required | Description                     |
| --------- | -------- | -------- | ------------------------------- |
| `page`    | `number` | ✅ Yes   | Current page number (1-indexed) |
| `limit`   | `number` | ✅ Yes   | Number of items per page        |
| `search`  | `string` | No       | Search query string             |

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
    data = data.filter((item) =>
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

## Advanced Examples

### With Expandable Rows

```typescript
<DataTable
  fetchUrl="/api/users"
  columns={userColumns}
  expandable={{
    fetchUrl: (row) => `/api/users/${row.id}/tasks`,
    render: (tasks, row, loading, error) => {
      if (loading) return <div>Loading tasks...</div>;
      if (error) return <div>Error: {error}</div>;

      return (
        <div className="p-4 bg-gray-50">
          <h4 className="font-semibold mb-2">Tasks for {row.name}</h4>
          <ul>
            {tasks?.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </div>
      );
    },
  }}
/>
```

### With Custom Actions

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
    key: "avatar",
    label: "Avatar",
    render: (value, row) => (
      <img src={value} alt={row.name} className="w-10 h-10 rounded-full" />
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (value) => new Date(value).toLocaleDateString(),
  },
];
```

## Hooks Usage

### useTableData

Automatically handles data fetching with TanStack Query:

```typescript
const { data, isLoading, error, meta, refetch } = useTableData({
  fetchUrl: "/api/users",
  page: 1,
  pageSize: 15,
  search: "john",
});
```

### useExpandable

Manages expanded row states and sub-data fetching:

```typescript
const { expandedRows, toggleRow, fetchSubData, subDataCache } = useExpandable();
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Note:** This component requires proper backend API implementation following the specified structure. Make sure your API endpoints return data in the correct format for optimal functionality.
