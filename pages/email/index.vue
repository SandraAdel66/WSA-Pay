<template>
  <div class="app-content">
    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="content-body">
        <section class="email-app">
          <div class="row">
            <!-- Email Sidebar -->
            <div class="col-md-3 col-12">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title mb-0">Mailbox</h4>
                  <div class="header-right">
                    <button class="btn btn-sm btn-icon btn-outline-primary" @click="composeEmail">
                      <i class="feather icon-edit"></i>
                    </button>
                  </div>
                </div>
                <div class="card-content">
                  <div class="card-body p-0">
                    <!-- Folders -->
                    <div class="email-folders p-3">
                      <ul class="nav flex-column">
                        <li class="nav-item">
                          <a href="#" class="nav-link" :class="{ active: currentFolder === 'inbox' }" @click.prevent="switchFolder('inbox')">
                            <i class="feather icon-inbox mr-2"></i>
                            Inbox
                            <span v-if="unreadCount > 0" class="badge badge-primary badge-pill float-right">
                              {{ unreadCount }}
                            </span>
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="#" class="nav-link" :class="{ active: currentFolder === 'starred' }" @click.prevent="switchFolder('starred')">
                            <i class="feather icon-star mr-2"></i>
                            Starred
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="#" class="nav-link" :class="{ active: currentFolder === 'sent' }" @click.prevent="switchFolder('sent')">
                            <i class="feather icon-send mr-2"></i>
                            Sent
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="#" class="nav-link" :class="{ active: currentFolder === 'drafts' }" @click.prevent="switchFolder('drafts')">
                            <i class="feather icon-file mr-2"></i>
                            Drafts
                            <span v-if="draftCount > 0" class="badge badge-info badge-pill float-right">
                              {{ draftCount }}
                            </span>
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="#" class="nav-link" :class="{ active: currentFolder === 'spam' }" @click.prevent="switchFolder('spam')">
                            <i class="feather icon-alert-octagon mr-2"></i>
                            Spam
                            <span v-if="spamCount > 0" class="badge badge-danger badge-pill float-right">
                              {{ spamCount }}
                            </span>
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="#" class="nav-link" :class="{ active: currentFolder === 'trash' }" @click.prevent="switchFolder('trash')">
                            <i class="feather icon-trash mr-2"></i>
                            Trash
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Email List -->
            <div class="col-md-9 col-12">
              <div class="card">
                <!-- Email Header -->
                <div class="card-header d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <div class="custom-control custom-checkbox mr-3">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="selectAll"
                        :checked="allSelected"
                        @change="toggleSelectAll"
                      />
                      <label class="custom-control-label" for="selectAll"></label>
                    </div>
                    <div class="email-actions mr-3">
                      <button class="btn btn-sm btn-icon btn-outline-secondary" @click="refreshEmails" title="Refresh">
                        <i class="feather icon-refresh-cw"></i>
                      </button>
                      <button class="btn btn-sm btn-icon btn-outline-secondary ml-1" :disabled="selectedEmails.length === 0" @click="deleteEmails" title="Delete">
                        <i class="feather icon-trash"></i>
                      </button>
                      <button class="btn btn-sm btn-icon btn-outline-secondary ml-1" :disabled="selectedEmails.length === 0" @click="markAsSpam" title="Mark as Spam">
                        <i class="feather icon-alert-octagon"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="d-flex align-items-center">
                    <!-- Email Search -->
                    <div class="email-search mr-3">
                      <div class="input-group input-group-merge">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <i class="feather icon-search"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          placeholder="Search emails..."
                          v-model="emailSearch"
                        />
                      </div>
                    </div>

                    <!-- View Options -->
                    <div class="view-options">
                      <button class="btn btn-sm btn-icon btn-outline-secondary" @click="toggleViewMode" title="Toggle View">
                        <i class="feather" :class="viewMode === 'list' ? 'icon-grid' : 'icon-list'"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="card-content">
                  <div class="card-body p-0">
                    <!-- Welcome Screen -->
                    <div v-if="!currentEmail && filteredEmails.length === 0 && !isComposing" class="email-welcome text-center py-5">
                      <i class="feather icon-mail display-4 text-muted mb-3"></i>
                      <h4>No Emails Found</h4>
                      <p class="text-muted">{{ emailSearch ? 'Try a different search term' : 'Your inbox is empty' }}</p>
                      <button class="btn btn-primary mt-2" @click="composeEmail">
                        <i class="feather icon-edit mr-1"></i> Compose New Email
                      </button>
                    </div>

                    <!-- Email List View -->
                    <div v-else-if="!currentEmail && !isComposing" class="email-list-wrapper">
                      <div class="email-list">
                        <div
                          v-for="email in paginatedEmails"
                          :key="email.id"
                          class="email-list-item"
                          :class="{
                            'email-unread': !email.read,
                            'email-selected': isEmailSelected(email.id),
                            'email-starred': email.starred
                          }"
                          @click="selectEmail(email)"
                        >
                          <div class="d-flex align-items-center p-3">
                            <div class="custom-control custom-checkbox mr-3">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                :id="'email-' + email.id"
                                :checked="isEmailSelected(email.id)"
                                @click.stop="toggleEmailSelection(email.id)"
                              />
                              <label class="custom-control-label" :for="'email-' + email.id"></label>
                            </div>
                            
                            <div class="email-star mr-3" @click.stop="toggleStar(email)">
                              <i class="feather" :class="email.starred ? 'icon-star text-warning' : 'icon-star'"></i>
                            </div>

                            <div class="email-avatar mr-3">
                              <img
                                :src="email.sender.avatar || `https://ui-avatars.com/api/?name=${email.sender.name}&background=7367f0&color=fff`"
                                :alt="email.sender.name"
                                class="rounded-circle"
                                width="40"
                              />
                            </div>

                            <div class="email-info flex-grow-1">
                              <div class="d-flex justify-content-between align-items-center mb-1">
                                <div class="email-sender">
                                  <h6 class="mb-0">{{ email.sender.name }}</h6>
                                  <small class="text-muted" v-if="currentFolder === 'sent'">To: {{ email.recipients.join(', ') }}</small>
                                </div>
                                <div class="email-time">
                                  <small class="text-muted">{{ formatEmailTime(email.timestamp) }}</small>
                                  <span v-if="email.hasAttachments" class="ml-2">
                                    <i class="feather icon-paperclip text-muted"></i>
                                  </span>
                                </div>
                              </div>
                              
                              <div class="d-flex justify-content-between align-items-center">
                                <div class="email-subject-preview">
                                  <h6 class="mb-0 email-subject">
                                    {{ email.subject }}
                                    <span v-if="email.labels.length > 0" class="ml-2">
                                      <span
                                        v-for="label in email.labels"
                                        :key="label.id"
                                        class="badge badge-sm mr-1"
                                        :style="{ backgroundColor: label.color, color: '#fff' }"
                                      >
                                        {{ label.name }}
                                      </span>
                                    </span>
                                  </h6>
                                  <p class="text-truncate text-muted mb-0 mt-1" style="max-width: 600px;">
                                    {{ email.preview }}
                                  </p>
                                </div>
                                <div class="email-actions ml-2">
                                  <button class="btn btn-sm btn-icon btn-outline-secondary" @click.stop="toggleRead(email)">
                                    <i class="feather" :class="email.read ? 'icon-eye-off' : 'icon-eye'"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Pagination -->
                      <div class="email-pagination p-3 border-top" v-if="filteredEmails.length > 0">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredEmails.length) }} to 
                            {{ Math.min(currentPage * itemsPerPage, filteredEmails.length) }} of {{ filteredEmails.length }} emails
                          </div>
                          <nav>
                            <ul class="pagination pagination-sm mb-0">
                              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <a class="page-link" href="#" @click.prevent="prevPage">
                                  <i class="feather icon-chevron-left"></i>
                                </a>
                              </li>
                              <li
                                class="page-item"
                                v-for="page in totalPages"
                                :key="page"
                                :class="{ active: currentPage === page }"
                              >
                                <a class="page-link" href="#" @click.prevent="goToPage(page)">
                                  {{ page }}
                                </a>
                              </li>
                              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <a class="page-link" href="#" @click.prevent="nextPage">
                                  <i class="feather icon-chevron-right"></i>
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>

                    <!-- Email Detail View -->
                    <div v-else-if="currentEmail && !isComposing" class="email-detail">
                      <!-- Email Detail Header -->
                      <div class="email-detail-header p-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-icon btn-outline-secondary mr-2" @click="currentEmail = null">
                              <i class="feather icon-arrow-left"></i>
                            </button>
                            <h5 class="mb-0">{{ currentEmail.subject }}</h5>
                          </div>
                          <div class="email-detail-actions">
                            <button class="btn btn-sm btn-icon btn-outline-secondary" @click="toggleStar(currentEmail)">
                              <i class="feather" :class="currentEmail.starred ? 'icon-star text-warning' : 'icon-star'"></i>
                            </button>
                            <button class="btn btn-sm btn-icon btn-outline-secondary ml-1" @click="replyEmail">
                              <i class="feather icon-corner-up-left"></i>
                            </button>
                            <button class="btn btn-sm btn-icon btn-outline-secondary ml-1" @click="forwardEmail">
                              <i class="feather icon-share"></i>
                            </button>
                            <button class="btn btn-sm btn-icon btn-outline-secondary ml-1" @click="deleteEmail(currentEmail)">
                              <i class="feather icon-trash"></i>
                            </button>
                          </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">
                            <div class="email-avatar mr-3">
                              <img
                                :src="currentEmail.sender.avatar || `https://ui-avatars.com/api/?name=${currentEmail.sender.name}&background=7367f0&color=fff`"
                                :alt="currentEmail.sender.name"
                                class="rounded-circle"
                                width="48"
                              />
                            </div>
                            <div>
                              <h6 class="mb-0">{{ currentEmail.sender.name }}</h6>
                              <small class="text-muted">
                                {{ currentFolder === 'sent' ? 'To: ' + currentEmail.recipients.join(', ') : 'From: ' + currentEmail.sender.email }}
                              </small>
                            </div>
                          </div>
                          <div class="text-right">
                            <small class="text-muted">{{ formatDetailedTime(currentEmail.timestamp) }}</small>
                            <div class="email-labels mt-1">
                              <span
                                v-for="label in currentEmail.labels"
                                :key="label.id"
                                class="badge badge-sm mr-1"
                                :style="{ backgroundColor: label.color, color: '#fff' }"
                              >
                                {{ label.name }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Email Body -->
                      <div class="email-body p-3">
                        <div v-html="currentEmail.body"></div>
                        
                        <!-- Attachments -->
                        <div v-if="currentEmail.attachments.length > 0" class="email-attachments mt-4 pt-3 border-top">
                          <h6 class="mb-3">
                            <i class="feather icon-paperclip mr-2"></i>
                            Attachments ({{ currentEmail.attachments.length }})
                          </h6>
                          <div class="row">
                            <div
                              v-for="attachment in currentEmail.attachments"
                              :key="attachment.id"
                              class="col-md-4 col-sm-6 mb-3"
                            >
                              <div class="attachment-card p-2 border rounded">
                                <div class="d-flex align-items-center">
                                  <div class="attachment-icon mr-2">
                                    <i class="feather" :class="getFileIcon(attachment.type)"></i>
                                  </div>
                                  <div class="attachment-info flex-grow-1">
                                    <small class="d-block text-truncate font-weight-bold">{{ attachment.name }}</small>
                                    <small class="text-muted">{{ formatFileSize(attachment.size) }}</small>
                                  </div>
                                  <button class="btn btn-sm btn-icon btn-outline-secondary" @click="downloadAttachment(attachment)">
                                    <i class="feather icon-download"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Email Reply -->
                      <div class="email-reply p-3 border-top">
                        <div class="d-flex align-items-center mb-3">
                          <button class="btn btn-sm btn-outline-primary mr-2" @click="replyEmail">
                            <i class="feather icon-corner-up-left mr-1"></i> Reply
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" @click="forwardEmail">
                            <i class="feather icon-share mr-1"></i> Forward
                          </button>
                        </div>
                        <div class="form-group">
                          <textarea
                            class="form-control"
                            rows="3"
                            placeholder="Write a reply..."
                            v-model="replyMessage"
                          ></textarea>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-icon btn-outline-secondary mr-2">
                              <i class="feather icon-paperclip"></i>
                            </button>
                            <button class="btn btn-sm btn-icon btn-outline-secondary">
                              <i class="feather icon-smile"></i>
                            </button>
                          </div>
                          <button class="btn btn-primary" @click="sendReply" :disabled="!replyMessage.trim()">
                            <i class="feather icon-send mr-1"></i> Send
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Compose Email View -->
                    <div v-else-if="isComposing" class="email-compose">
                      <div class="email-compose-header p-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-center">
                          <h5 class="mb-0">New Message</h5>
                          <div>
                            <button class="btn btn-sm btn-icon btn-outline-secondary" @click="saveDraft" title="Save Draft">
                              <i class="feather icon-save"></i>
                            </button>
                            <button class="btn btn-sm btn-icon btn-outline-secondary ml-1" @click="cancelCompose" title="Cancel">
                              <i class="feather icon-x"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="email-compose-body p-3">
                        <div class="form-group">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text bg-transparent border-0">To</span>
                            </div>
                            <input
                              type="text"
                              class="form-control border-0"
                              placeholder="Recipients"
                              v-model="newEmail.recipients"
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text bg-transparent border-0">Cc</span>
                            </div>
                            <input
                              type="text"
                              class="form-control border-0"
                              placeholder="Carbon copy"
                              v-model="newEmail.cc"
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text bg-transparent border-0">Subject</span>
                            </div>
                            <input
                              type="text"
                              class="form-control border-0"
                              placeholder="Subject"
                              v-model="newEmail.subject"
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="compose-editor border rounded p-2">
                            <textarea
                              class="form-control border-0"
                              rows="12"
                              placeholder="Write your message here..."
                              v-model="newEmail.body"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <div class="email-compose-footer p-3 border-top">
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-icon btn-outline-secondary mr-2">
                              <i class="feather icon-paperclip"></i>
                            </button>
                            <button class="btn btn-sm btn-icon btn-outline-secondary">
                              <i class="feather icon-smile"></i>
                            </button>
                          </div>
                          <div>
                            <button class="btn btn-secondary mr-2" @click="saveDraft">
                              Save Draft
                            </button>
                            <button class="btn btn-primary" @click="sendEmail" :disabled="!canSendEmail">
                              <i class="feather icon-send mr-1"></i> Send
                            </button>
                          </div>
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
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Email'
})

