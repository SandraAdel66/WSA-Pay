<template>
  <div class="app-content">
    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="content-body">
        <section class="chat-app">
          <div class="row">
            <!-- Chat Sidebar -->
            <div class="col-md-3 col-12">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title mb-0">Conversations</h4>
                  <div class="header-right">
                    <button class="btn btn-sm btn-icon btn-outline-primary" @click="newChat">
                      <i class="feather icon-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="card-content">
                  <div class="card-body p-0">
                    <!-- Search -->
                    <div class="chat-search p-2">
                      <div class="input-group input-group-merge">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <i class="feather icon-search"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Search chats..."
                          v-model="chatSearch"
                        />
                        <div class="input-group-append" v-if="chatSearch">
                          <button
                            class="btn btn-outline-secondary"
                            type="button"
                            @click="chatSearch = ''"
                          >
                            <i class="feather icon-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Chat List -->
                    <div class="chat-list-wrapper">
                      <div class="chat-list">
                        <div
                          v-for="chat in filteredChats"
                          :key="chat.id"
                          class="chat-list-item"
                          :class="{ active: activeChat?.id === chat.id }"
                          @click="selectChat(chat)"
                        >
                          <div class="d-flex align-items-center">
                            <div class="chat-avatar position-relative">
                              <img
                                :src="chat.avatar || `https://ui-avatars.com/api/?name=${chat.name}&background=7367f0&color=fff`"
                                :alt="chat.name"
                                class="rounded-circle"
                              />
                              <span
                                class="badge badge-dot badge-success"
                                v-if="chat.online"
                              ></span>
                              <span
                                class="badge badge-dot badge-secondary"
                                v-else
                              ></span>
                            </div>
                            <div class="chat-info ml-2 flex-grow-1">
                              <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">{{ chat.name }}</h6>
                                <small class="text-muted">{{ formatTime(chat.lastMessage?.time) }}</small>
                              </div>
                              <div class="d-flex justify-content-between align-items-center">
                                <p class="text-truncate text-muted mb-0" style="max-width: 150px;">
                                  {{ chat.lastMessage?.text || 'No messages yet' }}
                                </p>
                                <span
                                  v-if="chat.unreadCount > 0"
                                  class="badge badge-primary badge-pill"
                                >
                                  {{ chat.unreadCount }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-if="filteredChats.length === 0" class="text-center py-4">
                          <i class="feather icon-message-square display-4 text-muted"></i>
                          <h6 class="mt-2">No chats found</h6>
                          <p class="text-muted" v-if="chatSearch">Try a different search term</p>
                          <p class="text-muted" v-else>Start a new conversation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Window -->
            <div class="col-md-9 col-12">
              <div class="card">
                <!-- Chat Header -->
                <div class="card-header d-flex justify-content-between align-items-center" v-if="activeChat">
                  <div class="d-flex align-items-center">
                    <div class="chat-avatar position-relative mr-2">
                      <img
                        :src="activeChat.avatar || `https://ui-avatars.com/api/?name=${activeChat.name}&background=7367f0&color=fff`"
                        :alt="activeChat.name"
                        class="rounded-circle"
                      />
                      <span
                        class="badge badge-dot badge-success"
                        v-if="activeChat.online"
                      ></span>
                      <span
                        class="badge badge-dot badge-secondary"
                        v-else
                      ></span>
                    </div>
                    <div>
                      <h5 class="mb-0">{{ activeChat.name }}</h5>
                      <small class="text-muted">
                        {{ activeChat.online ? 'Online' : formatLastSeen(activeChat.lastSeen) }}
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Chat Messages -->
                <div class="card-content">
                  <div class="card-body">
                    <div class="chat-window" ref="chatWindow">
                      <!-- Welcome Screen -->
                      <div v-if="!activeChat" class="chat-welcome text-center py-5">
                        <i class="feather icon-message-square display-4 text-muted mb-3"></i>
                        <h4>Welcome to Chat</h4>
                        <p class="text-muted">Select a conversation to start messaging</p>
                        <button class="btn btn-primary mt-2" @click="newChat">
                          <i class="feather icon-plus mr-1"></i> Start New Chat
                        </button>
                      </div>

                      <!-- Messages -->
                      <div v-else class="chat-messages">
                        <div class="text-center my-3">
                          <span class="badge badge-light">Today</span>
                        </div>

                        <div
                          v-for="message in activeChat.messages"
                          :key="message.id"
                          class="message-wrapper"
                          :class="{'message-out': message.sender === 'me', 'message-in': message.sender !== 'me'}"
                        >
                          <div class="message">
                            <div class="message-content">
                              <p class="mb-0">{{ message.text }}</p>
                            </div>
                            <div class="message-time">
                              <small class="text-muted">{{ formatMessageTime(message.time) }}</small>
                              <i
                                v-if="message.sender === 'me' && message.read"
                                class="feather icon-check ml-1 text-primary"
                                style="font-size: 12px;"
                              ></i>
                            </div>
                          </div>
                        </div>

                        <!-- Typing Indicator -->
                        <div v-if="activeChat.isTyping" class="message-wrapper message-in">
                          <div class="message">
                            <div class="message-content">
                              <div class="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Message Input -->
                    <div class="chat-input" v-if="activeChat">
                      <form @submit.prevent="sendMessage">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button">
                              <i class="feather icon-paperclip"></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Type a message..."
                            v-model="newMessage"
                            @keyup.enter="sendMessage"
                            ref="messageInput"
                          />
                          <div class="input-group-append">
                            <button class="btn btn-primary" type="submit" :disabled="!newMessage.trim()">
                              <i class="feather icon-send"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- New Chat Modal -->
    <div class="modal fade" :class="{'show d-block': showNewChatModal}" v-if="showNewChatModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New Conversation</h5>
            <button type="button" class="close" @click="closeNewChatModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Search Users</label>
              <input
                type="text"
                class="form-control"
                v-model="userSearch"
                placeholder="Search by name or email..."
              />
            </div>

            <div class="users-list">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                class="user-item d-flex align-items-center p-2 border-bottom"
                @click="startChatWithUser(user)"
                style="cursor: pointer;"
              >
                <div class="user-avatar mr-2">
                  <img
                    :src="user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=7367f0&color=fff`"
                    :alt="user.name"
                    class="rounded-circle"
                    width="40"
                  />
                </div>
                <div class="user-info">
                  <h6 class="mb-0">{{ user.name }}</h6>
                  <small class="text-muted">{{ user.email }}</small>
                </div>
                <div class="ml-auto">
                  <span class="badge" :class="user.online ? 'badge-success' : 'badge-secondary'">
                    {{ user.online ? 'Online' : 'Offline' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeNewChatModal">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" v-if="showNewChatModal"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Chat'
})

interface ChatUser {
  id: number
  name: string
  email: string
  avatar?: string
  online: boolean
  lastSeen?: string
}

interface Message {
  id: number
  text: string
  sender: 'me' | string
  time: string
  read: boolean
}

interface Chat {
  id: number
  name: string
  avatar?: string
  userId: number
  online: boolean
  lastSeen?: string
  unreadCount: number
  isTyping: boolean
  lastMessage?: {
    text: string
    time: string
  }
  messages: Message[]
}

// State
const chats = ref<Chat[]>([
  {
    id: 1,
    name: 'John Doe',
    userId: 1,
    online: true,
    unreadCount: 2,
    isTyping: false,
    lastMessage: {
      text: 'Can we schedule a meeting tomorrow?',
      time: new Date().toISOString()
    },
    messages: [
      {
        id: 1,
        text: 'Hi there! How are you doing?',
        sender: 'me',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: true
      },
      {
        id: 2,
        text: 'I\'m doing great! Thanks for asking.',
        sender: '1',
        time: new Date(Date.now() - 3500000).toISOString(),
        read: true
      },
      {
        id: 3,
        text: 'Can we schedule a meeting tomorrow?',
        sender: '1',
        time: new Date(Date.now() - 300000).toISOString(),
        read: false
      }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    userId: 2,
    online: false,
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
    isTyping: false,
    lastMessage: {
      text: 'I\'ve sent you the documents',
      time: new Date(Date.now() - 86400000).toISOString()
    },
    messages: [
      {
        id: 1,
        text: 'Hi Jane, did you receive the documents?',
        sender: 'me',
        time: new Date(Date.now() - 172800000).toISOString(),
        read: true
      },
      {
        id: 2,
        text: 'Yes, I got them. I\'ve sent you the documents as well.',
        sender: '2',
        time: new Date(Date.now() - 86400000).toISOString(),
        read: true
      }
    ]
  },
  {
    id: 3,
    name: 'Alex Johnson',
    userId: 3,
    online: true,
    unreadCount: 5,
    isTyping: true,
    lastMessage: {
      text: 'Working on the project right now',
      time: new Date().toISOString()
    },
    messages: [
      {
        id: 1,
        text: 'Hey Alex, how\'s the project going?',
        sender: 'me',
        time: new Date(Date.now() - 1800000).toISOString(),
        read: true
      },
      {
        id: 2,
        text: 'Working on the project right now, almost done!',
        sender: '3',
        time: new Date().toISOString(),
        read: false
      }
    ]
  }
])

const users = ref<ChatUser[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', online: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', online: false, lastSeen: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, name: 'Alex Johnson', email: 'alex@example.com', online: true },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', online: true },
  { id: 5, name: 'Mike Brown', email: 'mike@example.com', online: false, lastSeen: new Date(Date.now() - 3600000).toISOString() },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', online: true }
])

