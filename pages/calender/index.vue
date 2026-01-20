<template>
  <div class="app-content">
    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="content-body">
        <section class="calendar-app">
          <div class="row">
            <!-- Calendar Sidebar -->
            <div class="col-md-3 col-12">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title mb-0">Calendar</h4>
                </div>
                <div class="card-content">
                  <div class="card-body p-0">
                    <!-- Calendar Navigation -->
                    <div class="calendar-navigation p-3">
                        <h5 class="mb-0 text-center">{{ currentMonthYear }}</h5>
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <button class="btn btn-sm btn-outline-secondary" @click="prevMonth">
                          <i class="feather icon-chevron-left"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
                          <i class="feather icon-chevron-right"></i>
                        </button>
                      </div>
                      
                      <div class="text-center mb-3">
                        <button class="btn btn-primary btn-sm" @click="goToToday">
                          Today
                        </button>
                      </div>
                    </div>

                    <!-- Mini Calendar -->
                    <div class="mini-calendar p-3 border-top">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">{{ miniCalendarMonth }}</h6>
                        <div>
                          <button class="btn btn-sm btn-icon" @click="prevMiniMonth">
                            <i class="feather icon-chevron-left"></i>
                          </button>
                          <button class="btn btn-sm btn-icon" @click="nextMiniMonth">
                            <i class="feather icon-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                      <div class="mini-calendar-grid">
                        <!-- Week days -->
                        <div class="mini-calendar-weekdays">
                          <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="weekday">
                            {{ day }}
                          </div>
                        </div>
                        <!-- Days -->
                        <div class="mini-calendar-days">
                          <div
                            v-for="day in miniCalendarDays"
                            :key="day.date"
                            class="mini-calendar-day"
                            :class="{
                              'current-month': day.isCurrentMonth,
                              'today': day.isToday,
                              'selected': day.isSelected
                            }"
                            @click="selectDate(day.date)"
                          >
                            {{ day.day }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Selected Date Info -->
                    <div class="selected-date-info p-3 border-top">
                      <h6 class="mb-3">Selected Date</h6>
                      <div class="date-display p-2 border rounded bg-light">
                        <div class="d-flex align-items-center">
                          <i class="feather icon-calendar mr-2 text-primary"></i>
                          <div>
                            <h5 class="mb-0">{{ formatSelectedDate(selectedDate) }}</h5>
                            <small class="text-muted">{{ selectedDate.toLocaleDateString('en-US', { weekday: 'long' }) }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Calendar Main Area -->
            <div class="col-md-9 col-12">
              <div class="card">
                <!-- Calendar Header -->
                <div class="card-header d-flex justify-content-between align-items-center" style="min-height: 70px;">
                  <div class="d-flex align-items-center">
                    <div class="calendar-view-options mr-3">
                      <div class="btn-group btn-group-sm" role="group">
                        <button
                          class="btn"
                          :class="viewMode === 'day' ? 'btn-primary' : 'btn-outline-primary'"
                          @click="changeView('day')"
                        >
                          Day
                        </button>
                        <button
                          class="btn"
                          :class="viewMode === 'week' ? 'btn-primary' : 'btn-outline-primary'"
                          @click="changeView('week')"
                        >
                          Week
                        </button>
                        <button
                          class="btn"
                          :class="viewMode === 'month' ? 'btn-primary' : 'btn-outline-primary'"
                          @click="changeView('month')"
                        >
                          Month
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="d-flex align-items-center">
                    <!-- Date Navigation -->
                    <div class="date-navigation mr-3">
                      <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-secondary" @click="navigatePrev">
                          <i class="feather icon-chevron-left"></i>
                        </button>
                        <button class="btn btn-outline-secondary" @click="goToToday">
                          Today
                        </button>
                        <button class="btn btn-outline-secondary" @click="navigateNext">
                          <i class="feather icon-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card-content" style="height: calc(600px - 70px); overflow: hidden;">
                  <div class="card-body p-0 h-100">
                    <!-- Month View -->
                    <div v-if="viewMode === 'month'" class="calendar-month-view h-100">
                      <!-- Weekday Headers -->
                      <div class="calendar-weekdays">
                        <div
                          v-for="day in weekdays"
                          :key="day"
                          class="calendar-weekday"
                        >
                          {{ day }}
                        </div>
                      </div>

                      <!-- Calendar Days Grid -->
                      <div class="calendar-days-grid">
                        <div
                          v-for="day in calendarDays"
                          :key="day.date"
                          class="calendar-day"
                          :class="{
                            'current-month': day.isCurrentMonth,
                            'today': day.isToday,
                            'selected': day.isSelected,
                            'weekend': day.isWeekend
                          }"
                          @click="selectDate(day.date)"
                        >
                          <div class="day-header">
                            <div class="day-number">
                              {{ day.day }}
                              <span class="day-label" v-if="day.isToday">Today</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Week View -->
                    <div v-else-if="viewMode === 'week'" class="calendar-week-view h-100">
                      <!-- Time Grid -->
                      <div class="calendar-week-grid h-100">
                        <div class="time-column">
                          <div class="time-header"></div>
                          <div
                            v-for="hour in hours"
                            :key="hour"
                            class="time-cell"
                          >
                            {{ formatHour(hour) }}
                          </div>
                        </div>
                        
                        <div
                          v-for="day in weekDays"
                          :key="day.date"
                          class="day-column"
                          :class="{ 'today': day.isToday, 'selected': day.isSelected }"
                        >
                          <div class="day-header" @click="selectDate(day.date)">
                            <div class="day-name">{{ day.name }}</div>
                            <div class="day-date">{{ day.date.getDate() }}</div>
                          </div>
                          
                          <div class="day-time-cells">
                            <div
                              v-for="hour in hours"
                              :key="hour"
                              class="time-cell"
                              @click="selectDate(day.date)"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Day View -->
                    <div v-else-if="viewMode === 'day'" class="calendar-day-view h-100">
                      <!-- Current Date -->
                      <div class="day-view-header p-3 border-bottom">
                        <h4 class="mb-0">{{ formatDayHeader(selectedDate) }}</h4>
                        <p class="text-muted mb-0">{{ selectedDate.toLocaleDateString('en-US', { weekday: 'long' }) }}</p>
                      </div>

                      <!-- Time Grid -->
                      <div class="day-view-grid h-100">
                        <div class="time-column">
                          <div
                            v-for="hour in hours"
                            :key="hour"
                            class="time-cell"
                          >
                            {{ formatHour(hour) }}
                          </div>
                        </div>
                        
                        <div class="events-column">
                          <div
                            v-for="hour in hours"
                            :key="hour"
                            class="time-slot"
                            @click="selectDate(selectedDate)"
                          ></div>
                        </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Calendar'
})

interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isWeekend: boolean
}

// State
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const viewMode = ref<'day' | 'week' | 'month'>('month')

// Constants
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => i) // 0-23

// Computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const miniCalendarMonth = computed(() => {
  const date = new Date(currentDate.value)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

const miniCalendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()
  
  // Get first day of month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Get the day of the week for the first day (0 = Sunday)
  const firstDayIndex = firstDay.getDay()
  
  // Get total days in month
  const totalDays = lastDay.getDate()
  
  // Get days from previous month
  const prevMonthDays = []
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i)
  }
  
  // Get days for current month
  const currentMonthDays = Array.from({ length: totalDays }, (_, i) => i + 1)
  
  // Get days from next month
  const totalCells = 42 // 6 weeks * 7 days
  const nextMonthDays = Array.from(
    { length: totalCells - (prevMonthDays.length + totalDays) },
    (_, i) => i + 1
  )
  
  // Combine all days
  const allDays = [
    ...prevMonthDays.map(day => ({
      day,
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })),
    ...currentMonthDays.map(day => {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = date.toDateString() === selectedDate.value.toDateString()
      return {
        day,
        date,
        isCurrentMonth: true,
        isToday,
        isSelected
      }
    }),
    ...nextMonthDays.map(day => ({
      day,
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    }))
  ]
  
  return allDays.slice(0, 42) // Return exactly 6 weeks
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()
  
  // Get first day of month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Get the day of the week for the first day (0 = Sunday)
  const firstDayIndex = firstDay.getDay()
  
  // Get total days in month
  const totalDays = lastDay.getDate()
  
  // Get days from previous month
  const prevMonthDays = []
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i)
  }
  
  // Get days for current month
  const currentMonthDays = Array.from({ length: totalDays }, (_, i) => i + 1)
  
  // Get days from next month to fill 6 weeks
  const totalCells = 42 // 6 weeks * 7 days
  const nextMonthDays = Array.from(
    { length: totalCells - (prevMonthDays.length + totalDays) },
    (_, i) => i + 1
  )
  
  // Combine all days
  const allDays = [
    ...prevMonthDays.map(day => createCalendarDay(new Date(year, month - 1, day), false)),
    ...currentMonthDays.map(day => {
      const date = new Date(year, month, day)
      return createCalendarDay(date, true)
    }),
    ...nextMonthDays.map(day => createCalendarDay(new Date(year, month + 1, day), false))
  ]
  
  return allDays.slice(0, 42) // Return exactly 6 weeks
})

const weekDays = computed(() => {
  const startOfWeek = new Date(selectedDate.value)
  startOfWeek.setDate(selectedDate.value.getDate() - selectedDate.value.getDay())
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    return {
      date,
      name: weekdays[i],
      isToday: isSameDay(date, new Date()),
      isSelected: isSameDay(date, selectedDate.value)
    }
  })
})

