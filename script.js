const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const list = document.getElementById("task-list");
const error = document.getElementById("error");
let counter = 0;
const cnt_span = document.getElementById("left");
const empty = document.getElementById("empty");
let taskArray = [];

// Step 1: Add a task
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    error.textContent = "Please type a task";
    error.hidden = false;
    input.focus();
    return;
  }

  const isDuplicate = taskArray.some(
    (task) =>
      task.querySelector(".text").textContent.trim().toLowerCase() ===
      text.toLowerCase(),
  );
  if (isDuplicate) {
    error.textContent = "This task already exists";
    error.hidden = false;
    input.focus();
    return;
  }

  counter++;
  cnt_span.textContent = counter;
  error.textContent = "";
  error.hidden = true;
  empty.hidden = true;

  const task = document.createElement("li");
  task.classList.add(`priority-${prioritySelect.value}`);
  task.hidden = doneBtn.classList.contains("active");
  taskArray.push(task);
  const name = document.createElement("span");
  name.classList.add("text");
  name.textContent = text;

  const del = document.createElement("button");
  del.textContent = "x";
  del.classList.add("delete");

  task.append(name, del);
  list.appendChild(task);

  input.value = "";
  input.focus();
});

// Step 2 + Step 3: Toggle done and delete using event delegation
list.addEventListener("click", (e) => {
  // Step 3: Check whether the X button was clicked
  const deleteBtn = e.target.closest("button.delete");

  if (deleteBtn) {
    const task = deleteBtn.closest("li");
    if (!task.classList.contains("done")) {
      counter--;
      cnt_span.textContent = counter;
    }
    task.remove();
    taskArray = taskArray.filter((item) => item !== task);
    empty.hidden = taskArray.length > 0;
    return;
  }

  // Step 2: Check whether a task was clicked
  const task = e.target.closest("li");

  if (!task || !list.contains(task)) return;

  task.classList.toggle("done");
  counter += task.classList.contains("done") ? -1 : 1;
  cnt_span.textContent = counter;
});

// Step 4: "tasks left" counter

// Step 5: filters (All / Active / Done)
const doneBtn = document.querySelector(".done_btn");
const active_btn = document.querySelector(".active_btn");
const all_btn = document.querySelector(".all_btn");
const filterButtons = [doneBtn, active_btn, all_btn];
const setActiveFilter = (button) => {
  filterButtons.forEach((filterButton) => {
    filterButton.classList.toggle("active", filterButton === button);
  });
};
doneBtn.addEventListener("click", () => {
  setActiveFilter(doneBtn);
  taskArray.forEach((task) => {
    if (task.classList.contains("done")) {
      task.hidden = false;
    } else {
      task.hidden = true;
    }
  });
});
active_btn.addEventListener("click", () => {
  setActiveFilter(active_btn);
  taskArray.forEach((task) => {
    if (!task.classList.contains("done")) {
      task.hidden = false;
    } else {
      task.hidden = true;
    }
  });
});
all_btn.addEventListener("click", () => {
  setActiveFilter(all_btn);
  taskArray.forEach((task) => {
    task.hidden = false;
  });
});

// Step 6: Clear completed
const clear_done = document.getElementById("clear-done");
clear_done.addEventListener("click", () => {
  taskArray = taskArray.filter((task) => {
    if (task.classList.contains("done")) {
      task.remove();
      return false;
    }
    return true;
  });
  empty.hidden = taskArray.length > 0;
  cnt_span.textContent = counter;
});
// Step 7: show the empty message only when there are no tasks
// Bonus: block duplicate tasks ("This task already exists")
