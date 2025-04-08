<template>
  <section id="basic-datatable">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between mb-1">
          <div>
            <label>
              Show
              <select
                v-model="localPerPage"
                @change="$emit('change-per-page', localPerPage)"
                class="form-control"
              >
                <option
                  v-for="option in pageOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Search:
              <input
                v-model="localSearchQuery"
                @input="$emit('change-search', localSearchQuery)"
                type="search"
                class="form-control"
                placeholder="Search..."
              />
            </label>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div class="card-body card-dashboard">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th v-for="(col, index) in columns" :key="index">
                        {{ col.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, rowIndex) in filteredData"
                      :key="rowIndex"
                    >
                      <td v-for="(col, colIndex) in columns" :key="colIndex">
                        {{ item[col.key] }}
                      </td>
                    </tr>
                    <tr v-if="filteredData === 0">
                      <td :colspan="columns.length">No data available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <div role="status" aria-live="polite">
              Showing {{ meta.from }} to {{ meta.to }} of
              {{ meta.total }} entries
            </div>
          </div>
          <div>
            <div class="paging_simple_numbers">
              <ul class="pagination">
                <li
                  v-for="link in meta.links"
                  :key="link.label"
                  :class="['page-item', { active: link.active }]"
                >
                  <a
                    v-if="link.url"
                    @click.prevent="$emit('change-page', link.url)"
                    href="#"
                    class="page-link"
                  >
                    <span v-html="link.label" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  meta: {
    type: Object,
    required: true,
  },
  columns: {
    type: Array as () => { label: string; key: string }[],
    required: true,
  },
});

const localPerPage = ref(10);
const localSearchQuery = ref("");

const pageOptions = [5, 10, 25, 50, 100, 500];

watch(
  () => props.meta,
  () => {
    localPerPage.value = Number(props.meta.per_page) || 10;
  },
  { immediate: true }
);

// filtered data based on search query
const filteredData = computed(() => {
  if (!localSearchQuery.value) return props.data;

  const query = localSearchQuery.value.toLowerCase();

  return props.data.filter((item) => {
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(query)
    );
  });
});

</script>
  