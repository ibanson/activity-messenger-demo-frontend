<template>
    <div class="bg-white shadow rounded-xl p-6 mb-12">

      <!-- Board Title wrapper -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-indigo-600">{{ board.title }}</h2>
        <!-- Board commands -->
        <div class="flex">
          <label :for="'checkbox-all-checked-' + board.id" class="flex items-center cursor-pointer gap-2 select-none">
              <input
                type="checkbox"
                :id="'checkbox-all-checked-' + board.id"
                :checked="checkBoardAllTasksCompleted()"
                @change="markBoardAllTasksCompleted($event)"
                class="form-checkbox h-5 w-5 transition"
              >
              <span>Marquer toutes comme résolues</span>
          </label>
          <!-- Board cannot be deleted if we have some incomplete tasks remaining -->
          <button
            @click="deleteBoard"
              :disabled="!checkBoardAllTasksCompleted()"
              :class="[
                'text-sm px-3 py-2 rounded transition ml-4',
                !checkBoardAllTasksCompleted()
                  ? 'bg-red-200 text-red-400 hover:bg-red-200 cursor-not-allowed'
                  : 'bg-red-600 text-white'
              ]"
          >
            Supprimer le board
          </button>
        </div>

      </div>

      <!-- Board Tasks -->
      <ul>

        <!-- Task Element -->
        <li
          v-for="task in board.tasks"
          :key="task.id"
          class="flex justify-between items-center border-b border-gray-100 py-2 relative"
        >

          <!-- Task checkbox + title -->
          <div class="flex items-center gap-2">

            <template v-if="editingTaskId === task.id">
              <input
                type="text"
                v-model="editingTaskValue"
                @blur="updateTask(task, $event)"
                @keyup.enter="updateTask(task, $event)"
                @keyup.esc="cancelEditTask"
                class="border px-2 py-1 rounded w-full"
                ref="editInput"
              >
              <button
                @click="updateTask(task, $event)"
                class="flex items-center justify-center text-sm px-2"
              >
              Valider
              </button>
              <button
                @click="cancelEditTask()"
                class="flex items-center justify-center text-sm text-red-500 px-2"
              >
              Annuler
              </button>
            </template>
            <template v-else>
              <!-- Std mode -->
              <label :for="'checkbox-task-' + task.id" class="flex items-center cursor-pointer gap-2 select-none">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  :id="'checkbox-task-' + task.id"
                  @change="toggleTaskCompleted(task)"
                  class="form-checkbox h-5 w-5 transition"
                >
                <span :class="{ 'line-through text-gray-400': task.completed }">{{ task.title }}</span>
              </label>
            </template>



          </div>

          <!-- Task commands -->
          <div class="flex items-center gap-2">
            <!-- Contextual menu -->
            <div class="task-menu relative">
              <button
                @click="toggleTaskMenu(task)"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span class="text-2xl font-bold text-gray-500">⋮</span>
              </button>
              <div
                v-if="taskMenuOpened === task.id"
                class="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10"
              >
                <button @click="editTask(task)" class="block w-full text-sm text-left px-4 py-2 text-body hover:bg-gray-100">Éditer</button>
                <button @click="deleteTask(task)" class="block w-full text-sm text-left px-4 py-2 text-red-600 hover:bg-gray-100">Supprimer</button>
              </div>
            </div>

          </div>

        </li>

      </ul>
  </div>

</template>

<script>



export default {
  data() {
    return {
      boards: [],
      taskMenuOpened: null,
      editingTaskId: null,
      editingTaskValue: null,
      canDeleteBoard: false,
    };
  },
  name: 'BoardCard',
  props: {
    board: { type: Object, required: true }
  },
  methods: {
    /* Toggle logic for contextual menu */
    toggleTaskMenu(task) {
      this.taskMenuOpened = (this.taskMenuOpened === task.id) ? null : task.id;
    },
    /* Toggle task completed (true/false) */
    toggleTaskCompleted(task) {
      this.$emit('toggle-task-completed', this.board, task);
    },
    /* Mark all board tasks as completed (true/false) */
    markBoardAllTasksCompleted(event){
      const checked = event.target.checked;
      this.board.tasks.forEach(task => {task.completed = checked});
    },
    /* Check if board tasks are completed */
    checkBoardAllTasksCompleted() {
      return this.board.tasks.every(task => task.completed);
    },
    /* Close tasks contextual menu if click outside */
    handleClickOutside(e) {
      const menus = this.$el.querySelectorAll('.task-menu');

      let clickedMenu = false;
      menus.forEach((menu) => {
        if (menu.contains(e.target)) clickedMenu = true;
      });
      if (!clickedMenu) this.taskMenuOpened = null;
    },
    /* Edit action : when clicking on contextual menu option */
    editTask(task) {
      this.editingTaskId = task.id;
      this.editingTaskValue = task.title;

      this.taskMenuOpened = null; // close contextual menu

    },
    /* Validate task modifications */
    updateTask(task, event) {
      // new value
      const newTitle = event.target.value;

      this.$emit('update-board-task', this.board, task, {
        title: newTitle
      });

      this.editingTaskId = null;
      this.editingTaskValue = '';

    },
    /* Cancel task edit action */
    cancelEditTask() {
      this.editingTaskId = null;
      this.editingTaskValue = '';
    },
    /* Delete task */
    deleteTask(task) {
      this.$emit('remove-board-task', this.board, task);
    },
    /* Delete board */
    deleteBoard() {
      this.$emit('remove-board', this.board)
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
}
</script>
