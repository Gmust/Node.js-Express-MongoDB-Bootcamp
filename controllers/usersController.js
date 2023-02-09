class UsersController {

  async getAllUsers(req, res) {
    res.status(404).json({
      status: 'error',
      message: 'This route in not implemented'
    });
  };

  async createUser(req, res) {
    res.status(404).json({
      status: 'error',
      message: 'This route in not implemented'
    });
  };

  async getUser(req, res) {
    res.status(404).json({
      status: 'error',
      message: 'This route in not implemented'
    });
  };

  async patchUser(req, res) {
    res.status(404).json({
      status: 'error',
      message: 'This route in not implemented'
    });
  };

  async deleteUser(req, res) {
    res.status(404).json({
      status: 'error',
      message: 'This route in not implemented'
    });
  };

}


module.exports = new UsersController();

