import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
 
export const Items = new Mongo.Collection('items');
export const Cart = new Mongo.Collection('cart');
 
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