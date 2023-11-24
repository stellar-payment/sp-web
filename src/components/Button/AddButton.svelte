<script lang="ts">
  import Add from "../Icons/Add.svelte";

  export let onClick: () => void = () => {};
  export let type: "submit" | "reset" | "button" = "button";
</script>

<button
  class="bg-brand-btn-main text-xl px-5 py-1 flex gap-2 text-white font-bold rounded-md items-center"
  {type}
  on:click={onClick}
>
  <div class="w-full text-base font-roboto">Add</div>
  <div class="w-5 h-5">
    <Add />
  </div>
</button>
