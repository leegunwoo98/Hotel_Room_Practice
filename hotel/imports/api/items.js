import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
 
export const Items = new Mongo.Collection('items');
export const Carts = new Mongo.Collection('carts');
export const Rooms = new Mongo.Collection('rooms');
 
Meteor.methods({
    'addUser'(username,password,permission)
    {
        Accounts.createUser({
            username:username,
            password:password,
            profile:permission
        })
    },
});