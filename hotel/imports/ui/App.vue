simple-todos/imports/ui/App.vue »
<template>
  <div className="container">
    <header>
      <div>
      <h1 id="title">Hotel Room Service</h1>
      </div>
    <div v-if="!currentUser">
      <div>Username: <input type="username" name="username" v-model="user"></div>
      <div>Password: <input type="password" name="password" v-model="password"></div>
      <div>Room number (optional): <select name="rooms" v-model="room_number">
        <option disabled value="">only for guests</option>
        <option v-for="room in rooms" v-bind:key="room._id" v-bind:value="room.roomname">{{room.roomname}}</option>
        </select>
      </div>
      <div><input type="submit" value="Login" @click="login">
      <input type="submit" value="Register as guest" @click="register_client">
      <input type="submit" value="Register as manager" @click="register_manager"></div>
    </div>
    <div id="currentusername">
    <h1 v-if="currentUser">
     {{currentUsername}} - logged in as {{currentProfile}} <i v-if="currentRoom!=null">at {{currentRoom}} </i>
      <input type="submit" value="logout" @click="logout">
    </h1> 
    </div>
    <div id="currentprofileroom">
    <h1 v-if="currentProfile=='guest'">
      Change Room To : <select name="rooms" v-model="room_number" @change="change_room">
        <option disabled value="">{{currentUser.profile.roomnumber}}</option>
        <option v-for="room in rooms_except" v-bind:key="room._id" v-bind:value="room.roomname">{{room.roomname}}</option>
        </select>
    </h1>
    </div>
    </header>
    <div class="rooms" v-if="currentProfile=='manager'">
    Rooms:
    <h1 v-for="room in rooms" v-bind:key="room.key">
      <strong>{{room.roomname}}</strong>
      <button class="deleteRoom" @click="deleteRoom(room)">
      x
      </button>
      <div v-for="user in thisRoom" v-bind:key="user.key" v-bind:room="room">
        {{user.name}}
      </div>
    </h1>
    </div>
    <div v-if="currentProfile=='manager'" className="Rooms">
      <a style="color:white"> Room: </a>
      <input type="text" placeholder="room name" v-model="save_room_data">
      <input type="button" value="add" @click="save_room">
    </div>
    <transition name="fade">
      <div v-if="currentUser" >
      <div class="items" v-for="item in items" v-bind:key="item._id">
          <strong><i>{{item.name}}</i></strong>
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
      </div>
    </transition>
    <div v-if="currentProfile=='manager'" className="Items" style="margin:30pt;">
      <input type="text" placeholder="name of item" v-model="save_Item_Name"><br>
      <input type="text" placeholder="description" v-model="save_Item_Description"><br>
      <input type="button" value="save" @click="save_Item">
    </div>
    <transition name="fade">
    <div class="cart" v-if="currentProfile=='guest'&&show_cart" >
      <h1>cart</h1>
      <div v-for="item in carts" v-bind:key="item.key">
        Item: {{item.name}}  |  Status: {{item.status}}
        <button @click="deleteFromCart(item._id)">
           ×
        </button>
      </div>
      <button class="order_all" @click="order(carts)">
        order
      </button>
    </div>
    </transition>
    <transition name="fade">
      <div class="orders" v-if="currentProfile=='guest'&&show_orders">
        <h1>orders</h1>
        <div v-for="item in orders" v-bind:key="item.key" style="color:#d1a141">
          Item: {{item.name}}  |  Status: ordered
        </div>
        <div v-for="item in recieved" v-bind:key="item.key">
          Item: {{item.name}}  |  Status: order received
        </div>
      </div>
      <div class="orders" v-if="currentProfile=='manager'&&show_orders" >
        <h1>orders</h1>
        <div v-for="item in incomingOrders" v-bind:key="item.key">
          Item: {{item.name}}  |  Status: pending check | Ordered by: {{item.user.username}} | Room No: {{item.user.profile.roomnumber}}
          <button @click="recieve_order(item._id)">
            approve
          </button>
          <button @click="deletes(item._id)">
            delete
          </button>
        </div>
        <div v-for="item in approvedOrders" v-bind:key="item.key">
          Item: {{item.name}}  |  Status: approved | Ordered by: {{item.user.username}}
        <button @click="deletes(item._id)">
            delete
        </button>
        </div>
      </div>
    </transition>
    <button class="toggle_orders" v-if="currentUser" v-on:click="show_orders=!show_orders">
      orders
    </button>
    <button class="toggle_cart" v-if="currentProfile=='guest'" v-on:click="show_cart=!show_cart">
      cart
    </button>
    <button class="toggle_chat" v-if="currentUser" @click="showChat">
      chat
    </button>
    <transition name=fade>
      <div class="chat" v-if="currentUser && show_chats">
        <div class="messageBox">
        <div v-for="Message in Messages" v-bind:key="Message._id">{{Message.From}} : {{Message.Message}}</div>
        </div>
        <input type=text placeholder="message" class="sendmessage" v-model="message">
        <button class="sendmessageButton" @click="sendMessage">
          send
        </button>
      </div>
      <div class="chat" v-if="currentUser && show_chat_lists">
        <div v-for="from in From" v-bind:key="from._id" @click="showChat_manager">
          <div class="chat_list_box"> {{from.username}}</div>
        </div>
      </div>
      </transition>
  </div>