const activeChat = ref<Chat | null>(null)
const chatSearch = ref('')
const userSearch = ref('')
const newMessage = ref('')
const showNewChatModal = ref(false)
const messageInput = ref<HTMLInputElement | null>(null)
const chatWindow = ref<HTMLElement | null>(null)

// Computed properties
const filteredChats = computed(() => {
  if (!chatSearch.value) return chats.value
  
  const search = chatSearch.value.toLowerCase()
  return chats.value.filter(chat =>
    chat.name.toLowerCase().includes(search) ||
    chat.lastMessage?.text.toLowerCase().includes(search)
  )
})

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  
  const search = userSearch.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  )
})

// Methods
function formatTime(timestamp?: string) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000)
    return minutes === 0 ? 'Just now' : `${minutes}m`
  } else if (diff < 86400000) { // Less than 24 hours
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatLastSeen(timestamp?: string) {
  if (!timestamp) return 'Offline'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
  return `Last seen ${date.toLocaleDateString()}`
}

function selectChat(chat: Chat) {
  activeChat.value = chat
  // Mark messages as read
  chat.messages.forEach(msg => {
    if (msg.sender !== 'me') msg.read = true
  })
  chat.unreadCount = 0
  
  nextTick(() => {
    scrollToBottom()
    messageInput.value?.focus()
  })
}

function sendMessage() {
  if (!newMessage.value.trim() || !activeChat.value) return
  
  const message: Message = {
    id: activeChat.value.messages.length + 1,
    text: newMessage.value,
    sender: 'me',
    time: new Date().toISOString(),
    read: false
  }
  
  activeChat.value.messages.push(message)
  activeChat.value.lastMessage = {
    text: newMessage.value,
    time: message.time
  }
  
  // Simulate reply after 1 second
  setTimeout(() => {
    if (activeChat.value) {
      const reply: Message = {
        id: activeChat.value.messages.length + 1,
        text: `Thanks for your message: "${newMessage.value}"`,
        sender: activeChat.value.userId.toString(),
        time: new Date().toISOString(),
        read: true
      }
      activeChat.value.messages.push(reply)
      activeChat.value.lastMessage = {
        text: reply.text,
        time: reply.time
      }
      scrollToBottom()
    }
  }, 1000)
  
  newMessage.value = ''
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (chatWindow.value) {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight
    }
  })
}

