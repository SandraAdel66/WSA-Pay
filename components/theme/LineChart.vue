<script lang="ts" setup>
const categories: Record<string, any> = {
  Adyen: { name: 'Adyen', color: '#00DC82' }, // Nuxt primary green color
  Booking: { name: 'Booking.com', color: '#41B883' }, // Vue.js green color
  Mollie: { name: 'Mollie', color: '#34495E' }, // Vue.js dark blue - works well in both modes
}

const InvestmentData = [
  {
    date: 'Aug 01',
    Adyen: 2100.2,
    Booking: 4434.1,
    Mollie: 7943.2,
  },
  {
    date: 'Aug 02',
    Adyen: 2943.0,
    Booking: 4954.1,
    Mollie: 8954.1,
  },
  {
    date: 'Aug 03',
    Adyen: 4889.5,
    Booking: 6100.2,
    Mollie: 9123.7,
  },
  {
    date: 'Aug 04',
    Adyen: 3909.8,
    Booking: 4909.7,
    Mollie: 7478.4,
  },

]

const xFormatter = (i: number) => `${InvestmentData[i]?.date}`

const userId = ref('admin')
const actual = ref('8,110.15')
const forecasted = ref('10,230.25')
const lastInvoiceDate = ref('Sept 20, 2024')

const tableVisible = ref(true)

function toggleTable() {
  tableVisible.value = !tableVisible.value
}
</script>

<template>
  <div>
  

    <LineChart
      :data="InvestmentData"
      :height="322"
      :legend-poisition="'Bottom'"
      :categories="categories"
      :y-num-ticks="4"
      :x-formatter="xFormatter"
      :curve-type="CurveType.MonotoneX"
    />

  </div>
</template>