// Methods
function createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
  const today = new Date()
  const isToday = isSameDay(date, today)
  const isSelected = isSameDay(date, selectedDate.value)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  
  return {
    date,
    day: date.getDate(),
    isCurrentMonth,
    isToday,
    isSelected,
    isWeekend
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

function formatDayHeader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatSelectedDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function selectDate(date: Date) {
  selectedDate.value = date
}

function changeView(view: 'day' | 'week' | 'month') {
  viewMode.value = view
}

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function prevMiniMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMiniMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function goToToday() {
  const today = new Date()
  currentDate.value = today
  selectedDate.value = today
}

function navigatePrev() {
  if (viewMode.value === 'day') {
    selectedDate.value = new Date(selectedDate.value.getTime() - 86400000)
  } else if (viewMode.value === 'week') {
    selectedDate.value = new Date(selectedDate.value.getTime() - 604800000)
  } else if (viewMode.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  }
}

function navigateNext() {
  if (viewMode.value === 'day') {
    selectedDate.value = new Date(selectedDate.value.getTime() + 86400000)
  } else if (viewMode.value === 'week') {
    selectedDate.value = new Date(selectedDate.value.getTime() + 604800000)
  } else if (viewMode.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  }
}

// Initialize
onMounted(() => {
  goToToday()
})
</script>

<style scoped>
.calendar-app {
  padding: 20px 0;
  height: calc(100vh - 70px);
}

.mini-calendar-grid {
  font-size: 0.8rem;
}

.mini-calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 5px;
}

.mini-calendar-weekdays .weekday {
  text-align: center;
  font-weight: 600;
  color: #6c757d;
  padding: 2px 0;
}

.mini-calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.mini-calendar-day {
  text-align: center;
  padding: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.mini-calendar-day:hover {
  background-color: #f8f9fa;
}

.mini-calendar-day.current-month {
  color: #333;
}

.mini-calendar-day:not(.current-month) {
  color: #adb5bd;
}

.mini-calendar-day.today {
  background-color: #7367f0;
  color: white;
}

.mini-calendar-day.selected {
  background-color: #f0f2fe;
  color: #7367f0;
  font-weight: 500;
}

/* Month View */
.calendar-month-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
}

.calendar-weekday {
  padding: 10px;
  text-align: center;
  font-weight: 600;
  color: #495057;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.calendar-day {
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  padding: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.calendar-day:hover {
  background-color: #f8fbff;
}

.calendar-day:not(.current-month) {
  background-color: #f8f9fa;
  color: #adb5bd;
}

.calendar-day.today {
  background-color: #f0f7ff;
}

.calendar-day.selected {
  background-color: #f0f2fe;
  border-color: #7367f0;
}

.calendar-day.weekend {
  background-color: #fafafa;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-number {
  font-weight: 500;
  font-size: 1.1rem;
}

.day-label {
  font-size: 0.7rem;
  background-color: #7367f0;
  color: white;
  padding: 1px 4px;
  border-radius: 3px;
  margin-left: 4px;
}

/* Week View */
.calendar-week-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calendar-week-grid {
  display: grid;
  grid-template-columns: 50px repeat(7, 1fr);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.time-column {
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0;
}

.time-header {
  height: 40px;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
}

.time-cell {
  height: 48px;
  padding: 5px;
  border-bottom: 1px solid #eee;
  font-size: 0.8rem;
  color: #6c757d;
  flex-shrink: 0;
}

.day-column {
  border-right: 1px solid #dee2e6;
  position: relative;
  min-height: 0;
}

.day-column.today {
  background-color: #f0f7ff;
}

.day-column.selected {
  background-color: #f0f2fe;
}

.day-header {
  height: 40px;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.day-name {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.day-date {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
}

.day-time-cells {
  position: relative;
  flex: 1;
}

.day-time-cells .time-cell {
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.day-time-cells .time-cell:hover {
  background-color: #f8f9fa;
}

/* Day View */
.calendar-day-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.day-view-header {
  background-color: #f8f9fa;
  flex-shrink: 0;
}

.day-view-grid {
  display: grid;
  grid-template-columns: 50px 1fr;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.events-column {
  position: relative;
  flex: 1;
}

.time-slot {
  height: 48px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.time-slot:hover {
  background-color: #f8f9fa;
}

/* Selected Date Info */
.selected-date-info .date-display {
  background-color: #f8f9fa;
}

/* Scrollbar styling */
.calendar-week-grid::-webkit-scrollbar {
  width: 4px;
}

.calendar-week-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.calendar-week-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.calendar-week-grid::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive design */
@media (max-width: 768px) {
  .calendar-app {
    height: auto;
  }
  
  .calendar-month-view,
  .calendar-week-view,
  .calendar-day-view {
    height: 400px;
  }
  
  .mini-calendar-grid {
    font-size: 0.7rem;
  }
}

.btn-primary {
  background-color: #7367f0;
  border-color: #7367f0;
}

.btn-primary:hover {
  background-color: #5a51d5;
  border-color: #5a51d5;
}

.btn-outline-primary {
  color: #7367f0;
  border-color: #7367f0;
}

.btn-outline-primary:hover {
  background-color: #7367f0;
  border-color: #7367f0;
  color: white;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>