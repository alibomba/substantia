import { v4 } from "uuid";

function generateUniqueId() {
    return v4();
}

export default generateUniqueId;