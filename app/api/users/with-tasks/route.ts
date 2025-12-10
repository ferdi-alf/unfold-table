import { getUsersWithTask } from "@/lib/data/dummy-users-data";
import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: Request) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "15");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    let users = getUsersWithTask(30);

    // filter berdasarkan search query kalo ada
    if (search) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      );
    }
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
        sucess: false,
        error: "Failed to fetch users with task",
      },
      { status: 500 }
    );
  }
}
