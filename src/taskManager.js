/**
 * TaskFlow — Core task management logic.
 * Works as a Node.js module (for Jest tests) and as a browser global.
 */
(function (exports) {
  'use strict';

  var _idCounter = 0;

  function _nextId() {
    return ++_idCounter;
  }

  function createTask(text, priority, dueDate) {
    return {
      id: _nextId(),
      text: text,
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Returns a new array with the given task appended.
   * Throws if text is empty or whitespace-only.
   * dueDate is optional: an ISO date string ('YYYY-MM-DD') or empty.
   */
  function addTask(tasks, text, priority, dueDate) {
    var trimmed = (text || '').trim();
    if (!trimmed) {
      throw new Error('Task text cannot be empty');
    }
    return tasks.concat([createTask(trimmed, priority, dueDate)]);
  }

  /**
   * Returns a new array with the matching task's completed flag toggled.
   */
  function toggleTask(tasks, id) {
    return tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { completed: !task.completed });
      }
      return task;
    });
  }

  /**
   * Returns a new array with the matching task removed.
   */
  function deleteTask(tasks, id) {
    return tasks.filter(function (task) {
      return task.id !== id;
    });
  }

  /**
   * Returns a new array with all completed tasks removed.
   */
  function clearCompleted(tasks) {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  }

  /**
   * Returns the number of active (incomplete) tasks.
   */
  function getActiveCount(tasks) {
    return tasks.filter(function (task) { return !task.completed; }).length;
  }

  /**
   * Returns tasks filtered by the given filter string.
   * filter: 'all' | 'active' | 'completed'
   */
  function filterTasks(tasks, filter) {
    if (filter === 'active') {
      return tasks.filter(function (task) { return !task.completed; });
    }
    if (filter === 'completed') {
      return tasks.filter(function (task) { return task.completed; });
    }
    return tasks;
  }

  /**
   * Returns true if the task is not completed and its due date is before today.
   * `now` is injectable for testing; defaults to the current date.
   */
  function isOverdue(task, now) {
    if (!task.dueDate || task.completed) {
      return false;
    }
    var d = now || new Date();
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var today = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    return task.dueDate < today;
  }

  /**
   * Formats an ISO date string ('YYYY-MM-DD') as e.g. "Sep 20".
   */
  function formatDueDate(dueDate) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var parts = dueDate.split('-');
    return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10);
  }

  exports.createTask = createTask;
  exports.addTask = addTask;
  exports.toggleTask = toggleTask;
  exports.deleteTask = deleteTask;
  exports.clearCompleted = clearCompleted;
  exports.getActiveCount = getActiveCount;
  exports.filterTasks = filterTasks;
  exports.isOverdue = isOverdue;
  exports.formatDueDate = formatDueDate;

})(typeof module !== 'undefined' ? module.exports : (window.TaskManager = {}));
