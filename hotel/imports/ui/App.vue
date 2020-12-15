simple-todos/imports/ui/App.vue »
<template>
  <div className="container">
    <header>
      <h1>Hotel controller</h1>
    <div v-if="!currentUser">
      <div>Username: <input type="username" name="username" v-model="user"></div>
      <div>Password: <input type="password" name="password" v-model="password"></div>
      <div><input type="submit" value="Login" @click="login">
      <input type="submit" value="Register as client" @click="register_client">
      <input type="submit" value="Register as manager" @click="register_manager"></div>
    </div>
    <h1 v-if="currentUser">
     {{currentUsername}} logged in as {{currentProfile}}
      <input type="submit" value="logout" @click="logout">
    </h1>
    </header>
    <!-- <ul>
      <Items v-for="task in tasks" v-bind:key="task._id" v-bind:task="task" />
    </ul> -->
  </div>
</template>
 
<script>
import Vue from "vue";
// import Task from "./Task.vue";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
// import Items from "./Items.vue";
 
export default {
//   components: {
//     Task
//   },
  data() {
    return {
      user:"",
      username:null,
      password:"",
      guest:"guest",
      manager:"manager",
      userID:"",
      profile:null,
      loggedIn:false
    };
  },
  methods: {
    register_client(event)  {
        Meteor.call("addUser",this.user,this.password,this.guest, function(error){
          alert(error.reason);
        });
        user="",
        password=""
    },
    register_manager(event) {
        Meteor.call("addUser",this.user,this.password,this.manager, function(error){
          alert(error.reason);
        });
        user="",
        password=""
    },
    login(event){
        Meteor.loginWithPassword(this.user,this.password, function(error){
          alert(error.reason);
        });
    },
    logout(event){
        Meteor.logout();
    }
  },

  meteor: {
    currentUser(){
      return Meteor.user();
    },
    currentUsername(){
      if(Meteor.user()){
        return Meteor.user().username;}
      else 
        return "";
    },
    currentProfile(){
      if(Meteor.user()){
        return Meteor.user().profile;}
      else
        return "";
    }
  }
};
</script>



//     handleSubmit(event) {      
//      Meteor.call("tasks.insert", this.newTask);
//       // Clear form
//       this.newTask = "";
//     },
//     toggleHideCompleted() {
//       this.hideCompleted = !this.hideCompleted;
//     }
//   },
//   meteor: {
//     tasks() {
//       let filteredTasks = Tasks.find({username:Meteor.user().username},{}, { sort: { createdAt: -1 } }).fetch();
//       if (this.hideCompleted) {
//         filteredTasks = filteredTasks.filter(task => !task.checked);
//       }
//       return filteredTasks;
//     },
//     incompleteCount() {
//       return Tasks.find({ checked: { $ne: true } }).count();
//     },
//     currentUser() {
//       return Meteor.user().username;
//     }
