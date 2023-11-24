<script lang="ts">
	export let title: string;
	export let amount: number;
</script>

<div
	class="w-full max-w-sm bg-white flex flex-col items-center justify-center text-center rounded-md py-5"
>
	<p class="text-xl text-brand-dark">{title}</p>
	<p class="text-4xl text-brand-lighter font-bold">{amount}</p>
</div>
