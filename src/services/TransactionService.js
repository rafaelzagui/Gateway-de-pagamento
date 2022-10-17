// criando um serviço de controle de transações
import Cart from '../models/Cart'
import Transaction from '../models/Transaction'
import {v4 as uuidv4} from 'uuid'
import PagarMeProvider from '../../providers/PagarMeProvider';
class TransactionService {
paymentProvider;
constructor(paymentProvider)
{
    this.paymentProvider = paymentProvider || new PagarMeProvider();
}

    async process({
        cartcode,
        paymentType,
        installments,
        customer,// customer name
        billing,
        creditCard,

    }) {
       
        const cart = await Cart.findOne({code: cartcode})
       const code  = uuidv4()
       const codeClient  = uuidv4()
      const items ={
        amount: cart.price,
        description:'Carrinho de compras ',
        quantity: 1,
        code:  cart
      }
            if(!cart)
            {
              throw `Cart : ${cartcode} was not found`
            }else{
            const transaction = await Transaction.create({
                cartcode: cart.code,
                code: code,
                total: cart.price,
                paymentType,
                installments,
                status:"Started",
                customer_id: codeClient,
                customerName : customer.name,
                customerEmail: customer.email,
                customerMobile: customer.mobile,
                customerDocument: customer.document,
                billlingAddress : billing.address,
                billingNumber: billing.number,
                billlingNeighborhood : billing.neighborhood,
                billlingCity : billing.city,
                billlingState : billing.state,
                billlingZipCode : billing.zipcode,
            });
           
        this.paymentProvider.process({
            transactionCode:transaction.code,
            total:transaction.total,
            paymentType,
            installments,
            creditCard,
            customer,
            billing,
            items,
            });
        return transaction;
            }
        }
};
export default TransactionService
