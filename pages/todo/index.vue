<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'default', // Use your default layout which includes Navbar
  title: 'Todo List'
  // No middleware - accessible without login
})

interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
}

// State
const todos = ref<Todo[]>([
  { id: 1, title: 'Complete project report', description: 'Finish the quarterly project report', completed: false, priority: 'high', dueDate: getTomorrowDate() },
  { id: 2, title: 'Buy groceries', description: 'Milk, eggs, bread, fruits', completed: true, priority: 'medium', dueDate: getYesterdayDate() },
  { id: 3, title: 'Schedule team meeting', description: 'Discuss project progress', completed: false, priority: 'medium', dueDate: getTomorrowDate() },
  { id: 4, title: 'Update documentation', description: 'Update API documentation', completed: false, priority: 'low', dueDate: getNextWeekDate() },
])

const filter = ref<'all' | 'pending' | 'completed'>('all')
const searchQuery = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const isEditing = ref(false)
const currentTodo = ref<Todo>({
  id: 0,
  title: '',
  description: '',
  completed: false,
  priority: 'medium',
  dueDate: ''
})

// Helper functions for dates
function getTomorrowDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

function getYesterdayDate() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

function getNextWeekDate() {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  return nextWeek.toISOString().split('T')[0]
}

// Computed properties
const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed))
const completedTodos = computed(() => todos.value.filter(todo => todo.completed))

