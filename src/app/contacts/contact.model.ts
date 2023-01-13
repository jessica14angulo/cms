export class Contact {
    constructor(public id: string, public name: string, public email: string, public phone: number, public imageUrl: string, public group: Contact[]) {

    }
}