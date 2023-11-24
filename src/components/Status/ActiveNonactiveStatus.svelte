<script lang="ts">
	export let active: boolean;
</script>

{#if active}
	<div class="px-2 py-2 bg-pastel-green text-white font-bold w-[100px] text-center rounded-full">Aktif</div>
{:else}
	<div class="px-2 py-2 rounded-full bg-pastel-red text-white font-bold w-[100px] text-center">Tidak Aktif</div>
{/if}
