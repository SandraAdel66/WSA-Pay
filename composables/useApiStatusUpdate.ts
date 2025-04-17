export const useApiStatusUpdate = () => {
    const loading = ref(false)
    const error = ref(null)
    const success = ref(false)
  
    const updateStatus = async ({
      api,
      id,
      status
    }: {
      api: string
      id: string | number
      status: boolean
    }) => {
      loading.value = true
      error.value = null
      success.value = false
  
      try {
        const response = await useApiFetch(`/api/${api}/${id}/active`, {
          method: 'PUT',
          body: { active: status } // <- ✅ HERE
        })
  
        success.value = true
        return response
      } catch (err: any) {
        error.value = err?.data || err.message || 'Failed to update status'
      } finally {
        loading.value = false
      }
    }
  
    return {
      updateStatus,
      loading,
      error,
      success
    }
  }
  