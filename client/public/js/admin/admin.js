const SERVER_URL = 'http://localhost:3000';

async function fetchUsers() {
  return fetch(`${SERVER_URL}/users`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        accept: 'application/json',
      },
    })
    .then((res) => res.json())
    .then((users) => users
      .map((user, index) => {
        return {
          index: index + 1,
          name: user.fullName,
          company: 'User',
          jobTitle: user.role,
          avatar: '/images/free-plan.png'
        };
      })
    );
}
