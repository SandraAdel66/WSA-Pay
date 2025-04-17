<script lang="ts" setup>
interface AreaChartItem {
  date: string
  desktop: number
  mobile: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  mobile: { name: 'Mobile' },
}

const BarChartData: AreaChartItem[] = [
  { date: '2024-04-01', desktop: 222, mobile: 15 },
  { date: '2024-04-02', desktop: 180, mobile: 12 },
  { date: '2024-04-03', desktop: 167, mobile: 9 },
  { date: '2024-04-04', desktop: 172, mobile: 18 },
  { date: '2024-04-05', desktop: 184, mobile: 22 },
  { date: '2024-04-06', desktop: 195, mobile: 16 },
  { date: '2024-04-07', desktop: 198, mobile: 14 },
  { date: '2024-04-08', desktop: 205, mobile: 19 },
  { date: '2024-04-09', desktop: 210, mobile: 21 },
  { date: '2024-04-10', desktop: 219, mobile: 17 },
  { date: '2024-04-11', desktop: 224, mobile: 13 },
  { date: '2024-04-12', desktop: 230, mobile: 20 },
]

const xFormatter = (i: number): string | number => {
  if (!BarChartData[i]?.date) {
    return ''
  }
  const date = new Date(BarChartData[i]?.date)
  return `${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`
}


</script>
<template>
  <div class="">
    <BarChart
      :data="BarChartData"
      :height="250"
      :categories="categories"
      :y-axis="['desktop']"
      :group-padding="0"
      :bar-padding="0.2"
      :yNumTicks="4"
      :yGridLine="true"
      :x-formatter="xFormatter"
      :legend-position="LegendPosition.Top"
    />
  </div>
</template>