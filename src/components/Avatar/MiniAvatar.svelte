<script lang="ts">
  import { getInitials } from "@/utils/utils";

  export let imageURL: string;
  export let name: string;
</script>

  <span class="text-3xl font-medium text-magnum-700">{getInitials(name)}</span>
