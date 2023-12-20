<script lang="ts">
  import { onMount } from "svelte";
  import ApexCharts from "apexcharts";
  import { formatNumber } from "@/utils/utils";
  import { get, type Writable } from "svelte/store";

  let filter;
  let chartDiv: HTMLDivElement;
  let chart;

  export let quantity: number = 0;
  export let title: string;
  export let categories: string[];
  export let data: Writable<number[]>;
  export let chartType: string;
  export let chartID: string;
  export let extraClass: string = "";
  export let height: string = "auto";
  export let width: string = "auto";
  export let extraOptions: Record<string, any> = {};

  onMount(() => {
    var options = {
      chart: {
        type: chartType,
        height: height,
        width: width,
      },
      series: [
        {
          name: "penjualan",
          data: get(data),
        },
      ],
      xaxis: {
        categories: categories,
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#EA5C1F"],
      ...extraOptions,
    };

    chart = new ApexCharts(document.querySelector(`#${chartID}`), options);

    chart.render();
  });

  data.subscribe((value) => {
    if (chart) {
      chart.updateSeries([
        {
          data: value,
        },
      ]);
    }
  });
</script>

<div class="w-max bg-brand-white px-10 py-12 shadow-md rounded-md z-[10]">
  <div class="flex justify-between">
    <div class="flex flex-col">
      <p class="text-3xl font-semibold">{title}</p>
      {#if quantity}
        <p class="text-base text-gray-400">{formatNumber(quantity)}</p>
      {/if}
    </div>
  </div>
  <div id={chartID} class={extraClass ? extraClass : "w-max"} />
</div>
