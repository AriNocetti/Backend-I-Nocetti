export default class UserDTO {
    constructor(user) {
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.role = user.role;
        // Excluimos informacion sensible como el id
        // this.id = user.id;
    }
}