let todoItems = [];

loadTodoItems();
if (todoItems.length > 0) {
  refreshTodoSpaces();
}

if (todoItems.length == 0) {
  document.getElementsByTagName("main")[0].style.display = "none";
}

addEventListener("beforeunload", () => saveTodoItems());

function addTodoSpace() {
  saveTitle();
  saveInputValues();
  let todoTitle = document.getElementById("todoTitle").value;
  if (todoTitle !== "") {
    todoItems.push({
      title: todoTitle,
      content: [{ text: "", default: true }],
    });
    refreshTodoSpaces();
  } else {
    alert("Wprowadź tytuł");
  }
  document.getElementById("todoTitle").value = "";
}

function addLi(index) {
  saveInputValues();
  saveTitle();
  todoItems[index].content.push({ text: "", default: true });
  refreshTodoSpaces();
}

function saveInputValues() {
  let todoSpaces = Array.from(document.getElementsByClassName("todoSpace"));
  for (let i = 0; i < todoSpaces.length; i++) {
    let inputs = Array.from(todoSpaces[i].getElementsByTagName("input"));
    todoItems[i].content = inputs.map((input) => ({
      text: input.value,
      default: input.className === "default",
    }));
  }
}

function saveTitle() {
  let todoSpaces = Array.from(document.getElementsByClassName("todoSpace"));
  for (let i = 0; i < todoSpaces.length; i++) {
    let textArea = todoSpaces[i].getElementsByTagName("span")[0].innerText;
    todoItems[i].title = textArea;
  }
}

function refreshTodoSpaces() {
  let main = document.getElementsByTagName("main")[0];
  main.innerHTML = "";

  if (todoItems.length == 0) {
    main.style.display = "none";
  } else main.style.display = "grid";
  saveInputValues();
  todoItems.forEach((todoItem, index) => {
    let todoSpace = document.createElement("div");
    todoSpace.className = "todoSpace";
    let title = document.createElement("span");
    title.setAttribute("contenteditable", "true");
    title.role = "textarea";
    title.innerText = todoItem.title;
    let deleteTodoSpaceBtn = document.createElement("button");
    deleteTodoSpaceBtn.addEventListener("click", () =>
      deleteTodoSpace(deleteTodoSpaceBtn)
    );
    deleteTodoSpaceBtn.innerHTML = "&#120;";
    todoSpace.appendChild(deleteTodoSpaceBtn);
    todoSpace.appendChild(title);
    todoItem.content.forEach((element) => {
      let section = document.createElement("section");
      let input = document.createElement("input");
      let changeStatusBtn = document.createElement("button");
      changeStatusBtn.innerHTML = "&#9998;";
      changeStatusBtn.addEventListener("click", () =>
        changeStatus(changeStatusBtn)
      );
      let deleteBtn = document.createElement("button");
      deleteBtn.addEventListener("click", () => deleteTodo(deleteBtn));
      deleteBtn.innerHTML = "&#120;";
      input.setAttribute("type", "text");
      input.className = element.default ? "default" : "checked"; // Set initial class
      input.value = element.text;
      input.placeholder = "write your task here";
      input.addEventListener("input", () => saveInputValues());
      section.appendChild(input);
      section.appendChild(changeStatusBtn);
      section.appendChild(deleteBtn);
      todoSpace.appendChild(section);
    });

    let addListItemButton = document.createElement("button");
    addListItemButton.innerText = "Add List Item";
    addListItemButton.addEventListener("click", function () {
      addLi(index);
    });

    todoSpace.appendChild(addListItemButton);
    main.appendChild(todoSpace);
  });
}

function changeStatus(changeStatusBtn) {
  let sectionOfInput = changeStatusBtn.parentNode;
  let inputToChange = sectionOfInput.getElementsByTagName("input")[0];
  inputToChange.className =
    inputToChange.className === "default" ? "checked" : "default"; // Toggle class

  saveInputValues(); // Save input values after changing status
  refreshTodoSpaces(); // Refresh the display
}

function deleteTodo(element1) {
  const sectionToDelete = element1.parentNode;
  const todoSpaceToDelete = sectionToDelete.parentNode;

  const todoSpaceIndex = Array.from(
    document.getElementsByClassName("todoSpace")
  ).indexOf(todoSpaceToDelete);
  const sectionIndex = Array.from(
    todoSpaceToDelete.getElementsByTagName("section")
  ).indexOf(sectionToDelete);

  if (todoSpaceIndex !== -1 && sectionIndex !== -1) {
    todoItems[todoSpaceIndex].content.splice(sectionIndex, 1);
    refreshTodoSpaces();
  }
}

function deleteTodoSpace(button) {
  let todoSpace = button.parentNode;
  let todoSpaces = document.getElementsByClassName("todoSpace");
  Array.from(todoSpaces).forEach((element, index) => {
    if (todoSpace === element) {
      todoItems.splice(index, 1);
    }
  });
  refreshTodoSpaces();
}

function deleteAll() {
  todoItems = [];
  saveTodoItems;
  refreshTodoSpaces();
}

function saveTodoItems() {
  saveInputValues();
  saveTitle();
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function loadTodoItems() {
  const savedTodoItems = localStorage.getItem("todoItems");
  if (savedTodoItems) {
    todoItems = JSON.parse(savedTodoItems);
  }
}