function newChat() {
  showNewChatModal.value = true
}

function startChatWithUser(user: ChatUser) {
  // Check if chat already exists
  const existingChat = chats.value.find(chat => chat.userId === user.id)
  
  if (existingChat) {
    selectChat(existingChat)
  } else {
    // Create new chat
    const newChat: Chat = {
      id: chats.value.length + 1,
      name: user.name,
      userId: user.id,
      online: user.online,
      lastSeen: user.lastSeen,
      unreadCount: 0,
      isTyping: false,
      messages: [],
      lastMessage: undefined
    }
    
    chats.value.unshift(newChat)
    selectChat(newChat)
  }
  
  closeNewChatModal()
}

function closeNewChatModal() {
  showNewChatModal.value = false
  userSearch.value = ''
}

// Initialize
onMounted(() => {
  // Load chats from localStorage
  const savedChats = localStorage.getItem('chats')
  if (savedChats) {
    try {
      chats.value = JSON.parse(savedChats)
    } catch (e) {
      console.error('Error loading chats from localStorage:', e)
    }
  }
  
  // Auto-select first chat if available
  if (chats.value.length > 0) {
    selectChat(chats.value[0])
  }
})

// Watch chats for changes and save to localStorage
watch(chats, (newChats) => {
  try {
    localStorage.setItem('chats', JSON.stringify(newChats))
  } catch (e) {
    console.error('Error saving chats to localStorage:', e)
  }
}, { deep: true })

