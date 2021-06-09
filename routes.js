const Users = require(`./controllers/users.js`);
const Express = require("express");
const Router = Express.Router();

Router.get("/", Users.viewIndex());
Router.get("/register", Users.Register());
Router.post("/register_user", Users.RegisterUser());
Router.get("/login", Users.Login());
Router.post("/login_user", Users.LoginUser());
Router.get("/dashboard", Users.viewDashboard());
Router.get("/add_user", Users.viewAddUser());
Router.get("/edit/:id", Users.viewEditUser());
Router.post("/edit_user/:id", Users.editUser());
Router.post("/edit_password/:id", Users.editPassword());
Router.post("/delete_user/:id", Users.deleteUser());
Router.get("/edit_profile", Users.viewEditProfile());
Router.post("/edit_description", Users.editDescription());
Router.post("/edit_profile_details", Users.editProfile());
Router.post("/edit_password_profile", Users.editProfilePassword());
Router.get("/profile/:id", Users.viewProfile());
Router.post("/post_message/:id", Users.createMessage());
Router.post("/post_comment/:id", Users.createComment());

Router.get("/logout", Users.Logout());

module.exports = Router;