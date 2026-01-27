import { ref } from 'vue'

export interface MemberCounts {
  pending: number
  approved: number
  suspended: number
  deactivate: number
  total: number
}

export function useMemberCounts() {
  const counts = ref<MemberCounts>({
    pending: 0,
    approved: 0,
    suspended: 0,
    deactivate: 0,
    total: 0
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch counts from API
  const fetchCounts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/members/counts')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch counts: ${response.status}`)
      }
      
      const data = await response.json()
      counts.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load counts'
      console.error('Error fetching member counts:', err)
    } finally {
      loading.value = false
    }
  }

  // Format number to "1.2M" style
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }

  return {
    // State
    counts,
    loading,
    error,
    
    // Methods
    fetchCounts,
    formatCount
  }
}