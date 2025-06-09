<template>
  <div class="issues-create-edit-detail flex">
    <h1>{{ isEditing ? '이슈 수정' : isDetailMode ? '이슈 상세' : '이슈 생성' }}</h1>

    <!-- 상세 보기 모드 -->
    <div v-if="isDetailMode && !isEditing" class="issue-detail flex">
      <h2>{{ issue.title }}</h2>
      <p><strong>설명:</strong> {{ issue.description }}</p>
      <p><strong>상태:</strong> {{ issue.status }}</p>
      <p><strong>담당자:</strong> {{ issue.user?.name || '없음' }}</p>
      <p><strong>생성일:</strong> {{ formatDate(issue.createdAt) }}</p>

      <div class="form-bottom flex">
        <button @click="isEditing = true">수정하기</button>
        <router-link to="/issues">목록으로 돌아가기</router-link>
      </div>
    </div>

    <!-- 생성/수정 폼 -->
    <form v-else @submit.prevent="handleSubmit" class="flex">
      <div class="input-container flex">
        <label for="title">제목</label>
        <input v-model="issue.title" type="text" id="title" required />
      </div>

      <div class="input-container flex">
        <label for="description">설명</label>
        <textarea v-model="issue.description" id="description" required></textarea>
      </div>

      <div class="input-container flex">
        <label for="status">상태</label>
        <select v-model="issue.status" id="status">
          <option value="PENDING">대기</option>
          <option value="IN_PROGRESS" :disabled="!issue.user">진행 중</option>
          <option value="COMPLETED" :disabled="!issue.user">완료</option>
          <option value="CANCELLED" :disabled="!issue.user">취소</option>
        </select>
      </div>

      <div class="input-container flex">
        <label for="assignee">담당자</label>
        <select v-model="issue.user" id="assignee" :disabled="isAssigneeDisabled">
          <option :value="{ id: 1, name: '김개발' }">김개발</option>
          <option :value="{ id: 2, name: '이디자인' }">이디자인</option>
          <option :value="{ id: 3, name: '박기획' }">박기획</option>
        </select>
      </div>

      <div class="form-bottom flex">
        <button type="submit">{{ isDetailMode ? '수정 완료' : '저장하기' }}</button>
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
      user: null,
    })

    const isEditing = ref(false)
    const isDetailMode = ref(false)

    onMounted(() => {
      if (route.params.id) {
        isDetailMode.value = true
        const issueId = parseInt(route.params.id)
        const issueData = issuesList.value.find((i) => i.id === issueId)
        if (issueData) {
          issue.value = {
            ...issueData,
            user: issueData.user || null,
          }
        }
      }
    })

    const handleSubmit = () => {
      const now = new Date().toISOString()

      const updatedIssue = {
        ...issue.value,
        updatedAt: now,
      }

      if (isDetailMode.value) {
        const index = issuesList.value.findIndex((item) => item.id === parseInt(route.params.id))
        if (index !== -1) {
          issuesList.value[index] = {
            ...issuesList.value[index],
            ...updatedIssue,
          }
        }
      } else {
        const newIssue = {
          id: issuesList.value.length + 1,
          ...updatedIssue,
          createdAt: now,
        }
        issuesList.value.push(newIssue)
      }

      router.push('/issues')
    }

    const isStatusDisabled = computed(() => {
      return (
        !issue.value.user ||
        issue.value.status === 'COMPLETED' ||
        issue.value.status === 'CANCELLED'
      )
    })

    const isAssigneeDisabled = computed(() => {
      return issue.value.status === 'COMPLETED' || issue.value.status === 'CANCELLED'
    })

    const formatDate = (isoString) => {
      return new Date(isoString).toLocaleString('ko-KR')
    }

    return {
      issue,
      isEditing,
      isDetailMode,
      handleSubmit,
      isStatusDisabled,
      isAssigneeDisabled,
      formatDate,
    }
  },
}
</script>
