/* eslint-disable no-undef */
function updateTodo(id) {
  id = Number(id);

  fetch(`/todos/${id}/update`, {
    method: "put",
    headers: { "content-type": "application/json" },
  })
    .then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    })
    .catch((err) => {
      console.log(typeof id);

      //console.error(err);
    });
}

function deleteTodo(id) {
  id = Number(id);
  console.log("delete function called for id: " + id);

  fetch(`/todos/${id}`, {
    method: "delete",
    headers: { "content-type": "application/json" },
  })
    .then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    })
    .catch((err) => {
      console.log(typeof id);

      //console.error(err);
    });
}
