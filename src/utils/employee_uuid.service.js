import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

export class EmployeeUUIDService {

    async getUUID() {
        let idFound = false;
        let UUID = null;

        while (!idFound) {
            let idSuffix = Math.floor(Math.random()*10000000);
            UUID = 'UI' + idSuffix.toString();

            const employeeSearch = await axios.get(`${baseURL}/employees/search`, {
                params: {
                    employeeId: UUID
                }
            })

            if (employeeSearch.data.length === 0) {
                idFound = true;
            }
        }

        return UUID
    }
}

export const employeeUUIDService = new EmployeeUUIDService();