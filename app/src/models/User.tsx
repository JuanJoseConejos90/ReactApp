export class User {
    constructor(
        public id: number = 0,
        public user1: string = "",
        public pass: string = "",
        public price: number = 0,
        public created: Date = new Date(),
        public createdBy: string = "admin",
        public updated: Date = new Date(),
        public updatedBy: string = "admin"
    ) { }
}
