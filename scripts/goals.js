document.addEventListener('DOMContentLoaded', () => {

  const setHere = document.querySelector('#setHere');


  axios.get(`http://localhost:3000/users/1`).then(result => {
    let user = result.data
    axios.get(`http://localhost:3000/goals/`)
      .then(result => {
        let goalsToUse = result.data.filter(b => {
          return !user.goals.includes(b.id);
        });
        makeGoalsCard(goalsToUse);
      });
  });

  document.addEventListener('click', event => {
    if (/add/.test(event.target.id)) {
      addGoal(event.target);
    }
  })

  function makeGoalsCard(data) {
    data.forEach(x => {
      let item = setHere.appendChild(makeDiv(['card'])).appendChild(makeDiv(['card-body', 'text-left']));
      let row1 = item.appendChild(makeDiv(['row']));
      row1.appendChild(makeDiv(['col'])).innerHTML = `Goal: ${x.name}<br>`;
      row1.appendChild(makeDiv(['col'])).appendChild(makeButton('add', x.id));
      let row2 = item.appendChild(makeDiv(['row']));
      row2.appendChild(makeDiv(['col'])).innerHTML += `Experience: ${x.xp}<br>`
    });
  }

  function makeDiv(cl) { // make a div with a given class list array
    let div = document.createElement('div');
    cl.forEach(x => {
      div.classList.add(x)
    });
    return div;
  }

  function makeButton(type, id) { // make a button with given type and id
    let button = document.createElement('button');
    button.id = `${type}${id}`;
    button.classList.add('btn');
    button.classList.add('btn-dark');
    button.classList.add('goalBut');
    button.innerText = type.toUpperCase();
    return button;
  }

  function addGoal(item) {
    let id = item.id.replace(/add/, ''); //get id of goal
    item.classList.remove('btn-dark');
    item.classList.add('btn-primary');
    item.id = 'x';
    item.innerText = 'ADDED!';
    console.log('Added goal number', id);
    axios.post(`http://localhost:3000/goals_users`, {user_id: 1, goal_id: id});
  }


});
