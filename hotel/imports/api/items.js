import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
 
export const Items = new Mongo.Collection('items');
export const Carts = new Mongo.Collection('carts');
export const Rooms = new Mongo.Collection('rooms');
export const Chats = new Mongo.Collection('chats');
 
Meteor.methods({
    'addUser'(username,password,permissions,roomnumbers)
    {
        Accounts.createUser({
            username:username,
            password:password,
            profile:{
                permission:permissions,
                roomnumber:roomnumbers
            }
        })
    },
    'updateUserRoom'(room)
    {
        Meteor.users.update({'profile.roomnumber':room.roomname},{$set:{'profile.roomnumber':null}});
    }
});