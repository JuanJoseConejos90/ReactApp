import axios from 'axios';
import { Product } from "./../models/Product";
import { API_KEY } from "./../utilitary/util";

export default class ProductService {

    async getAllProducts() {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                Authorization: localStorage.getItem("token")
            }
        };

        return await axios.get(API_KEY.concat("/api/Product"), axiosConfig).then(res => res.data);
    }

    async getProductById(id: number) {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                Authorization: localStorage.getItem("token")
            }
        };

        return await axios.get(API_KEY.concat(`/api/Product/${id}`), axiosConfig).then(res => res.data);
    }

    async createProduct(body: Product) {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                Authorization: localStorage.getItem("token")
            }
        };

        return await axios.post(API_KEY.concat("/api/Product/CreateProduct"), body, axiosConfig).then(res => res.data);
    }

    async updateProduct(body: Product) {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                Authorization: localStorage.getItem("token")
            }
        };
        return await axios.put(API_KEY.concat("/api/Product/UpdateProduct"), body, axiosConfig).then(res => res.data);
    }

    async deleteProduct(id: number) {

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                Authorization: localStorage.getItem("token")
            }
        };

        return await axios.delete(API_KEY.concat(`/api/Product/${id}`), axiosConfig).then(res => res.data);
    }
}