interface EmailSender {
  id: number
  name: string
  email: string
  avatar?: string
}

interface EmailLabel {
  id: number
  name: string
  color: string
  count: number
}

interface EmailAttachment {
  id: number
  name: string
  type: string
  size: number
  url: string
}

interface Email {
  id: number
  sender: EmailSender
  recipients: string[]
  subject: string
  preview: string
  body: string
  timestamp: string
  read: boolean
  starred: boolean
  folder: string
  labels: EmailLabel[]
  attachments: EmailAttachment[]
  hasAttachments: boolean
}

// State
const emails = ref<Email[]>([
  {
    id: 1,
    sender: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=7367f0&color=fff'
    },
    recipients: ['me@example.com'],
    subject: 'Meeting Tomorrow at 2 PM',
    preview: 'Hi, just confirming our meeting tomorrow at 2 PM. Please bring the project documents...',
    body: '<p>Hi Team,</p><p>Just confirming our meeting tomorrow at 2 PM in Conference Room B.</p><p>Please bring the project documents we discussed last week.</p><p>Best regards,<br>John</p>',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    starred: true,
    folder: 'inbox',
    labels: [{ id: 1, name: 'Work', color: '#7367f0', count: 12 }],
    attachments: [
      { id: 1, name: 'project_docs.pdf', type: 'pdf', size: 2048576, url: '#' }
    ],
    hasAttachments: true
  },
  {
    id: 2,
    sender: {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@company.com'
    },
    recipients: ['me@example.com'],
    subject: 'Welcome to the Team!',
    preview: 'Welcome aboard! We\'re excited to have you join our team. Here are some resources to get started...',
    body: '<p>Welcome aboard!</p><p>We\'re excited to have you join our team. Here are some resources to get started:</p><ul><li>Company Handbook</li><li>Project Guidelines</li><li>Team Directory</li></ul><p>Please let me know if you have any questions.</p><p>Best,<br>Sarah</p>',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: [{ id: 2, name: 'Important', color: '#ff9f43', count: 8 }],
    attachments: [],
    hasAttachments: false
  },
  {
    id: 3,
    sender: {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex@techcorp.com'
    },
    recipients: ['me@example.com'],
    subject: 'Project Update & Timeline',
    preview: 'Here\'s the latest update on the project timeline. We\'re slightly ahead of schedule...',
    body: '<p>Hi,</p><p>Here\'s the latest update on the project timeline. We\'re slightly ahead of schedule, which is great news!</p><p>Attached you\'ll find the updated Gantt chart and progress report.</p><p>Regards,<br>Alex</p>',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    starred: true,
    folder: 'inbox',
    labels: [
      { id: 1, name: 'Work', color: '#7367f0', count: 12 },
      { id: 3, name: 'Project', color: '#28c76f', count: 5 }
    ],
    attachments: [
      { id: 1, name: 'gantt_chart.xlsx', type: 'excel', size: 5123456, url: '#' },
      { id: 2, name: 'progress_report.pdf', type: 'pdf', size: 1048576, url: '#' }
    ],
    hasAttachments: true
  },
  {
    id: 4,
    sender: {
      id: 4,
      name: 'Marketing Team',
      email: 'marketing@company.com'
    },
    recipients: ['me@example.com'],
    subject: 'Weekly Newsletter - Latest Updates',
    preview: 'Check out our latest newsletter with company updates, upcoming events, and team highlights...',
    body: '<h3>Weekly Newsletter</h3><p>Check out all the latest updates from our company!</p>',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: [],
    attachments: [],
    hasAttachments: false
  },
  {
    id: 5,
    sender: {
      id: 5,
      name: 'Mike Brown',
      email: 'mike@partner.com'
    },
    recipients: ['me@example.com'],
    subject: 'Collaboration Opportunity',
    preview: 'I wanted to discuss a potential collaboration opportunity between our companies...',
    body: '<p>Hello,</p><p>I wanted to discuss a potential collaboration opportunity between our companies.</p><p>Let me know when you might be available for a quick call next week.</p><p>Best,<br>Mike</p>',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    read: false,
    starred: false,
    folder: 'inbox',
    labels: [{ id: 4, name: 'Opportunity', color: '#ea5455', count: 3 }],
    attachments: [],
    hasAttachments: false
  }
])

