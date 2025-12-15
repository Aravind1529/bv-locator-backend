const fs = require("fs");
const pkg = require("pg");
const { Client } = pkg;
const helpers = require("../shared/helper");
const { tables, supabaseDB } = require("../shared/constants");
const { supabase } = require("../shared/supabaseClient");
const dotenv = require("dotenv");
dotenv.config();

const bv_centres_table = tables.BV_CENTRES;


// // Connect to Neon.tech
// const pool = new Pool({
//   connectionString:
//     "postgresql://postgres:Sairam@2311#@db.tuvathnuygftcqflnxdx.supabase.co:5432/postgres",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// async function insertBulkData() {
//   const client = await pool.connect();
//   console.log("Started bulk insert .. pl wait");
//   try {
//     // Load JSON file
//     // const data = JSON.parse(fs.readFileSync("././data/erode,theni,dindugal,karai,trichy.json", "utf8"));
//     // const data = JSON.parse(fs.readFileSync("././data/madurai,darmapuri,kanyakumari,tvn,kanchiNorth.json", "utf8")); //load proper json file to insert bulk data
//     // const data = JSON.parse(fs.readFileSync("././data/3rd&4th-set-json.json", "utf8")); //load proper json file to insert bulk data
//     const data = JSON.parse(fs.readFileSync("././data/cbe.json", "utf8")); //load proper json file to insert bulk data
//     for (const record of data) {
//       const query = `
//         INSERT INTO ${bv_centres_table} (
//     samithi_name, centre_name, guru_name, guru_contact,
//     address, pincode, ec_name, ec_contact,
//     convenor_name, convenor_contact, area, district, google_map_link, state, city
//   ) VALUES (
//     $1, $2, $3, $4,
//     $5, $6, $7, $8,
//     $9, $10, $11, $12, $13, $14, $15
//   )
// `;
//       const values = [
//         record.samithiName,
//         record.centreName,
//         record.guruName,
//         record.guruContactNumber,
//         record.address,
//         record.pincode,
//         record.ecName,
//         record.ecContact,
//         record.convenorName,
//         record.convenorContact,
//         record.area,
//         record.district,
//         record.googleMapLink,
//         record.state,
//         record.city,
//       ];

//       await client.query(query, values);
//     }

//     console.log("✅ Data inserted successfully!");
//   } catch (err) {
//     console.error("❌ Error inserting data:", err);
//     throw err;
//   } finally {
//     client.release();
//   }
// }

async function authenticateUser(username, password) {
  try {
    const { data, error } = await supabase
      .from("bv_users")
      .select("*")
      .eq("user_name", username)
      .eq("password", password)
      .single(); // returns one row or null

    if(error) {
      console.error("Error Message: ", error);
    }
    if (data) {
      console.log("✅ User found:", data);
      data.isAuthenticatedUser = true;
      return data;
    } else {
      const result = {
        isAuthenticatedUser : false,
        message : "Invalid Credentials"
      }
      console.error("❌ Invalid credentials", result);
      throw error;
    }
  } catch (err) {
    console.error("❌ Error Authenticating user:", err);
    throw err;
  }
}

async function getCentres() {
  try {
    const { data, error } = await supabase.from(bv_centres_table).select("*");
    // .eq("id", `${id}`);

    if (error) {
      console.error("Error fetching bvCentres:", error);
      throw error;
    }

    return data.map(helpers.transformToUiModel);
  } catch (err) {
    console.error("❌ Error getting data:", err);
    throw err;
  }
}

async function getCentresById(id) {
  try {
    const { data, error } = await supabase
      .from(bv_centres_table)
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error fetching bvCentres:", error);
      throw error;
    }

    return data.map(helpers.transformToUiModel);
  } catch (err) {
    console.error("❌ Error getting data:", err);
    throw err;
  }
}

async function updateCentre(id, updateData) {
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
    const entries = Object.entries(updateData).filter(([key]) =>
      allowedColumns.includes(key)
    );
    if (entries.length === 0) {
      throw new Error("No valid fields provided");
    }

    const { data, error } = await supabase
      .from(bv_centres_table)
      .update(updateData)
      .eq("id", id)
      .select(); // returns updated row(s)
    console.log("updated data", data);

    if (error) throw error;
    return data.map(helpers.transformToUiModel);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteCentre(id) {
  try {
    const { data, error } = await supabase
      .from(bv_centres_table)
      .delete()
      .eq("id", id)
      .select(); // optional: returns deleted record(s)

    if (error) throw error;

    return data.map(helpers.transformToUiModel);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createCentre(record) {
  record = Array.isArray(record) ? record : [record];
  const newCentre = record.map(helpers.transformToDbModel);

  try {
    const { data, error } = await supabase
      .from(bv_centres_table)
      .insert(newCentre) // insert array of objects
      .select(); // return inserted rows

    if (error) {
      throw error;
    } else {
      console.log("Centre created successfuly", data);
    }

    return data.map(helpers.transformToUiModel);
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    throw err;
  }
}

module.exports = {
  // insertBulkData,
  authenticateUser,
  getCentres,
  getCentresById,
  updateCentre,
  deleteCentre,
  createCentre,
};
