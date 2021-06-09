const User = require('../models/user.js');

class Users {
    constructor() {}
    
    static viewIndex() {
        return (req, res) => {
            res.render("home");
        }   
    }
    
    static Register() {
        return (req, res) => {
            res.render("register", {output: res.locals.error_messages});
        }
    }

    static InsertUser(req, res, user_level) {
        User.validate_email(req.body.email)
        .then((result) => {
            if(result == 'Success') {
                let validation = User.validate_register(req.body);
                if(validation.result == 'success') {
                    let register_data = validation.output;
                    register_data.user_level = user_level;
                    User.create_user(register_data);
                    if(typeof res.locals.user === 'undefined') {
                        res.redirect('/');
                    }
                    else {
                        res.redirect("add_user");
                    }
                }
                else {
                    req.flash('error_messages', validation.output);
                    if(typeof res.locals.user === 'undefined') {
                        res.redirect("register");  
                    }
                    else {
                        res.redirect("add_user");
                    }
                }
            }
            else {
                res.flash('error_messages', [result]);
                res.redirect("register");
            }
        })
        .catch((err) => {
            console.log("Promise rejection error: "+err);
        });
    }

    static RegisterUser() {
        return (req, res) => {
            User.check_admin()
            .then((result) => {
                if(result == false) {
                    //User level - Admin
                    console.log("User level - Admin");
                    this.InsertUser(req, res, "Admin");
                }
                else {   
                    //User level - Normal
                    console.log("User level - User");
                    this.InsertUser(req, res, "User");
                }
            })
            .catch((err) => {
                console.log("Promise rejection error: "+err);
            });
        }
    }

    static Login() {
        return (req, res) => {
            res.render("login", {output: res.locals.error_messages});
        }
    }

    static LoginUser() {
        return (req, res) => {
            let validate_login = User.validate_login(req.body);
            if(validate_login.result == 'error') {
                req.flash('error_messages', validate_login.output);
                res.redirect("login");
            }
            else {
                User.login_user(req.body)
                .then((results) => {
                    if(results.length == 1) {
                        req.session.loggedin = results[0];
                        res.redirect("dashboard");
                    }
                    else {
                        req.flash('error_messages', ['Invalid email/password. Please try again.']);
                        res.redirect("login");
                    }
                })
                .catch((err) => {
                    console.log("Promise rejection error: "+err);
                });
            }
        }
    }

    static viewDashboard() {
        return (req, res) => {
            User.select_users()
            .then((results) => {
                res.render("dashboard", {success_message: res.locals.success_messages, error_message: res.locals.error_messages, users: results});
            })
            .catch((err) => {
                console.log("Promise rejection error: "+err);
            });
        }
    }
    
    static viewAddUser() {
        return (req, res) => {
            res.render("add_user", {success_message: res.locals.success_messages, error_message: res.locals.error_messages});
        }
    }

    static viewEditUser() {
        return (req, res) => {
            var id = req.params.id;
            User.select_user(id)
            .then((result) => {
                res.render("edit_user", {error_message: res.locals.error_messages, success_message: res.locals.success_messages, data: result});
            })
            .catch((err) => {
                console.log("Promise rejection error: "+err);
            });
        }
    }

    static editUser() {
        return async (req, res) => {
            let validate_edit_user = User.validate_edit_user(req.body);
            var id = req.params.id;
            if(validate_edit_user.result == 'error') {
                req.flash('error_messages', validate_edit_user.output);
                res.redirect("/edit/"+id);
            }
            else {
                let edit_user = await User.edit_user(req.body);
                req.flash('success_messages', [edit_user]);
                res.redirect("/edit/"+id);
            }
        }
    }

    static editPassword() {
        return async (req, res) => {
            let validate_edit_password = User.validate_edit_password(req.body);
            var id = req.params.id;
            if(validate_edit_password.result == 'error') {
                req.flash('error_messages', validate_edit_user.output);
                res.redirect("/edit/"+id);
            }
            else {
                let edit_user_password = await User.edit_password(req.body);
                req.flash('success_messages', [edit_user_password]);
                res.redirect("/edit/"+id);
            }
        }
    }

    static deleteUser() {
        return async (req, res) => {
            var id = req.params.id;
            let delete_user = await User.delete_user(id);
            if(delete_user == 'Delete User Done!') {
                req.flash('success_messages', [delete_user]);
            }
            else {
                req.flash('error_messages', [delete_user]);
            }
            res.redirect("/dashboard");
        }
    }

    static viewEditProfile() {
        return (req, res) => {
            User.select_user(res.locals.user.id)
            .then((result) => {
                res.render("edit_profile", {error_message: res.locals.error_messages, success_message: res.locals.success_messages, data: result});
            })
            .catch((err) => {
                console.log("Promise rejection error: "+err);
            });
        }
    }

    static editDescription() {
        return async (req, res) => {
            let edit_description = await User.edit_description(req.body);
            req.flash('success_messages', [edit_description]);
            res.redirect("/edit_profile");
        }
    }

    static editProfile() {
        return async (req, res) => {
            let validate_edit_user = User.validate_edit_user(req.body);
            if(validate_edit_user.result == 'error') {
                req.flash('error_messages', validate_edit_user.output);
                res.redirect("/edit_profile");
            }
            else {
                let edit_profile = await User.edit_profile(req.body);
                req.flash('success_messages', [edit_profile]);
                res.redirect("/edit_profile");
            }
        }
    }

    static editProfilePassword() {
        return async (req, res) => {
            let validate_edit_password = User.validate_edit_password(req.body);
            if(validate_edit_password.result == 'error') {
                req.flash('error_messages', validate_edit_password.output);
                res.redirect("/edit_profile");
            }
            else {
                let edit_password = await User.edit_password(req.body);
                req.flash('success_messages', [edit_password]);
                res.redirect("/edit_profile");
            }
        }
    }

    static viewProfile() {
        return async (req, res) => {
            var id = req.params.id;
            let online_user = res.locals.user.id;
            let user_data = await User.select_user(id);
            let message_data = await User.get_profile_messages(id);
            let comments_data = await User.get_comments(id);
            res.render("profile", {
                error_message: res.locals.error_messages, 
                success_message: res.locals.success_messages, 
                user_data: user_data,
                online_user: online_user,
                messages: message_data,
                comments: comments_data
            });
        }
    }

    static createMessage() {
        return async (req, res) => {
            let id = req.params.id;
            let create_message = await User.create_message(req.body);
            if(create_message == 'Created new message!') {
                req.flash('success_messages', create_message);
                res.redirect("/profile/"+id);
            }
            else {
                req.flash('error_messages', create_message);
                res.redirect("/profile/"+id);
            }
        }
    }

    static createComment() {
        return async (req, res) => {
            let id = req.params.id;
            let data = {
                comment: req.body.comment,
                message_id: id,
                created_user_id: req.body.created_user_id
            };
            let create_comment = await User.create_comment(data);
            if(create_comment == 'Created new comment!') {
                req.flash('success_messages', create_comment);
                res.redirect("/profile/"+req.body.page_user_id);
            }
            else {
                req.flash('error_messages', create_comment);
                res.redirect("/profile/"+req.body.page_user_id);
            }
        }
    }

    static Logout() {
        return (req, res) => {
            req.session.destroy();
            res.redirect("/");
        }
    }

} 

module.exports = Users;