const filteredTodos = computed(() => {
  let filtered = todos.value
  
  // Apply filter
  if (filter.value === 'pending') {
    filtered = filtered.filter(todo => !todo.completed)
  } else if (filter.value === 'completed') {
    filtered = filtered.filter(todo => todo.completed)
  }
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(todo => 
      todo.title.toLowerCase().includes(query) || 
      todo.description.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Methods
function formatDate(dateString: string) {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function isOverdue(dateString: string) {
  if (!dateString) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateString) < today
}

function addTodo() {
  currentTodo.value = {
    id: 0,
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: ''
  }
  isEditing.value = false
  showAddModal.value = true
}

function editTodo(todo: Todo) {
  currentTodo.value = { ...todo }
  isEditing.value = true
  showEditModal.value = true
}

function saveTodo() {
  if (!currentTodo.value.title.trim()) return
  
  if (isEditing.value) {
    // Update existing todo
    const index = todos.value.findIndex(t => t.id === currentTodo.value.id)
    if (index !== -1) {
      todos.value[index] = { ...currentTodo.value }
    }
  } else {
    // Add new todo
    currentTodo.value.id = todos.value.length > 0 
      ? Math.max(...todos.value.map(t => t.id)) + 1 
      : 1
    todos.value.push({ ...currentTodo.value })
  }
  
  closeModal()
}

function deleteTodo(id: number) {
  if (confirm('Are you sure you want to delete this task?')) {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }
}

function updateTodoStatus(todo: Todo) {
  console.log(`Todo ${todo.id} status updated to: ${todo.completed}`)
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  isEditing.value = false
  currentTodo.value = {
    id: 0,
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: ''
  }
}

// Initialize
onMounted(() => {
  // Load todos from localStorage
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    try {
      todos.value = JSON.parse(savedTodos)
    } catch (e) {
      console.error('Error loading todos from localStorage:', e)
    }
  }
})

// Watch todos for changes and save to localStorage
watch(todos, (newTodos) => {
  try {
    localStorage.setItem('todos', JSON.stringify(newTodos))
  } catch (e) {
    console.error('Error saving todos to localStorage:', e)
  }
}, { deep: true })
</script>

<template>
  <div class="app-content">
    <!-- Navbar is already included in your layout -->
    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="content-body">
        <section class="todo-app">
          <div class="row">
            <!-- Todo Sidebar -->
            <div class="col-md-3 col-12">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Todo Filters</h4>
                </div>
                <div class="card-content">
                  <div class="card-body">
                    <div class="list-group">
                      <a href="#" class="list-group-item list-group-item-action active" @click.prevent="filter = 'all'">
                        <i class="feather icon-list mr-1"></i> All Tasks
                        <span class="badge badge-primary badge-pill float-right">{{ todos.length }}</span>
                      </a>
                      <a href="#" class="list-group-item list-group-item-action" @click.prevent="filter = 'pending'">
                        <i class="feather icon-clock mr-1"></i> Pending
                        <span class="badge badge-warning badge-pill float-right">{{ pendingTodos.length }}</span>
                      </a>
                      <a href="#" class="list-group-item list-group-item-action" @click.prevent="filter = 'completed'">
                        <i class="feather icon-check-circle mr-1"></i> Completed
                        <span class="badge badge-success badge-pill float-right">{{ completedTodos.length }}</span>
                      </a>
                    </div>
                    
                    <div class="mt-3">
                      <button class="btn btn-primary btn-block" @click="showAddModal = true">
                        <i class="feather icon-plus mr-1"></i> Add New Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Todo List -->
            <div class="col-md-9 col-12">
              <div class="card">
                <!-- Card Header with aligned title and search -->
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4 class="card-title mb-0">Todo List</h4>
                  <div class="search-wrapper">
                    <div class="input-group input-group-merge">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="feather icon-search"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Search tasks..."
                        v-model="searchQuery"
                        style="width: 200px;"
                      />
                      <div class="input-group-append" v-if="searchQuery">
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          @click="searchQuery = ''"
                        >
                          <i class="feather icon-x"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-content">
                  <div class="card-body">
                    <!-- Todo List Items -->
                    <div class="todo-list">
                      <div v-if="filteredTodos.length === 0" class="text-center py-4">
                        <i class="feather icon-check-circle display-4 text-muted"></i>
                        <h5 class="mt-2">No tasks found</h5>
                        <p v-if="searchQuery">Try a different search term</p>
                        <p v-else>Add your first task to get started</p>
                      </div>
                      
                      <div v-else class="table-responsive">
                        <table class="table table-hover">
                          <thead>
                            <tr>
                              <th style="width: 50px;">Status</th>
                              <th>Task</th>
                              <th style="width: 150px;">Priority</th>
                              <th style="width: 150px;">Due Date</th>
                              <th style="width: 100px;">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="todo in filteredTodos" :key="todo.id" :class="{'table-success': todo.completed}">
                              <td>
                                <div class="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    :id="'todo-' + todo.id"
                                    v-model="todo.completed"
                                    @change="updateTodoStatus(todo)"
                                  />
                                  <label class="custom-control-label" :for="'todo-' + todo.id"></label>
                                </div>
                              </td>
                              <td>
                                <div :class="{'text-muted text-decoration-line-through': todo.completed}">
                                  <strong>{{ todo.title }}</strong>
                                  <p class="mb-0 text-small text-muted">{{ todo.description }}</p>
                                </div>
                              </td>
                              <td>
                                <span class="badge" :class="{
                                  'badge-danger': todo.priority === 'high',
                                  'badge-warning': todo.priority === 'medium',
                                  'badge-info': todo.priority === 'low'
                                }">
                                  {{ todo.priority }}
                                </span>
                              </td>
                              <td>
                                <span :class="{'text-danger': isOverdue(todo.dueDate) && !todo.completed}">
                                  {{ formatDate(todo.dueDate) }}
                                </span>
                              </td>
                              <td>
                                <button class="btn btn-sm btn-icon btn-outline-primary mr-1" @click="editTodo(todo)">
                                  <i class="feather icon-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-icon btn-outline-danger" @click="deleteTodo(todo.id)">
                                  <i class="feather icon-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Add/Edit Todo Modal -->
    <div class="modal fade" :class="{'show d-block': showAddModal || showEditModal}" v-if="showAddModal || showEditModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit Task' : 'Add New Task' }}
            </h5>
            <button type="button" class="close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="todoTitle">Title *</label>
              <input
                type="text"
                id="todoTitle"
                class="form-control"
                v-model="currentTodo.title"
                placeholder="Enter task title"
                required
                @keyup.enter="saveTodo"
              />
            </div>
            
            <div class="form-group">
              <label for="todoDescription">Description</label>
              <textarea
                id="todoDescription"
                class="form-control"
                v-model="currentTodo.description"
                rows="3"
                placeholder="Enter task description"
              ></textarea>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="todoPriority">Priority</label>
                  <select id="todoPriority" class="form-control" v-model="currentTodo.priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="todoDueDate">Due Date</label>
                  <input
                    type="date"
                    id="todoDueDate"
                    class="form-control"
                    v-model="currentTodo.dueDate"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="saveTodo" :disabled="!currentTodo.title.trim()">
              {{ isEditing ? 'Update Task' : 'Add Task' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" v-if="showAddModal || showEditModal"></div>
  </div>
</template>



<style scoped>
.todo-app {
  padding: 20px 0;
}

.todo-list {
  min-height: 400px;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

.text-decoration-line-through {
  text-decoration: line-through;
}

.text-small {
  font-size: 0.875rem;
}

.table td {
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.badge {
  font-size: 0.85rem;
  padding: 0.35em 0.65em;
}

.custom-control-input:checked ~ .custom-control-label::before {
  border-color: #7367f0;
  background-color: #7367f0;
}

.btn-outline-primary {
  color: #7367f0;
  border-color: #7367f0;
}

.btn-outline-primary:hover {
  background-color: #7367f0;
  border-color: #7367f0;
}

.btn-primary {
  background-color: #7367f0;
  border-color: #7367f0;
}

.btn-primary:hover {
  background-color: #5a51d5;
  border-color: #5a51d5;
}

.list-group-item.active {
  background-color: #7367f0;
  border-color: #7367f0;
}

.card {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  padding: 1rem 1.25rem;
}

.card-title {
  margin-bottom: 0;
  font-size: 1.25rem;
}

.search-wrapper {
  min-width: 200px;
}

.input-group-merge .input-group-prepend {
  margin-right: -1px;
}

.input-group-merge .input-group-text {
  border-radius: 0.357rem 0 0 0.357rem;
  border-right: 0;
}

.input-group-merge .form-control {
  border-radius: 0 0.357rem 0.357rem 0;
  border-left: 0;
}

.input-group-merge .input-group-append .btn {
  border-radius: 0 0.357rem 0.357rem 0;
  border-left: 0;
}

/* For responsive design */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .search-wrapper {
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .search-wrapper .input-group {
    width: 100% !important;
  }
}
</style>