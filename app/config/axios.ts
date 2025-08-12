import axios from "axios";

const axiosFetch = axios.create({
    baseURL:  "http://localhost:2000"
})

export default axiosFetch;