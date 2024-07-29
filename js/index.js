document.addEventListener("DOMContentLoaded", function () {
  const bookListUl = document.querySelector("#list");
  const showPanelDiv = document.querySelector("#show-panel");
  const user1 = {
    id: 1,
    username: "pouros",
  };

  function displayTitles() {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((books) => {
        for (let bookObj in books) {
          const book = books[bookObj];
          const bookLi = document.createElement("li");
          bookLi.textContent = book.title;
          bookLi.addEventListener("click", () => {
            handleTitleClick(book);
          });

          bookListUl.append(bookLi);
        }
      });
  }

  function handleTitleClick(book) {
    showPanelDiv.innerHTML = "";

    const bookImg = document.createElement("img");
    bookImg.src = book["img_url"];

    const bookDescriptionP = document.createElement("p");
    bookDescriptionP.textContent = book.description;

    const usersListUl = document.createElement("ul");
    const usersList = book.users;
    for (let userObj in usersList) {
      const usernameLi = document.createElement("li");
      const username = usersList[userObj].username;
      usernameLi.textContent = username;
      usersListUl.append(usernameLi);
    }

    const likeButton = document.createElement("button");
    likeButton.textContent = "Like";
    likeButton.addEventListener("click", () => {
      handleLikeButtonClick(book);
    });

    showPanelDiv.append(bookImg, bookDescriptionP, usersListUl, likeButton);
  }

  function handleLikeButtonClick(book) {
    let usersList = book.users;

    if (usersList.some((name) => name.id === user1.id)) {
      usersList = usersList.filter((user) => user.id !== user1.id);
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users: usersList,
        }),
      })
        .then((res) => res.json())
        .then((newBook) => {
          handleTitleClick(newBook);
        });
    } else {
      const updatedUsersList = [...usersList, user1];
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: updatedUsersList }),
      })
        .then((res) => res.json())
        .then((newBook) => {
          handleTitleClick(newBook);
        });
    }
  }

  displayTitles();
});
