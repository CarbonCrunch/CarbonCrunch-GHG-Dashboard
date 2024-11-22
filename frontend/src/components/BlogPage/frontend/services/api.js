import axios from "axios";
import { API_Notification } from "../constants/config";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
})

axiosInstance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    function(response) {
        return processResponse(response);
    },
    function(error) {
        // Stop global loader here
        return Promise.reject(ProcessError(error));
    }
)

const processResponse = (response) => {
    if (response.status === 200) {
        return {isSuccess: true, data: response.data};
    }
    else{
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code,
        }
    }
}

const ProcessError = (error) => {
    if (error.response) {
        console.log('Error in Response', error.toJSON());
        return {
            isError: true,
            msg: API_Notification.responseFailure,
            code: error.response.status
        }
    }
    else if (error.request) {
        console.log('Error in Request', error.toJSON());
        return {
            isError: true,
            msg: API_Notification.requestFailure,
            code: ""
        }
    }
    else {
        console.log('Error in Network', error.toJSON());
        return {
            isError: true,
            msg: API_Notification.networkError,
            code: ""
        }
    }
}

const API = () => {
    
}
