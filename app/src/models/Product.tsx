export class ProductDto {
    data!: Product;
}

export class ProductResponse {
    code!: string;
    succeeded!: boolean;
    message!: string;
    data!: Product;
}

export class Product {
    constructor(
        public id: number = 0,
        public cod: string = "",
        public name: string = "",
        public price: number = 0,
        public iva: number = 0,
        public total: number = 0,
        public created: Date = new Date(),
        public createdBy: string = localStorage.getItem('name') || ""
    ) { }
}

export class ListProduct {
    constructor(
        public Products: Product[] = [],
    ) { }
}