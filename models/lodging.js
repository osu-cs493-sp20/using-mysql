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
  // console.log(" -- fields:", fields);
  return results[0].count;
}

exports.getLodgingsPage = async function (page) {
  const pageSize = 10;
  const count = await getLodgingsCount();
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;
  // const offset = "; DROP TABLE *;"

  /*
   * SELECT * FROM lodgings
   * ORDER BY id
   * LIMIT <offset>,<count>
   */
  const [ results ] = await mysqlPool.query(
    "SELECT * FROM lodgings ORDER BY id LIMIT ?,?",
    [ offset, pageSize ]
  );

  return {
    lodgings: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
};

exports.insertNewLodging = async function (lodging) {
  const validatedLodging = extractValidFields(
    lodging,
    exports.LodgingSchema
  );

  const [ results ] = await mysqlPool.query(
    "INSERT INTO lodgings SET ?",
    validatedLodging
  );
  return results.insertId;
};