const currentEmail = ref<Email | null>(null)
const currentFolder = ref('inbox')
const emailSearch = ref('')
const viewMode = ref('list') // 'list' or 'grid'
const selectedEmails = ref<number[]>([])
const isComposing = ref(false)
const replyMessage = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const newEmail = ref({
  recipients: '',
  cc: '',
  subject: '',
  body: ''
})

// Computed properties
const filteredEmails = computed(() => {
  let filtered = emails.value.filter(email => email.folder === currentFolder.value)
  
  if (emailSearch.value) {
    const search = emailSearch.value.toLowerCase()
    filtered = filtered.filter(email =>
      email.subject.toLowerCase().includes(search) ||
      email.sender.name.toLowerCase().includes(search) ||
      email.sender.email.toLowerCase().includes(search) ||
      email.preview.toLowerCase().includes(search) ||
      email.body.toLowerCase().includes(search)
    )
  }
  
  // Sort by timestamp (newest first)
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const paginatedEmails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEmails.value.slice(start, end)
})

const unreadCount = computed(() => {
  return emails.value.filter(email => email.folder === 'inbox' && !email.read).length
})

const draftCount = computed(() => {
  return emails.value.filter(email => email.folder === 'drafts').length
})

const spamCount = computed(() => {
  return emails.value.filter(email => email.folder === 'spam').length
})

