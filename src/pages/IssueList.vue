<template>
  <div>
    <h1>이슈 목록</h1>
    <button @click="createIssue">새 이슈 만들기</button>
    <ul>
      <li v-for="issue in issuesList" :key="issue.id" class="issue">
        <router-link :to="`/issues/${issue.id}`">
          <h2>
            {{ issue.title }}
          </h2>
        </router-link>
        <p>{{ issue.status }}</p>
        <p>{{ issue.user?.name }}</p>
        <p>{{ issue.createdAt }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIssues } from '../services/api'

export default {
  name: 'IssueList',

  setup() {
    const router = useRouter()
    const { issuesList, fetchIssues } = useIssues()

    onMounted(() => {
      fetchIssues()
    })

    const createIssue = () => {
      router.push('/issues/new')
    }

    return {
      issuesList,
      createIssue,
    }
  },
}
</script>
