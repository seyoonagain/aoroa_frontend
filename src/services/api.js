import { ref } from 'vue'

import { issues } from '../data/mockData'

export const useIssues = () => {
  const issuesList = ref([])

  const fetchIssues = async () => {
    if (import.meta.env.VITE_MODE === 'DEV') {
      issuesList.value = issues
    } else if (import.meta.env.VITE_MODE === 'PROD') {
      try {
        const response = await fetch('http://localhost:8080/api/issues')
        if (response.ok) {
          issuesList.value = await response.json()
        } else {
          console.error('API 호출 오류:', response.statusText)
        }
      } catch (error) {
        console.error('API 요청 실패:', error)
      }
    }
  }

  return {
    issuesList,
    fetchIssues,
  }
}
