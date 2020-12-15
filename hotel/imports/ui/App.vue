simple-todos/imports/ui/App.vue »
<template>
  <div className="container">
    <header>
      <h1>Hotel controller</h1>
    <h1 v-bind:text="currentUser"></h1>

    <div v-if="not_logged">Email: <input type="email" name="email" v-model="email"></div>
    <div v-if="not_logged">Password: <input type="password" name="password" v-model="password"></div>
    <div v-if="not_logged"><input type="submit" value="Login" @click="login">
    <input type="submit" value="Register as client" @click="register_client">
    <input type="submit" value="Register as manager" @click="register_manager"></div>
    <div v-if="logged"><input type="submit" value="logout" @click="logout"></div>


    
      <!-- <form className="new-task" @submit.prevent="handleSubmit">
        <input
          type="text"
          placeholder="Type to add new tasks"
          v-model="newTask"
        />
      </form> -->


    </header>
    <ul>
        <Task v-for="task in tasks" v-bind:key="task._id" v-bind:task="task" />
    </ul>
  </div>
</template>
 
<script>
import Vue from "vue";
import Task from "./Task.vue";
import { Tasks } from "../api/tasks.js";
import { Meteor } from "meteor/meteor";
 
export default {
  components: {
    Task
  },
  data() {
    return {
      email:"",
      password:"",
      guest:"guest",
      manager:"manager",
      newTask: "",
      hideCompleted: false,
      seen:false,
      not_logged:true,
      logged:false,
      userID:"",
      username:"",
    };
  },
  methods: {
    register_client(event)  {
        Meteor.call("tasks.addUser",this.email,this.password,this.guest)
    },
    register_manager(event) {
        Meteor.call("tasks.addUser",this.email,this.password,this.manager)
    },
    login(event){
        Meteor.loginWithPassword(email,password)
    },
    logout(event){
        Meteor.logout()
    },
    meteor: {
        currentUser(){
            return Meteor.user().username;
        }
    }


    




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
  }
};
</script>