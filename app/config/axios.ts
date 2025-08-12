import axios from "axios";

const axiosFetch = axios.create({
    baseURL:  process.env.NEXT_PUBLIC_BRAND_BASE_URL
})

export default axiosFetch;