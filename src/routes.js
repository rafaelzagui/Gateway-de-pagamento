import  {Router} from "express";
import CartsController from './controllers/CartsController'
import TransactionController from "./controllers/TransactionController";
const routes = new Router();
routes.get("/carrinho", CartsController.getCarrinho)
routes.post("/carrinho", CartsController.create)
routes.put("/carrinho/:id", CartsController.update)
routes.delete("/carrinho/:id", CartsController.delete)
routes.post("/transactions",TransactionController.create)

export default routes;