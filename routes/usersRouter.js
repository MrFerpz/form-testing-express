const Router = require('express');
const usersRouter = Router();
const usersController = require('../controllers/usersController')

usersRouter.get("/", usersController.usersListGet);
usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);
usersRouter.get("/:id/update", usersController.usersUpdateGet);
usersRouter.post("/:id/update", usersController.usersUpdatePost);
usersRouter.post("/:id/delete", usersController.deleteUserPost);
usersRouter.get("/search", usersController.usersSearchPageGet);
usersRouter.get("/search/results", usersController.usersNameSearchGet);

module.exports = usersRouter;