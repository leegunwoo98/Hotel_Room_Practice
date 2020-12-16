simple-todos/imports/ui/App.vue »
<template>
  <div className="container">
    <header>
      <h1>Hotel Room Service</h1>
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
    <div v-if="currentProfile=='manager'" className="Rooms">
      addRooms
      <input type="text" placeholder="room name" v-model="save_room_data">
      <input type="button" value="save" @click="save_room">
    </div>
    <ul v-if="currentUser">
      <div v-for="item in items" v-bind:key="item._id" className="Items">
          <p>{{item.name}}</p>
          <div>
          <p className="description">{{item.description}}</p>
          <button v-if="currentProfile=='guest'" @click="addToCart(item._id,item.name)">
          cart
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
    <div class="cart" v-if="currentProfile=='guest'" style="float:left; width:45%; background:#ddd;">
      <h1>cart</h1>
      <div v-for="item in carts" v-bind:key="item.key">
        Item: {{item.name}}  |  status: {{item.status}}
        <button @click="deleteFromCart(item._id)">
          ×
        </button>
      </div>
      <button @click="order(carts)">
        order
      </button>
    </div>
    <div class="orders" v-if="currentProfile=='guest'" style="float:left; width:45%; background:#ddd;">
      <h1>orders</h1>
      <div v-for="item in orders" v-bind:key="item.key" style="color:#d1a141">
        Item: {{item.name}}  |  status: ordered
      </div>
      <div v-for="item in recieved" v-bind:key="item.key">
        Item: {{item.name}}  |  status: order received
      </div>
    </div>
    <div className="check_orders" v-if="currentProfile=='manager'" style="float:left; width:45%; background:#ddd;">
      <h1>orders</h1>
      <div v-for="item in incomingOrders" v-bind:key="item.key">
        Item: {{item.name}}  |  status: {{item.status}}  by {{item.username}}
        <button @click="recieve_order(item._id)">
          approve
        </button>
        <button @click="deletes(item._id)">
          delete
        </button>
      </div>
      <div v-for="item in approvedOrders" v-bind:key="item.key">
        Item: {{item.name}}  |  status: {{item.status}} | ordered by: {{item.username}}
      <button @click="deletes(item._id)">
          delete
      </button>
      </div>
    </div>
  </div>
</template>
 
<script>
import Vue from "vue";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Items } from "../api/items.js";
import { Carts } from "../api/items.js";
// import { Carts } from "../api/cart.js"

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
      ordered_items:null,
      save_room_data:null
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
            username: Meteor.user().username,
            userID:Meteor.userId(),
            status: "Added To Cart",
            name: name,
            createdAt: new Date(), 
        });
    },
    deleteFromCart(item_id){
      Carts.remove(item_id);
    },
    order(cart){
      cart.forEach(function(element){
        Carts.update(element._id,{
          $set : {status: "ordered"}
        });
      })
    },
    recieve_order(item_id){
      Carts.update(item_id,{
        $set : {status: "recieved"}
      });
    },
    deletes(item_id){
      Carts.remove(item_id);
    },
    save_room(event){
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
      return Carts.find({userID:Meteor.userId(),status:"Added To Cart"},{ sort: { createdAt: -1 } }).fetch();
    },
    orders(){
      return Carts.find({userID:Meteor.userId(),status:"ordered"},{ sort: { createdAt: -1 } }).fetch();
    },
    recieved(){
      return Carts.find({userID:Meteor.userId(),status:"recieved"},{ sort: { createdAt: -1 } }).fetch();
    },
    incomingOrders(){
      return Carts.find({status:"ordered"},{ sort: { createdAt: -1 } }).fetch();
    },
    approvedOrders(){
      return Carts.find({status:"recieved"},{ sort: { createdAt: -1 } }).fetch();
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
