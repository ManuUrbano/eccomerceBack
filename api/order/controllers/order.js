'use strict';
const stripe = require("stripe")
("sk_test_51J2KASB2kGuty4FgxqsWA0EQDgwy2YWJ8XtwAVtfTAMuNt2HRIIYQuKE74TrSfxFxDEwOHKFB1SpfoWpzwr52J6000LmMGG1Aa");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        const { token, products, idUser, addressShipping } = ctx.request.body;
        let totalPayment = 0;

        products.forEach((pr) => {
            totalPayment = totalPayment + pr.price;
        })
  

        const charge = await stripe.charges.create({
            amount: totalPayment * 100,
            currency: "eur",
            source: token.id,
            description: `ID Usuario: ${idUser}`
        })

        const createOrder = [];
        for await(const pr of products) {
            const data = {
                products_details: pr.id,
                user: idUser,
                totalPayment,
                idPayment: charge.id,
                addressShipping
            }
            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models.order,
                data
            );
            const entry = await strapi.query("order").create(validData);
            createOrder.push(entry);
        }   
        return createOrder;
    }
};