const allSelected = computed(() => {
  return selectedEmails.value.length > 0 && 
         selectedEmails.value.length === filteredEmails.value.length
})

const totalPages = computed(() => {
  return Math.ceil(filteredEmails.value.length / itemsPerPage.value)
})

const canSendEmail = computed(() => {
  return newEmail.value.recipients.trim() && 
         newEmail.value.subject.trim() && 
         newEmail.value.body.trim()
})

// Methods
function formatEmailTime(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diff < 604800000) return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatDetailedTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(fileType: string) {
  const icons: Record<string, string> = {
    pdf: 'icon-file-text',
    doc: 'icon-file-text',
    docx: 'icon-file-text',
    xls: 'icon-file',
    xlsx: 'icon-file',
    ppt: 'icon-slides',
    pptx: 'icon-slides',
    jpg: 'icon-image',
    jpeg: 'icon-image',
    png: 'icon-image',
    gif: 'icon-image',
    zip: 'icon-archive',
    rar: 'icon-archive',
    txt: 'icon-file-text'
  }
  
  return icons[fileType.toLowerCase()] || 'icon-file'
}

function switchFolder(folder: string) {
  currentFolder.value = folder
  currentEmail.value = null
  selectedEmails.value = []
  currentPage.value = 1
}

function selectEmail(email: Email) {
  currentEmail.value = email
  if (!email.read) {
    email.read = true
  }
}

