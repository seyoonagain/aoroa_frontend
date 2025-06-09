<template>
  <div>
    <h1>{{ formTitle }}</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="title">제목</label>
        <input
          v-model="issue.title"
          type="text"
          id="title"
          placeholder="제목을 입력하세요"
          required
        />
      </div>
      <div>
        <label for="description">설명</label>
        <textarea
          v-model="issue.description"
          id="description"
          placeholder="설명을 입력하세요"
          required
        ></textarea>
      </div>

      <div>
        <label for="status">상태</label>
        <select v-model="issue.status" id="status" :disabled="isStatusDisabled">
          <option value="PENDING">대기</option>
          <option value="IN_PROGRESS">진행 중</option>
          <option value="COMPLETED">완료</option>
          <option value="CANCELLED">취소</option>
        </select>
      </div>

      <div>
        <label for="assignee">담당자</label>
        <select v-model="issue.assignee" id="assignee" :disabled="isAssigneeDisabled">
          <option value="김개발">김개발</option>
          <option value="이디자인">이디자인</option>
          <option value="박기획">박기획</option>
        </select>
      </div>

      <div>
        <button type="submit">{{ isEditing ? '수정하기' : '저장하기' }}</button>
        <router-link to="/issues">목록으로 돌아가기</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { issues } from '../data/mockData'

export default {
  name: 'IssueForm',

  setup() {
    const router = useRouter()
    const route = useRoute()

    const issuesList = ref(issues)

    const issue = ref({
      title: '',
      description: '',
      status: '',
      assignee: '',
      createdAt: '',
    })

    const isEditing = ref(false)
    const formTitle = ref('이슈 생성')

    onMounted(() => {
      if (route.params.id) {
        isEditing.value = true
        formTitle.value = '이슈 수정'

        const issueId = parseInt(route.params.id)

        const issueData = issuesList.value.find((issue) => issue.id === issueId)

        if (issueData) {
          issue.value = { ...issueData }
        }
      }
    })

    const handleSubmit = () => {
      const currentDate = new Date().toISOString()

      if (isEditing.value) {
        const index = issuesList.value.findIndex((item) => item.id === issue.value.id)
        if (index !== -1) {
          issuesList.value[index] = { ...issue.value }
        }
      } else {
        const newIssue = {
          id: issuesList.value.length + 1,
          ...issue.value,
          createdAt: currentDate,
        }
        issuesList.value.push(newIssue)
      }

      router.push('/issues')
    }

    const isStatusDisabled = computed(() => {
      return (
        issue.value.assignee === null ||
        issue.value.status === 'COMPLETED' ||
        issue.value.status === 'CANCELLED'
      )
    })

    const isAssigneeDisabled = computed(() => {
      return issue.value.status === 'COMPLETED' || issue.value.status === 'CANCELLED'
    })

    return {
      issue,
      formTitle,
      isEditing,
      handleSubmit,
      isStatusDisabled,
      isAssigneeDisabled,
    }
  },
}
</script>
