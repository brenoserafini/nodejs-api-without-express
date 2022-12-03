let users = require('../mocks/users');

module.exports = {
  listUsers(request, response) {
    // console.log(request.query);
    const { order } = request.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      } else {
        return a.id > b.id ? 1 : -1;
      }
    });

    // response.writeHead(200, {'Content-Type': 'application/json'});
    // // response.end(JSON.stringify(users));
    // response.end(JSON.stringify(sortedUsers));
    response.send(200, sortedUsers);
  },
  getUserById(request, response) {
    const { id } = request.params;
    console.log(id);
    const user = users.find((user) => user.id == id)

    if(!user) {
      // response.writeHead(400, {'Content-Type': 'application/json'});
      // response.end(JSON.stringify({error: 'User not found!'}));
      response.send(400, {error: 'User not found!'});
    } else {
      // response.writeHead(200, {'Content-Type': 'application/json'});
      // response.end(JSON.stringify(user));
      response.send(200, user);
    }
  },
  createUser(request, response) {
    const { body } = request;
    const lastUserId = users[users.length - 1].id;
    const newUser = {
      id: lastUserId + 1,
      name: body.name
    }
    users.push(newUser);
    response.send(200, newUser)
  },
  updateUser(request, response) {
    let { id } = request.params;
    const { name } = request.body;
    id = Number(id);

    const userExists = users.find((user) => user.id === id);
    if(!userExists) {
      return response.send(400, { error: 'User not found!' });
    }

    users = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          name: name
        }
      }
      return user;
    });
    response.send(200, {id, name})
  },
  deleteUser(request, response) {
    let { id } = request.params;
    id = Number(id);

    const userExists = users.find((user) => user.id === id);
    if(!userExists) {
      return response.send(400, { error: 'User not found!' });
    }

    users = users.filter((user) => user.id !== id);
    response.send(200, {deleted: true})

  }
}
