document.addEventListener('DOMContentLoaded', () => {

  checkDate();

  document.addEventListener('click', event => {
    if (/and/.test(event.target.id)) {
      completeTask(event.target);
    } else if (/complete/.test(event.target.id)) {
      checkTasks(event.target);
    } else if (/remove/.test(event.target.id)){
      removeGoal(event.target);
    }
  });

});

const url = 'http://localhost:3000';

function checkDate() { // make sure the date is today. if it's not, clear storage
  let today = new Date().getDate();
  if (parseInt(localStorage.getItem('date')) !== today) {
    localStorage.clear();
    localStorage.setItem('date', today); // set the date as today
  }
}

function completeTask(item) {
  let arr = item.id.split('and'); // remove the word and from the id
  let gold = parseInt(arr[1]); // get the gold from the id
  let id = parseInt(arr[0]); // get the task's id from the button's id
  if (localStorage.getItem(id)) return;
  item.classList.remove('btn-dark');
  item.classList.add('btn-primary');
  localStorage.setItem(id, true);
  axios.get(`${url}/users/${1}`)
  .then(result => {
    console.log(result.data);
    let passes = parseInt(result.data.passes);
    let preGold = parseInt(result.data.gold);
    let newGold = preGold+gold;
    let prePass = parseInt(result.data.points_toward_pass);
    let newPass = prePass+1;
    console.log(prePass, newPass);
    axios.patch(`${url}/users/${1}`, {gold: newGold, points_toward_pass: newPass})
    .then(result => {
      if (result.data.points_toward_pass == 5) {
        passes++;
        axios.patch(`${url}/users/${1}`, {points_toward_pass: 0, passes: passes})
      }
    });
  })

}

function removeGoal(item) {
  let id = item.id.replace(/remove/, '')
  axios.get(`${url}/goals_users`)
  .then(result => {
    let goalToRemove = result.data.filter(x => {
      return x.user_id === 1 && x.goal_id == id
    });
    let idToRemove = goalToRemove[0].id;
    axios.delete(`${url}/goals_users/${idToRemove}`)
    .then(result => {
      item.classList.remove('btn-dark');
      item.classList.add('btn-danger');
      item.innerText = 'REMOVED!';
      item.id = 'x';
    });
  });
}

function completeGoal(item) {
  item.classList.remove('btn-dark');
  item.classList.add('btn-primary');
  localStorage.setItem(item.id, true);
  let nums = item.id.replace(/complete/, ''); // remove the word complete from the id
  let xp = parseInt(nums.split('tasks')[0]); // get the experience from the id
  axios.get(`${url}/users/${1}`)
  .then(result => {
    let level = parseInt(result.data.level)
    let preXp = parseInt(result.data.xp);
    let newXp = result.data.xp+xp
    axios.patch(`${url}/users/${1}`, {xp: newXp})
    .then(result => {
      if (result.data.xp == 1000){
        level++;
        axios.patch(`${url}/users/${1}`, {xp: 0, level: level})
      }
    });
  });
}

function checkTasks(item) {
  let count = 0;
  let nums = item.id.replace(/complete/, ''); // remove the word complete from the id
  let tasks = nums.split('tasks')[1].split(''); // get the array of tasks associated with the goal
  tasks.forEach(x => { // make sure all tasks are set to true
    if (!localStorage.getItem(x)) count++;
  });
  if(localStorage.getItem(item.id)) count++
  if (count === 0) {
    completeGoal(item);
  }

}
