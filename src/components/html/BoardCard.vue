<template>
    <div class="bg-white shadow rounded-xl p-6 mb-12">

      <!-- Board Title wrapper -->
      <div class="flex justify-between items-center mb-4">

        <template v-if="editingBoardId === board.id">

          <input
            type="text"
            v-model="editingBoardValue"
            @blur="updateBoard($event)"
            @keyup.enter="updateBoard($event)"
            @keyup.esc="cancelEditBoardAction"
            class="border px-2 py-1 rounded w-full"
            ref="editInput"
          >
          <button
            @click="updateBoard($event)"
            class="flex items-center justify-center text-sm px-2"
          >
          Valider
          </button>
          <button
            @click="cancelEditBoardAction"
            class="flex items-center justify-center text-sm text-red-500 px-2"
          >
          Annuler
          </button>

        </template>

        <template v-else>

          <h2 @click="editBoardAction($event)" class="text-xl font-bold text-black-900">{{ board.title }}</h2>
          <!-- Board commands -->
          <div class="flex">
            <label :for="'checkbox-all-checked-' + board.id" class="flex items-center cursor-pointer gap-2 select-none" v-if="this.board.tasks.length">
                <input
                  type="checkbox"
                  :id="'checkbox-all-checked-' + board.id"
                  :checked="checkBoardAllTasksCompleted()"
                  @change="markBoardAllTasksCompleted($event)"
                  class="form-checkbox h-5 w-5 transition"
                >
                <span>Marquer toutes comme résolues</span>
            </label>

            <button
              @click="deleteBoard"
                :disabled="this.board.tasks.length > 0 && !this.checkBoardAllTasksCompleted()"
                :class="[
                  'text-sm px-3 py-2 rounded transition ml-4',
                  this.board.tasks.length > 0 && !this.checkBoardAllTasksCompleted()
                    ? 'bg-red-200 text-red-400 hover:bg-red-200 cursor-not-allowed'
                    : 'bg-red-600 text-white'
                ]"
            >
              Supprimer le groupe de tâches
            </button>
          </div>

        </template>

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
                <button @click="editTaskAction(task)" class="block w-full text-sm text-left px-4 py-2 text-body hover:bg-gray-100">Éditer</button>
                <button @click="deleteTask(task)" class="block w-full text-sm text-left px-4 py-2 text-red-600 hover:bg-gray-100">Supprimer</button>
              </div>
            </div>

          </div>

        </li>

      </ul>

      <div class="mt-4">

        <template v-if="isAddingTask">
          <div class="flex">
             <input
              type="text"
              v-model="addTaskValue"
              @blur="createBoardTask($event)"
              @keyup.enter="createBoardTask($event)"
              @keyup.esc="cancelAddBoardTaskAction"
              class="border px-2 py-1 rounded w-full"
              ref="editInput"
            >
            <button
              @click="createBoardTask($event)"
              class="flex items-center justify-center text-sm px-2"
            >
            Valider
            </button>
            <button
              @click="cancelAddBoardTaskAction"
              class="flex items-center justify-center text-sm text-red-500 px-2"
            >
            Annuler
            </button>
          </div>
        </template>

        <template v-else>
          <button @click="addBoardTaskAction" class=" px-3 py-2 rounded transition ml-4 bg-gray-200 hover:bg-gray-300 text-body">
              Ajouter une tâche
          </button>
        </template>

      </div>

  </div>

</template>

<script>



export default {
  data() {
    return {
      boards: [],
      taskMenuOpened: null,
      editingBoardId: null,
      editingBoardValue: null,
      editingTaskId: null,
      editingTaskValue: null,
      isAddingTask: false,
      addTaskValue:null,
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
      return this.board.tasks.length ? this.board.tasks.every(task => task.completed) : false;
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

    /* Edit action : update board data */
    editBoardAction() {
      this.editingBoardId = this.board.id;
      this.editingBoardValue = this.board.title;
    },
    /* Cancel task edit action */
    cancelEditBoardAction() {
      this.editingBoardId = null;
      this.editingBoardValue = '';
    },
    /* Validate board modifications */
    updateBoard(event) {
      // new value
      const newTitle = event.target.value;

      this.$emit('update-board', this.board, {
        title: newTitle
      });

      this.editingBoardId = null;
      this.editingBoardValue = '';

    },
    addBoardTaskAction() {
      this.isAddingTask = true;
    },
    cancelAddBoardTaskAction() {
      this.isAddingTask = false;
      this.addTaskValue = '';
    },
    /* Edit action : when clicking on contextual menu option */
    editTaskAction(task) {
      this.editingTaskId = task.id;
      this.editingTaskValue = task.title;

      this.taskMenuOpened = null; // close contextual menu

    },
    createBoardTask(event) {
       // new value
      const taskTitle = event.target.value;

      this.$emit('create-board-task', this.board, {
        title: taskTitle
      });

       this.isAddingTask = false;
       this.addTaskValue = '';
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
