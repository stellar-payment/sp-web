<script lang="ts">
  import Title from "@/components/SEO/Title.svelte";
  import Sidebar from "@/components/Sidebar/Sidebar.svelte";
	import TopBar from "../Topbar/Topbar.svelte";

  export let pageName: string;
</script>

<Title title={pageName} />
<div class="flex">
  <Sidebar />
  <div
    class="min-h-screen h-max w-full flex flex-col justify-between bg-brand-background"
  >
    <div class="w-full flex justify-end px-5 py-3">
      <TopBar />
    </div>
    <div class="w-full min-h-screen">
      <div class="w-full min-h-screen px-10 mt-14">
        <slot />
      </div>
      <div class="sticky bottom-0 z-[5]">
        <img src="/Bg_Element_Export.png" alt="Background Element" />
      </div>
    </div>
  </div>
</div>
