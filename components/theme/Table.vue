<template>
  <section id="basic-datatable">
    <div class="row">
      <div class="col-12">
        <!-- Top Controls -->
        <div class="d-flex justify-content-between mb-1">
          <div class="gap-2">
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

            <button
              class="btn btn-danger btnOut  ml-1 btn-icon"
              :readonly="selectedIds.length === 0"
              @click="deleteSelected"
            >
              <i class="feather icon-trash"></i> 
               multiple
            </button>
            <button v-if="!showDeletedItems"
              class="btn btn-outline-danger btnOut ml-1 btn-icon"
              @click="deletedItems"
            >
              <i class="feather icon-delete"></i> 
              deleted items
            </button>
            <button v-if="showDeletedItems"
              class="btn btn-outline-success btnOut ml-1 btn-icon"
              @click="getItems"
            >
              <i class="feather icon-check"></i> 
               items
            </button>
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

        <!-- Table -->
        <div class="card">
          <div class="card-content">
            <div class="card-body card-dashboard p-0">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th v-if="!showDeletedItems"  >
                        <fieldset class="checkbox">
                          <div class="vs-checkbox-con vs-checkbox-primary">
                            <input
                              type="checkbox"
                              :checked="isAllSelected"
                              @change="toggleSelectAll"
                            />
                            <span class="vs-checkbox">
                              <span class="vs-checkbox--check">
                                <i class="vs-icon feather icon-check"></i>
                              </span>
                            </span>
                          </div>
                        </fieldset>
                      </th>
                      <th v-for="(col, index) in columns" :key="index">
                        <span>
                          {{ col.label }} 
                        </span>
                        <span>
                          <a href="javascript:void(0)" class="ml-1" @click="sortData(col.key, 'asc')">
                          <i class="feather icon-arrow-up"></i>
                        </a>
                        <a href="javascript:void(0)" class="" @click="sortData(col.key, 'desc')">

                          <i class="feather icon-arrow-down"></i>
                        </a>
                        </span>

                      </th>
                      <th v-if="!showDeletedItems">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(item, rowIndex) in filteredData"
                      :key="rowIndex"
                    >
                      <td v-if="!showDeletedItems">
                        <fieldset class="checkbox">
                          <div class="vs-checkbox-con vs-checkbox-primary">
                            <input
                              type="checkbox"
                              :value="item.id"
                              :checked="selectedIds.includes(item.id)"
                              @change="toggleSingleSelect(item.id)"
                            />
                            <span class="vs-checkbox">
                              <span class="vs-checkbox--check">
                                <i class="vs-icon feather icon-check"></i>
                              </span>
                            </span>
                          </div>
                        </fieldset>
                      </td>
                      <td v-for="(col, colIndex) in columns" :key="colIndex">
                        {{ item[col.key] }}
                      </td>
                      <td v-if="!showDeletedItems">
                        <button
                          class="btn btn-primary btn-icon"
                          @click="editItem(item)"
                        >
                          <i class="feather icon-edit"></i>
                        </button>
                        <button
                          class="btn btn-danger ml-1 btn-icon"
                          @click="confirmDelete(item.id)"
                        >
                          <i class="feather icon-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="filteredData.length === 0">
                      <td :colspan="columns.length + 1">No data available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
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
import { ref, watch, computed } from "vue";

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

const emit = defineEmits([
  "change-per-page",
  "change-search",
  "change-page",
  "update-selected",
  "sort-data"
]);

const localPerPage = ref(10);
const localSearchQuery = ref("");
const pageOptions = [5, 10, 25, 50, 100, 500];

const showDeletedItems = ref(false);

watch(
  () => props.meta,
  () => {
    localPerPage.value = Number(props.meta.per_page) || 10;
  },
  { immediate: true }
);

// Filtered data based on search query
const filteredData = computed(() => {
  if (!localSearchQuery.value) return props.data;

  const query = localSearchQuery.value.toLowerCase();
  return props.data.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(query))
  );
});

// Checkbox selection
const selectedIds = ref<number[] | string[]>([]);

// Emit selected IDs to parent
watch(selectedIds, () => {
  emit("update-selected", selectedIds.value);
});

// Select All checkbox logic
const isAllSelected = computed(() => {
  return (
    filteredData.value.length > 0 &&
    filteredData.value.every((item) => selectedIds.value.includes(item.id))
  );
});

const toggleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  const currentPageIds = filteredData.value.map((item) => item.id);

  if (checked) {
    // Add all current page IDs to selectedIds
    selectedIds.value = Array.from(
      new Set([...selectedIds.value, ...currentPageIds])
    );
  } else {
    // Remove all current page IDs
    selectedIds.value = selectedIds.value.filter(
      (id) => !currentPageIds.includes(id)
    );
  }
};

const toggleSingleSelect = (id: string | number) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((i) => i !== id);
  } else {
    selectedIds.value.push(id);
  }
};
// Sort data based on column key
const sortData = (key: string, sort: string) => {

  emit("sort-data", { key, sort });
};
// Handle Edit Button Click
const editItem = (item) => {
  emit("edit-item", item);  // Emit the selected item to parent for further editing
};

// Confirm Delete for selected Item
const confirmDelete = (id) => {
  emit("delete-item", id);  // Emit the ID for deletion

};

// Handle Deleting Selected Items
const deleteSelected = () => {
  if (selectedIds.value.length === 0) return;
  emit("delete-selected", selectedIds.value);  // Emit selected IDs to delete

};

// Handle Deleted Items
const deletedItems = () => {
  showDeletedItems.value = true;  // Toggle deleted items view
  emit("deleted-items");  // Emit to show deleted items
};

// Handle Deleted Items
const getItems = () => {
  showDeletedItems.value = false;  // Toggle deleted items view
  emit("get-items");  // Emit to show deleted items
};

// Handle Sorting

</script>


<style>
.card-dashboard {
  padding: 0;
  border-left: 3px solid #7367f0;
  border-radius: 10px;
}
.btnOut {
  padding: 10px 6px !important;
  font-weight: 600;

}

</style>