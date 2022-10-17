import Cart from '../models/Cart';


class CartsController {
    async getCarrinho(req, res) {
        try {
            const carts = await Cart.find();
            return res.status(200).json(carts)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ error: "Servidor com problemas!" })
        }
    }
    async create(req, res) {
        try {
            const { code, price, email, name } = req.body;
            const cart = await Cart.create({ code, price, email, name });
            return res.status(201).json(cart)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ error: "Servidor com problemas!" })
        }

    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { code, price, email, name } = req.body;
            const cart = await Cart.findById(id)
            if (!cart) {
                return res.status(404).json()

            } else {
                await cart.updateOne({ code, price, email, name });
                return res.status(200).json()
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({ error: "Servidor com problemas!" })

        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;

            const cart = Cart.findById(id)

            if (!cart) {
                return res.status(404).json()
            }
            await cart.deleteOne();
        } catch {
            console.log(err)
            return res.status(500).json({ error: "Servidor com problemas!" })
        }
    }

}

export default new CartsController();