/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUsersWithoutTasks } from "@/lib/data/dummy-users-data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "15");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    let users = getUsersWithoutTasks(30);

    // filter berdasarkan search query kalo ada
    if (search) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    // pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      meta: {
        total: users.length,
        page,
        limit,
        totalPages: Math.ceil(users.length / limit),
        hasNextPage: endIndex < users.length,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}
