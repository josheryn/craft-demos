import { sql, db } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  WeatherData,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchWeatherData() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log('Fetching weather data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<WeatherData>`SELECT * FROM weatherdata`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch weather data.');
  }
}

/**
 * function getTopKWeatherDataByField
 * returns the top K weather data from weatherdata table by the given field 
 * 
 * @param field - the field to sort by
 * @param k - the number of records to return
 * @param order - the order to sort by
 * @returns - the top K weather data records sorted by the given field 
 */
export async function getTopKWeatherDataByField(field: string, k: number, order: string) {
  try {
    console.log('Fetching weather data...');
    // Manually escape the field name to prevent SQL injection
    const safeField = `${field.replace(/"/g, '""')}`;
    console.log('Safe field:', safeField);
    console.log('Order:', order);
    
    // Define the data variable outside the if block
    let data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY temp LIMIT ${k}`;

    // Use an if block to handle different possible safeField variables
    // if (safeField == "temp") {
    //   console.log('Temp');
    //   data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY temp LIMIT ${k}`;;
    // } else if (safeField == 'humidity') {
    //   data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY humidity LIMIT ${k}`;
    // } else if (safeField == 'pressurepsi') {
    //   data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY pressurepsi LIMIT ${k}`;
    // } else if (safeField == 'city') {
    //   data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY city LIMIT ${k}`;
    // } else {
    //   throw new Error('Invalid field specified');
    // }
    // Use a switch statement to handle different possible safeField variables
   
    if (order === 'ASC') {
      switch (safeField) {
        case 'temp':
          console.log('Temp');
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY temp LIMIT ${k}`;
          break;
        case 'humidity':
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY humidity LIMIT ${k}`;
          break;
        case 'pressurepsi':
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY pressurepsi LIMIT ${k}`;
          break;
        case 'city':
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY city LIMIT ${k}`;
          break;
        default:
          throw new Error('Invalid field specified');
      }
    } else {
      switch (safeField) {
        case 'temp':
          console.log('Temp');
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY temp DESC LIMIT ${k}`;
          break;
        case 'humidity':
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY humidity DESC LIMIT ${k}`;
          break;
        case 'pressurepsi':
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY pressurepsi DESC LIMIT ${k}`;
          break;
        case 'city':
          data = await sql<WeatherData>`SELECT * FROM weatherdata ORDER BY city DESC LIMIT ${k}`;
          break;
        default:
          throw new Error('Invalid field specified');
      }
    }

    console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch weather data.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    console.log('Fetching invoice data...' + id);
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    console.log('Couldn\'t find invoice:' + invoice);
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function findMaxPossibleSumeOfContiguousBalances(
  balances: number[],
) {
  let maxSum = 0;
  let currentSum = 0;

  for (let i = 0; i < balances.length; i++) {
    currentSum = Math.max(balances[i], currentSum + balances[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
