export class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.products = ticket.products.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));
    }
}

export class CreateTicketDTO {
    constructor(data) {
        this.purchaser = data.purchaser;
        this.amount = data.amount;
        this.products = data.products;
    }
}
