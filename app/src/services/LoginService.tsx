import axios from 'axios';
import { loginDto, LoginResponse } from "./../models/login";
import { User } from "./../models/User";
import { API_KEY } from "./../utilitary/util";

export default class LoginService {

    async Login(data: loginDto) {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        };

        return await axios.post<LoginResponse>(API_KEY.concat("/api/Login/Autheticate"), data, axiosConfig).then(res => res.data);
    }

    async SignUp(data: User) {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        };

        return await axios.post(API_KEY.concat("/Login/signUp"), data, axiosConfig).then(res => res.data);
    }
}