import * as Yup from 'yup'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import parsePhoneNumber from 'libphonenumber-js'
import Cart from '../models/Cart'
import TransactionService from '../services/TransactionService'
class TransactionController {
    async create(req, res) {
        try {
            const {
                cartcode,
                paymentType,
                installments,
                customerEmail,
                customerName,
                customerMobile,
                customerDocument,
                billingAddress,
                billingNumber,
                billingNeighborhood,
                billingCity,
                billingZipCode,
                billingState,
                creditCardNumber,
                creditCardExpiration,
                creditCardHolderName,
                creditCardCvv,
            } = req.body;
            const schema = Yup.object({
                cartcode: Yup.string().required(),
                paymentType: Yup.mixed().oneOf(["credit_card", "billet", "pix"]).required(),
                customerName:Yup.string().min(3).required(),
                installments: Yup.number().min(1).when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.max(12) : schema.max(1)),
                customerEmail: Yup.string().required().email(),
                customerMobile: Yup.string().required().test("is-valid-mobile", "${path} não é um telefone valido", (value) => parsePhoneNumber(value, "BR").isValid()),//nome do validador -> mensagem de erro -> função para teste de numero via methodos lib
                customerDocument: Yup.string().required().test("is-valid-document", "${path} não é um CPF/CNPJ valido", (value) => cpf.isValid(value) || cnpj.isValid(value)),
                billingAddress: Yup.string().required(),
                billingNumber: Yup.string().required(),
                billingNeighborhood: Yup.string().required(),
                billingCity: Yup.string().required(),
                billingState: Yup.string().required(),
                billingZipCode: Yup.string().required(),
            });
            console.log(schema.paymentType)
            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: "error validate schema" })
            }

            const cart = Cart.findOne({ code: cartcode })
            if (!cart) {
                return res.status(404).json();
            }
            const service = new TransactionService();
            const response = await service.process(
                {
                    cartcode,
                    paymentType,
                    installments,
                    customer: {
                        name: customerName,
                        email: customerEmail,
                        mobile: parsePhoneNumber(customerMobile,"BR").format("E.164"),
                        document: customerDocument,
                    },
                    billing: {
                        address: billingAddress,
                        number: billingNumber,
                        neighborhood: billingNeighborhood,
                        city: billingCity,
                        state: billingState,
                        zipcode: billingZipCode,
                    },
                    creditCard: {
                        number: creditCardNumber,
                        expiration: creditCardExpiration,
                        holderName: creditCardHolderName,
                        cvv: creditCardCvv,
                    },

                });
            return res.status(200).json(response);

        } catch (err) {
            return res.status(500).json({ error: "Servidor com problemas! " + err})

        }
    }
}
export default new TransactionController();