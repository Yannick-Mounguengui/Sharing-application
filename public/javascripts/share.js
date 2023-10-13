// Déclaration de la connexion au serveur
const socket = io();
const listDiv = document.getElementById('list');
const contentDiv = document.getElementById('content');
const empruntDiv = document.getElementById('item-name');
const createItemBtn = document.getElementById('create');
const userDiv=document.getElementById('userId');
const log=document.getElementById('logout');
const empruntme=document.getElementById("borrower-name");

const displayItems = async () => {
    const requestOptions = {
      method: 'GET'
    };
    const response = await fetch('/item/', requestOptions);
    if (!response.ok) {
      throw new Error('Response not ok');
    }
    const items = await response.json();
    let html = '<ul>';
    items.forEach(item => {
          html += `<li class="item">${item.description} <button class="emprunt" data-id="${item._id}">Emprunter</button> <button class="modify" data-id="${item._id}">Modifier</button> <button class="delete" data-id="${item._id}">Supprimer</button></li>`;    });
    listDiv.innerHTML = html;

    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(deleteButton => {
      deleteButton.addEventListener('click', () => {
        const itemId = deleteButton.getAttribute('data-id');
        deleteItem(itemId, deleteButton);
      });
    });
    const borrowButtons = document.querySelectorAll('.emprunt');
    borrowButtons.forEach(button => {
      button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        borrowItem(itemId, button);
      });
    });
    const modifyButtons = document.querySelectorAll('.modify');
    modifyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        updateItem(itemId, button);
      });
    });
};

const deleteItem = async (itemId, button) => {
  const requestOptions = {
    method: 'DELETE'
  };
  const response = await fetch(`/item/${itemId}`, requestOptions);
  if (response.ok) {
    contentDiv.textContent = `Item with id ${itemId} was deleted.`;
    button.parentNode.remove();
    socket.emit('itemDeleted', itemId);
  } else if (response.status === 403) {
    contentDiv.textContent = `You can only delete objects that you have added.`;
  } else {
    contentDiv.textContent = `Item with id ${itemId} is currently borrowed and cannot be deleted`;
  }
  displayItems();
};

const borrowItem = async (itemId, button) => {
  const requestOptions = {
    method: 'PUT'
  };
  const response = await fetch(`/item/borrow/${itemId}`, requestOptions);
  if (response.status === 400) {
    contentDiv.textContent = `You cannot borrow more than 2 objects.`;
    const error = await response.json();
    throw new Error(error.error);
  }
  const item = await response.json();
  const listItem = document.createElement('li');
  contentDiv.textContent = `Item with id ${itemId} is borrowed.`;
  listItem.innerHTML = `${item.description}<button class="Libere" data-id="${item._id}">Liberer</button>`;
  empruntme.appendChild(listItem);
  const releaseButton = listItem.querySelector('.Libere');
  releaseButton.addEventListener('click', async () => {
    await releaseItem(itemId, releaseButton);
    listItem.remove();
  });
  button.parentNode.remove();
  displayItems();
  socket.emit('itemBorrowed',itemId);
};


const releaseItem = async (itemId, button) => {
  const requestOptions = {
    method: 'PUT'
  };
  const response = await fetch(`/item/release/${itemId}`, requestOptions);
  if (!response.ok) {
    throw new Error(`Failed to release item with id ${itemId}.`);
  }
  const item = await response.json();
  contentDiv.textContent = `Item with id ${itemId} is released .`;
  displayItems();
  socket.emit('itemReleased',itemId);
};

const itemsOfOther = async () => {
  const requestOptions = {
    method: 'GET',
  };
  const response = await fetch('/item/others', requestOptions);
  console.log(response);
  const items = await response.json();
  console.log(items);
  items.forEach(item => {
    empruntDiv.innerHTML += `<li class="elts"><td class="desc">${item.description} (by ${item.userName})</td></li>`;
  });
  displayItems();

socket.on('itemCreated', () => {
  displayItemsOfOther();
});
socket.on('itemBorrowed', () => {
  displayItemsOfOther();
});
socket.on('itemReleased', () => {
  displayItemsOfOther();
});
};

const displayItemsOfOther = async () => {
  empruntDiv.innerHTML = '';
  const requestOptions = {
    method: 'GET',
  };
  const response = await fetch('/item/others', requestOptions);
  console.log(response);
  const items = await response.json();
  console.log(items);
  items.forEach(item => {
    empruntDiv.innerHTML += `<li class="elts"><td class="desc">${item.description} (by ${item.userName})</td></li>`;
  });
};

const createItem = async () => {
    const description = document.getElementById('desc').value;
    if (!description) {
      contentDiv.textContent = 'item description cannot be empty.';
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({description})
    };
    const response = await fetch('/item/', requestOptions);
    if (!response.ok) {
      throw new Error('Response not ok');
    }
    const createdItem = await response.json();
    contentDiv.textContent = `item with id ${createdItem._id} was created.`;
    displayItems();
    socket.emit('itemCreated',createdItem);
};

const updateItem = async (itemId, button) => {
  const newDescription = prompt('Enter a new description for the item:');
  if (!newDescription) {
    contentDiv.textContent = 'New item description cannot be empty.';
    return;
  }
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ itemId, newDescription })
  };
  const response = await fetch(`/item/update/${itemId}`, requestOptions);
  if (!response.ok) {
    const error = await response.json();
    contentDiv.textContent = error.message;
    return;
  }
  const updatedItem = await response.json();
  contentDiv.textContent = `Item with id ${updatedItem._id} was updated.`;
  displayItems();
  socket.emit("itemModified",updatedItem);
};

const getUser = async () => {
  const requestOptions = {
    method: 'GET',
  };
  const response = await fetch('/user/me', requestOptions);
  console.log(response);
  if (response.ok) {
    const user = await response.json();
    userDiv.textContent = `${user.name} id is ${user.id}` || '';
  } else {
    const error = await response.json();
    handleError(error);
  }
}

const logout = async () => {
  const requestOptions = {
                         method :'GET',
                       };
  const response = await fetch(`/access/logout`, requestOptions);
  if (response.ok) {
    window.location.href= '/';
  }
};

createItemBtn.addEventListener('click', createItem);
log.addEventListener('click',logout);
getUser();
displayItems();
itemsOfOther();
socket.on('itemDeleted', (itemId) => {
  displayItems();
});
socket.on('itemCreated', (itemId) => {
  displayItems();
});
socket.on('itemBorrowed', (itemId) => {
  displayItems();
});
socket.on('itemReleased', (itemId) => {
  displayItems();
});
socket.on('itemModified', (itemId) => {
  displayItems();
});
