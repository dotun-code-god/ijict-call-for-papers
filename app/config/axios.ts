import axios from "axios";

const axiosFetch = axios.create({
    baseURL:  "https://ijict-call-for-papers.vercel.app/"
    // baseURL:  "http://localhost:2000"
})

export default axiosFetch;