function toggleStar(email: Email) {
  email.starred = !email.starred
}

function toggleRead(email: Email) {
  email.read = !email.read
}

function toggleEmailSelection(emailId: number) {
  const index = selectedEmails.value.indexOf(emailId)
  if (index > -1) {
    selectedEmails.value.splice(index, 1)
  } else {
    selectedEmails.value.push(emailId)
  }
}

function isEmailSelected(emailId: number) {
  return selectedEmails.value.includes(emailId)
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedEmails.value = []
  } else {
    selectedEmails.value = filteredEmails.value.map(email => email.id)
  }
}

function deleteEmails() {
  emails.value = emails.value.filter(email => !selectedEmails.value.includes(email.id))
  selectedEmails.value = []
}

function deleteEmail(email: Email) {
  email.folder = 'trash'
  currentEmail.value = null
}

function markAsSpam() {
  selectedEmails.value.forEach(emailId => {
    const email = emails.value.find(e => e.id === emailId)
    if (email) {
      email.folder = 'spam'
    }
  })
  selectedEmails.value = []
}

function composeEmail() {
  isComposing.value = true
  currentEmail.value = null
  newEmail.value = {
    recipients: '',
    cc: '',
    subject: '',
    body: ''
  }
}

function cancelCompose() {
  isComposing.value = false
}

