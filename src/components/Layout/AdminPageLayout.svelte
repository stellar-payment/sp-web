<script lang="ts">
  import Title from "@/components/SEO/Title.svelte";
  import Sidebar from "@/components/Sidebar/Sidebar.svelte";
  import Topbar from "../Topbar/Topbar.svelte";

  export let pageName: string;
</script>

<Title title={pageName} />
<div class="flex">
  <Sidebar />
  <div
    class="min-h-screen h-max w-full flex flex-col justify-between bg-brand-background"
  >
    <div class="w-full flex justify-end px-5 py-3">
      <Topbar />
    </div>
    <div class="w-full min-h-screen">
      <div class="w-full min-h-screen px-10 mt-1">
        <div class="w-full flex justify-between">
          <h1 class="text-4xl font-bold">{pageName}</h1>
        </div>
        <slot />
      </div>
    </div>
  </div>
</div>
