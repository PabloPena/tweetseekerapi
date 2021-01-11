
class IndexController {

  /**
   * Render the API index page
   * @param req
   * @param res
   */
  public static index = function (req: any, res: any) {
    res.render("../views/index");
  };

}

export default IndexController;