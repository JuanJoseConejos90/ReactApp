export class loginDto {
    user1!: string;
    pass!: string;
}

export class LoginResponse {
    code!: string;
    succeeded!: boolean;
    message!: string;
    data!: Data;
}

export class Data {
    id!: number;
    name!: string;
    token!: string;
}


