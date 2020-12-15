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
    <ul v-if="currentUser">
      <div v-for="item in items" v-bind:key="item._id" className="Items">
          <p>{{item.name}}</p>
          <div>
          <p className="description">{{item.description}}</p>
          <button v-if="currentProfile=='guest'" @click="addToCart(item._id,item.name)">
          order
          </button>
          <button v-if="currentProfile=='manager'" @click="deleteThisItem(item._id)">
          ×
          </button>
          </div>
      </div>
    </ul>
    <div v-if="currentProfile=='manager'" className="Items">
      <input type="text" placeholder="name of item" v-model="save_Item_Name"><br>
      <input type="text" placeholder="description" v-model="save_Item_Description"><br>
      <input type="button" value="save" @click="save_Item">
    </div>
    <div class="cart" v-if="currentProfile=='guest'">
      <h1>cart</h1>
      <div v-for="item in carts" v-bind:key="item.key">
        Item: {{item.name}}  |  status: {{item.status}}

      </div>
    </div>
  </div>
</template>
 
<script>
import Vue from "vue";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Items } from "../api/items.js";
import { Carts } from "../api/cart.js"

export default {
  components: {
  },
  data() {
    return {
      user:"",
      username:null,
      password:"",
      userID:"",
      profile:null,
      loggedIn:false,
      save_Item_Name:"",
      save_Item_Description:"",
      ordered_items:null
    };
  },
  methods: {
    register_client(event)  {
        Meteor.call("addUser",this.user,this.password,"guest", function(error){
          alert(error.reason);
        });
        user="",
        password=""
    },
    register_manager(event) {
        Meteor.call("addUser",this.user,this.password,"manager", function(error){
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
    },
    save_Item(event){
        Items.insert({
          name:this.save_Item_Name,
          description:this.save_Item_Description
        });
        this.save_Item_Name="",
        this.save_Item_Description=""
    },
    order(event){
      console.log(this.ordered_items)
    },
    deleteThisItem(item_id){
    Items.remove(item_id);
    },
    addToCart(id,name){
        Carts.insert({
            item: id,
            user: Meteor.userID,
            status: "Added To Cart",
            name: name,
            createdAt: new Date(), 
        });
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
    },
    items(){
      return Items.find({}).fetch();
    },
    carts(){
      if(Meteor.user()!=null)
      {
      let filteredItems=Carts.find({user:Meteor.user().username}).fetch;
      return filteredItems;
      }
      else{
        return null;
      }
      // return Carts.find({}).fetch();
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
