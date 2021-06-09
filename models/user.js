const MVC_model = require('./model.js');
const Mysql = require('mysql');
const md5 = require('md5');
const { executeQuery } = require('./model.js');

class User extends MVC_model {
    constructor() {
        super();
    }

    static async validate_email(data) {
        try{
            let get_email = Mysql.format('SELECT * FROM users WHERE email = ?', [data]);
            let get_email_result = await this.executeQuery(get_email);
            if(get_email_result.length !== 0) {
                return 'Email is already registered';
        	}
        }
        catch(err) {
            console.log(err);
        }
        return 'Success';
    }

    static async check_admin() {
        try{
            let get_admins = Mysql.format("SELECT * FROM users WHERE user_level = 'Admin'");
            let get_admins_result = await this.executeQuery(get_admins);
            if(get_admins_result.length !== 0) {
                return true;
        	}
        }
        catch(err) {
            console.log(err);
        }
        return false;
    }

    static validate_register(data) {
        //For Email
        let error = [];
        var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(data.email == null || data.email == "") {
            error.push("Email is empty!");
        }
        if(regEx.test(data.email) == false) {
            error.push("Email is not Valid");
        }
        //For First name validation
        if(data.first_name == null || data.first_name == "") {
            error.push("First name is empty!");
        }
        //For Last name
        if(data.last_name == null || data.last_name == "") {
            error.push("Last name is empty!");
        }
        //For password
        if(data.password == null || data.password == "" ) {
            error.push("Password is empty!");
        }
        else if(data.password.length <= 7) {
            error.push("Password not longer than 8 characters!");
        }
        if(data.confirm_password == null || data.confirm_password == "") {
            error.push("Confirm Password is empty!");
        }
        if(data.password != data.confirm_password) {
            error.push("Confirmation password is not the same as your password!");
        }
        //Return results in controller
        if(error[0] != null) {
            return {result: 'error', output: error};
        }
        else {
            return {result: 'success', output: data};
        }
    }

