<template>
  <div>
    <TitleHtml title="Liste des tâches" />

    <div class="wrapper">

      <div v-if="loading">Chargement...</div>
      <ul v-else>
        <BoardCard v-for="board in boards"
          :key="board.id"
          :board="board"
          @remove-board="removeBoard"
          @update-board="updateBoard"
          @toggle-task-completed="toggleTaskCompleted"
          @remove-board-task="removeBoardTask"
          @update-board-task="updateBoardTask"
          @create-board-task="createBoardTask"
        >
        </BoardCard>
      </ul>

      <div class="flex justify-center mt-8">
        <button
          class="bg-gray-600 hover:bg-gray-700 text-white text-xl px-8 py-4 rounded-2xl  transition"
          @click="createBoard"
        >
          Créer un groupe de tâches
        </button>
      </div>

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
    async createBoard() {
      try {
      const response = await boardService.createBoard({
        title: "Nouvelle liste de tâches"
      }); // Call API

      if (!('tasks' in response.data.data)) {
        response.data.data.tasks = [];
      }

      this.boards.push(response.data.data);  // Then Local update to reflect changes

      } catch (error) {
         console.error('Erreur API:', error);
      }
    },
    async updateBoard(board, payload) {
      try {
        await boardService.updateBoard(board.id, payload); // Call API
        Object.assign(board, payload); // Then Local update to reflect changes
      } catch (error) {
         console.error('Erreur API:', error);
      }
    },
    async createBoardTask(board, payload) {
      try {
        const response = await boardService.createTask(board.id, payload); // Call API
        board.tasks.push(response.data.data); // Then Local update to reflect changes
      } catch (error) {
         console.error('Erreur API:', error);
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