<script lang="ts">
	export let label: string = '';
	export let name: string = '';
</script>

{#if label}
	<label class="font-roboto 2xl:text-base text-sm" for={name}>
		{label}
	</label>
{/if}
