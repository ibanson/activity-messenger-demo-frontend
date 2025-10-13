<template>
  <div>
    <TitleHtml title="Tasks boards" />

    <div class="wrapper">

      <div v-if="loading">Chargement...</div>
      <ul v-else>
        <BoardCard v-for="board in boards"
          :key="board.id"
          :board="board"
          @toggle-task-completed="toggleTaskCompleted"
          @remove-board-task="removeBoardTask"
          @update-board-task="updateBoardTask"
          @remove-board="removeBoard"
        >
        </BoardCard>
      </ul>
    </div>

  </div>
</template>

<script>
import BoardCard from '@/components/html/BoardCard.vue';
import TitleHtml from '@/components/html/TitleHtml.vue';
import boardService from '@/services/boardService';

export default {
  name: 'TaskBoardsView',
  components: {
    TitleHtml,
    BoardCard
  },
  data() {
    return {
      boards: [],
      loading: true
    }
  },
  async created() {
    try {
      this.boards = await this.fetchBoards();
    } catch (error) {
      console.error('Erreur API:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchBoards() {
       try {
          const { data } = await boardService.getBoards();
          return data.data;
        } catch (error) {
          console.error('Erreur API:', error);
        } finally {
          this.loading = false;
        }
    },
    async toggleTaskCompleted(board, task) {

      task.completed = !task.completed;

      try {
        await boardService.toggleTaskCompleted(board.id, task.id, task.completed);
      } catch (e) {
        // Rollback if it goes wrong
        task.completed = !task.completed;
      }
    },
    async updateBoardTask(board, task, payload) {
      try {
        await boardService.updateTask(board.id, task.id, payload); // Call API
        Object.assign(task, payload); // Then Local update to reflect changes
      } catch (error) {
         console.error('Erreur API:', error);
      }
    },
    async removeBoardTask(board, task) {
      try {
        await boardService.deleteTask(board.id, task.id); // Call API
        board.tasks = board.tasks.filter(t => t.id !== task.id); // Then Local update to reflect changes
      } catch (error) {
         console.error('Erreur API:', error);
      }
    },
    async removeBoard(board) {
      try {
        await boardService.deleteBoard(board.id); // Call API
        this.boards = this.boards.filter(b => b.id !== board.id); // Then Local update to reflect changes
      } catch (error) {
         console.error('Erreur API:', error);
      }
    }
  }
}
</script>