export class PostDto {
    constructor(
        public id: number = 0,
        public cod: string = "",
        public name: string = "",
        public price: number = 0,
        public iva: number = 0,
        public cant: number = 0,
        public total: number = 0,
        public created: Date = new Date(),
        public createdBy: string = localStorage.getItem('name') || ""
    ) { }
}

export class POSReq {
    constructor(
        public id: number = 0,
        public cod: string = "",
        public details: string = "",
        public created: Date = new Date(),
        public createdBy: string = localStorage.getItem('name') || ""
    ) { }
}