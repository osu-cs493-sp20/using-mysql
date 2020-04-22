/*
 * Lodgings schema and data accessor methods.
 */

const { extractValidFields } = require('../lib/validation');
const mysqlPool = require('../lib/mysqlPool');

/*
 * Schema for a lodging.
 */
exports.LodgingSchema = {
  name: { required: true },
  description: { required: false },
  street: { required: true },
  city: { required: true },
  state: { required: true },
  zip: { required: true },
  price: { required: true },
  ownerid: { required: true }
};

async function getLodgingsCount() {
  const [ results, fields ] = await mysqlPool.query(
    "SELECT COUNT(*) AS count FROM lodgings"
  );
  console.log(" -- fields:", fields);
  return results[0].count;
}
