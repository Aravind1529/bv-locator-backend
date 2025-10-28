const fs = require("fs");
const { Pool } = require("pg");
const helpers = require("../shared/helper");
const { tables } = require("../shared/constants");
const { supabase } = require("../shared/supabaseClient");
// import { supabase } from './supabaseClient.js'

const bv_centres_table = tables.BV_CENTRES;

// // Connect to Neon.tech
// const pool = new Pool({
//   connectionString:
//     "postgresql://postgres:Sairam@2311#@db.tuvathnuygftcqflnxdx.supabase.co:5432/postgres",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

async function insertBulkData() {
  const client = await pool.connect();
  console.log("Started bulk insert .. pl wait");
  try {
    // Load JSON file
    // const data = JSON.parse(fs.readFileSync("././data/erode,theni,dindugal,karai,trichy.json", "utf8"));
    // const data = JSON.parse(fs.readFileSync("././data/madurai,darmapuri,kanyakumari,tvn,kanchiNorth.json", "utf8")); //load proper json file to insert bulk data
    // const data = JSON.parse(fs.readFileSync("././data/3rd&4th-set-json.json", "utf8")); //load proper json file to insert bulk data
    const data = JSON.parse(fs.readFileSync("././data/cbe.json", "utf8")); //load proper json file to insert bulk data
    for (const record of data) {
      const query = `
        INSERT INTO ${bv_centres_table} (
    samithi_name, centre_name, guru_name, guru_contact,
    address, pincode, ec_name, ec_contact,
    convenor_name, convenor_contact, area, district, google_map_link, state, city
  ) VALUES (
    $1, $2, $3, $4,
    $5, $6, $7, $8,
    $9, $10, $11, $12, $13, $14, $15
  )
`;
      const values = [
        record.samithiName,
        record.centreName,
        record.guruName,
        record.guruContactNumber,
        record.address,
        record.pincode,
        record.ecName,
        record.ecContact,
        record.convenorName,
        record.convenorContact,
        record.area,
        record.district,
        record.googleMapLink,
        record.state,
        record.city,
      ];

      await client.query(query, values);
    }

    console.log("✅ Data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    throw err;
  } finally {
    client.release();
  }
}

async function getCentres() {
  // const client = await pool.connect();

  // try {
  //   const result = await client.query(`SELECT * FROM ${bv_centres_table} order by id`); // Fetch data
  //   console.log("✅ Data read successfully!");
  //   const response = result.rows.map(helpers.transformToUiModel);
  //   console.log('response', response)
  //   return response;
  // } catch (err) {
  //   console.error("❌ Error getting data:", err);
  //   throw err;
  // } finally {
  //   client.release();
  // }

  const { data, error } = await supabase
    .from(`${bv_centres_table}`)
    .select("*");

  if (error) {
    console.error("Error fetching bvCentres:", error);
    throw error;
  }

  console.log("BV CENTRES:", data);
  return data;
}

async function getCentresById(id) {

  try {
    const { data, error } = await supabase
      .from(`${bv_centres_table}`)
      .select("*")
      .eq('id',`${id}`);

    if (error) {
      console.error("Error fetching bvCentres:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("❌ Error getting data:", err);
    throw err;
  }
}

async function updateCentre(id, data) {
  try {
    console.log("udpateData");

    const allowedColumns = [
      "district",
      "guru_name",
      "samithi_name",
      "centre_name",
      "address",
      "area",
      "pincode",
      "type",
      "guru_contact",
      "ec_name",
      "ec_contact",
      "convenor_name",
      "convenor_contact",
      "google_map_link",
      "state",
      "city",
    ];

    // Filter only valid fields present in the request
    const entries = Object.entries(data).filter(([key]) =>
      allowedColumns.includes(key)
    );
    if (entries.length === 0) {
      throw new Error("No valid fields provided");
    }

    // Build SET clause and values
    const setClause = entries
      .map(([key], idx) => `${key} = $${idx + 1}`)
      .join(", ");
    const values = entries.map(([, value]) => value);
    values.push(id); // id is the last param

    const query = `
      UPDATE ${bv_centres_table}
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteCentre(id) {
  const client = await pool.connect();
  try {
    console.log("deleteData");
    const deleteQuery = `DELETE FROM ${bv_centres_table} WHERE id = $1 RETURNING *;`;

    const result = await client.query(deleteQuery, [id]);
    console.log(result);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function createCentre(record) {
  const client = await pool.connect();

  try {
    const query = `
        INSERT INTO ${bv_centres_table} (
          samithi_name, centre_name, guru_name, guru_contact,
          address, pincode, ec_name, ec_contact,
          convenor_name, convenor_contact, area, district, google_map_link, state, city
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15
        )
      `;

    const values = [
      record.samithiName,
      record.centreName,
      record.guruName,
      record.guruContactNumber,
      record.address,
      record.pincode,
      record.ecName,
      record.ecContact,
      record.convenorName,
      record.convenorContact,
      record.area,
      record.district,
      record.googleMapLink,
      record.state,
      record.city,
    ];

    const result = await client.query(query, values);
    console.log("✅ Data inserted successfully!");
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    client.release();
  }
}

module.exports = {
  insertBulkData,
  getCentres,
  getCentresById,
  updateCentre,
  deleteCentre,
  createCentre,
};
