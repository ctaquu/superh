import axios from "axios";

const superheroApiAccessToken = '10221482807763886';

axios.defaults.baseURL = `api/${superheroApiAccessToken}`

export default axios