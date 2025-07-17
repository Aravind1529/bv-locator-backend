const fieldMap = {
    id: 'id',
    district: 'district',
    guruName: 'guru_name',
    samithiName: 'samithi_name',
    centreName: 'centre_name',
    address: 'address',
    area: 'area',
    pincode: 'pincode',
    guruContactNumber: 'guru_contact_number',
    ecName: 'ec_name',
    ecContact: 'ec_contact',
    convenorName: 'convenor_name',
    convenorContact: 'convenor_contact',
    googleMapLink: 'google_map_link',
    state: 'state'
  };
  
  // Convert DB → UI
  function transformToUiModel(item) {
    const result = {};
    for (const [uiKey, dbKey] of Object.entries(fieldMap)) {
      result[uiKey] = dbKey === 'id' ? +item[dbKey] : item[dbKey];
    }
    return result;
  }
  
  // Convert UI → DB
  function transformToDbModel(uiItem) {
    const db = {};
  for (const [uiKey, dbKey] of Object.entries(fieldMap)) {
    if (uiItem[uiKey] !== undefined) {
      db[dbKey] = uiItem[uiKey];
    }
  }
  return db;
  }
  
  module.exports = {
    transformToUiModel,
    transformToDbModel
  };