// Auto-focus message input when chat is selected
watch(activeChat, () => {
  nextTick(() => {
    messageInput.value?.focus()
  })
})
</script>

<style scoped>
.chat-app {
  padding: 20px 0;
  height: calc(100vh - 70px);
}

.chat-list-wrapper {
  max-height: 500px;
  overflow-y: auto;
}

.chat-list-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-list-item:hover {
  background-color: #f8f9fa;
}

.chat-list-item.active {
  background-color: #f0f2fe;
  border-left: 3px solid #7367f0;
}

.chat-avatar {
  position: relative;
  width: 40px;
  height: 40px;
}

.chat-avatar img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.badge-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.chat-window {
  height: 500px;
  overflow-y: auto;
  padding: 1rem;
}

.chat-messages {
  display: flex;
  flex-direction: column;
}

.message-wrapper {
  margin-bottom: 1rem;
  max-width: 80%;
}

.message-out {
  align-self: flex-end;
}

.message-in {
  align-self: flex-start;
}

.message {
  position: relative;
}

.message-out .message-content {
  background-color: #7367f0;
  color: white;
  border-radius: 18px 18px 4px 18px;
  padding: 0.75rem 1rem;
}

.message-in .message-content {
  background-color: #f8f9fa;
  color: #333;
  border-radius: 18px 18px 18px 4px;
  padding: 0.75rem 1rem;
}

.message-time {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.message-out .message-time {
  justify-content: flex-end;
}

.message-in .message-time {
  justify-content: flex-start;
}

.chat-input {
  margin-top: 1rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #6c757d;
  border-radius: 50%;
  display: inline-block;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.users-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-item:hover {
  background-color: #f8f9fa;
}

.chat-welcome {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Scrollbar styling */
.chat-list-wrapper::-webkit-scrollbar,
.chat-window::-webkit-scrollbar,
.users-list::-webkit-scrollbar {
  width: 6px;
}

.chat-list-wrapper::-webkit-scrollbar-track,
.chat-window::-webkit-scrollbar-track,
.users-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-list-wrapper::-webkit-scrollbar-thumb,
.chat-window::-webkit-scrollbar-thumb,
.users-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-list-wrapper::-webkit-scrollbar-thumb:hover,
.chat-window::-webkit-scrollbar-thumb:hover,
.users-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-app {
    height: auto;
  }
  
  .chat-window {
    height: 400px;
  }
  
  .message-wrapper {
    max-width: 90%;
  }
}

.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
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
}

.badge-primary {
  background-color: #7367f0;
}

.badge-success {
  background-color: #28c76f;
}

.badge-secondary {
  background-color: #6c757d;
}
</style>