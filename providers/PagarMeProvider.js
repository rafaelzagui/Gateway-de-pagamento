import { cpf } from 'cpf-cnpj-validator'




class PagarMeProvider {


  async process({
    transactionCode,
    total,
    customer,
    billing,
    items,
  }) {

    let phoneSplit = []
    let country_code, area_code, num;

    phoneSplit = customer.mobile.replace(/[^?0-9]/g, "")
    num = phoneSplit[4] + phoneSplit[5] + phoneSplit[6] + phoneSplit[7] + phoneSplit[8] + phoneSplit[9] + phoneSplit[10] + phoneSplit[11] + phoneSplit[12]
    country_code = phoneSplit[0] + phoneSplit[1]
    area_code = phoneSplit[2] + phoneSplit[3]
    let line1 = `${billing.number}, ${billing.address}, ${billing.neighborhood}`
    let data = new Date();
    let due_at = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate() + 1}`


    const http = require('https');



    const options = {
      method: 'POST',
      hostname: 'api.pagar.me',
      port: null,
      path: '/core/v5/orders/',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: ''
      }
    };

    const req = http.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });

    req.write(JSON.stringify({
      customer: {
        phones: { home_phone: { country_code: country_code, area_code: area_code, number: num } },
        name: customer.name,
        email: customer.email,
        type: cpf.isValid(customer.document) ? "individual" : "corporation",
        document: customer.document.replace(/[^?0-9]/g, "")
      },
      items: [{ amount: items.amount * 100, description: 'Chaveiro do Tesseract', quantity: 1, code: 123 }],
      shipping: {
        amount: 5 * 100,
        description: "Entregar ao destinatario em questão.",
        recipient_name: customer.name,
        recipient_phone: customer.mobile,
        address: {
          country: "br",
          state: billing.state,
          city: billing.city,
          zip_code: billing.zipcode.replace(/[^?0-9]/g, ""),
          line_1: line1,
          line_2: 'e6',
        },
      },
      payments: [
        {
          checkout: {
            expires_in: 6,
            default_payment_method: "pix",
            accepted_payment_methods: ["pix", "credit_card", "boleto"],
            accepted_brands: ["visa", "mastercard", "elo"],
            success_url: "https://gwsolucoes3d.com/",
            skip_checkout_success_page: false,
            billing_address_editable: true,
            billing: {
              line_1: line1,
              line_2: '',
              zip_code: billing.zipcode.replace(/[^?0-9]/g, ""),
              city: billing.city,
              state: billing.state,
              country: 'br',
            },
            boleto: {
              bank: "001",
              instructions: "Pagar até o vencimento",
              due_at: due_at
            },
            pix: {
              expires_in: 300,
              additional_information: [{
                Name: customer.name,
                Value: total
              }
              ],



            }

          },
          payment_method: 'checkout',

        },

      ],

      antifraud_enabled: true,
      Recurrence: false,
      closed: true,
      metadata: '',

    }));
    req.end();
  }
}

export default PagarMeProvider




