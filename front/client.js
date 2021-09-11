const API = "http://localhost:5000";
const form = document.querySelector("form");
const load = document.querySelector(".loading");
const meo = document.querySelector(".meows");

setTimeout(() => {
  load.style.display = "none";
  listAll();
}, 3500);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");
  if (!name || !content) return;
  const meow = { name, content };
  load.style.display = "";
  form.style.display = "none";
  fetch(API, {
    method: "POST",
    body: JSON.stringify(meow),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      meo.innerHTML = "";
      if (data.msg) {
        console.log(msg);
        return;
      }
      setTimeout(() => {
        form.reset();
        form.style.display = "";
        load.style.display = "none";
        console.log(data);
        listAll();
      }, 1500);
    });
});

function listAll() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      data.reverse();
      data.forEach((mew) => {
        const div = document.createElement("div");
        const header = document.createElement("h3");
        header.textContent = mew.name;
        const contents = document.createElement("p");
        contents.textContent = mew.content;
        div.appendChild(header);
        div.appendChild(contents);
        meo.appendChild(div);
      });
    });
}
