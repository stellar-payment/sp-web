<script lang="ts">
  import type {
    ActionButtonProps,
    ValidateActionButtonProps,
  } from "@/interfaces/ui.interfaces";

  export let buttonProps: ActionButtonProps | ValidateActionButtonProps;
</script>

<button
  class=""
  on:click={() => {
    if (buttonProps.id) {
      buttonProps.actionFn(buttonProps.id);
    }
  }}
>
  <slot />
</button>
