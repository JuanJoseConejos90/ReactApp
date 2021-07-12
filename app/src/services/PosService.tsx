import axios from 'axios';
import { POSReq } from "./../models/Pos";
import { API_KEY } from "./../utilitary/util";


export default class PosService {

    async createPOS(body: POSReq) {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                Authorization: localStorage.getItem("token")
            }
        };

        return await axios.post(API_KEY.concat("/api/POS/CreatePOS"), body, axiosConfig).then(res => res.data);
    }


}