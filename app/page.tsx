// import BlogList from "./components/blog-list";
"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  // The `useUser()` hook will be used to ensure that Clerk has loaded data about the logged in user
  const { user } = useUser();
  // The `useSession()` hook will be used to get the Clerk session object
  const { session } = useSession();

  // Create a custom supabase client that injects the Clerk Supabase token into the request headers
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "letter-blog-supabase",
            });

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }

  // Create a `client` object for accessing Supabase data using the Clerk token
  const client = createClerkSupabaseClient();

  // This `useEffect` will wait for the User object to be loaded before requesting
  // the tasks for the logged in user
  useEffect(() => {
    if (!user) return;

    async function loadBlogs() {
      setLoading(true);
      const { data, error } = await client.from("blogs").select();
      if (!error) setBlogs(data);
      setLoading(false);
    }

    loadBlogs();
  }, [user]);

  async function createBlog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Insert task into the "tasks" database
    await client.from("blogs").insert({
      title,
    });
    window.location.reload();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 overflow-auto">
      <div>
        <h1>Blogs</h1>

        {loading && <p>Loading...</p>}

        {!loading &&
          blogs.length > 0 &&
          blogs.map((blog: any) => <p>{blog.name}</p>)}

        {!loading && blogs.length === 0 && <p>No tasks found</p>}

        <form onSubmit={createBlog}>
          <input
            autoFocus
            type="text"
            name="title"
            placeholder="Enter new task"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      ブログですよ
    </div>
  );
}