function saveDraft() {
  const draft: Email = {
    id: emails.value.length + 1,
    sender: {
      id: 0, // Current user
      name: 'Me',
      email: 'me@example.com'
    },
    recipients: newEmail.value.recipients.split(',').map(r => r.trim()),
    subject: newEmail.value.subject || '(No Subject)',
    preview: newEmail.value.body.substring(0, 100),
    body: newEmail.value.body,
    timestamp: new Date().toISOString(),
    read: true,
    starred: false,
    folder: 'drafts',
    labels: [],
    attachments: [],
    hasAttachments: false
  }
  
  emails.value.unshift(draft)
  isComposing.value = false
  switchFolder('drafts')
}

function sendEmail() {
  const sentEmail: Email = {
    id: emails.value.length + 1,
    sender: {
      id: 0,
      name: 'Me',
      email: 'me@example.com'
    },
    recipients: newEmail.value.recipients.split(',').map(r => r.trim()),
    subject: newEmail.value.subject,
    preview: newEmail.value.body.substring(0, 100),
    body: newEmail.value.body,
    timestamp: new Date().toISOString(),
    read: true,
    starred: false,
    folder: 'sent',
    labels: [],
    attachments: [],
    hasAttachments: false
  }
  
  emails.value.unshift(sentEmail)
  isComposing.value = false
  switchFolder('sent')
}

