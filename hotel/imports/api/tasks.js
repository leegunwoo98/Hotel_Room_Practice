import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
 
export const Tasks = new Mongo.Collection('tasks');
 
Meteor.methods({
    'addUser'(username,password,permission)
    {
        Accounts.createUser({
            username:username,
            password:password,
            profile:permission
        })
    },
    'loggin' (username,password)
    {
        Meteor.loginWithPassword(username,password)
    }
});