    static async create_user(data) {
        try {
            var create_user = Mysql.format(
                "INSERT INTO users (first_name, last_name, email, password, user_level, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
                [data.first_name, data.last_name, data.email, md5(data.password), data.user_level]
            );
            var create_user_result = await this.executeQuery(create_user);
            if(create_user_result.affectedRows == 1) {
                return 'Success';
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'Fail';
    }

    static async login_user(data) {
        try{
            var login_user = Mysql.format(
                "SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1",
                [data.email, md5(data.password)]
            );
            var login_user_result = await this.executeQuery(login_user);
            if(login_user_result.length == 1){
                return login_user_result;
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'User not found';
    }

    static validate_login(data) {
        //For Email
        let error = [];
        var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(data.email == null || data.email == "") {
            error.push("Email is empty!");
        }
        if(regEx.test(data.email) == false) {
            error.push("Email is not Valid");
        }
        //For password
        if(data.password == null || data.password == "" ) {
            error.push("Password is empty!");
        }
        else if(data.password.length <= 7) {
            error.push("Password not longer than 8 characters!");
        }
        if(error[0] != null) {
            return {result: 'error', output: error};
        }
        else {
            return {result: 'success', output: data};
        }
    }

    static async select_users() {
        try {
            var select_users = Mysql.format("SELECT * FROM users");
            var select_users_results = await this.executeQuery(select_users);
            return select_users_results;
        }
        catch(err) {
            console.log(err);
        }
    }

    static async select_user(id) {
        try{
            var get_user = Mysql.format('SELECT * FROM users WHERE id = ?', [id]);
            var get_user_result = await this.executeQuery(get_user);
            return get_user_result;
        }
        catch(err) {
            console.log(err);
        }
    }

    static async edit_user(data) {
        try {
            var edit_user = Mysql.format(
                "UPDATE users SET email=?, first_name=?, last_name=?, user_level=?, updated_at=NOW() WHERE id = ?",
                [data.email, data.first_name, data.last_name, data.user_level, data.id]
            );
            var edit_user_result = await this.executeQuery(edit_user); 
            if(edit_user_result.changedRows == 1) {
                return 'Edit User Information Done!';
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'No changes were made';
    }

    static async edit_password(data) {
        try {
            var edit_user_password = Mysql.format(
                "UPDATE users SET password=?, updated_at=NOW() WHERE id=?",
                [md5(data.password), data.id]
            );
            var edit_user_password_result = await this.executeQuery(edit_user_password); 
            if(edit_user_password_result.changedRows == 1) {
                return 'Edit User Password Done!';
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'No changes were made';
    }

    static validate_edit_user(data) {
        //For Email
        let error = [];
        var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(data.email == null || data.email == "") {
            error.push("Email is empty!");
        }
        if(regEx.test(data.email) == false) {
            error.push("Email is not Valid");
        }
        //For First name validation
        if(data.first_name == null || data.first_name == "") {
            error.push("First name is empty!");
        }
        //For Last name
        if(data.last_name == null || data.last_name == "") {
            error.push("Last name is empty!");
        }
        if(error[0] != null) {
            return {result: 'error', output: error};
        }
        else {
            return {result: 'success', output: data};
        }
    }

    static validate_edit_password(data) {
        //For password
        let error = [];
        if(data.password == null || data.password == "" ) {
            error.push("Password is empty!");
        }
        else if(data.password.length <= 7) {
            error.push("Password not longer than 8 characters!");
        }
        if(data.confirm_password == null || data.confirm_password == "") {
            error.push("Confirm Password is empty!");
        }
        if(data.password != data.confirm_password) {
            error.push("Confirmation password is not the same as your password!");
        }
        if(error[0] != null) {
            return {result: 'error', output: error};
        }
        else {
            return {result: 'success', output: data};
        }
    }

    static async delete_user(id) {
        try {
            var delete_user = Mysql.format("DELETE FROM users WHERE id = ? ", id);
            var delete_user_result = await this.executeQuery(delete_user); 
            if(delete_user_result.affectedRows == 1) {
                return 'Delete User Done!';
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'No users deleted!';
    }

    static async edit_description(data) {
        try {
            var edit_description = Mysql.format(
                "UPDATE users SET description = ? WHERE id = ?",
                [data.description, data.id]
            );
            var edit_description_result = await this.executeQuery(edit_description); 
            if(edit_description_result.affectedRows == 1) {
                return 'Edit Profile Description Done!';
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'No changes were made';
    }

    static async edit_profile(data) {
        try {
            var edit_profile = Mysql.format(
                "UPDATE users SET email=?, first_name=?, last_name=?, updated_at=NOW() WHERE id = ?",
                [data.email, data.first_name, data.last_name, data.id]
            );
            var edit_profile_result = await this.executeQuery(edit_profile); 
            if(edit_profile_result.affectedRows == 1) {
                return 'Edit Profile Information Done!';
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'No changes were made';
    }

    static async get_profile_messages(id) {
        try {
            var get_profile_messages = Mysql.format(
                "SELECT messages.id, message, messages.created_at, CONCAT(creators.first_name, ' ', creators.last_name) AS message_name, messages.created_user_id AS user_id " + 
                "FROM users " +
                "LEFT JOIN messages " +
                "ON users.id = messages.page_user_id " +
                "LEFT JOIN users AS creators " +
                "ON messages.created_user_id = creators.id " +
                "WHERE users.id = ? " +
                "ORDER BY messages.created_at DESC ", id
            );
            var get_profile_messages_results = await this.executeQuery(get_profile_messages);
            return get_profile_messages_results;
        }
        catch(err) {
            console.log(err);
        }
    }

    static async get_comments(id) {
        try {
            var get_comments = Mysql.format(
                "SELECT comments.id, comments.created_at, comments.created_user_id, comment, comments.message_id, CONCAT_WS(' ', first_name, last_name) AS comment_name " +
                "FROM comments " +
                "LEFT JOIN messages " +
                "ON comments.message_id = messages.id " +
                "LEFT JOIN users " +
                "ON comments.created_user_id = users.id " +
                "WHERE page_user_id =? ", id
            );
            var get_comments_results = await this.executeQuery(get_comments);
            return get_comments_results;
        }
        catch(err) {
            console.log(err);
        }
    }

    static async create_message(data) {
        try {
            var create_message = Mysql.format(
                "INSERT INTO messages (message, page_user_id, created_user_id, created_at, updated_at) VALUES (?,?,?, Now(), NOW())",
                [data.message, data.page_user_id, data.created_user_id]
            );
            var create_message_result = await this.executeQuery(create_message);
            if(create_message_result.affectedRows == 1) {
                return "Created new message!";
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'Cannot create new message!';
    }

    static async create_comment(data) {
        try {
            var create_comment = Mysql.format(
                "INSERT INTO comments (comment, message_id, created_user_id, created_at, updated_at) VALUES (?,?,?, NOW(), NOW())",
                [data.comment, data.message_id, data.created_user_id]
            );
            var create_comment_result = await this.executeQuery(create_comment);
            if(create_comment_result.affectedRows == 1) {
                return "Created new comment!";
            }
        }
        catch(err) {
            console.log(err);
        }
        return 'Cannot create new comment!';
    }
} 

module.exports = User;