function refreshEmails() {
  // Simulate refreshing emails
  currentPage.value = 1
  selectedEmails.value = []
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

function replyEmail() {
  if (currentEmail.value) {
    isComposing.value = true
    newEmail.value = {
      recipients: currentEmail.value.sender.email,
      cc: '',
      subject: `Re: ${currentEmail.value.subject}`,
      body: `\n\n---\nOn ${formatDetailedTime(currentEmail.value.timestamp)}, ${currentEmail.value.sender.name} wrote:\n> ${currentEmail.value.body.replace(/\n/g, '\n> ')}`
    }
  }
}

function forwardEmail() {
  if (currentEmail.value) {
    isComposing.value = true
    newEmail.value = {
      recipients: '',
      cc: '',
      subject: `Fwd: ${currentEmail.value.subject}`,
      body: `\n\n--- Forwarded message ---\nFrom: ${currentEmail.value.sender.name} <${currentEmail.value.sender.email}>\nDate: ${formatDetailedTime(currentEmail.value.timestamp)}\nSubject: ${currentEmail.value.subject}\n\n${currentEmail.value.body}`
    }
  }
}

function sendReply() {
  if (currentEmail.value && replyMessage.value.trim()) {
    const reply: Email = {
      id: emails.value.length + 1,
      sender: {
        id: 0,
        name: 'Me',
        email: 'me@example.com'
      },
      recipients: [currentEmail.value.sender.email],
      subject: `Re: ${currentEmail.value.subject}`,
      preview: replyMessage.value.substring(0, 100),
      body: replyMessage.value,
      timestamp: new Date().toISOString(),
      read: true,
      starred: false,
      folder: 'sent',
      labels: [],
      attachments: [],
      hasAttachments: false
    }
    
    emails.value.unshift(reply)
    replyMessage.value = ''
    switchFolder('sent')
  }
}

function downloadAttachment(attachment: EmailAttachment) {
  // Simulate download
  console.log('Downloading:', attachment.name)
  // In a real app, you would trigger a download
  // window.open(attachment.url, '_blank')
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Initialize
onMounted(() => {
  // Load emails from localStorage
  const savedEmails = localStorage.getItem('emails')
  if (savedEmails) {
    try {
      emails.value = JSON.parse(savedEmails)
    } catch (e) {
      console.error('Error loading emails from localStorage:', e)
    }
  }
})

// Watch emails for changes and save to localStorage
watch(emails, (newEmails) => {
  try {
    localStorage.setItem('emails', JSON.stringify(newEmails))
  } catch (e) {
    console.error('Error saving emails to localStorage:', e)
  }
}, { deep: true })
</script>

<style scoped>
.email-app {
  padding: 20px 0;
  height: calc(100vh - 70px);
}

.email-folders .nav-link {
  color: #6c757d;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.email-folders .nav-link:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.email-folders .nav-link.active {
  background-color: #f0f2fe;
  color: #7367f0;
  font-weight: 500;
}

.email-folders .nav-link.active i {
  color: #7367f0;
}

.email-list-wrapper {
  max-height: 600px;
  overflow-y: auto;
}

.email-list-item {
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.email-list-item:hover {
  background-color: #f8f9fa;
}

.email-list-item.email-unread {
  background-color: #f8fbff;
}

.email-list-item.email-unread .email-subject {
  font-weight: 600;
}

.email-list-item.email-selected {
  background-color: #f0f2fe;
}

.email-list-item.email-starred .email-star i {
  color: #ff9f43;
}

.email-avatar img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.email-subject-preview {
  flex: 1;
  min-width: 0;
}

.email-subject {
  font-size: 0.95rem;
}

.email-time {
  white-space: nowrap;
}

.email-detail {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.email-detail-header {
  background-color: #f8f9fa;
}

.email-body {
  flex: 1;
  overflow-y: auto;
}

.email-compose {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.email-compose-body {
  flex: 1;
  overflow-y: auto;
}

.compose-editor {
  min-height: 300px;
}

.compose-editor textarea {
  resize: none;
  border: none;
  outline: none;
  box-shadow: none;
}

.attachment-card {
  transition: all 0.2s;
}

.attachment-card:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.attachment-icon i {
  font-size: 24px;
  color: #6c757d;
}

.email-pagination {
  background-color: #f8f9fa;
}

.email-welcome {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Scrollbar styling */
.email-list-wrapper::-webkit-scrollbar,
.email-body::-webkit-scrollbar,
.email-compose-body::-webkit-scrollbar {
  width: 6px;
}

.email-list-wrapper::-webkit-scrollbar-track,
.email-body::-webkit-scrollbar-track,
.email-compose-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.email-list-wrapper::-webkit-scrollbar-thumb,
.email-body::-webkit-scrollbar-thumb,
.email-compose-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.email-list-wrapper::-webkit-scrollbar-thumb:hover,
.email-body::-webkit-scrollbar-thumb:hover,
.email-compose-body::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive design */
@media (max-width: 768px) {
  .email-app {
    height: auto;
  }
  
  .email-detail,
  .email-compose {
    height: 500px;
  }
  
  .email-subject-preview {
    max-width: 200px;
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
}

.badge-primary {
  background-color: #7367f0;
}

.badge-info {
  background-color: #00cfe8;
}

.badge-danger {
  background-color: #ea5455;
}

.badge-warning {
  background-color: #ff9f43;
}

.badge-success {
  background-color: #28c76f;
}

.badge-secondary {
  background-color: #6c757d;
}
</style>