<script lang="ts">
  import type { ButtonOption } from "@/interfaces/ui.interfaces";
  import ActionButton from "./ActionButton.svelte";
  import Delete from "../Icons/Delete.svelte";
  import Edit from "../Icons/Edit.svelte";
  import Detail from "../Icons/Detail.svelte";
  import Validate from "../Icons/Validate.svelte";
	import { BRAND_ORANGE } from "@/constant/constant";

  export let button: ButtonOption;
</script>

<div class="justify-center flex gap-2 px-2">
  {#if button.delete}
    <ActionButton buttonProps={button.delete}>
      <Delete currentColor={BRAND_ORANGE} />
    </ActionButton>
  {/if}
  {#if button.edit}
    <ActionButton buttonProps={button.edit}>
      <Edit currentColor={BRAND_ORANGE} />
    </ActionButton>
  {/if}
  {#if button.detail}
    <ActionButton buttonProps={button.detail}>
      <Detail currentColor={BRAND_ORANGE} />
    </ActionButton>
  {/if}
  {#if button.validate && !button.validate.approvedAt}
    <ActionButton buttonProps={button.validate}>
      <Validate currentColor={BRAND_ORANGE} />
    </ActionButton>
  {/if}
</div>
