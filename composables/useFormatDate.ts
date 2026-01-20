export const useFormatDate = () => {
    const formatDate = (date: any) => {
      if (!date) return '—'
  
      // Fix extra microseconds (.000000Z → .000Z)
      const safeDate = typeof date === 'string'
        ? date.replace(/(\.\d{3})\d+Z$/, '$1Z')
        : date
  
      const parsedDate = new Date(safeDate)
  
      if (isNaN(parsedDate.getTime())) return 'Invalid date'
  
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(parsedDate)
    }
  
    return {
      formatDate,
    }
  }
  