</template>
 
<script>
import Vue from "vue";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Items } from "../api/items.js";
import { Carts } from "../api/items.js";
import { Rooms } from "../api/items.js";
import { Chats } from "../api/items.js";
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
      save_room_data:null,
      room_number:null,
      show_orders:false,
      show_cart:false,
      show_chats:false,
      show_chat_lists:false,
      message:""
    };
  },
  methods: {
    register_client(event)  {
        Meteor.call("addUser",this.user,this.password,"guest", this.room_number, function(error){
          if(error==null)
          {
            alert("succesful registration")
          }
          else{
            alert(error.reason);
          }
        });
        user="",
        password=""
    },
    register_manager(event) {
        Meteor.call("addUser",this.user,this.password,"manager", null, function(error){
          if(error==null)
          {
            alert("succesful registration")
          }
          else{
            alert(error.reason);
          }
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
            user: Meteor.user(),
            userID:Meteor.userId(),
            status: "Added To Cart",
            name: name,
            createdAt: new Date(), 
        });
        this.show_cart=true;
    },
    deleteFromCart(item_id){
      Carts.remove(item_id);
    },
    order(cart){
      cart.forEach(function(element){
        Carts.update(element._id,{
          $set : {status: "ordered"}
        });
      });
      this.show_orders=true;
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
      if(Rooms.find({roomname:this.save_room_data}).count()==0)
      {
      Rooms.insert({
        roomname:this.save_room_data
      });
      }
      else{ alert("duplicate room name")}
    },
    deleteRoom(room){
      Rooms.remove(room._id)
      Meteor.call("updateUserRoom",room)
    },
    change_room(){
      Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.roomnumber':this.room_number}});
    },
    sendMessage(event){
      if(Meteor.user())
      {
        if(Meteor.user().profile.permission=="guest")
        {
          Chats.insert({
            From:Meteor.user().username,
            To:"manager",
            Message:this.message,
            createdAt:new Date()
          });
        }
      }
    },
    showChat(event){
      if(Meteor.user())
      {
        if(Meteor.user().profile.permission=="guest")
        {
          this.show_chats=!this.show_chats
        }
        else{
          this.show_chat_lists=!this.show_chat_lists
        }
      }
    },
    showChat_manager()
    {

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
        return Meteor.user().profile.permission;}
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
    },
    rooms(){
      return Rooms.find({}).fetch();
    },
    currentRoom(){
      if(Meteor.user())
      return Meteor.user().profile.roomnumber;
    },
    rooms_except(){
      if(Meteor.user()){
      return Rooms.find({roomname:{$not:Meteor.user().profile.roomnumber}}).fetch();}
    },
    thisRoom(){
      if(this.room!=null)
      {
      return Accounts.users.find({'profile.roomnuber':this.room.roomname}).fetch();
      }
    },
    Messages(){
      if(Meteor.user())
      {
        if(Meteor.user().profile.permission=="guest")
        {
          return Chats.find({$or:[{From:Meteor.user().username}]}, { sort: { createdAt: 1 } }).fetch();
        }
      }
    },
    From(){
      if(Meteor.user())
      {
        if(Meteor.user().profile.permission=="manager")
        {
          return Accounts.users.find({}).fetch();
        }
      }
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
