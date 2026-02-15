import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'skillbazaar_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Initial structure
const INITIAL_DATA = {
    technicianRequests: [],
    freelancerOrders: []
};

function readDb() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
        return INITIAL_DATA;
    }
    try {
        const content = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return INITIAL_DATA;
    }
}

function writeDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
    get: () => readDb(),

    getTechnicianRequests: (customerId?: string) => {
        const data = readDb();
        if (customerId) {
            return data.technicianRequests.filter((r: any) =>
                String(r.customerId) === String(customerId) ||
                String(r.customer_id) === String(customerId)
            );
        }
        return data.technicianRequests;
    },

    getFreelancerOrders: (customerId?: string) => {
        const data = readDb();
        if (customerId) {
            return data.freelancerOrders.filter((o: any) =>
                String(o.customerId) === String(customerId) ||
                String(o.customer_id) === String(customerId)
            );
        }
        return data.freelancerOrders;
    },

    addTechnicianRequest: (request: any) => {
        const data = readDb();
        data.technicianRequests.push(request);
        writeDb(data);
        return request;
    },

    addFreelancerOrder: (order: any) => {
        const data = readDb();
        data.freelancerOrders.push(order);
        writeDb(data);
        return order;
    }
};
