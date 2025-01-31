import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="flex flex-col gap-2 justify-center min-h-screen w-full">
        <h1 class="text-4xl">404 - Page not found</h1>
        <p class="text-lg">The page you're looking for doesn't exist.</p>
      </div>
    </>
  );
}
